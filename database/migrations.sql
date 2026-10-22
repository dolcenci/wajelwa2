-- Run this after importing the base schema to sync
-- schema changes made by the team.
-- Usage: psql -U postgres -d bingebuy_db -f database/migrations.sql

-- products: colours and sizes for designer variants
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes  TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE products
SET
    colors = ARRAY['Black', 'White'],
    sizes  = ARRAY['S', 'M', 'L', 'XL']
WHERE colors IS NULL OR array_length(colors, 1) IS NULL;

-- cart_items: per-line colour and size chosen by the customer
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT 'Default';
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS size  VARCHAR(50) DEFAULT 'One Size';

-- orders: Stripe payment tracking + delivery snapshot
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'unpaid';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_details JSONB;