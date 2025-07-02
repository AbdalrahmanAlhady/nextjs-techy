# Full-Stack Architecture Document: nextjs-techy v1.2

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
| 2025-06-29 | 1.2 | Re-generated with NextAuth.js and standard project structure. | Sarah (PO) |

## 1. High Level Architecture

[cite_start]This document outlines the overall project architecture for nextjs-techy, including backend systems, shared services, and non-UI specific concerns. [cite: 599] [cite_start]Its primary goal is to serve as the guiding architectural blueprint for AI-driven development, ensuring consistency and adherence to chosen patterns and technologies. [cite: 599]

* **Platform:** Vercel
* **Database:** PostgreSQL (hosted on Supabase)
* [cite_start]**Architectural Patterns:** Full-Stack Jamstack, Server Actions, Repository Pattern. [cite: 612]

---
## 2. Tech Stack

[cite_start]This table represents the definitive technology choices for the platform. [cite: 614]

| Category | Technology |
| :--- | :--- |
| **Language** | TypeScript |
| **Framework** | Next.js |
| **Styling** | Tailwind CSS |
| **Database** | PostgreSQL |
| **Authentication**| **NextAuth.js** |
| **Payments** | Stripe |
| **State Mgmt.** | Redux Toolkit |
| **ORM** | Drizzle ORM |
| **Testing** | Vitest, Playwright |

---
## 3. API Specification
Authorization for all sensitive Server Actions will be centralized using a wrapper function (`withRole`) that checks the user's role from the **NextAuth.js session object** before executing business logic.

---
## 4. Source Tree
The project will use a standard Next.js project structure (`app/` directory at the root). It will be supplemented by a sibling directory (`lovable-techy-ui`) for the UI reference code, which will not be committed to the main application's repository.

---
## 5. Deployment & Test Strategy
The deployment will be handled by Vercel's integrated CI/CD pipeline, using a Canary Deployment strategy. The test strategy will use Vitest for unit/integration tests and Playwright for E2E tests.