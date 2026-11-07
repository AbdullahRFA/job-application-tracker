
# Job Application Tracker Web Platform (v1.0)

A scalable, multi-user web platform designed for job seekers to track applications, deadlines, interview stages, and HR contacts, complete with Role-Based Access Control (RBAC) and administrative auditing.

## Architecture
- `client/`: Frontend web application (React / Next.js, TypeScript, Tailwind CSS, TanStack Table, Recharts)
- `server/`: RESTful API `/api/v1/` (Node.js, TypeScript, PostgreSQL, Prisma ORM)
- `docs/`: Software Requirements Specification (SRS) and API documentation

## Key Security & Engineering Standards
- **OWASP ASVS Level 2** compliance for authentication and RBAC (`User`, `Admin`, `Super Admin`)
- **Argon2 / bcrypt** password hashing & JWT rotation
- **Privacy-Preserving Audit Logs**: Admins monitor system activity without accessing private user feedback notes
- **RAG-Ready Extensibility**: Modular REST architecture prepared for Phase 2 vector search integration (`pgvector`)
EOF