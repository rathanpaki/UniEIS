# UniEIS — Student Academic Portal

UniEIS is a multi-page university student portal with:

- PHP + MySQL backend APIs
- Session-based authentication
- Dashboard analytics and academic data views
- Transcript generation and PDF download
- Responsive UI built with HTML, CSS, and vanilla JavaScript

## Current App Scope

The project is no longer only a static front-end demo.
It now includes:

- Login/logout APIs
- Protected data endpoints (require active session)
- Database schema + seed script
- Dynamic dashboard and transcript data loading

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: PHP (session-based auth, JSON APIs)
- Database: MySQL
- Charts: Chart.js (CDN)
- PDF export: jsPDF (CDN)

## Project Structure

```text
UNI EIS/
  index.html                # Home page
  login.html                # Login page
  dashboard.html            # Authenticated dashboard
  transcript.html           # Authenticated transcript page
  setup_db.php              # One-time DB/schema/data seeding script
  README.md

  config/
    db.php                  # Database connection settings

  api/
    auth/
      login.php             # Login endpoint
      logout.php            # Logout endpoint
    dashboard/
      overview.php          # Dashboard KPI/profile/summary data
    grades/
      index.php             # Semester grades data
    attendance/
      index.php             # Attendance + weekly trend data
    schedule/
      index.php             # Weekly timetable data
    deadlines/
      index.php             # Upcoming deadline data
    notifications/
      index.php             # Notification feed data

  css/
    styles.css              # Shared + home + login styles
    dashboard.css           # Dashboard-specific styles
    transcript.css          # Transcript-specific styles

  js/
    app.js                  # Home interactions + auth-aware nav on index
    dashboard.js            # Dashboard logic + logout action
    transcript.js           # Transcript generation, PDF download, logout
```

## Prerequisites

- PHP 8.x (or 7.4+ with PDO MySQL enabled)
- MySQL 8.x or compatible
- Local web server (XAMPP, Laragon, WAMP, or PHP built-in server)

## Setup

### 1. Configure database connection

Edit `config/db.php`:

- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`

### 2. Run database setup and seeding

Open `setup_db.php` once in your browser through your local server.

This script will:

- Create database `unieis_db` (if missing)
- Create all required tables
- Truncate and reseed data
- Insert demo user + courses + grades + attendance + schedule + deadlines + notifications

### 3. Start using the app

Open `index.html` from your local web server URL (not file://).

## Demo Login Credentials

After running `setup_db.php`, use:

- Student ID / Username: `U2024-IT-0042`
- Email (alternative): `ahmad@unieis.edu`
- Password: `password123`

## Pages and Flow

- `index.html`
  - Public landing page
  - Auth-aware nav button:
    - Shows **Student Login** when not logged in
    - Shows **Logout** when session is active
- `login.html`
  - Sends credentials to `api/auth/login.php`
  - Redirects to `dashboard.html` on success
- `dashboard.html`
  - Protected page (requires session)
  - Loads data from API endpoints
  - Supports logout from top nav
- `transcript.html`
  - Protected page (requires session)
  - Generates transcript view from live API data
  - Exports transcript to PDF via jsPDF
  - Supports logout from top nav

## API Endpoints

All endpoints return JSON.

### Auth

- `POST api/auth/login.php`
  - Input: `{ user, password }` (JSON) or form fields
  - Output: `success`, `message`, and `user` on success
- `POST api/auth/logout.php`
  - Destroys session
  - Output: `success`, `message`

### Protected endpoints (require session)

- `GET api/dashboard/overview.php`
  - Profile + KPIs + GPA history + score breakdown
- `GET api/grades/index.php?semester=sem2`
  - Grades by semester
- `GET api/attendance/index.php`
  - Subject attendance + weekly trend
- `GET api/schedule/index.php`
  - Timetable grouped by weekday
- `GET api/deadlines/index.php`
  - Upcoming tasks/deadlines
- `GET api/notifications/index.php`
  - Notification list

If session is missing, protected endpoints return HTTP 401.

## Database Tables Created

`setup_db.php` creates and seeds:

- `users`
- `courses`
- `user_courses`
- `attendance`
- `schedule`
- `deadlines`
- `notifications`

## Notable Behaviors

- Dashboard and transcript pages redirect to login on unauthorized access.
- Transcript PDF download only works after transcript generation.
- Home page still loads `js/app.js` for home interactions and nav auth state.
- Some KPI/history values are currently mock/hardcoded for demo consistency.

## Troubleshooting

- Login fails with valid credentials:
  - Re-run `setup_db.php`
  - Verify `config/db.php` credentials
  - Confirm MySQL service is running
- APIs return 401 on dashboard/transcript:
  - Log in again from `login.html`
  - Ensure cookies/sessions are enabled in your browser
- API/database errors:
  - Check your PHP/MySQL logs
  - Confirm schema/tables exist in `unieis_db`

## Security Note

This project is designed for learning/demo use.
Do not deploy as-is to production without:

- Moving DB credentials to environment variables
- Hardening session/cookie settings
- Adding CSRF protection
- Restricting CORS and improving error handling
- Implementing proper secrets management
