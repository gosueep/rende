CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(256) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    verified BOOLEAN NOT NULL DEFAULT FALSE
    -- created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    -- updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ORG
DROP TABLE IF EXISTS org CASCADE;
CREATE TABLE org (
    id BIGSERIAL PRIMARY KEY,
    name varchar(256),
    description TEXT,
    photo_url varchar(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- EVENT
DROP TABLE IF EXISTS event CASCADE;
CREATE TABLE event (
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