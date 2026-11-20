-- ==================================================================
-- STORAGE POLICIES FOR PAK ADENIUM NURSERY ('product-media' BUCKET)
-- Idempotent RLS policies for storage.objects
-- ==================================================================

DO $$
BEGIN
  -- 1. PUBLIC READ ACCESS
  -- Allow public (anon and authenticated) to read/download files in product-media bucket
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Read Access for product-media'
  ) THEN
    CREATE POLICY "Public Read Access for product-media"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'product-media');
  END IF;

  -- 2. RESTRICTED INSERT ACCESS
  -- Allow only authenticated users and service_role to upload files to product-media bucket
  -- Anonymous / unauthenticated public uploads are strictly forbidden
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Restricted Insert Access for product-media'
  ) THEN
    CREATE POLICY "Restricted Insert Access for product-media"
    ON storage.objects FOR INSERT
    TO authenticated, service_role
    WITH CHECK (bucket_id = 'product-media');
  END IF;

  -- 3. RESTRICTED UPDATE ACCESS
  -- Allow only authenticated users and service_role to modify/overwrite files in product-media bucket
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Restricted Update Access for product-media'
  ) THEN
    CREATE POLICY "Restricted Update Access for product-media"
    ON storage.objects FOR UPDATE
    TO authenticated, service_role
    USING (bucket_id = 'product-media')
    WITH CHECK (bucket_id = 'product-media');
  END IF;

  -- 4. RESTRICTED DELETE ACCESS
  -- Allow only authenticated users and service_role to delete files from product-media bucket
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Restricted Delete Access for product-media'
  ) THEN
    CREATE POLICY "Restricted Delete Access for product-media"
    ON storage.objects FOR DELETE
    TO authenticated, service_role
    USING (bucket_id = 'product-media');
  END IF;
END $$;
