# 🚀 Self-Hosted URL Shortener

A high-performance, robust, self-hosted URL shortening service. Built for personal or enterprise use, it features passwordless magic-link authentication, a beautiful dashboard, detailed click analytics, and dynamic QR code generation. It is designed to be deployed effortlessly anywhere via Docker Compose or Kubernetes (Helm).

---

## ✨ Features

- **Passwordless Magic Links**: Secure email-based authentication powered by NextAuth.js (Auth.js) and Nodemailer.
- **Custom Short Codes**: Generate random 6-character short codes or define custom branded aliases (e.g., `my-domain.com/campaign`).
- **Comprehensive Analytics**: Asynchronously logs every click to track:
  - Total click volume over time.
  - Top Referrers (Where your traffic is coming from).
  - Estimated Device/OS breakdowns (Mobile, Desktop, Bot).
- **QR Code Generation**: Instantly generated QR codes for every link, perfect for print or mobile scanning.
- **Blazing Fast**: Built on the modern Next.js App Router, using Bun for near-instant dependency resolution and standalone Docker builds.
- **Enterprise Ready DevOps**: Includes multi-stage Dockerfiles, "All-in-One" Docker Compose configs, and a Kubernetes Helm Chart (with Bitnami PostgreSQL subchart).

---

## 🏗️ Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Authentication**: [Auth.js (NextAuth)](https://authjs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)

---

## ⚙️ Environment Variables

Before running the application, you need to configure your environment variables. Copy the `.env.example` to `.env` (or just create a `.env` file) and fill in the values:

```env
# Database Connection
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/urlshortener?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"

# SMTP Relay Configuration (For Magic Link Emails)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-username"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM="noreply@yourdomain.com"

# The Base URL of your deployed application (used for QR codes & Analytics)
BASE_URL="http://localhost:3000"
```

> **Note**: For local development, you can use [Ethereal Email](https://ethereal.email/) to generate mock SMTP credentials to test the magic links.

---

## 💻 Local Development Setup

### Prerequisites
- [Bun](https://bun.sh/) installed.
- Docker (for spinning up a local Postgres database).

### 1. Start Local Database
Use the provided `docker-compose.yml` to spin up a local PostgreSQL instance:
```bash
docker compose up -d db
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Initialize Database Schema
Push the Prisma schema to the database:
```bash
bunx prisma db push
```
*(Alternatively, you can use `bunx prisma migrate dev` to track migration history)*

### 4. Run the Development Server
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Log in via the `/login` route.

---

## 🐳 Docker Deployment (All-in-One)

For a simple production deployment on a single server, you can use the multi-stage standalone Dockerfile and `docker-compose.yml` which bundles both the Next.js App and PostgreSQL.

1. Ensure your `.env` is correctly populated.
2. Build and start the stack in detached mode:
   ```bash
   docker compose up -d
   ```
3. The application will be exposed on port `3000`. Put this behind a reverse proxy like Nginx, Traefik, or Caddy to handle SSL/HTTPS.

---

## ☸️ Kubernetes Deployment (Helm)

For scalable cluster deployments, a Helm chart is provided in `charts/url-shortener`. It includes the official Bitnami PostgreSQL subchart.

### 1. Update Dependencies
Fetch the PostgreSQL subchart:
```bash
helm dep update ./charts/url-shortener
```

### 2. Configure Values
Edit `charts/url-shortener/values.yaml` to set your desired `config` (URLs, SMTP Host) and `secret` (SMTP Passwords, Auth Secret).

### 3. Install the Chart
Deploy the URL shortener to your Kubernetes cluster:
```bash
helm install my-url-shortener ./charts/url-shortener -n url-shortener --create-namespace
```

---

## 📁 Project Structure

- **`/app`**: Next.js App Router endpoints.
  - `/api/links`: API route for Link creation.
  - `/[shortCode]`: Dynamic route that intercepts short links, tracks analytics, and redirects.
  - `/dashboard`: The authenticated dashboard layout and views.
  - `/login`: Magic link login page.
- **`/components/ui`**: Reusable `shadcn/ui` Tailwind components.
- **`/lib`**: Utility files, including the Prisma singleton (`prisma.ts`) and Auth.js config (`auth.ts`).
- **`/prisma`**: Prisma database schema (`schema.prisma`) defining `User`, `Link`, and `LinkClick` tables.
- **`/charts`**: Kubernetes Helm chart configuration.
