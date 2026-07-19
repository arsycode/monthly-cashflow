-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Creates the tables for the cashflow app and locks every row to its owning user.

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now()
);

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category_id uuid not null references categories (id) on delete cascade,
  month text not null, -- 'YYYY-MM'
  label text not null,
  projected numeric not null default 0,
  actual numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists entries_user_month_idx on entries (user_id, month);
create unique index if not exists categories_user_name_type_idx on categories (user_id, name, type);

alter table categories enable row level security;
alter table entries enable row level security;

create policy "categories: owner full access" on categories
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "entries: owner full access" on entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
