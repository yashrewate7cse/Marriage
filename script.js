const audio = document.getElementById("music");
let firstLoopCompleted = false;
let audioStarted = false;

audio.loop = true;
audio.preload = "auto";
audio.playsInline = true;
audio.volume = 1;

// The first full play-through stays at 100%. As soon as it reaches its
// first loop boundary, every repeat continues at 70%.
function lowerVolumeAfterFirstLoop() {
  if (firstLoopCompleted || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
  if (audio.currentTime >= audio.duration - 0.35) {
    firstLoopCompleted = true;
    audio.volume = 0.70;
  }
}
audio.addEventListener("timeupdate", lowerVolumeAfterFirstLoop);
audio.addEventListener("ended", () => {
  firstLoopCompleted = true;
  audio.volume = 0.70;
});
audio.addEventListener("playing", () => {
  audioStarted = true;
  if (firstLoopCompleted) audio.volume = 0.70;
});

async function startMusic() {
  if (!audio.paused) return;
  try {
    audio.muted = false;
    if (!audioStarted && !firstLoopCompleted) audio.volume = 1;
    else if (firstLoopCompleted) audio.volume = 0.70;
    await audio.play();
  } catch (err) {
    // Audible autoplay can be blocked by mobile browsers. The first
    // normal interaction with this invitation retries playback silently.
  }
}

// Try immediately. If the browser blocks autoplay, the first ordinary
// interaction anywhere on the page starts the song; there is no music UI.
window.addEventListener("DOMContentLoaded", startMusic);
window.addEventListener("load", startMusic);
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  startMusic();
  ["pointerdown", "touchstart", "keydown", "scroll"].forEach(type =>
    window.removeEventListener(type, unlockAudio)
  );
}
["pointerdown", "touchstart", "keydown", "scroll"].forEach(type =>
  window.addEventListener(type, unlockAudio, {once:true, passive:true})
);

// Resume after returning to the browser if the operating system suspended playback.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && audio.paused) startMusic();
});

// The glitter reveal is part of the invitation itself, not a separate
// tap-to-open or sound-control screen.
const opening = document.getElementById("opening");
if (opening) {
  const dust = opening.querySelector(".glitter-dust");
  for (let i = 0; i < 42; i++) {
    const spark = document.createElement("i");
    spark.style.setProperty("--gx", `${(i * 29 + 7) % 100}%`);
    spark.style.setProperty("--gy", `${(i * 43 + 11) % 100}%`);
    spark.style.setProperty("--gs", `${1 + (i % 3)}px`);
    spark.style.setProperty("--gd", `${1.4 + (i % 6) * 0.55}s`);
    spark.style.setProperty("--delay", `${(i % 9) * -0.45}s`);
    dust.append(spark);
  }
}
window.setTimeout(() => {
  if (opening) {
    opening.classList.add("opening-finished");
    window.setTimeout(() => opening.remove(), 1400);
  }
}, 4300);

// Calendar: build all month dates, keep the active page visible above the paper.
document.querySelectorAll(".days").forEach(grid => {
  const month = Number(grid.dataset.month), year = 2027;
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < first; i++) grid.append(document.createElement("span"));
  for (let day = 1; day <= count; day++) {
    const cell = document.createElement("span");
    cell.textContent = day;
    if (month === 5 && day === 12) cell.className = "chosen";
    grid.append(cell);
  }
});
const pages = [...document.querySelectorAll(".month-page")];
let currentPage = 0;
function showCalendarPage(index) {
  pages.forEach((page, i) => {
    page.classList.toggle("active", i === index);
    page.setAttribute("aria-hidden", i === index ? "false" : "true");
  });
  currentPage = index;
}
showCalendarPage(0);
let calendarTimer = null;
const calendar = document.querySelector(".calendar-shell");
if (calendar && pages.length > 1) {
  const calendarObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      if (!calendarTimer) {
        calendarTimer = setInterval(() => showCalendarPage((currentPage + 1) % pages.length), 2400);
      }
      calendarObserver.disconnect();
    }
  }, {threshold: 0.2});
  calendarObserver.observe(calendar);
}

// Scroll reveal and subtle section motion.
const revealTargets = document.querySelectorAll(
  ".section-title, .calendar-shell, .save-line, .gold-button, .paper-card, .venue-frame, .venue-name, .venue-address, .map-frame, .dress-card, .rsvp-card, .questions h2, .faq details, .countdown > *"
);
revealTargets.forEach(el => el.classList.add("motion-in"));
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("motion-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
revealTargets.forEach(el => revealObserver.observe(el));

// A few subtle floating rose-gold particles add movement without filling the page with clutter.
document.querySelectorAll(".hero, .letter, .calendar-section, .dress, .countdown").forEach((section, sectionIndex) => {
  const layer = document.createElement("div");
  layer.className = "ambient-particles";
  layer.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 13; i++) {
    const dot = document.createElement("i");
    dot.style.setProperty("--x", `${(i * 37 + sectionIndex * 13) % 100}%`);
    dot.style.setProperty("--delay", `${(i % 7) * -1.4}s`);
    dot.style.setProperty("--duration", `${7 + (i % 5) * 1.7}s`);
    dot.style.setProperty("--size", `${2 + (i % 3)}px`);
    layer.append(dot);
  }
  section.append(layer);
});

// Live countdown.
function countdown() {
  const end = new Date("2027-06-12T17:30:00+05:30").getTime();
  const left = Math.max(0, end - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor(left % 86400000 / 3600000);
  const m = Math.floor(left % 3600000 / 60000);
  document.getElementById("days").textContent = String(d).padStart(3, "0");
  document.getElementById("hours").textContent = String(h).padStart(2, "0");
  document.getElementById("minutes").textContent = String(m).padStart(2, "0");
}
countdown();
setInterval(countdown, 60000);

// Calendar download.
document.getElementById("calendarLink").addEventListener("click", e => {
  e.preventDefault();
  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT",
    "UID:aurelia-sebastian-20270612@example.com",
    "DTSTART:20270612T120000Z","DTEND:20270612T170000Z",
    "SUMMARY:Aurelia & Sebastian Wedding",
    "LOCATION:Example venue, Nagpur, India","END:VEVENT","END:VCALENDAR"
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], {type:"text/calendar;charset=utf-8"}));
  const link = document.createElement("a");
  link.href = url; link.download = "wedding.ics"; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// RSVP demo confirmation.
const replyForm = document.getElementById("replyForm");
const admit = document.getElementById("admitCard");
replyForm.addEventListener("submit", e => {
  e.preventDefault();
  const who = new FormData(replyForm).get("fullName") || "Guest";
  document.getElementById("formStatus").textContent =
    `Thank you, ${who}. Your reply has been saved in this demo only.`;
  admit.hidden = false;
  admit.scrollIntoView({behavior:"smooth", block:"center"});
});
document.getElementById("changeReply").addEventListener("click", () => {
  admit.hidden = true;
  document.getElementById("rsvp").scrollIntoView({behavior:"smooth"});
});
