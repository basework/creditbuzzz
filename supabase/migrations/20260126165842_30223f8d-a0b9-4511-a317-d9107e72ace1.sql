-- Policy for user_roles: users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

-- Admins can view all roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 5700,
  receipt_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
ON public.payments FOR SELECT
USING (user_id = auth.uid());

-- Users can insert their own payments
CREATE POLICY "Users can insert own payments"
ON public.payments FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own payments (for receipt upload)
CREATE POLICY "Users can update own payments"
ON public.payments FOR UPDATE
USING (user_id = auth.uid());

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
ON public.payments FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can update payment status
CREATE POLICY "Admins can update payments"
ON public.payments FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Assign admin role to the specified user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'lumexzzwin@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Enable realtime for payments
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;