"use strict";

// Demo data that drives the dashboard and transcript views.
const GRADES_DATA = {
  sem2: [
    {
      code: "IT301",
      name: "Data Structures & Algorithms",
      credits: 4,
      midterm: 82,
      final: 79,
      assign: 88,
      total: 83,
      grade: "A-",
      status: "Pass",
    },
    {
      code: "IT302",
      name: "Network Security",
      credits: 3,
      midterm: 74,
      final: 80,
      assign: 85,
      total: 79,
      grade: "B+",
      status: "Pass",
    },
    {
      code: "IT303",
      name: "Machine Learning",
      credits: 4,
      midterm: 91,
      final: 88,
      assign: 92,
      total: 90,
      grade: "A",
      status: "Pass",
    },
    {
      code: "IT304",
      name: "Software Engineering",
      credits: 3,
      midterm: 68,
      final: 72,
      assign: 76,
      total: 71,
      grade: "B",
      status: "Pass",
    },
    {
      code: "MPU3102",
      name: "Co-curriculum I",
      credits: 2,
      midterm: null,
      final: null,
      assign: 88,
      total: 88,
      grade: "A-",
      status: "Pass",
    },
    {
      code: "MPU2143",
      name: "Ethnic Relations",
      credits: 2,
      midterm: 55,
      final: 62,
      assign: 70,
      total: 61,
      grade: "C+",
      status: "Pass",
    },
  ],
  sem1: [
    {
      code: "IT201",
      name: "Database Systems",
      credits: 4,
      midterm: 88,
      final: 84,
      assign: 90,
      total: 87,
      grade: "A",
      status: "Pass",
    },
    {
      code: "IT202",
      name: "Operating Systems",
      credits: 3,
      midterm: 78,
      final: 76,
      assign: 82,
      total: 78,
      grade: "B+",
      status: "Pass",
    },
    {
      code: "IT203",
      name: "Computer Architecture",
      credits: 3,
      midterm: 70,
      final: 68,
      assign: 75,
      total: 71,
      grade: "B",
      status: "Pass",
    },
    {
      code: "IT204",
      name: "Web Technologies",
      credits: 4,
      midterm: 92,
      final: 90,
      assign: 94,
      total: 92,
      grade: "A",
      status: "Pass",
    },
    {
      code: "MPU2113",
      name: "English for Academic Purposes",
      credits: 3,
      midterm: 80,
      final: 78,
      assign: 83,
      total: 80,
      grade: "A-",
      status: "Pass",
    },
  ],
  sem4: [
    {
      code: "IT101",
      name: "Programming Fundamentals",
      credits: 4,
      midterm: 85,
      final: 82,
      assign: 88,
      total: 85,
      grade: "A",
      status: "Pass",
    },
    {
      code: "IT102",
      name: "Discrete Mathematics",
      credits: 3,
      midterm: 65,
      final: 70,
      assign: 72,
      total: 68,
      grade: "B-",
      status: "Pass",
    },
    {
      code: "IT103",
      name: "Digital Logic Design",
      credits: 3,
      midterm: 72,
      final: 74,
      assign: 78,
      total: 74,
      grade: "B",
      status: "Pass",
    },
    {
      code: "MPU1013",
      name: "Bahasa Melayu Komunikasi",
      credits: 2,
      midterm: 82,
      final: 80,
      assign: 85,
      total: 82,
      grade: "A-",
      status: "Pass",
    },
  ],
  sem3: [
    {
      code: "MATH101",
      name: "Calculus",
      credits: 4,
      midterm: 60,
      final: 58,
      assign: 65,
      total: 61,
      grade: "C+",
      status: "Pass",
    },
    {
      code: "IT001",
      name: "Introduction to IT",
      credits: 3,
      midterm: 88,
      final: 86,
      assign: 90,
      total: 88,
      grade: "A",
      status: "Pass",
    },
    {
      code: "COM101",
      name: "Communication Skills",
      credits: 2,
      midterm: 78,
      final: 76,
      assign: 80,
      total: 78,
      grade: "B+",
      status: "Pass",
    },
    {
      code: "MPU1023",
      name: "Islamic Civilisation",
      credits: 2,
      midterm: 72,
      final: 74,
      assign: 76,
      total: 74,
      grade: "B",
      status: "Pass",
    },
  ],
};

const GPA_HISTORY = [
  { sem: "Sem 1, 2024", gpa: 3.42 },
  { sem: "Sem 2, 2024", gpa: 3.55 },
  { sem: "Sem 1, 2025", gpa: 3.68 },
  { sem: "Sem 2, 2025", gpa: 3.8 },
];

const SEM_INFO = {
  sem2: { label: "Semester 2, 2024–2025", gpa: 3.8 },
  sem1: { label: "Semester 1, 2024–2025", gpa: 3.68 },
  sem4: { label: "Semester 2, 2023–2024", gpa: 3.55 },
  sem3: { label: "Semester 1, 2023–2024", gpa: 3.42 },
};

const ATTENDANCE_DATA = [
  {
    code: "IT301",
    name: "Data Structures & Algorithms",
    total: 40,
    attended: 38,
    pct: 95,
  },
  { code: "IT302", name: "Network Security", total: 36, attended: 31, pct: 86 },
  {
    code: "IT303",
    name: "Machine Learning",
    total: 40,
    attended: 40,
    pct: 100,
  },
  {
    code: "IT304",
    name: "Software Engineering",
    total: 36,
    attended: 28,
    pct: 78,
  },
  {
    code: "MPU3102",
    name: "Co-curriculum I",
    total: 20,
    attended: 14,
    pct: 70,
  },
  {
    code: "MPU2143",
    name: "Ethnic Relations",
    total: 32,
    attended: 26,
    pct: 81,
  },
];

const SCHEDULE = {
  MON: [
    { time: "08:00", course: "IT301", room: "Lab A-201", color: "#1D3461" },
    {
      time: "10:00",
      course: "IT303",
      room: "Lecture Hall 3",
      color: "#2E7D52",
    },
  ],
  TUE: [
    { time: "09:00", course: "IT302", room: "Lab B-102", color: "#C9A84C" },
    { time: "14:00", course: "MPU2143", room: "Dewan Besar", color: "#7C3AED" },
  ],
  WED: [
    { time: "08:00", course: "IT303", room: "ML Lab-01", color: "#2E7D52" },
    { time: "11:00", course: "IT304", room: "Tutorial Rm 4", color: "#2563EB" },
  ],
  THU: [
    { time: "10:00", course: "IT301", room: "Tutorial Rm 2", color: "#1D3461" },
    { time: "15:00", course: "MPU3102", room: "Sports Hall", color: "#B7791F" },
  ],
  FRI: [
    { time: "08:00", course: "IT302", room: "Lab B-103", color: "#C9A84C" },
    { time: "11:00", course: "IT304", room: "Tutorial Rm 5", color: "#2563EB" },
  ],
};

const DEADLINES = [
  {
    due: "22 Feb 2025",
    course: "IT303",
    task: "Machine Learning Lab Report 3",
    weight: "10%",
    status: "Pending",
  },
  {
    due: "25 Feb 2025",
    course: "IT301",
    task: "Assignment 2 — Sorting Algorithms",
    weight: "15%",
    status: "Pending",
  },
  {
    due: "01 Mar 2025",
    course: "IT302",
    task: "Network Security Quiz 2",
    weight: "5%",
    status: "Pending",
  },
  {
    due: "05 Mar 2025",
    course: "IT304",
    task: "Group Project Milestone 2",
    weight: "20%",
    status: "Pending",
  },
  {
    due: "10 Mar 2025",
    course: "MPU2143",
    task: "Essay Submission",
    weight: "15%",
    status: "Submitted",
  },
];

const LECTURERS = [
  "Dr. Ahmad Zaki",
  "Dr. Nora Hassan",
  "Prof. Raj Patel",
  "Dr. Lisa Chen",
  "Mr. Faiz Aziz",
  "Dr. Aishah Mohd",
];

const NOTIFICATIONS = [
  {
    icon: "⚠️",
    title: "Attendance Warning — MPU3102",
    body: "Your attendance in Co-curriculum I is at 70%, below the required 80%. Please attend the next 3 sessions to avoid being barred.",
    time: "Today, 9:14 AM",
    tag: "urgent",
    unread: true,
  },
  {
    icon: "📢",
    title: "Grade Released — IT303",
    body: "Your Machine Learning midterm grade is now available: 91/100. Excellent work!",
    time: "Yesterday, 3:42 PM",
    tag: "success",
    unread: true,
  },
  {
    icon: "📅",
    title: "Assignment Due — IT301",
    body: "Data Structures Assignment 2 is due in 2 days (25 Feb). Upload your submission before 11:59 PM.",
    time: "Yesterday, 10:00 AM",
    tag: "info",
    unread: true,
  },
  {
    icon: "🏆",
    title: "Dean's List Nomination",
    body: "Congratulations! Based on your Semester 1 results, you have been nominated for the Dean's List. Results will be announced on 28 Feb.",
    time: "20 Feb 2025",
    tag: "success",
    unread: false,
  },
  {
    icon: "📋",
    title: "Final Exam Timetable Released",
    body: "Your final exam schedule for Semester 2, 2025 has been published. Check your exam dates under Schedule.",
    time: "18 Feb 2025",
    tag: "info",
    unread: false,
  },
];

const PAGES = ["home", "dashboard", "reports"];

let navToggle;
let navOverlay;
let sidebarToggle;
let sidebarOverlay;

let dashReady = false;
let gradesBarInst;
let tChartInst;
let slideIdx = 0;
let sliderTimer;
let toastTimer;

// Keep the visible page and the URL hash in sync.
function showPage(page, opts = {}) {
  const target = PAGES.includes(page) ? page : "home";
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  const pageEl = document.getElementById("page-" + target);
  if (pageEl) pageEl.classList.add("active");

  document
    .querySelectorAll(".nav-link[data-page]")
    .forEach((l) => l.classList.remove("active"));
  const navEl = document.getElementById("nav-" + target);
  if (navEl) navEl.classList.add("active");

  window.scrollTo(0, 0);

  if (target === "dashboard") initDash();

  closeNav();
  closeSidebar();

  if (opts.updateHash !== false) {
    if (target === "home") {
      history.replaceState(null, "", location.pathname + location.search);
    } else {
      location.hash = target;
    }
  }
}

function getPageFromHash() {
  const hash = location.hash.replace("#", "").trim();
  return PAGES.includes(hash) ? hash : "home";
}

function routeFromHash() {
  showPage(getPageFromHash(), { updateHash: false });
}

// Mobile nav and sidebar helpers.
function openNav() {
  document.body.classList.add("nav-open");
  if (navToggle) navToggle.setAttribute("aria-expanded", "true");
}

function closeNav() {
  document.body.classList.remove("nav-open");
  if (navToggle) navToggle.setAttribute("aria-expanded", "false");
}

function toggleNav() {
  if (document.body.classList.contains("nav-open")) closeNav();
  else openNav();
}

function openSidebar() {
  document.body.classList.add("sidebar-open");
  if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", "true");
}

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
  if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", "false");
}

function toggleSidebar() {
  if (document.body.classList.contains("sidebar-open")) closeSidebar();
  else openSidebar();
}

// Build dashboard widgets once, then reuse the rendered state.
function initDash() {
  if (dashReady) return;
  dashReady = true;
  animNum("kpi-cgpa", 3.72, 1300, 2);
  animNum("kpi-att", 87, 1200, 0, "%");
  animNum("kpi-credits", 94, 1100, 0);
  animNum("kpi-courses", 6, 700, 0);
  buildGpaProgress();
  animRing();
  buildGradeBreak();
  renderGrades();
  buildAttendance();
  buildAttTrend();
  buildAttPie();
  buildSchedule();
  buildDeadlines();
  buildCourses();
  buildNotifications();
}

function animNum(id, target, dur, dec, suf = "") {
  const el = document.getElementById(id);
  if (!el) return;
  let s = null;
  const step = (ts) => {
    if (!s) s = ts;
    const p = Math.min((ts - s) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * ease).toFixed(dec) + suf;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toFixed(dec) + suf;
  };
  requestAnimationFrame(step);
}

function animRing() {
  const c = document.getElementById("gpaRingCircle");
  if (!c) return;
  const circ = 2 * Math.PI * 58;
  setTimeout(() => {
    c.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)";
    c.style.strokeDashoffset = circ * (1 - 3.72 / 4.0);
  }, 350);
}

function buildGpaProgress() {
  const el = document.getElementById("gpaProgressChart");
  if (!el || typeof Chart === "undefined") return;
  const ctx = el.getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: GPA_HISTORY.map((g) => g.sem),
      datasets: [
        {
          label: "Semester GPA",
          data: GPA_HISTORY.map((g) => g.gpa),
          borderColor: "#C9A84C",
          backgroundColor: "rgba(201,168,76,0.08)",
          tension: 0.45,
          fill: true,
          pointBackgroundColor: "#C9A84C",
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 3.0,
          max: 4.0,
          grid: { color: "#E8E0D0" },
          ticks: { callback: (v) => v.toFixed(2) },
        },
        x: { grid: { display: false } },
      },
    },
  });
}

function buildGradeBreak() {
  const el = document.getElementById("gradeBreakChart");
  if (!el || typeof Chart === "undefined") return;
  const g = GRADES_DATA.sem2;
  new Chart(el.getContext("2d"), {
    type: "bar",
    data: {
      labels: g.map((x) => x.code),
      datasets: [
        {
          label: "Midterm",
          data: g.map((x) => x.midterm || 0),
          backgroundColor: "#1D3461",
          borderRadius: 3,
        },
        {
          label: "Assignment",
          data: g.map((x) => x.assign),
          backgroundColor: "#C9A84C",
          borderRadius: 3,
        },
        {
          label: "Final",
          data: g.map((x) => x.final || 0),
          backgroundColor: "#2E7D52",
          borderRadius: 3,
        },
      ],
    },
    options: {
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } },
      scales: {
        y: { min: 0, max: 100, grid: { color: "#E8E0D0" } },
        x: { grid: { display: false } },
      },
    },
  });
}

function renderGrades() {
  const semEl = document.getElementById("gradeSem");
  if (!semEl) return;
  const sem = semEl.value || "sem2";
  const data = GRADES_DATA[sem] || GRADES_DATA.sem2;
  const labels = {
    sem2: "Semester 2, 2025",
    sem1: "Semester 1, 2025",
    sem4: "Semester 2, 2024",
    sem3: "Semester 1, 2024",
  };
  const label = labels[sem] || labels.sem2;
  const labelEl = document.getElementById("gradeTableLabel");
  if (labelEl) labelEl.textContent = label;

  const tableEl = document.getElementById("gradeTable");
  if (tableEl) {
    tableEl.innerHTML = data
      .map(
        (g) => `<tr>
      <td><code>${g.code}</code></td><td>${g.name}</td><td>${g.credits}</td>
      <td>${g.midterm !== null ? g.midterm : "—"}</td><td>${g.final !== null ? g.final : "—"}</td>
      <td>${g.assign}</td><td><strong>${g.total}</strong></td>
      <td><span class="grade-badge grade-${g.grade[0]}">${g.grade}</span></td>
      <td><span class="badge badge-green">${g.status}</span></td>
    </tr>`,
      )
      .join("");
  }

  if (typeof Chart !== "undefined") {
    if (gradesBarInst) gradesBarInst.destroy();
    const chartEl = document.getElementById("gradesBarChart");
    if (chartEl) {
      gradesBarInst = new Chart(chartEl.getContext("2d"), {
        type: "bar",
        data: {
          labels: data.map((x) => x.code),
          datasets: [
            {
              label: "Midterm",
              data: data.map((x) => x.midterm || 0),
              backgroundColor: "#1D3461",
              borderRadius: 3,
            },
            {
              label: "Assignment",
              data: data.map((x) => x.assign),
              backgroundColor: "#C9A84C",
              borderRadius: 3,
            },
            {
              label: "Final",
              data: data.map((x) => x.final || 0),
              backgroundColor: "#2E7D52",
              borderRadius: 3,
            },
          ],
        },
        options: {
          plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } },
          scales: {
            y: { min: 0, max: 100, grid: { color: "#E8E0D0" } },
            x: { grid: { display: false } },
          },
        },
      });
    }
  }
  showToast("Grades loaded for " + label);
}

function buildAttendance() {
  const list = document.getElementById("attList");
  if (!list) return;
  list.innerHTML = ATTENDANCE_DATA.map((a) => {
    const cls = a.pct >= 85 ? "good" : a.pct >= 80 ? "warn" : "bad";
    return `<div class="att-item">
      <div class="att-row">
        <div><div class="att-course">${a.name}</div><div class="att-code">${a.code}</div></div>
        <div class="att-pct ${cls}">${a.pct}%</div>
      </div>
      <div class="att-bar"><div class="att-fill ${cls}" data-pct="${a.pct}"></div></div>
      <div class="att-meta"><span>${a.attended} / ${a.total} sessions attended</span><span>${a.pct < 80 ? "⚠️ Below 80% — barred from exam risk" : a.pct === 100 ? "🏆 Perfect attendance" : "✓ On track"}</span></div>
    </div>`;
  }).join("");
  setTimeout(animAttBars, 80);
}

function animAttBars() {
  document.querySelectorAll(".att-fill").forEach((el) => {
    el.style.width = el.dataset.pct + "%";
  });
}

function buildAttTrend() {
  const el = document.getElementById("attTrendChart");
  if (!el || typeof Chart === "undefined") return;
  new Chart(el.getContext("2d"), {
    type: "line",
    data: {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7"],
      datasets: [
        {
          label: "My Attendance %",
          data: [100, 95, 90, 83, 88, 84, 87],
          borderColor: "#C9A84C",
          backgroundColor: "rgba(201,168,76,0.08)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#C9A84C",
        },
        {
          label: "Min. Required",
          data: [80, 80, 80, 80, 80, 80, 80],
          borderColor: "rgba(192,57,43,0.45)",
          borderDash: [5, 5],
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } },
      scales: {
        y: {
          min: 60,
          max: 110,
          grid: { color: "#E8E0D0" },
          ticks: { callback: (v) => v + "%" },
        },
        x: { grid: { display: false } },
      },
    },
  });
}

function buildAttPie() {
  const el = document.getElementById("attPieChart");
  if (!el || typeof Chart === "undefined") return;
  const good = ATTENDANCE_DATA.filter((a) => a.pct >= 85).length,
    warn = ATTENDANCE_DATA.filter((a) => a.pct >= 80 && a.pct < 85).length,
    bad = ATTENDANCE_DATA.filter((a) => a.pct < 80).length;
  new Chart(el.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Good (≥85%)", "Warning (80–84%)", "At Risk (<80%)"],
      datasets: [
        {
          data: [good, warn, bad],
          backgroundColor: ["#2E7D52", "#C9A84C", "#C0392B"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 10, font: { family: "DM Sans" } },
        },
      },
      cutout: "65%",
    },
  });
}

function buildSchedule() {
  const grid = document.getElementById("scheduleGrid");
  if (!grid) return;
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  // JS uses Sunday = 0, so Monday-Friday map to 1-5 here.
  const tod = new Date().getDay();
  grid.innerHTML = days
    .map((d, i) => {
      const slots = SCHEDULE[d] || [],
        isToday = i + 1 === tod;
      return `<div class="sched-day">
      <div class="sched-day-header${isToday ? " today" : ""}">${d}${isToday ? " · Today" : ""}</div>
      ${
        slots.length === 0
          ? '<div class="sched-slot empty"><div class="sched-course" style="font-weight:400;font-size:12px;">No classes</div></div>'
          : slots
              .map(
                (
                  s,
                ) => `<div class="sched-slot" data-toast="${s.course} · ${s.room} · ${s.time}">
        <div class="sched-time">${s.time}</div>
        <div class="sched-course"><span class="sched-dot" style="background:${s.color}"></span>${s.course}</div>
        <div class="sched-room">${s.room}</div>
      </div>`,
              )
              .join("")
      }
    </div>`;
    })
    .join("");
}

function buildDeadlines() {
  const table = document.getElementById("deadlineTable");
  if (!table) return;
  table.innerHTML = DEADLINES.map(
    (d) => `<tr>
    <td><strong>${d.due}</strong></td><td><code>${d.course}</code></td>
    <td>${d.task}</td><td>${d.weight}</td>
    <td><span class="badge ${d.status === "Submitted" ? "badge-green" : "badge-gold"}">${d.status}</span></td>
  </tr>`,
  ).join("");
}

function buildCourses() {
  const table = document.getElementById("coursesTable");
  if (!table) return;
  table.innerHTML = GRADES_DATA.sem2
    .map((g, i) => {
      const sched = Object.entries(SCHEDULE).find(([d, slots]) =>
        slots.some((s) => s.course === g.code),
      );
      const slot = sched
        ? SCHEDULE[sched[0]].find((s) => s.course === g.code)
        : null;
      return `<tr>
      <td><code>${g.code}</code></td><td><strong>${g.name}</strong></td>
      <td>${g.credits} cr</td><td>${LECTURERS[i] || "—"}</td>
      <td>${sched ? sched[0] + " " + slot?.time : "—"}</td>
      <td>${slot?.room || "—"}</td>
      <td><span class="grade-badge grade-${g.grade[0]}">${g.grade}</span></td>
    </tr>`;
    })
    .join("");
}

function buildNotifications() {
  const list = document.getElementById("notifList");
  if (!list) return;
  list.innerHTML = NOTIFICATIONS.map(
    (n) => `
    <div class="notif-item${n.unread ? " unread" : ""}" data-toast="Marked as read">
      <div class="notif-icon">${n.icon}</div>
      <div>
        <div class="notif-title"><span class="notif-tag tag-${n.tag}">${n.tag.toUpperCase()}</span>${n.title}</div>
        <div class="notif-body">${n.body}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`,
  ).join("");
}

function showSec(sec, el) {
  document
    .querySelectorAll(".dash-section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".sidebar-item")
    .forEach((s) => s.classList.remove("active"));
  const secEl = document.getElementById("sec-" + sec);
  if (secEl) secEl.classList.add("active");
  if (el) el.classList.add("active");
  if (sec === "attendance") setTimeout(animAttBars, 60);
  closeSidebar();
}

// Home page slider.
function moveSlide(d) {
  const count = document.querySelectorAll(".slide").length;
  if (!count) return;
  slideIdx = (slideIdx + d + count) % count;
  updateSlider();
}

function goToSlide(i) {
  const count = document.querySelectorAll(".slide").length;
  if (!count) return;
  slideIdx = Math.max(0, Math.min(i, count - 1));
  updateSlider();
}

function updateSlider() {
  const track = document.getElementById("sliderTrack");
  if (!track) return;
  track.style.transform = `translateX(-${slideIdx * 100}%)`;
  document
    .querySelectorAll(".slider-dot")
    .forEach((d, i) => d.classList.toggle("active", i === slideIdx));
}

function initSlider() {
  if (!document.getElementById("sliderTrack")) return;
  updateSlider();
  if (sliderTimer) clearInterval(sliderTimer);
  sliderTimer = setInterval(() => moveSlide(1), 4200);
}

// Animate the hero counters only when they scroll into view.
function initCounters() {
  const targets = document.querySelectorAll("[data-target]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const dec = Number.isInteger(target) ? 0 : 2;
      el.textContent = target.toFixed(dec) + suffix;
    });
    return;
  }

  const io = new IntersectionObserver((entries) =>
    entries.forEach((e) => {
      // Transcript generator.
      const el = e.target,
        target = parseFloat(el.dataset.target),
        suffix = el.dataset.suffix || "",
        dec = Number.isInteger(target) ? 0 : 2;
      let s = null;
      const step = (ts) => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / 1300, 1),
          ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * ease).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(dec) + suffix;
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    }),
  );
  targets.forEach((el) => io.observe(el));
}

// Transcript generator.
function generateTranscript() {
  const sem = document.getElementById("rSemester")?.value;
  const type = document.getElementById("rType")?.value;
  let ok = true;
  if (!sem) {
    document.getElementById("err-semester").classList.add("show");
    document.getElementById("rSemester").classList.add("error");
    ok = false;
  } else {
    document.getElementById("err-semester").classList.remove("show");
    document.getElementById("rSemester").classList.remove("error");
  }
  if (!type) {
    document.getElementById("err-type").classList.add("show");
    document.getElementById("rType").classList.add("error");
    ok = false;
  } else {
    document.getElementById("err-type").classList.remove("show");
    document.getElementById("rType").classList.remove("error");
  }
  if (!ok) {
    showToast("⚠ Please fill in all required fields");
    return;
  }

  const now = new Date().toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const selText =
    document.getElementById("rSemester").options[
      document.getElementById("rSemester").selectedIndex
    ].text;
  document.getElementById("reportTitle").textContent =
    `${type} — Ahmad Fauzi (U2024-IT-0042)`;
  document.getElementById("reportMeta").textContent =
    `Generated: ${now} · ${selText} · Bachelor of Computer Science (Hons)`;

  const sems = sem === "all" ? ["sem2", "sem1", "sem4", "sem3"] : [sem];
  document.getElementById("transcriptBody").innerHTML = sems
    .map((s) => {
      const data = GRADES_DATA[s],
        info = SEM_INFO[s];
      const totalCr = data.reduce((a, g) => a + g.credits, 0);
      return `<div class="sem-block">
      <h4>${info.label}<span class="sem-gpa-tag">Semester GPA: ${info.gpa}</span></h4>
      <div class="table-wrap">
        <table><thead><tr><th>Code</th><th>Course</th><th>Credits</th><th>Grade</th></tr></thead>
        <tbody>${data.map((g) => `<tr><td><code>${g.code}</code></td><td>${g.name}</td><td>${g.credits}</td><td><span class="grade-badge grade-${g.grade[0]}">${g.grade}</span></td></tr>`).join("")}
        <tr style="background:var(--cream)"><td colspan="2"><strong>Total</strong></td><td><strong>${totalCr}</strong></td><td><strong style="color:var(--gold)">${info.gpa}</strong></td></tr>
        </tbody></table>
      </div>
    </div>`;
    })
    .join("");

  if (typeof Chart !== "undefined") {
    if (tChartInst) tChartInst.destroy();
    const chartEl = document.getElementById("transcriptChart");
    if (chartEl) {
      tChartInst = new Chart(chartEl.getContext("2d"), {
        type: "line",
        data: {
          labels: GPA_HISTORY.map((g) => g.sem),
          datasets: [
            {
              label: "GPA",
              data: GPA_HISTORY.map((g) => g.gpa),
              borderColor: "#C9A84C",
              backgroundColor: "rgba(201,168,76,0.08)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#C9A84C",
              pointRadius: 6,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            y: {
              min: 3.0,
              max: 4.0,
              grid: { color: "#E8E0D0" },
              ticks: { callback: (v) => v.toFixed(2) },
            },
            x: { grid: { display: false } },
          },
        },
      });
    }
  }

  const res = document.getElementById("reportResults");
  res.classList.add("visible");
  res.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("✓ Transcript generated successfully");
}

function downloadTranscript() {
  showToast("⬇ Preparing transcript PDF... (demo)");
  setTimeout(() => showToast("✓ Transcript downloaded successfully"), 1800);
}

// Small toast messages for quick feedback.
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

// Shared click and change handlers keep the markup simple.
function runAction(action) {
  switch (action) {
    case "renderGrades":
      renderGrades();
      break;
    case "generateTranscript":
      generateTranscript();
      break;
    case "downloadTranscript":
      downloadTranscript();
      break;
    default:
      break;
  }
}

function handleClick(e) {
  const pageEl = e.target.closest("[data-page]");
  if (pageEl) {
    e.preventDefault();
    showPage(pageEl.dataset.page);
    return;
  }

  const sectionEl = e.target.closest("[data-section]");
  if (sectionEl) {
    e.preventDefault();
    showSec(sectionEl.dataset.section, sectionEl);
    return;
  }

  const actionEl = e.target.closest("[data-action]");
  if (actionEl) {
    e.preventDefault();
    runAction(actionEl.dataset.action);
    return;
  }

  const slideEl = e.target.closest("[data-slide]");
  if (slideEl) {
    e.preventDefault();
    const val = slideEl.dataset.slide;
    if (val === "prev") moveSlide(-1);
    else if (val === "next") moveSlide(1);
    else goToSlide(parseInt(val, 10));
    return;
  }

  const toastEl = e.target.closest("[data-toast]");
  if (toastEl) {
    e.preventDefault();
    showToast(toastEl.dataset.toast);
    return;
  }
}

function handleChange(e) {
  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;
  runAction(actionEl.dataset.action);
}

function initUI() {
  navToggle = document.getElementById("navToggle");
  navOverlay = document.getElementById("navOverlay");
  sidebarToggle = document.getElementById("sidebarToggle");
  sidebarOverlay = document.getElementById("sidebarOverlay");

  if (navToggle) navToggle.addEventListener("click", toggleNav);
  if (navOverlay) navOverlay.addEventListener("click", closeNav);
  if (sidebarToggle) sidebarToggle.addEventListener("click", toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

  document.addEventListener("click", handleClick);
  document.addEventListener("change", handleChange);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNav();
      closeSidebar();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      closeNav();
      closeSidebar();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  initCounters();
  initSlider();
  routeFromHash();
});

window.addEventListener("hashchange", routeFromHash);
