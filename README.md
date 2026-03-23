# Resume Builder

An AI-assisted full-stack resume platform that helps users create, improve, analyze, and tailor resumes for real job applications.

## Live Project Scope

This repository contains two applications:

- `resume-builder`: React + Vite frontend
- `resume-builder-backend`: Spring Boot backend API

Users can sign in, manage profile/resume data, generate or improve resume content, run ATS checks, browse jobs, and view match scores.

## Core Features

- Authentication and protected routes
- Resume builder with template support
- ATS analysis and resume improvement flow
- Dashboard/profile integration with latest resume data
- Job discovery flow with:
	- compact dynamic filters
	- dedicated job details page
	- match score evaluation
- Apply assistant workflow and application tracking APIs

## Tech Stack

Frontend:

- React
- Vite
- React Router
- Context API

Backend:

- Java 17+
- Spring Boot
- Spring Security + JWT
- JPA/Hibernate
- Maven

Database:

- PostgreSQL (production-style)
- H2 (local fallback/testing)

## Project Structure

```text
Resume Builder/
	resume-builder/             # Frontend app (React + Vite)
	resume-builder-backend/     # Backend app (Spring Boot)
	render.yaml                 # Deployment config
```

## Local Setup

### 1) Clone and enter project

```bash
git clone https://github.com/Sreecharan-03/Resume_Builder.git
cd Resume_Builder
```

### 2) Run backend

```powershell
cd resume-builder-backend
$env:JWT_SECRET="dev-local-jwt-secret-key-with-minimum-length-2026"
mvn spring-boot:run
```

Backend default URL:

- `http://localhost:8083`

### 3) Run frontend

Open a new terminal:

```powershell
cd resume-builder
npm install
npm run dev
```

Frontend default URL:

- `http://localhost:5173`

## Deployment Notes

- `render.yaml` is included for deployment configuration.
- Configure production environment variables for backend secrets and database credentials.
- Ensure frontend API base URL points to deployed backend.

## Reference

- Initial presentation: https://docs.google.com/presentation/d/1-MvWKqOjpvPoUDl2AEDWsECWuBd-0vls/edit?slide=id.p1#slide=id.p1
