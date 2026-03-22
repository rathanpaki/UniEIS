"use strict";

let GRADES_DATA = {};
let GPA_HISTORY = [];
let SEM_INFO = {
  sem2: { label: "Semester 2, 2024–2025", gpa: 3.8 },
  sem1: { label: "Semester 1, 2024–2025", gpa: 3.68 },
  sem4: { label: "Semester 2, 2023–2024", gpa: 3.55 },
  sem3: { label: "Semester 1, 2023–2024", gpa: 3.42 },
};

let tChartInst;
let toastTimer;

let navToggle;
let navOverlay;

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

function handleScrollFx() {
  document.body.classList.toggle("scrolled", window.scrollY > 24);
}

function getRevealGroup(el) {
  return (
    el.closest(
      ".features-grid, .stats-strip, .kpi-grid, .charts-row, .att-list, .notif-list, .form-grid, .report-results, section, .dash-section, .reports-wrap, .login-shell",
    ) || document.body
  );
}

function initScrollAnimations() {
  handleScrollFx();
  window.addEventListener("scroll", handleScrollFx, { passive: true });

  const revealEls = [...document.querySelectorAll("[data-reveal]")];
  if (!revealEls.length) return;

  const groups = new Map();
  revealEls.forEach((el) => {
    const group = getRevealGroup(el);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(el);
  });

  groups.forEach((els) => {
    els.forEach((el, idx) => {
      const delay = Math.min(idx * 80, 520);
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    });
  });

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("reveal-active"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-active");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => {
    if (el.classList.contains("reveal-active")) return;
    io.observe(el);
  });
}

async function initTranscriptPage() {
  try {
    const res = await fetch("api/dashboard/overview.php");
    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }
    const data = await res.json();
    if (!data.success) throw new Error("Transcript preload failed");

    GPA_HISTORY = data.gpa_history || [];

    const cgpaEl = document.querySelector(".transcript-cgpa");
    if (cgpaEl && data.kpis?.cgpa)
      cgpaEl.textContent = data.kpis.cgpa.toFixed(2);

    const studentName = document.querySelector(".transcript-header h3");
    const studentMeta = document.querySelector(".transcript-header p");
    if (studentName && data.user?.name)
      studentName.textContent = data.user.name;
    if (studentMeta && data.user) {
      studentMeta.textContent = `${data.user.student_id} · ${data.user.program} · ${data.user.faculty}`;
    }
  } catch (e) {
    showToast("Error loading transcript data");
    console.error(e);
  }
}

async function generateTranscript() {
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

  for (const s of sems) {
    if (!GRADES_DATA[s]) {
      const res = await fetch(`api/grades/index.php?semester=${s}`);
      const gData = await res.json();
      GRADES_DATA[s] = gData.data;
    }
  }

  document.getElementById("transcriptBody").innerHTML = sems
    .map((s) => {
      const data = GRADES_DATA[s] || [];
      const info = SEM_INFO[s];
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

async function downloadTranscript() {
  const reportVisible = document
    .getElementById("reportResults")
    ?.classList.contains("visible");
  if (!reportVisible) {
    showToast("Generate the transcript before downloading.");
    return;
  }

  if (!(window.jspdf && window.jspdf.jsPDF)) {
    showToast("PDF library failed to load. Check your internet connection.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const maxTextWidth = pageWidth - margin * 2;

  let y = 46;

  const reportTitle =
    document.getElementById("reportTitle")?.textContent?.trim() ||
    "Academic Transcript";
  const reportMeta =
    document.getElementById("reportMeta")?.textContent?.trim() || "";
  const studentName =
    document.querySelector(".transcript-header h3")?.textContent?.trim() ||
    "Student";
  const studentMeta =
    document.querySelector(".transcript-header p")?.textContent?.trim() || "";
  const cgpaText =
    document.querySelector(".transcript-cgpa")?.textContent?.trim() || "-";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(reportTitle, margin, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const metaLines = doc.splitTextToSize(reportMeta, maxTextWidth);
  doc.text(metaLines, margin, y);
  y += metaLines.length * 12 + 10;

  doc.setDrawColor(212, 201, 176);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(studentName, margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const studentMetaLines = doc.splitTextToSize(studentMeta, maxTextWidth - 90);
  doc.text(studentMetaLines, margin, y);
  doc.setFont("helvetica", "bold");
  doc.text(`CGPA: ${cgpaText}`, pageWidth - margin - 90, y);
  y += studentMetaLines.length * 12 + 14;

  const sem = document.getElementById("rSemester")?.value;
  if (!sem) {
    showToast("Select a semester and generate transcript first.");
    return;
  }

  const sems = sem === "all" ? ["sem2", "sem1", "sem4", "sem3"] : [sem];

  for (const s of sems) {
    if (!GRADES_DATA[s]) {
      const res = await fetch(`api/grades/index.php?semester=${s}`);
      const gData = await res.json();
      GRADES_DATA[s] = gData.data;
    }
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  sems.forEach((s) => {
    const semInfo = SEM_INFO[s];
    const courses = GRADES_DATA[s] || [];

    if (!semInfo || courses.length === 0) return;

    if (y > pageHeight - 130) {
      doc.addPage();
      y = 46;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${semInfo.label}  |  GPA: ${semInfo.gpa}`, margin, y);
    y += 14;

    doc.setFont("helvetica", "bold");
    doc.text("Code", margin, y);
    doc.text("Course", margin + 70, y);
    doc.text("Cr", pageWidth - margin - 90, y);
    doc.text("Grade", pageWidth - margin - 45, y);
    y += 10;
    doc.setDrawColor(212, 201, 176);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    doc.setFont("helvetica", "normal");
    courses.forEach((course) => {
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 46;
      }

      const courseName = doc.splitTextToSize(
        course.name || "",
        maxTextWidth - 190,
      );
      doc.text(course.code || "", margin, y);
      doc.text(courseName[0] || "", margin + 70, y);
      doc.text(String(course.credits ?? ""), pageWidth - margin - 90, y);
      doc.text(String(course.grade ?? ""), pageWidth - margin - 45, y);
      y += 12;

      if (courseName.length > 1) {
        courseName.slice(1).forEach((line) => {
          if (y > pageHeight - 60) {
            doc.addPage();
            y = 46;
          }
          doc.text(line, margin + 70, y);
          y += 12;
        });
      }
    });

    y += 10;
  });

  const studentId = studentMeta.match(/U\d{4}-[A-Z]+-\d+/)?.[0] || "student";
  doc.save(`transcript-${studentId}.pdf`);
  showToast("✓ Transcript downloaded successfully");
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

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

async function runAction(action) {
  switch (action) {
    case "generateTranscript":
      await generateTranscript();
      break;
    case "downloadTranscript":
      await downloadTranscript();
      break;
    case "logout":
      await logoutUser();
      break;
    default:
      break;
  }
}

function handleClick(e) {
  const actionEl = e.target.closest("[data-action]");
  if (actionEl) {
    e.preventDefault();
    runAction(actionEl.dataset.action);
  }
}

function initUI() {
  navToggle = document.getElementById("navToggle");
  navOverlay = document.getElementById("navOverlay");

  if (navToggle) navToggle.addEventListener("click", toggleNav);
  if (navOverlay) navOverlay.addEventListener("click", closeNav);

  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) closeNav();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  initScrollAnimations();
  initTranscriptPage();
});
