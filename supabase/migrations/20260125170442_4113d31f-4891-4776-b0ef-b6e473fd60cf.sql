-- Create function to credit user balance
CREATE OR REPLACE FUNCTION public.credit_user_balance(p_user_id UUID, p_amount DECIMAL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.profiles
    SET balance = balance + p_amount,
        updated_at = now()
    WHERE user_id = p_user_id;
END;
$$;