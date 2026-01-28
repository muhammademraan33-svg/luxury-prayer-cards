-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  order_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  customer_email TEXT,
  shipping_address JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_intent_id TEXT,
  payment_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  funeral_home_id UUID REFERENCES auth.users(id),
  free_shipping BOOLEAN DEFAULT FALSE
);

-- Create index on order_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_funeral_home_id ON orders(funeral_home_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Funeral homes can view their orders
CREATE POLICY "Funeral homes can view own orders" ON orders
  FOR SELECT USING (auth.uid() = funeral_home_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Users can insert their own orders
CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can update orders
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Create storage bucket for images (if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('designs', 'designs', true);

-- Storage policies for designs bucket
-- CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'designs');
-- CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'designs' AND auth.role() = 'authenticated');
