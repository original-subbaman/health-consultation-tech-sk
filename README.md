# Telehealth MVP

A small-scale telehealth web application that connects patients in Sikkim, India with consulting doctors in the US.

The MVP allows patients to submit structured medical intake information and supporting documents. An LLM generates a clinician-readable summary, which can then be reviewed by a consulting doctor. The doctor's feedback can be converted into a patient-facing report for viewing or download.

This project is currently intended for personal, non-commercial use with friends and family.

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* React Hook Form
* Zod

### Backend

* Next.js Route Handlers

### Database & Authentication

* Supabase PostgreSQL
* Supabase Auth
* Supabase Row Level Security

### File Storage

* Supabase Storage

### AI

* OpenAI API or Anthropic API

### PDF Generation

* `@react-pdf/renderer`

### Deployment

* Vercel
* Supabase
