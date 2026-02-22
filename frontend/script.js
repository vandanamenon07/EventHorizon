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

const eventGrid = document.getElementById('eventGrid');
const modal = document.getElementById('regModal');

// Function to display events
function displayEvents(filter = "all") {
    eventGrid.innerHTML = "";
    let filtered = events;
    if (filter !== "all") {
        // allow filtering by status (upcoming/live/past) or a custom timeline keyword
        filtered = events.filter(e => e.status === filter || e.type === filter);
    }
    // Show unique college cards only (college name + View) - pick the first event for time/date preview
    const uniqueByCollege = Array.from(new Map(filtered.map(e => [e.college, e])).values());

    uniqueByCollege.forEach(ev => {
        const collegeName = ev.college;
        const collegeEvents = filtered.filter(x => x.college === collegeName);
        const safeCollege = encodeURIComponent(collegeName);
        // render a compact empty card (no event rows, no View All button)
        const card = `
            <div class="event-card simple" aria-label="college-card">
                <!-- intentionally left empty per user request -->
            </div>
        `;
        eventGrid.innerHTML += card;
    });
}

// helper to group events by type
function groupByType(list) {
    return list.reduce((acc, e) => {
        const t = e.type || 'other';
        if (!acc[t]) acc[t] = [];
        acc[t].push(e);
        return acc;
    }, {});
}

let currentCollege = null;

function openModalForCollege(college) {
    currentCollege = college;
    const modalBody = modal.querySelector('.modal-body');
    const collegeEvents = events.filter(e => e.college === college);
    modalBody.innerHTML = '';
    if (collegeEvents.length === 0) {
        modalBody.innerHTML = `<h2>${college}</h2><p>No events found for this college.</p>`;
        modal.style.display = 'block';
        return;
    }

    const grouped = groupByType(collegeEvents);
    let html = `<h2>${college} — Events</h2>`;
    for (const type in grouped) {
        const displayType = type.charAt(0).toUpperCase() + type.slice(1);
        html += `<section class="modal-section"><h3>${displayType}</h3><ul class="event-list">`;
        grouped[type].forEach(ev => {
            html += `<li class="event-item">
                        <strong>${ev.title}</strong>
                        <div class="details small">⏰ ${ev.time} | ${ev.date} &nbsp; • &nbsp; ${ev.venue}</div>
                        <div class="event-desc">${ev.description}</div>
                        <div class="event-meta">Format: <em>${ev.format}</em></div>
                        <div style="margin-top:10px;"><button class="reg-btn" onclick="openRegisterForm(${ev.id})">Register</button></div>
                    </li>`;
        });
        html += `</ul></section>`;
    }

    modalBody.innerHTML = html;
    const content = modal.querySelector('.modal-content');
    // show modal and reveal content (used after animate)
    modal.style.display = 'block';
    content.style.opacity = 1;
    document.body.style.overflow = 'hidden';
}

function openRegisterForm(eventId) {
    const ev = events.find(e => e.id === eventId);
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
        <button class="back-btn" onclick="openModalForCollege('${currentCollege.replace(/'/g,'\\\'')}')">← Back</button>
        <h2>Register: ${ev.title}</h2>
        <p class="details small">${ev.college} • ${ev.venue} • ${ev.time} | ${ev.date}</p>
        <form id="registrationForm">
            <input type="hidden" name="eventId" value="${ev.id}" />
            <label>Full name</label>
            <input type="text" name="fullName" placeholder="Full Name" required />
            <label>College email</label>
            <input type="email" name="email" placeholder="College Email" required />
            <button type="submit" class="submit-btn">Confirm Registration</button>
        </form>
    `;

    // attach submit handler
    const form = modalBody.querySelector('#registrationForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        // simple confirmation (no backend)
        modalBody.innerHTML = `<h2>Registered</h2><p>Thanks, ${formData.get('fullName')}! You are registered for <strong>${ev.title}</strong> at ${ev.college}.</p><button class="close-confirm" onclick="modal.style.display='none'">Close</button>`;
    });
}

// Filtering Logic
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const prev = document.querySelector('.filter-btn.active');
        if (prev) prev.classList.remove('active');
        e.target.classList.add('active');
        const filter = e.target.dataset.filter;
        // update heading or navigate for timeline
        const heading = document.querySelector('.events-heading');
        if (filter === 'timeline') {
            // open calendar timeline view
            window.location.href = 'timeline.html';
            return;
        }
        if (heading) {
            if (filter === 'all') heading.textContent = 'All Events';
            else heading.textContent = filter.charAt(0).toUpperCase() + filter.slice(1) + ' Events';
        }
        displayEvents(filter);
    });
});

// Modal Logic: close handlers
document.querySelector('.close').onclick = () => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; };
window.onclick = (event) => { if (event.target == modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; } }

// Initial Load
displayEvents();

// --- Carousel behavior: simple left/right controls ---
(function initCarousel(){
    const track = document.getElementById('carouselTrack');
    // If track exists but is empty, populate with collage items (names + details)
    if (track && track.children.length === 0) {
        // Populate carousel with college name cards (swipeable) per user request
        // helper: custom initials map for nicer badges
        const initialsMap = {
        'RAJAGIRI': 'RSET',
            'NIT': 'NIT',
            'TOCH': 'TOCH',
            'College of Engineering Trivandrum (CET)': 'CET',
            'NIT Calicut': 'NITC',
            'Government Engineering College (GEC), Thrissur': 'GEC',
            'Sacred Heart College (Thevara), Kochi': 'SHC',
            'TKM College of Engineering, Kollam': 'TKM',
            'Cochin University of Science and Technology (CUSAT)': 'CUSAT',
            'Amrita Vishwa Vidyapeetham, Amritapuri': 'AMR',
            'Rajagiri College of Social Sciences, Kochi': 'RCS',
            'Mar Ivanios College, Thiruvananthapuram': 'MIC',
            "Maharaja's College, Ernakulam": 'MJC',
            "St. Teresa's College, Ernakulam": 'STC',
            'Government Model Engineering College (MEC), Kochi': 'MEC',
            'St. Thomas College, Thrissur': 'STT',
            'Farook College, Kozhikode': 'FRC',
            'MITS': 'MITS'
        };

        function getInitialsFor(title) {
            if (!title) return '';
            // exact match first
            if (initialsMap[title]) return initialsMap[title];
            // case-insensitive match
            const lower = title.toLowerCase();
            for (const k in initialsMap) if (k.toLowerCase() === lower) return initialsMap[k];
            // fallback: take first letters of up to first 3 words
            return title.split(/\s+/).map(w => w[0]).slice(0,3).join('').toUpperCase();
        }
        const collages = [
            { title: 'RAJAGIRI', detail: 'College showcase',events: [
        { name: "Tech Fest", time: "10:00 AM - 4:00 PM" },
        { name: "Cultural Night", time: "6:00 PM - 9:00 PM" }
      ]
    },


            { title: 'NIT', detail: 'Tech & competitions' },
            { title: 'TOCH', detail: 'Cultural & arts' }
        ];
        collages.forEach(c => {
            const div = document.createElement('div');
            div.className = 'card';
            div.style.background = "linear-gradient(180deg, rgba(212,175,55,0.12), rgba(0,0,0,0.2))";
            // compute initials for a simple logo
            const initials = getInitialsFor(c.title);
            div.innerHTML =`<div class="card-logo">${initials}</div>`;

            // make card clickable to open the college page
            div.style.cursor = 'pointer';
            div.tabIndex = 0;
            div.addEventListener('click', () => {  localStorage.setItem("selectedCollege", JSON.stringify(c));
    window.location.href = "event.html";
});

            div.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { animateCardToModal(div, c.title); } });
            track.appendChild(div);
        });
    }
    if (!track) return;
    const left = document.querySelector('.carousel-nav.left');
    const right = document.querySelector('.carousel-nav.right');
    const moreBtn = document.querySelector('.more-btn');
    const cardWidth = track.querySelector('.card')?.getBoundingClientRect().width || 220;
    let index = 0;

    function update() {
        const offset = -index * (cardWidth + 22);
        track.style.transform = `translateX(${offset}px)`;
    }

    left.addEventListener('click', () => {
        index = Math.max(0, index - 1);
        update();
    });
    right.addEventListener('click', () => {
        const max = Math.max(0, track.children.length - Math.floor(document.querySelector('.carousel-view').offsetWidth / (cardWidth + 22)));
        index = Math.min(max, index + 1);
        update();
    });

    // 'More' button: on first click append a larger set of college cards, then jump to them.
    if (moreBtn) {
        let extrasLoaded = false;
        // Curated smaller set to reduce clutter
        const extraItems = [
            { title: 'College of Engineering Trivandrum (CET)' },
            
            { title: 'Cochin University of Science and Technology (CUSAT)' },
            { title: 'Amrita Vishwa Vidyapeetham, Amritapuri' },
            { title: 'Rajagiri College of Social Sciences, Kochi' },
            { title: 'Mar Ivanios College, Thiruvananthapuram' },
            { title: 'Maharaja\'s College, Ernakulam' },
            
        ];

        moreBtn.addEventListener('click', () => {
            if (!extrasLoaded) {
                const before = track.children.length;
                extraItems.forEach(c => {
                    const div = document.createElement('div');
                    div.className = 'card';
                    div.style.background = "linear-gradient(180deg, rgba(212,175,55,0.12), rgba(0,0,0,0.2))";
                    const initials = getInitialsFor(c.title);
                    div.innerHTML = `<div class="card-logo">${initials}</div><div class="card-label"><div class="card-title">${c.title}</div></div>`;
                    div.style.cursor = 'pointer';
                    div.tabIndex = 0;
                    div.addEventListener('click', () => { animateCardToModal(div, c.title); });
                    div.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { animateCardToModal(div, c.title); } });
                    track.appendChild(div);
                });
                extrasLoaded = true;
                // recompute width and jump to the first newly added card
                const visible = Math.max(1, Math.floor(document.querySelector('.carousel-view').offsetWidth / (cardWidth + 22)));
                const max = Math.max(0, track.children.length - visible);
                index = Math.min(max, before);
                update();
                // remove the More button after loading extras to keep UI clean
                moreBtn.remove();
            }
        });
    }

    // allow swipe/drag for touch
    let startX = null; let startTransform = 0;
    track.addEventListener('pointerdown', (e) => {
        startX = e.clientX;
        track.style.transition = 'none';
        startTransform = parseFloat(getComputedStyle(track).transform.split(',')[4]) || 0;
        track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        track.style.transform = `translateX(${startTransform + dx}px)`;
    });
    track.addEventListener('pointerup', (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        track.style.transition = '';
        if (Math.abs(dx) > 40) {
            if (dx < 0) right.click(); else left.click();
        } else {
            update();
        }
        startX = null;
    });
})();

// animate a card element into the modal (card-to-modal transition)
function animateCardToModal(cardEl, college) {
    const rect = cardEl.getBoundingClientRect();
    const clone = cardEl.cloneNode(true);
    // prepare overlay/modal content hidden
    const content = modal.querySelector('.modal-content');
    content.style.opacity = 0;
    // style clone
    clone.style.position = 'fixed';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.margin = 0;
    clone.style.zIndex = 1200;
    clone.style.transition = 'all 420ms cubic-bezier(.2,.9,.2,1)';
    clone.style.borderRadius = window.getComputedStyle(cardEl).borderRadius || '12px';
    clone.style.boxShadow = '0 24px 60px rgba(0,0,0,0.6)';
    document.body.appendChild(clone);

    // show overlay behind clone
    modal.style.display = 'block';
    modal.style.background = 'rgba(0,0,0,0)';

    // force layout
    void clone.offsetWidth;
    requestAnimationFrame(() => {
        modal.style.background = 'rgba(0,0,0,0.7)';
        const targetWidth = Math.min(window.innerWidth - 48, 820);
        const targetHeight = Math.min(window.innerHeight * 0.8, 600);
        const left = (window.innerWidth - targetWidth) / 2;
        const top = (window.innerHeight - targetHeight) / 2;
        clone.style.left = left + 'px';
        clone.style.top = top + 'px';
        clone.style.width = targetWidth + 'px';
        clone.style.height = targetHeight + 'px';
        clone.style.borderRadius = '12px';
    });

    clone.addEventListener('transitionend', function handler() {
        clone.removeEventListener('transitionend', handler);
        clone.remove();
        // show the modal content and populate
        openModalForCollege(college);
    });

}