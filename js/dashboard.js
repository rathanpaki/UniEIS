"use strict";

let GRADES_DATA = {};
let GPA_HISTORY = [];
let ATTENDANCE_DATA = [];
let SCHEDULE = {};
let DEADLINES = [];
let NOTIFICATIONS = [];
const LECTURERS = [
  "Dr. Ahmad Zaki",
  "Dr. Nora Hassan",
  "Prof. Raj Patel",
  "Dr. Lisa Chen",
  "Mr. Faiz Aziz",
  "Dr. Aishah Mohd",
];

let scoreBreakdownGlobal = [];
let attendanceTrendGlobal = [0, 0, 0, 0, 0, 0, 0];

let gradesBarInst;
let toastTimer;

let navToggle;
let navOverlay;
let sidebarToggle;
let sidebarOverlay;

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

async function initDash() {
  try {
    const res = await fetch("api/dashboard/overview.php");
    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }
    const data = await res.json();
    if (!data.success) throw new Error("Dashboard failed");

    document.querySelector(".profile-name").textContent = data.user.name;
    document.querySelector(".profile-id").textContent = data.user.student_id;
    document.querySelector(".profile-badge").textContent =
      data.user.year + " · " + data.user.faculty;
    document.querySelector(".dash-header h2").textContent =
      "Welcome back, " + data.user.first_name + " 👋";
    document.querySelector(".dash-header p").textContent =
      data.user.current_semester + " · " + data.user.program;

    GPA_HISTORY = data.gpa_history;
    scoreBreakdownGlobal = data.score_breakdown;

    animNum("kpi-cgpa", data.kpis.cgpa, 1300, 2);
    animNum("kpi-att", data.kpis.attendance_rate, 1200, 0, "%");
    animNum("kpi-credits", data.kpis.credits_completed, 1100, 0);
    animNum("kpi-courses", data.kpis.current_courses, 700, 0);

    const cgpaRing = document.getElementById("gpaRingCircle");
    if (cgpaRing) {
      const circ = 2 * Math.PI * 58;
      cgpaRing.style.transition =
        "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)";
      cgpaRing.style.strokeDashoffset = circ * (1 - data.kpis.cgpa / 4.0);
      const valEl = document.querySelector(".gpa-ring-value");
      if (valEl) valEl.textContent = data.kpis.cgpa.toFixed(2);
    }

    const [gradesRes, attRes, schedRes, deadlinesRes, notifRes] =
      await Promise.all([
        fetch("api/grades/index.php?semester=sem2"),
        fetch("api/attendance/index.php"),
        fetch("api/schedule/index.php"),
        fetch("api/deadlines/index.php"),
        fetch("api/notifications/index.php"),
      ]);

    const gData = await gradesRes.json();
    GRADES_DATA[gData.semester] = gData.data;

    const aData = await attRes.json();
    ATTENDANCE_DATA = aData.data;
    attendanceTrendGlobal = aData.trend;

    const sData = await schedRes.json();
    SCHEDULE = sData.data;

    const dData = await deadlinesRes.json();
    DEADLINES = dData.data;

    const nData = await notifRes.json();
    NOTIFICATIONS = nData.data;

    buildGpaProgress();
    buildGradeBreak();
    renderGrades();
    buildAttendance();
    buildAttTrend();
    buildAttPie();
    buildSchedule();
    buildDeadlines();
    buildCourses();
    buildNotifications();
  } catch (e) {
    showToast("Error loading dashboard data");
    console.error(e);
  }
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
  const g = scoreBreakdownGlobal;
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

async function renderGrades() {
  const semEl = document.getElementById("gradeSem");
  if (!semEl) return;
  const sem = semEl.value || "sem2";

  if (!GRADES_DATA[sem]) {
    const res = await fetch(`api/grades/index.php?semester=${sem}`);
    const gData = await res.json();
    GRADES_DATA[sem] = gData.data;
  }

  const data = GRADES_DATA[sem] || [];
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
          data: attendanceTrendGlobal,
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
  const good = ATTENDANCE_DATA.filter((a) => a.pct >= 85).length;
  const warn = ATTENDANCE_DATA.filter((a) => a.pct >= 80 && a.pct < 85).length;
  const bad = ATTENDANCE_DATA.filter((a) => a.pct < 80).length;
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
  const tod = new Date().getDay();
  grid.innerHTML = days
    .map((d, i) => {
      const slots = SCHEDULE[d] || [];
      const isToday = i + 1 === tod;
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
  if (!table || !GRADES_DATA.sem2) return;
  table.innerHTML = GRADES_DATA.sem2
    .map((g, i) => {
      const sched = Object.entries(SCHEDULE).find(([, slots]) =>
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
    (
      n,
    ) => `<div class="notif-item${n.unread ? " unread" : ""}" data-toast="Marked as read">
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

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

async function logoutUser() {
  try {
    const res = await fetch("api/auth/logout.php", {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      showToast("Logged out successfully");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 250);
      return;
    }
  } catch (error) {
    console.error(error);
  }

  showToast("Logout failed. Try again.");
}

async function runAction(action) {
  if (action === "renderGrades") {
    await renderGrades();
    return;
  }
  if (action === "logout") {
    await logoutUser();
  }
}

function handleClick(e) {
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
  initDash();
});
