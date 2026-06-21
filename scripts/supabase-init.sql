-- Run this in Supabase SQL Editor for each new client project

-- Enable pgvector for RAG chatbot
create extension if not exists vector;

-- Orders table
create table if not exists orders (
  id text primary key,
  created_at timestamptz default now(),
  status text default 'pending' check (status in ('pending','verified','processing','shipped','delivered','cancelled')),
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_township text not null,
  customer_city text not null,
  product_id text not null,
  product_name text not null,
  delivery_option text not null,
  payment_method text not null,
  payment_screenshot_key text,
  payment_verified boolean default false,
  total integer not null,
  notes text,
  admin_notes text
);

-- RAG knowledge base (for chatbot)
create table if not exists knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  content text not null,
  embedding vector(768),
  source text,
  metadata jsonb default '{}'
);

-- Vector similarity search function
create or replace function match_knowledge(
  query_embedding vector(768),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  source text,
  similarity float
)
language sql stable as $$
  select
    id, content, source,
    1 - (embedding <=> query_embedding) as similarity
  from knowledge_chunks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;

-- RLS policies
alter table orders enable row level security;
alter table knowledge_chunks enable row level security;

-- Allow service role full access (used by API routes)
create policy "service_role_all" on orders for all using (true);
create policy "service_role_all" on knowledge_chunks for all using (true);

-- Indexes
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists knowledge_chunks_embedding_idx on knowledge_chunks using ivfflat (embedding vector_cosine_ops);
