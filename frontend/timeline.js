(function(){
  // events data (keep synced with other scripts)
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

  const monthMap = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  const currentYear = (new Date()).getFullYear();

  // parse event date strings like 'Feb 25' into Date objects using currentYear
  events.forEach(e => {
    const parts = e.date.split(' ');
    const m = parts[0];
    const d = parseInt(parts[1],10);
    const monthIndex = monthMap[m] ?? 0;
    e._dateObj = new Date(currentYear, monthIndex, d);
  });

  // group events by month-year
  const months = {};
  events.forEach(e => {
    const key = `${e._dateObj.getFullYear()}-${e._dateObj.getMonth()}`;
    if (!months[key]) months[key] = [];
    months[key].push(e);
  });

  const content = document.getElementById('timelineContent');
  content.innerHTML = '';

  // render each month present in events
  Object.keys(months).sort().forEach(key => {
    const [year, month] = key.split('-').map(Number);
    const monthEvents = months[key];
    content.innerHTML += renderMonth(year, month, monthEvents);
  });

  // attach small handlers for day toggles (delegation)
  content.addEventListener('click', (e) => {
    const day = e.target.closest('.cal-day');
    if (!day) return;
    day.classList.toggle('expanded');
  });

  function renderMonth(year, month, eventsForMonth) {
    const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
    // create map of day -> events
    const dayMap = {};
    eventsForMonth.forEach(ev => {
      const d = ev._dateObj.getDate();
      if (!dayMap[d]) dayMap[d] = [];
      dayMap[d].push(ev);
    });

    const firstDay = new Date(year, month, 1).getDay(); // 0 Sun - 6 Sat
    const daysInMonth = new Date(year, month+1, 0).getDate();

    let html = `<section class="calendar-month">
      <h2>${monthName} ${year}</h2>
      <div class="calendar">
        <div class="calendar-head"><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div></div>
        <div class="calendar-grid">`;

    // leading blanks
    for (let i=0;i<firstDay;i++) html += `<div class="cal-day blank"></div>`;

    for (let d=1; d<=daysInMonth; d++) {
      const has = dayMap[d] && dayMap[d].length > 0;
      const eventsHtml = has ? dayMap[d].map(ev => `<div class="cal-event">${ev.title} <span class="cal-college">${ev.college}</span></div>`).join('') : '';
      html += `<div class="cal-day ${has? 'has-event' : ''}" data-day="${d}">
                <div class="cal-day-num">${d}</div>
                <div class="cal-events">${eventsHtml}</div>
               </div>`;
    }

    html += `</div></div></section>`;
    return html;
  }
})();
