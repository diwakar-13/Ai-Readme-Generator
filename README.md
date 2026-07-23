# Ai-Readme-Generator

## projectOverview
Ai-Readme-Generator is a Next.js + React application (App Router) that provides an interface for generating README content and managing related projects. The repository integrates Tailwind CSS for styling and Drizzle ORM for database schema and access. The codebase follows a modular structure with clear separation of UI components, actions, database schema, and utility libraries.

Key repository layout (excerpted from the project):
```
.gitignore
README.md
drizzle.config.js
next.config.mjs
package.json
postcss.config.mjs
public/
src/
  actions/
    contactAction.js
    creditAction.js
    feedbackAction.js
    projectAction.js
    razorpayAction.js
    readmeAction.js
    userAction.js
  app/
    (auth)/sign-in/page.jsx
    (auth)/sign-up/page.jsx
    contact-us/page.jsx
    dashboard/[projectId]/page.jsx
    globals.css
    layout.js
    page.js
    pricing/page.jsx
  components/
    ReadmeWorkspace.jsx
    RepoTextarea.jsx
    Navbar.jsx
    ... (UI primitives under components/ui/)
  db/
    index.js
    schema.js
  email/
    contactEmailTemplate.js
    feedbackEmailTemplate.js
    refundEmailTemplate.js
  lib/
    octokit.js
    openRouter.js
    prompt.js
    razorpay.js
    resend.js
    utils.js
  proxy.js
```

## features
- Readme generation workflow (src/actions/readmeAction.js and ReadmeWorkspace.jsx).
- Project management and per-project dashboard (src/actions/projectAction.js; src/app/dashboard/[projectId]/page.jsx).
- User authentication UI (sign-in / sign-up under src/app/(auth)).
- Contact and feedback flows (src/actions/contactAction.js, src/actions/feedbackAction.js; contact page at src/app/contact-us).
- Payment integration via Razorpay (src/actions/razorpayAction.js and src/lib/razorpay.js).
- Email templates for contact, feedback, and refunds (src/email/*.js).
- Database layer using Drizzle ORM (drizzle.config.js and src/db/*).
- Utilities and integrations: Octokit, OpenRouter, Resend (src/lib/*).
- Component-driven UI with reusable primitives under src/components/ui.

## installation
Prerequisites
- Node.js (16+ recommended)
- npm (or yarn/pnpm if you adapt commands)
- A database compatible with your Drizzle configuration (configure in drizzle.config.js)

Install dependencies
```bash
npm install
```

Project configuration
- Review and configure drizzle.config.js for your database connection and Drizzle settings.
- If you use any third-party integrations (Razorpay, Resend, OpenRouter, GitHub/Octokit), add credentials to your environment and update the corresponding lib or config files as needed.

Build and run locally
```bash
# development
npm run dev

# build for production
npm run build
npm start
```

Notes
- The project uses the Next.js App Router (pages are under src/app). Static and client/server components are managed inside that directory.
- Tailwind CSS/PostCSS is configured (postcss.config.mjs and src/app/globals.css). Ensure any Tailwind config is present if you customize styles.

## usage
Running the dev server
```bash
npm run dev
# Open http://localhost:3000
```

Important app routes (based on src/app/)
- /sign-in — sign-in UI (src/app/(auth)/sign-in)
- /sign-up — sign-up UI (src/app/(auth)/sign-up)
- /contact-us — contact form (src/app/contact-us/page.jsx)
- /dashboard/[projectId] — per-project dashboard (src/app/dashboard/[projectId]/page.jsx)
- /pricing — pricing page (src/app/pricing/page.jsx)
- Home — src/app/page.js

Database and migrations
- Drizzle configuration is at drizzle.config.js. Configure connection settings there and run migrations using your preferred Drizzle CLI or workflow. (No migration commands are added to this README — consult your local Drizzle tooling.)

Testing, linting, and other scripts
- Check package.json for available npm scripts (dev, build, start, lint, etc.) and use them accordingly.

Notes on APIs
- This repository does not expose any explicit API routes under app/api or pages/api in the provided tree. Server-side logic and actions appear implemented in src/actions and src/lib and invoked by the client/server components in src/app.

## techStack
Badges (stack overview)
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js)
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css)
- ![Drizzle ORM](https://img.shields.io/badge/Drizzle-FF7B00?style=flat)

Primary technologies
- Next.js (App Router) — project files under src/app and next.config.mjs
- React — UI components under src/components and src/components/ui
- Tailwind CSS / PostCSS — postcss.config.mjs and src/app/globals.css
- Drizzle ORM — drizzle.config.js and src/db/* (index.js, schema.js)

Notable libraries / integrations (based on src/lib/)
- Razorpay integration (src/lib/razorpay.js, src/actions/razorpayAction.js)
- Resend (email) integration (src/lib/resend.js)
- Octokit (GitHub) utilities (src/lib/octokit.js)
- OpenRouter/OpenAI utilities (src/lib/openRouter.js, src/lib/prompt.js)

Project files of interest
- Configuration: drizzle.config.js, next.config.mjs, postcss.config.mjs
- Database: src/db/index.js, src/db/schema.js
- Actions (server/client logic): src/actions/*.js
- Pages & routing: src/app/...
- UI components: src/components/, src/components/ui/