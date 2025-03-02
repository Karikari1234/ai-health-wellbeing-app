-- This SQL creates the necessary tables in Supabase

-- Create weight entries table
create table weight_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  weight numeric not null,
  date date not null,
  created_at timestamptz default now() not null
);

-- Create RLS policies for weight_entries
alter table weight_entries enable row level security;

-- Policy for users to select only their own entries
create policy "Users can view their own entries"
on weight_entries
for select
using (auth.uid() = user_id);

-- Policy for users to insert their own entries
create policy "Users can insert their own entries"
on weight_entries
for insert
with check (auth.uid() = user_id);

-- Policy for users to update their own entries
create policy "Users can update their own entries"
on weight_entries
for update
using (auth.uid() = user_id);

-- Policy for users to delete their own entries
create policy "Users can delete their own entries"
on weight_entries
for delete
using (auth.uid() = user_id);

-- Create index on user_id for faster queries
create index weight_entries_user_id_idx on weight_entries(user_id);
*/