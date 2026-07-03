This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Running with Docker

Requires Docker with the Compose plugin. `docker-compose.yml` builds the app and
starts it alongside a MongoDB container, so you don't need a local Mongo or to edit
`.env` — Compose sets `MONGODB_URI` to the `mongo` service automatically.

```bash
# Build the image and start the app + MongoDB
docker compose up --build

# ...or run detached
docker compose up -d --build
```

The app is served at [http://localhost:3000](http://localhost:3000). MongoDB data
persists in the `taskboard-mongo-data` volume between runs.

```bash
# Stop the containers
docker compose down

# Stop and also delete the MongoDB data volume
docker compose down -v
```

To stamp the version shown in the stats bar, pass the build arg:

```bash
NEXT_PUBLIC_APP_VERSION=1.0.0 docker compose up --build
```

### Building the image directly (without Compose)

```bash
docker build -t taskboard:latest .
docker run -p 3000:3000 -e MONGODB_URI="mongodb://<host>:27017/taskboard" taskboard:latest
```
