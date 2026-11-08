const audio=document.getElementById("music"),sound=document.getElementById("sound"),soundText=document.getElementById("soundText");
function updateSound(){soundText.textContent=audio.paused?"SOUND OFF":"SOUND ON";}
async function tryAutoplay(){try{audio.muted=false;await audio.play();updateSound();}catch(e){soundText.textContent="TAP FOR SOUND";}}
window.addEventListener("load",()=>{tryAutoplay();});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&audio.paused)tryAutoplay();});
/* If the browser blocks autoplay, the first ordinary interaction starts audio.
   There is deliberately no Tap to Open / Tap to Enter gate. */
["pointerdown","touchstart","keydown","scroll"].forEach(evt=>window.addEventListener(evt,()=>{if(audio.paused)tryAutoplay();},{once:true,passive:true}));
sound.addEventListener("click",async()=>{if(audio.paused)tryAutoplay();else{audio.pause();updateSound();}});
audio.addEventListener("play",updateSound);audio.addEventListener("pause",updateSound);

// Calendar pages build dynamically and roll forward through February–June.
document.querySelectorAll(".days").forEach(grid=>{
 const month=Number(grid.dataset.month),year=2027,first=new Date(year,month,1).getDay(),count=new Date(year,month+1,0).getDate();
 for(let i=0;i<first;i++){const blank=document.createElement("span");grid.append(blank);}
 for(let d=1;d<=count;d++){const cell=document.createElement("span");cell.textContent=d;if(month===5&&d===12)cell.className="chosen";grid.append(cell);}
});
const pages=[...document.querySelectorAll(".month-page")];let page=0;pages[0].classList.add("active");
const calObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){let next=0;const cycle=()=>{pages.forEach((p,i)=>p.classList.toggle("active",i===next));next=(next+1)%pages.length;};setInterval(cycle,1800);calObserver.disconnect();}},{threshold:.35});
calObserver.observe(document.querySelector(".calendar-shell"));

// Live countdown to the invitation date.
function countdown(){const end=new Date("2027-06-12T17:30:00+05:30").getTime(),left=Math.max(0,end-Date.now());const d=Math.floor(left/86400000),h=Math.floor(left%86400000/3600000),m=Math.floor(left%3600000/60000);document.getElementById("days").textContent=String(d).padStart(3,"0");document.getElementById("hours").textContent=String(h).padStart(2,"0");document.getElementById("minutes").textContent=String(m).padStart(2,"0");}
countdown();setInterval(countdown,60000);
document.getElementById("calendarLink").addEventListener("click",e=>{e.preventDefault();const ics=["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT","UID:aurelia-sebastian-20270612@example.com","DTSTART:20270612T120000Z","DTEND:20270612T170000Z","SUMMARY:Aurelia & Sebastian Wedding","LOCATION:Example venue, Nagpur, India","END:VEVENT","END:VCALENDAR"].join("\\r\\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([ics],{type:"text/calendar"}));a.download="wedding.ics";a.click();URL.revokeObjectURL(a.href);});

const replyForm=document.getElementById("replyForm"),admit=document.getElementById("admitCard");
replyForm.addEventListener("submit",e=>{e.preventDefault();const formData=new FormData(replyForm);const who=formData.get("fullName")||"Guest";document.getElementById("formStatus").textContent=`Thank you, ${who}. Your reply has been saved in this demo.`;admit.hidden=false;admit.scrollIntoView({behavior:"smooth",block:"center"});});
document.getElementById("changeReply").addEventListener("click",()=>{admit.hidden=true;document.getElementById("rsvp").scrollIntoView({behavior:"smooth"});});
