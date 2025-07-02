# nextjs-techy

## Project Overview
A monorepo e-commerce platform built with Next.js, Drizzle ORM, PostgreSQL, and Tailwind CSS. This project follows the BMAD-METHOD for story-driven development and strict Dev Agent protocol for task execution.

---

## Getting Started

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd nextjs-techy
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```env
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>
DRIZZLE_DB_URL=${DATABASE_URL}
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> **Note:** `.env` is gitignored for security.

### 4. Database Setup & Migrations
- Configure your PostgreSQL database (e.g., via Supabase or local Postgres).
- Generate and run migrations:
```sh
npx drizzle-kit generate
npx drizzle-kit push
```

### 5. Run the Development Server
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

---

## Story-Driven Development
- User stories and tasks are tracked in `/docs/stories/` (see `1.1.story.md`).
- Follow Dev Agent protocol: Mark tasks as `[x]` (complete) or `[-]` (in progress) in the story file as you work.
- Reference PRD and architecture docs in `/docs/prd/` and `.bmad-core/` for requirements.

---

## Project Structure
- `/app` — Next.js app directory with route groups for auth, dashboard, main, and API endpoints
- `/components` — Shared React components
- `/lib` — Utility functions and libraries
- `/store` — State management (e.g., Redux, Zustand)
- `/public` — Static assets
- `/packages/db` — Drizzle ORM schema and config
- `/drizzle.config.ts` — Drizzle ORM config
- `/tailwind.config.js` — Tailwind CSS config
- `/docs` — PRD, stories, and architecture documentation
- `/tests/story-1.1/` — Integration tests for Story 1.1
- `/e2e/story-1.1/` — End-to-end tests for Story 1.1

---

## Scripts
- `npm run dev` — Start Next.js dev server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npx drizzle-kit generate` — Generate SQL migrations from schema
- `npx drizzle-kit push` — Apply migrations to database

---

## Coding Standards
- TypeScript, Prettier, and ESLint recommended
- Use enums and references in schema for type safety
- Store sensitive data in `.env`
- Follow modular and maintainable folder structure

---

## Testing
- Integration tests: `/tests/story-1.1/`
- E2E tests: `/e2e/story-1.1/`
- Add more tests as you implement new stories

---

## Additional Notes
- See `/docs/stories/1.1.story.md` for detailed story, tasks, and acceptance criteria
- For any blockers or questions, consult the PRD or reach out to the team

---

Happy coding!
