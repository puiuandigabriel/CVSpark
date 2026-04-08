-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- CVs table
create table if not exists public.cvs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled CV',
  template text not null default 'Modern',
  data jsonb not null default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.cvs enable row level security;

-- Policy: users can only see their own CVs
create policy "Users can view own CVs" on public.cvs
  for select using (auth.uid() = user_id);

-- Policy: users can insert their own CVs
create policy "Users can create own CVs" on public.cvs
  for insert with check (auth.uid() = user_id);

-- Policy: users can update their own CVs
create policy "Users can update own CVs" on public.cvs
  for update using (auth.uid() = user_id);

-- Policy: users can delete their own CVs
create policy "Users can delete own CVs" on public.cvs
  for delete using (auth.uid() = user_id);

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_cv_updated
  before update on public.cvs
  for each row execute procedure public.handle_updated_at();
