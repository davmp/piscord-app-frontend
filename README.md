# 🎨 Piscord Frontend

Frontend application for Piscord, a real-time chat platform. This project was developed using **Angular 19+**, styled with **TailwindCSS**, and uses **PrimeNG** components.

> [!TIP]
> For complete system orchestration (Backend + Frontend + Database) via Kubernetes, visit the main repository:
> 👉 **[Piscord App - Main Repository](https://github.com/davmp/piscord-app)**

---

## 🚀 Technologies

- **Framework:** [Angular 19+](https://angular.io/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **Components:** [PrimeNG](https://primeng.org/) & [Angular Material](https://material.angular.io/)
- **State Management/Flow:** RxJS
- **Real-time:** WebSocket
- **Build/Serve:** Angular CLI & Node.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- [pnpm](https://pnpm.io/) (package manager used)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/davmp/piscord-frontend.git
   cd piscord-frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## 💻 Development

To run the application in development mode (with hot-reload):

```bash
pnpm start
# or
ng serve
```

Access `http://localhost:4200/` in your browser.

## 📦 Build

To generate production files:

```bash
pnpm run build
```

The generated files will be in the `dist/piscord-frontend` folder.

## 🐳 Docker

To build and run the Docker image locally:

1. **Build the image:**
   ```bash
   docker build -t piscord-frontend .
   ```

2. **Run the container:**
   ```bash
   docker run -p 4200:4200 -e API_URL=http://localhost:3000/api piscord-frontend
   ```

## ⚙️ Environment Variables

The following environment variables can be configured (especially useful in Docker/Kubernetes):

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `API_URL` | Base URL for the Backend API | `http://_host_/api` |
| `PORT` | Port where the SSR/Node server will run | `4200` |
| `NODE_ENV` | Defines the environment (`production` or `development`) | `production` |

## 📂 Project Structure

- `src/app`: Components, services, and application logic.
- `src/assets`: Images, icons, and static files.
- `Dockerfile`: Configuration for building and deploying in containers.
- `angular.json`: Angular workspace configuration.
- `tailwind.config.ts`: Tailwind theme and style configuration.
