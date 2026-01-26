-- Create messages table for broadcast and individual messaging
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID, -- NULL means broadcast to all users
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_broadcast BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Admins can insert messages
CREATE POLICY "Admins can insert messages"
ON public.messages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update messages
CREATE POLICY "Admins can update messages"
ON public.messages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Users can view their own messages (individual or broadcast)
CREATE POLICY "Users can view own messages"
ON public.messages
FOR SELECT
USING (
  receiver_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR is_broadcast = true
);

-- Users can update read status on their messages
CREATE POLICY "Users can mark messages as read"
ON public.messages
FOR UPDATE
USING (
  receiver_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR is_broadcast = true
);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;