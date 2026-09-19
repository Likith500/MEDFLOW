# MEDFLOW

### Hospital Operations Coordination Platform

MEDFLOW is a React-based hospital operations dashboard designed to give teams a single live workspace for coordinating capacity, emergency resource requests, resource matching, alerts, and surge response.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-MEDFLOW-19a79b?style=for-the-badge)](https://medflow-six-eta.vercel.app)

[![React](https://img.shields.io/badge/React-19-238BE0?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com/)

---

## What MEDFLOW does

Hospitals often need to coordinate beds, equipment, departments, and urgent requests at the same time. MEDFLOW brings those operational workflows into one focused interface.

### Core workflows

- **Dashboard** — live overview of hospital capacity, resources, and open requests.
- **Departments** — monitor occupancy and availability across hospital units.
- **Emergency Requests** — create and track resource requests with urgency levels.
- **Resource Matching** — identify available resources and match them to open requests.
- **Surge Mode** — activate a coordinated surge response and monitor readiness.
- **Live Alerts** — surface important operational events in a live timeline.
- **Command Center** — central view for priority requests, capacity, and quick actions.

## Demo

**Live application:** https://medflow-six-eta.vercel.app

The current demo is a frontend prototype with shared React state for the operational workflows. Persistent backend storage and authentication are not connected yet.

## Tech stack

- React
- Vite
- React Router
- React Context API
- CSS
- Vercel

## Project structure

```
src/
├── pages/
│   ├── Alerts.jsx
│   ├── CommandCenter.jsx
│   ├── Departments.jsx
│   ├── EmergencyRequests.jsx
│   ├── ResourceMatching.jsx
│   └── SurgeMode.jsx
├── App.jsx
├── App.css
├── HospitalContext.jsx
├── main.jsx
└── index.css
```

## Run locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/Likith500/MEDFLOW.git
cd MEDFLOW
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Why MEDFLOW

MEDFLOW is built around a simple operational idea:

> **Resources, connected. Care, coordinate.**

The interface is designed to make urgent hospital coordination easier to understand at a glance while keeping the important workflows close together.

## Status

MEDFLOW is currently an active frontend prototype and demonstration project.

### Planned expansion

- Persistent backend data
- Authentication and role-based access
- Real hospital resource integrations
- Audit history
- More detailed analytics
- Production notification workflows

---

Built with React + Vite.
