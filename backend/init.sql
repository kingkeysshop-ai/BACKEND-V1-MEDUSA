-- Initialize Medusa database
-- Run on postgres startup

-- Wait for postgres to be ready
DO $$
BEGIN
  -- Create extensions if not exists  
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EXCEPTION
  WHEN duplicate_object THEN 
    RAISE NOTICE 'Extensions already exist';
END $$;
