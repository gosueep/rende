CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
DROP TABLE IF EXISTS public.users;
CREATE TABLE public.users (
    id uuid not null references auth.users(id) on delete cascade,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    org_name VARCHAR(100),
    org_id uuid
);
alter table public.users enable row level security;


-- ORG
DROP TABLE IF EXISTS public.org CASCADE;
CREATE TABLE org (
    id BIGSERIAL PRIMARY KEY,
    name varchar(256),
    description TEXT,
    photo_url varchar(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- EVENT
DROP TABLE IF EXISTS public.event CASCADE;
CREATE TABLE public.event (
    id BIGSERIAL PRIMARY KEY,
    org_id BIGINT,
    name varchar(256),
    description text,
    location varchar(256),
    date TIMESTAMP NOT NULL,
    photo_url varchar(256), 
    is_recurring BOOLEAN
);

-- NORMALIZE LATER
-- DROP TABLE IF EXISTS org_event_xref;
-- CREATE TABLE org_event_xref (
--     id BIGSERIAL PRIMARY KEY,
--     org_id BIGINT REFERENCES org(id),
--     event_id BIGINT REFERENCES event(id)
-- );


\i testdata.sql