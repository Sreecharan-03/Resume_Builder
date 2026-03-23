-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(255),
    summary TEXT,
    skills TEXT,
    experience TEXT,
    education TEXT,
    certifications TEXT,
    projects TEXT,
    coding_profiles TEXT,
    languages TEXT,
    activities TEXT,
    hobbies TEXT,
    template_id VARCHAR(255),
    ats_score INTEGER,
    status VARCHAR(50) DEFAULT 'DRAFT',
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Job Contexts Table
CREATE TABLE IF NOT EXISTS job_contexts (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    company VARCHAR(255) NOT NULL,
    target_role VARCHAR(255) NOT NULL,
    experience_level VARCHAR(255),
    job_description TEXT,
    extracted_keywords TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    style VARCHAR(255),
    category VARCHAR(255),
    badge VARCHAR(255),
    is_pro BOOLEAN DEFAULT FALSE,
    description TEXT,
    primary_color VARCHAR(50),
    accent_color VARCHAR(50),
    preview_image VARCHAR(500),
    sort_order INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Application History Table
CREATE TABLE IF NOT EXISTS application_history (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(255) NOT NULL,
    resume_id INTEGER,
    job_title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    match_score INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'SAVED',
    redirect_url TEXT,
    cover_letter TEXT,
    user_id INTEGER NOT NULL,
    applied_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
