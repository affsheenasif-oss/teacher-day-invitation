/* ==========================================================================
   TEACHER'S DAY CELEBRATION 2026 - INVITATION ENGINE
   Department of Electrical Engineering
   ========================================================================== */

/**
 * ==========================================================================
 * 🛠️ EASY CUSTOMIZATION SECTION (EDIT HERE)
 * ==========================================================================
 * You can edit any details below: teacher names, slugs, event date,
 * time, venue, department, or messages. Everything updates automatically!
 */
const INVITATION_CONFIG = {
  // Event Details
  eventTitle: "Teacher’s Day Celebration 2026",
  eventDate: "5 October 2026",
  eventTime: "1:00 PM",
  eventVenue: "Room 66",
  department: "Electrical Engineering Department",

  // Quotes & Messages
  quote: "A great teacher inspires, guides, and leaves a lasting impact.",
  courtesyIntro: "With heartfelt gratitude and appreciation,<br>You are warmly invited to our",
  closingMessage: "Your presence will make this celebration even more special.",
  signatureRespect: "With sincere gratitude and respect,",
  signatureSender: "Your Students ❤️",

  // Calendar Event Timing (5 October 2026, 1:00 PM to 3:00 PM)
  calendar: {
    startYear: 2026,
    startMonth: 10, // October
    startDay: 5,
    startHour: 13,  // 1:00 PM (24-hour format)
    startMinute: 0,
    durationHours: 2
  },

  // WhatsApp Coordinator Number (Optional - leave empty for default share)
  rsvpWhatsAppNumber: "", // e.g. "923001234567" if you have a coordinator number

  // Background Audio Configuration
  // Set to null to use our built-in soothing Web Audio ambient piano music generator,
  // or put a path to an mp3 file like 'assets/ambient.mp3'
  customAudioUrl: null,

  // ========================================================================
  // 🎓 THE 9 HONORED TEACHERS & PERSONALIZED URL SLUGS
  // ========================================================================
  teachers: [
    {
      id: 1,
      slug: "irfan-abid",
      titleAndName: "Prof. Dr. Irfan Abid",
      salutation: "Prof. Dr. Irfan Abid"
    },
    {
      id: 2,
      slug: "muhammad-junaid",
      titleAndName: "Prof. Muhammad Junaid",
      salutation: "Prof. Muhammad Junaid"
    },
    {
      id: 3,
      slug: "umer-khan",
      titleAndName: "Dr. Umer Khan",
      salutation: "Dr. Umer Khan"
    },
    {
      id: 4,
      slug: "fahid-randhawa",
      titleAndName: "Engr. Fahid Randhawa",
      salutation: "Engr. Fahid Randhawa"
    },
    {
      id: 5,
      slug: "aftab-ahmed",
      titleAndName: "Engr. Aftab Ahmed",
      salutation: "Engr. Aftab Ahmed"
    },
    {
      id: 6,
      slug: "saqlain",
      titleAndName: "Engr. Saqlain",
      salutation: "Engr. Saqlain"
    },
    {
      id: 7,
      slug: "abubakar",
      titleAndName: "Engr. Abubakar",
      salutation: "Engr. Abubakar"
    },
    {
      id: 8,
      slug: "abdul-basit",
      titleAndName: "Engr. Abdul Basit",
      salutation: "Engr. Abdul Basit"
    },
    {
      id: 9,
      slug: "ahsan",
      titleAndName: "Engr. Ahsan",
      salutation: "Engr. Ahsan"
    }
  ]
};

/* ==========================================================================
   APPLICATION STATE
   ========================================================================== */
const AppState = {
  currentTeacher: null,
  isMusicPlaying: false,
  audioContext: null,
  audioElement: null,
  audioOscillators: []
};

/* ==========================================================================
   URL & ROUTING LOGIC
   Supports:
   - Path routing: /invite/irfan-abid
   - Subfolder path routing: /subfolder/invite/irfan-abid
   - Hash routing: #/invite/irfan-abid or #/irfan-abid
   - Query param fallback: ?teacher=irfan-abid
   ========================================================================== */
function detectTeacherSlug() {
  const url = new URL(window.location.href);

  // 1. Check Query Parameter (?teacher=slug or ?invite=slug)
  const querySlug = url.searchParams.get("teacher") || url.searchParams.get("invite");
  if (querySlug) {
    return querySlug.trim().toLowerCase();
  }

  // 2. Check Hash Route (#/invite/slug or #slug)
  const hash = window.location.hash;
  if (hash) {
    const hashClean = hash.replace(/^#\/?/, "");
    const hashParts = hashClean.split("/").filter(Boolean);
    if (hashParts.length > 0) {
      const candidate = hashParts[hashParts.length - 1];
      if (candidate && candidate !== "invite") {
        return candidate.toLowerCase();
      }
    }
  }

  // 3. Check Pathname (/invite/slug)
  const pathname = window.location.pathname;
  const pathSegments = pathname.split("/").filter(Boolean);

  // Look for segment directly after 'invite'
  const inviteIndex = pathSegments.indexOf("invite");
  if (inviteIndex !== -1 && inviteIndex + 1 < pathSegments.length) {
    return pathSegments[inviteIndex + 1].toLowerCase();
  }

  // If the last segment matches one of our teacher slugs
  if (pathSegments.length > 0) {
    const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
    const isDirectSlug = INVITATION_CONFIG.teachers.some(t => t.slug === lastSegment);
    if (isDirectSlug) {
      return lastSegment;
    }
  }

  // No specific teacher slug detected (root page)
  return null;
}

/**
 * Generate canonical URL for a teacher link
 */
function getTeacherShareUrl(slug) {
  const origin = window.location.origin;
  const pathname = window.location.pathname;

  // If running on GitHub Pages under a subfolder e.g. /repo-name/
  let basePath = "";
  if (pathname.includes("/invite/")) {
    basePath = pathname.substring(0, pathname.indexOf("/invite/"));
  } else if (pathname.endsWith("/index.html")) {
    basePath = pathname.replace("/index.html", "");
  } else if (pathname !== "/") {
    basePath = pathname.replace(/\/$/, "");
  }

  // If served via standard server (Netlify, Vercel, or custom server with rewrites)
  return `${origin}${basePath}/invite/${slug}`;
}

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const DOM = {
  // Stages
  coverStage: document.getElementById("coverStage"),
  cardStage: document.getElementById("cardStage"),
  notFoundStage: document.getElementById("notFoundStage"),

  // Cover Elements
  coverTeacherTeaser: document.getElementById("coverTeacherTeaser"),
  teaserTeacherName: document.getElementById("teaserTeacherName"),
  openInvitationBtn: document.getElementById("openInvitationBtn"),

  // Card Elements
  invitationTeacherName: document.getElementById("invitationTeacherName"),
  eventDateText: document.getElementById("eventDateText"),
  eventTimeText: document.getElementById("eventTimeText"),
  eventVenueText: document.getElementById("eventVenueText"),
  eventDeptText: document.getElementById("eventDeptText"),
  addToCalendarBtn: document.getElementById("addToCalendarBtn"),
  rsvpBtn: document.getElementById("rsvpBtn"),
  reviewCoverBtn: document.getElementById("reviewCoverBtn"),

  // 404 Elements
  invalidPathDisplay: document.getElementById("invalidPathDisplay"),
  openDefaultInviteBtn: document.getElementById("openDefaultInviteBtn"),
  viewDirectoryFrom404Btn: document.getElementById("viewDirectoryFrom404Btn"),

  // Music Controls
  musicToggleBtn: document.getElementById("musicToggleBtn"),
  musicBtnLabel: document.getElementById("musicBtnLabel"),

  // Modal & Directory
  directoryModalBtn: document.getElementById("directoryModalBtn"),
  directoryModal: document.getElementById("directoryModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  teachersListContainer: document.getElementById("teachersListContainer"),

  // Toast
  toast: document.getElementById("toastNotification"),
  toastMessage: document.getElementById("toastMessage")
};

/* ==========================================================================
   INITIALIZATION & STAGE SWITCHING
   ========================================================================== */
function initApp() {
  populateStaticTexts();
  renderDirectoryList();
  bindEventListeners();
  initParticles();

  // Evaluate URL
  const slug = detectTeacherSlug();

  if (!slug) {
    // Root visit or general faculty invite
    setGeneralInviteState();
  } else {
    // Look up teacher
    const teacher = INVITATION_CONFIG.teachers.find(t => t.slug === slug);
    if (teacher) {
      setTeacherState(teacher);
    } else {
      setNotFoundState(slug);
    }
  }
}

function populateStaticTexts() {
  DOM.eventDateText.textContent = INVITATION_CONFIG.eventDate;
  DOM.eventTimeText.textContent = INVITATION_CONFIG.eventTime;
  DOM.eventVenueText.textContent = INVITATION_CONFIG.eventVenue;
  DOM.eventDeptText.textContent = INVITATION_CONFIG.department;
}

function showStage(stageElement) {
  [DOM.coverStage, DOM.cardStage, DOM.notFoundStage].forEach(stage => {
    if (stage === stageElement) {
      stage.classList.remove("hidden");
      stage.classList.add("active");
    } else {
      stage.classList.add("hidden");
      stage.classList.remove("active");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setTeacherState(teacher) {
  AppState.currentTeacher = teacher;
  document.title = `Special Invitation for ${teacher.titleAndName} | Teacher's Day 2026`;

  // Cover Teaser
  DOM.teaserTeacherName.textContent = teacher.titleAndName;
  DOM.coverTeacherTeaser.style.display = "block";

  // Card Content
  DOM.invitationTeacherName.textContent = teacher.titleAndName;

  showStage(DOM.coverStage);
}

function setGeneralInviteState() {
  AppState.currentTeacher = null;
  document.title = `Teacher's Day Celebration 2026 | Electrical Engineering Department`;

  DOM.teaserTeacherName.textContent = "Honored Faculty Members";
  DOM.coverTeacherTeaser.style.display = "block";

  DOM.invitationTeacherName.textContent = "Respected Faculty Member";

  showStage(DOM.coverStage);
}

function setNotFoundState(slug) {
  AppState.currentTeacher = null;
  document.title = "Invitation Not Found | Teacher's Day 2026";
  DOM.invalidPathDisplay.textContent = `/invite/${slug || "unknown"}`;
  showStage(DOM.notFoundStage);
}

/* ==========================================================================
   INTERACTIONS & EVENT HANDLERS
   ========================================================================== */
function bindEventListeners() {
  // Open Invitation Button (Stage 1 -> Stage 2)
  DOM.openInvitationBtn.addEventListener("click", () => {
    // Start ambient music automatically upon user gesture if not already playing
    if (!AppState.isMusicPlaying) {
      toggleMusic(true);
    }
    showStage(DOM.cardStage);
  });

  // Review Cover Button (Stage 2 -> Stage 1)
  DOM.reviewCoverBtn.addEventListener("click", () => {
    showStage(DOM.coverStage);
  });

  // 404 Action: Default Invite
  DOM.openDefaultInviteBtn.addEventListener("click", () => {
    setGeneralInviteState();
  });

  // 404 Action: Open Directory
  DOM.viewDirectoryFrom404Btn.addEventListener("click", () => {
    openDirectoryModal();
  });

  // Directory Modal Open / Close
  DOM.directoryModalBtn.addEventListener("click", openDirectoryModal);
  DOM.closeModalBtn.addEventListener("click", closeDirectoryModal);
  DOM.directoryModal.addEventListener("click", (e) => {
    if (e.target === DOM.directoryModal) {
      closeDirectoryModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDirectoryModal();
    }
  });

  // Music Toggle Button
  DOM.musicToggleBtn.addEventListener("click", () => {
    toggleMusic();
  });

  // Add to Calendar
  DOM.addToCalendarBtn.addEventListener("click", downloadCalendarInvite);

  // RSVP / Acknowledge Button
  DOM.rsvpBtn.addEventListener("click", handleRSVP);

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    const slug = detectTeacherSlug();
    if (!slug) {
      setGeneralInviteState();
    } else {
      const teacher = INVITATION_CONFIG.teachers.find(t => t.slug === slug);
      if (teacher) {
        setTeacherState(teacher);
      } else {
        setNotFoundState(slug);
      }
    }
  });
}

/* ==========================================================================
   ADMIN / TEACHER DIRECTORY MODAL
   ========================================================================== */
function renderDirectoryList() {
  DOM.teachersListContainer.innerHTML = "";

  INVITATION_CONFIG.teachers.forEach((teacher) => {
    const shareUrl = getTeacherShareUrl(teacher.slug);

    const row = document.createElement("div");
    row.className = "teacher-link-row";

    row.innerHTML = `
      <div class="teacher-row-meta">
        <span class="teacher-row-num">Teacher #${teacher.id}</span>
        <strong class="teacher-row-name">${escapeHtml(teacher.titleAndName)}</strong>
        <span class="teacher-row-slug">/invite/${teacher.slug}</span>
      </div>
      <div class="teacher-row-actions">
        <button class="mini-btn mini-view-btn" data-slug="${teacher.slug}">View</button>
        <button class="mini-btn mini-copy-btn" data-url="${escapeHtml(shareUrl)}" data-name="${escapeHtml(teacher.titleAndName)}">Copy Link</button>
        <button class="mini-btn mini-wa-btn" data-url="${escapeHtml(shareUrl)}" data-name="${escapeHtml(teacher.titleAndName)}">WhatsApp</button>
      </div>
    `;

    DOM.teachersListContainer.appendChild(row);
  });

  // Bind mini buttons
  DOM.teachersListContainer.querySelectorAll(".mini-view-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const slug = e.currentTarget.getAttribute("data-slug");
      const teacher = INVITATION_CONFIG.teachers.find(t => t.slug === slug);
      if (teacher) {
        // Update URL cleanly without full page refresh
        const targetUrl = getTeacherShareUrl(slug);
        try {
          window.history.pushState({}, "", targetUrl);
        } catch {
          window.location.hash = `/invite/${slug}`;
        }
        setTeacherState(teacher);
        closeDirectoryModal();
      }
    });
  });

  DOM.teachersListContainer.querySelectorAll(".mini-copy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const url = e.currentTarget.getAttribute("data-url");
      const name = e.currentTarget.getAttribute("data-name");
      copyToClipboard(url, `Copied link for ${name}!`);
    });
  });

  DOM.teachersListContainer.querySelectorAll(".mini-wa-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const url = e.currentTarget.getAttribute("data-url");
      const name = e.currentTarget.getAttribute("data-name");
      shareViaWhatsApp(name, url);
    });
  });
}

function openDirectoryModal() {
  DOM.directoryModal.classList.remove("hidden");
  DOM.directoryModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDirectoryModal() {
  DOM.directoryModal.classList.add("hidden");
  DOM.directoryModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || "Link copied to clipboard!");
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    showToast(successMsg || "Link copied to clipboard!");
  } catch (err) {
    showToast("Failed to copy link. Please copy manually.");
  }
  document.body.removeChild(textArea);
}

function shareViaWhatsApp(teacherName, teacherUrl) {
  const message = `Respected ${teacherName},\n\nYou are cordially invited to the Teacher's Day Celebration 2026 hosted by the Electrical Engineering Department.\n\n📅 Date: ${INVITATION_CONFIG.eventDate}\n⏰ Time: ${INVITATION_CONFIG.eventTime}\n📍 Venue: ${INVITATION_CONFIG.eventVenue}\n\nPlease click to open your personalized digital invitation:\n${teacherUrl}\n\nWith sincere gratitude and respect,\nYour Students ❤️`;

  const encoded = encodeURIComponent(message);
  const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(waUrl, "_blank");
}

function handleRSVP() {
  const teacherName = AppState.currentTeacher ? AppState.currentTeacher.titleAndName : "Honored Faculty";
  const replyMessage = `Dear Students,\n\nThank you for the warm invitation to the Teacher's Day Celebration 2026 (${INVITATION_CONFIG.department}).\n\nI will be pleased to attend!\n\nBest wishes,\n${teacherName}`;

  const encoded = encodeURIComponent(replyMessage);
  let waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
  if (INVITATION_CONFIG.rsvpWhatsAppNumber) {
    waUrl = `https://api.whatsapp.com/send?phone=${INVITATION_CONFIG.rsvpWhatsAppNumber}&text=${encoded}`;
  }
  window.open(waUrl, "_blank");
}

function showToast(message) {
  DOM.toastMessage.textContent = message;
  DOM.toast.classList.add("show");
  clearTimeout(DOM.toast._timer);
  DOM.toast._timer = setTimeout(() => {
    DOM.toast.classList.remove("show");
  }, 2800);
}

/* ==========================================================================
   CALENDAR (.ICS) GENERATOR
   ========================================================================== */
function downloadCalendarInvite() {
  const cal = INVITATION_CONFIG.calendar;
  const startYear = cal.startYear;
  const startMonth = String(cal.startMonth).padStart(2, "0");
  const startDay = String(cal.startDay).padStart(2, "0");
  const startHour = String(cal.startHour).padStart(2, "0");
  const startMinute = String(cal.startMinute).padStart(2, "0");

  const endHour = String(cal.startHour + cal.durationHours).padStart(2, "0");

  // Format: YYYYMMDDTHHMMSS
  const dtStart = `${startYear}${startMonth}${startDay}T${startHour}${startMinute}00`;
  const dtEnd = `${startYear}${startMonth}${startDay}T${endHour}${startMinute}00`;
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const description = `Teacher's Day Celebration 2026 - Department of Electrical Engineering.\\nVenue: ${INVITATION_CONFIG.eventVenue}\\nTime: ${INVITATION_CONFIG.eventTime}\\n\\n"A great teacher inspires, guides, and leaves a lasting impact."`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EE Department//Teachers Day Invitation 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:teachers-day-${Date.now()}@ee-dept.edu`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${INVITATION_CONFIG.eventTitle}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${INVITATION_CONFIG.eventVenue}, ${INVITATION_CONFIG.department}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT60M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Teacher's Day Celebration starting in 1 hour!",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Teachers_Day_Celebration_2026.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("📅 Calendar invitation downloaded!");
}

/* ==========================================================================
   LUXURY AMBIENT AUDIO ENGINE (WEB AUDIO API SYNTHESIZER / CUSTOM AUDIO)
   ========================================================================== */
function toggleMusic(forcePlay) {
  if (forcePlay !== undefined) {
    if (forcePlay && !AppState.isMusicPlaying) {
      startAmbientAudio();
    } else if (!forcePlay && AppState.isMusicPlaying) {
      stopAmbientAudio();
    }
    return;
  }

  if (AppState.isMusicPlaying) {
    stopAmbientAudio();
  } else {
    startAmbientAudio();
  }
}

function startAmbientAudio() {
  if (INVITATION_CONFIG.customAudioUrl) {
    if (!AppState.audioElement) {
      AppState.audioElement = new Audio(INVITATION_CONFIG.customAudioUrl);
      AppState.audioElement.loop = true;
    }
    AppState.audioElement.play().then(() => {
      setMusicUI(true);
    }).catch(() => {
      setMusicUI(false);
    });
    return;
  }

  // Elegant Built-in Web Audio API Harmonic Ambient Piano Harp
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!AppState.audioContext) {
      AppState.audioContext = new AudioContext();
    }

    if (AppState.audioContext.state === "suspended") {
      AppState.audioContext.resume();
    }

    startGentleArpeggiator();
    setMusicUI(true);
  } catch (err) {
    console.warn("Audio Context init warning:", err);
  }
}

function stopAmbientAudio() {
  if (AppState.audioElement) {
    AppState.audioElement.pause();
  }
  if (AppState.audioLoopTimer) {
    clearInterval(AppState.audioLoopTimer);
    AppState.audioLoopTimer = null;
  }
  setMusicUI(false);
}

function setMusicUI(isPlaying) {
  AppState.isMusicPlaying = isPlaying;
  if (isPlaying) {
    DOM.musicToggleBtn.classList.add("playing");
    DOM.musicBtnLabel.textContent = "Music: On";
  } else {
    DOM.musicToggleBtn.classList.remove("playing");
    DOM.musicBtnLabel.textContent = "Music: Off";
  }
}

/**
 * Built-in gentle acoustic bell/harp harmony synthesizer using Web Audio API
 * Generates an ethereal, regal chord sequence (D major / B minor ambient pads)
 */
function startGentleArpeggiator() {
  if (AppState.audioLoopTimer) clearInterval(AppState.audioLoopTimer);

  const notes = [
    // D Major / B Minor ethereal Pentatonic Frequencies (Hz)
    [293.66, 369.99, 440.00, 587.33], // D - F# - A - D
    [246.94, 329.63, 369.99, 493.88], // B - E - F# - B
    [277.18, 369.99, 440.00, 554.37], // C# - F# - A - C#
    [220.00, 329.63, 440.00, 659.25]  // A - E - A - E
  ];

  let chordIndex = 0;
  let noteIndex = 0;

  function playBellNote(freq, duration = 3.5, gainVal = 0.045) {
    if (!AppState.isMusicPlaying || !AppState.audioContext) return;
    const ctx = AppState.audioContext;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Soft warm sine + subtle overtone
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainVal, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration + 0.1);
  }

  // Initial chord trigger
  playBellNote(notes[0][0], 4.5, 0.06);

  AppState.audioLoopTimer = setInterval(() => {
    if (!AppState.isMusicPlaying) return;

    const currentChord = notes[chordIndex];
    const freq = currentChord[noteIndex % currentChord.length];

    playBellNote(freq, 3.8, 0.04);

    noteIndex++;
    if (noteIndex % 4 === 0) {
      chordIndex = (chordIndex + 1) % notes.length;
    }
  }, 950);
}

/* ==========================================================================
   FLOATING GOLD DUST & PETALS PARTICLES
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById("particlesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(45, Math.floor(window.innerWidth / 20));
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: Math.random() * 0.45 + 0.25,
      alpha: Math.random() * 0.65 + 0.25,
      alphaSpeed: (Math.random() - 0.5) * 0.008,
      color: Math.random() > 0.3 ? "#ffd970" : "#ffffff"
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX;
      p.y -= p.speedY; // Float gently upward like luxury champagne bubbles / starlight
      p.alpha += p.alphaSpeed;

      if (p.alpha <= 0.1 || p.alpha >= 0.85) {
        p.alphaSpeed = -p.alphaSpeed;
      }

      // Wrap around edges
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#d4af37";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  render();
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[m]);
}

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);
