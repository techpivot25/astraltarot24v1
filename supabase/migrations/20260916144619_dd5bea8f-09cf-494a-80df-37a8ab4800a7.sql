CREATE POLICY "anyone views blog images" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'blog-images');
CREATE POLICY "admins upload blog images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update blog images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete blog images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));