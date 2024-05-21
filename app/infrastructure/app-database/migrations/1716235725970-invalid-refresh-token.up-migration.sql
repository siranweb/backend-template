create table if not exists invalid_refresh_token (
    token text PRIMARY KEY,
    created_at timestamptz default now() not null
    updated_at timestamptz default now() not null
);
