// Render full-page college events based on ?college=Name
const college = JSON.parse(localStorage.getItem("selectedCollege"));

document.getElementById("eventTitle").textContent = college.title;
document.getElementById("eventDetail").textContent = college.detail;

let html = "";
if (college.events) {
    college.events.forEach(ev => {
        html += `<p><strong>${ev.name}</strong>: ${ev.time}</p>`;
    });
}

document.getElementById("eventList").innerHTML = html;

(function(){
  function qs(name){
    const params = new URLSearchParams(location.search);
    return params.get(name);
  }

  const college = qs('college');
  if (!college) {
    // no college specified — go back
    window.location.href = './';
  }

  // duplicate of events data (could be shared); keep in sync with script.js
  const events = [
    { id: 1, title: "Hack-A-Thon 2026", type: "tech", format: "group", status: "upcoming", college: "RAJAGIRI", venue: "Hall A", time: "10:00 AM", date: "Feb 25", description: "24-hour hackathon where teams compete to build a project from scratch." },
    { id: 2, title: "Canvas Painting", type: "arts", format: "individual", status: "upcoming", college: "MITS", venue: "Studio 2", time: "02:00 PM", date: "Feb 26", description: "Open canvas painting competition — bring your brushes and creativity." },
    { id: 3, title: "Robo-Race", type: "tech", format: "group", status: "upcoming", college: "NIT", venue: "Grounds", time: "09:00 AM", date: "Mar 01", description: "Teams program robots to race through an obstacle course." },
    { id: 4, title: "Debate Championship", type: "cultural", format: "individual", status: "upcoming", college: "TOCH", venue: "Auditorium", time: "11:00 AM", date: "Mar 05", description: "Timed debates on contemporary topics judged by a panel." },
    { id: 5, title: "Music Fiesta", type: "cultural", format: "group", status: "upcoming", college: "RAJAGIRI", venue: "Main Stage", time: "06:00 PM", date: "Mar 10", description: "Band performances and solo acts across genres." },
    { id: 6, title: "Tech Expo", type: "tech", format: "group", status: "upcoming", college: "MITS", venue: "Exhibition Hall", time: "01:00 PM", date: "Mar 12", description: "Showcase of student projects and demos." },
    { id: 7, title: "Solo Dance", type: "cultural", format: "individual", status: "upcoming", college: "NIT", venue: "Auditorium", time: "04:00 PM", date: "Mar 02", description: "Solo dance performances judged on creativity and technique." },
    { id: 8, title: "Photography Walk", type: "arts", format: "individual", status: "upcoming", college: "TOCH", venue: "Campus Grounds", time: "08:00 AM", date: "Feb 28", description: "Capture campus life — submit 3 photos for judging." }
  ];

  const decodedCollege = decodeURIComponent(college);
  const collegeEvents = events.filter(e => e.college === decodedCollege);
  const titleEl = document.getElementById('collegeTitle');
  const introEl = document.getElementById('collegeIntro');
  const content = document.getElementById('collegeContent');

  titleEl.textContent = decodedCollege;
  introEl.textContent = `Showing ${collegeEvents.length} event${collegeEvents.length!==1?'s':''} - grouped by type`;

  if (collegeEvents.length === 0) {
    content.innerHTML = `<p class="details small">No events scheduled.</p>`;
    return;
  }

  // group by type
  const grouped = collegeEvents.reduce((acc, e) => {
    (acc[e.type] = acc[e.type] || []).push(e);
    return acc;
  }, {});

  let html = '';
  for (const type in grouped) {
    const list = grouped[type];
    const displayType = type.charAt(0).toUpperCase() + type.slice(1);
    html += `<section class="modal-section full">
              <h2>${displayType}</h2>
              <ul class="event-list">`;
    list.forEach(ev => {
      html += `<li class="event-item">
                <div class="row">
                  <div>
                    <strong>${ev.title}</strong>
                    <div class="details small">⏰ ${ev.time} | ${ev.date} &nbsp; • &nbsp; ${ev.venue}</div>
                    <div class="event-desc">${ev.description}</div>
                    <div class="event-meta">Format: <em>${ev.format}</em></div>
                  </div>
                  <div class="event-actions">
                    <button class="reg-btn small" data-id="${ev.id}">Register</button>
                  </div>
                </div>
              </li>`;
    });
    html += `</ul></section>`;
  }

  content.innerHTML = html;

  // attach register handlers
  document.querySelectorAll('.reg-btn.small').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.dataset.id);
      showRegisterInline(id, btn.closest('.event-item'));
    });
  });

  function showRegisterInline(eventId, container) {
    const ev = events.find(x => x.id === eventId);
    if (!ev) return;
    const formHtml = `
      <div class="register-inline">
        <h3>Register for ${ev.title}</h3>
        <form class="inline-form">
          <input type="hidden" name="eventId" value="${ev.id}" />
          <input name="fullName" type="text" placeholder="Full Name" required />
          <input name="email" type="email" placeholder="College Email" required />
          <button type="submit" class="submit-btn">Confirm Registration</button>
          <button type="button" class="cancel-inline">Cancel</button>
        </form>
      </div>`;
    // insert after container
    container.insertAdjacentHTML('afterend', formHtml);
    const form = container.nextElementSibling.querySelector('.inline-form');
    form.addEventListener('submit', (evSubmit) => {
      evSubmit.preventDefault();
      const data = new FormData(form);
      const name = data.get('fullName');
      container.nextElementSibling.outerHTML = `<div class="registered-msg">Thanks ${name}, you're registered for ${ev.title}.</div>`;
    });
    container.nextElementSibling.querySelector('.cancel-inline').addEventListener('click', () => {
      container.nextElementSibling.remove();
    });
  }
})();