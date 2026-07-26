-- Additive column: the Step 1 schema had books.sample_chapter_storage_path
-- (the free preview) but nowhere to point a purchased digital format at the
-- full file. Needed for Step 3's secure digital download links.

alter table public.book_formats
  add column digital_file_storage_path text;

comment on column public.book_formats.digital_file_storage_path is
  'Path within the private "book-files" Supabase Storage bucket to the full digital file. Only set (and only relevant) when is_digital = true. Never exposed to the client directly — see digital_downloads and /api/downloads/[token].';
