-- Allow public update on quote_submissions so Screen 2 can sync changes
CREATE POLICY "Allow public update on quote_submissions"
    ON quote_submissions FOR UPDATE
    USING (true)
    WITH CHECK (true);
