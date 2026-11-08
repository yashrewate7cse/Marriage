const intro = document.getElementById("intro");
const invitation = document.getElementById("invitation");
const revealButton = document.getElementById("revealButton");
const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

function setMusicState(isPlaying) {
  musicToggle.classList.toggle("playing", isPlaying);
  musicLabel.textContent = isPlaying ? "Music on" : "Music off";
}
async function startMusic() {
  try {
    await music.play();
    setMusicState(true);
  } catch (error) {
    setMusicState(false);
    musicLabel.textContent = "Tap for music";
  }
}
function enterInvitation() {
  intro.classList.add("dismiss");
  invitation.classList.remove("hidden");
  document.body.classList.remove("locked");
  startMusic(); // User interaction allows the browser to start audio.
  setTimeout(() => {
    intro.style.display = "none";
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  }, 1150);
}
document.body.classList.add("locked");
revealButton.addEventListener("click", enterInvitation);
document.getElementById("glitterField").addEventListener("click", e => {
  if (e.target !== revealButton) enterInvitation();
});
musicToggle.addEventListener("click", async () => {
  if (music.paused) await startMusic();
  else { music.pause(); setMusicState(false); }
});
music.addEventListener("ended", () => setMusicState(false));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

function updateCountdown() {
  const target = new Date("2027-06-12T17:30:00+05:30").getTime();
  const diff = Math.max(0, target - Date.now());
  const day = Math.floor(diff / 86400000);
  const hour = Math.floor((diff % 86400000) / 3600000);
  const minute = Math.floor((diff % 3600000) / 60000);
  const second = Math.floor((diff % 60000) / 1000);
  document.getElementById("days").textContent = String(day).padStart(3, "0");
  document.getElementById("hours").textContent = String(hour).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minute).padStart(2, "0");
  document.getElementById("seconds").textContent = String(second).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Creates a downloadable calendar event (.ics) without a backend.
document.getElementById("calendarLink").addEventListener("click", e => {
  e.preventDefault();
  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Aurelia and Sebastian//Invitation//EN",
    "BEGIN:VEVENT","UID:aurelia-sebastian-20270612@example.com",
    "DTSTAMP:20261108T000000Z","DTSTART:20270612T120000Z","DTEND:20270612T170000Z",
    "SUMMARY:Aurelia & Sebastian — Wedding Celebration",
    "LOCATION:The Grand Estate, Nagpur, India",
    "DESCRIPTION:Join us to celebrate the wedding of Aurelia and Sebastian.",
    "END:VEVENT","END:VCALENDAR"
  ].join("\\r\\n");
  const blob = new Blob([ics], {type:"text/calendar;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "aurelia-sebastian-wedding.ics"; a.click();
  URL.revokeObjectURL(url);
});

// Demo-only RSVP: replace this handler with Formspree, Netlify Forms or your backend.
document.getElementById("rsvpForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget).entries());
  document.getElementById("formMessage").textContent =
    `Thank you, ${data.name}. Your demo reply has been recorded in this page. Connect a form backend to receive it.`;
  e.currentTarget.reset();
});
