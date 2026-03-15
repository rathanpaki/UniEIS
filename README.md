# UniEIS — Student Academic Portal

A responsive, single-page **student portal UI** (front-end only) built with **HTML, CSS, and vanilla JavaScript**. UniEIS provides a polished demo experience for a university e-Information System: dashboard KPIs, grades, attendance, schedule, notifications, and transcript generation.

> Note: This repository is a **static front-end demo**. It does not include a backend or real authentication. Data is mocked in the client.

## Features

- **Landing page** with overview, feature highlights, and quick navigation
- **Student login page** (`login.html`) that routes to the dashboard
- **Dashboard** sections:
  - Overview KPIs (CGPA, attendance, credits, courses)
  - GPA/grade visualizations (Chart.js)
  - Grades table by semester
  - Attendance trend + per-subject status
  - Weekly schedule + upcoming deadlines
  - Courses table
  - Notifications feed
- **Transcript** page with semester/document-type filters and a printable/download flow (client-side)
- Mobile-friendly navigation (navbar + dashboard sidebar)

## Tech Stack

- **HTML / CSS / JavaScript** (no framework)
- **Chart.js** via CDN

## Project Structure

- `index.html` — Main SPA-style UI (Home, Dashboard, Transcript)
- `login.html` — Login screen (demo)
- `css/styles.css` — Styling
- `js/app.js` — UI logic, navigation, charts, and mocked data rendering

## Getting Started

### Option 1: Open directly (simplest)

1. Clone the repository
2. Open `index.html` in your browser

## How to Use

- Use the top navigation to switch between **Home**, **My Dashboard**, and **Transcript**.
- Click **Student Login** to view the login UI. Submitting the form takes you to the dashboard section of `index.html` (demo flow).

## Customization

- Update mock student/course data and chart inputs in `js/app.js`.
- Adjust themes, spacing, and components in `css/styles.css`.

## Screens / Pages

- Home: `index.html` → Home
- Dashboard: `index.html` → My Dashboard
- Transcript: `index.html` → Transcript
- Login: `login.html`
