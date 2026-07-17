// L'Empreinte du Boucher — Suivi de production vidéo
// Source de vérité : Supabase (table "videos"), synchronisée en temps réel.
// Si Supabase n'est pas encore configuré (config.js), l'app tourne en mode
// démo locale (localStorage) pour rester utilisable avant la mise en place.

const STORAGE_KEY = 'edb_video_state_v1';

const DEMO_MODE = !SUPABASE_CONFIG.url || SUPABASE_CONFIG.url.includes('YOUR-PROJECT');

let sbClient = null;
let videosState = VIDEOS.map(v => ({ ...v }));
let isAdmin = false;

/* ---------------- Mode démo (localStorage) ---------------- */

function loadOverrides() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch (e) { return {}; }
}

function saveOverride(id, patch) {
  const overrides = loadOverrides();
  overrides[id] = { ...(overrides[id] || {}), ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function applyDemoOverrides() {
  const overrides = loadOverrides();
  videosState = VIDEOS.map(v => ({ ...v, ...(overrides[v.id] || {}) }));
}

/* ---------------- Icônes de statut ---------------- */

const STATUS_ICONS = {
  a_monter: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  monte: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5 19 19M19 5 8.5 15.5"/></svg>',
  planifie: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  poste: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 5-5"/></svg>'
};

function statusBadge(status, extraClass) {
  return `<span class="badge badge-${status} ${extraClass || ''}">${STATUS_ICONS[status]}${STATUS_META[status].label}</span>`;
}

/* ---------------- Data helpers ---------------- */

function getVideos() { return videosState; }

const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

function formatDateLong(iso) {
  const d = new Date(iso + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]}`;
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function daysUntil(iso) {
  const today = new Date(todayISO() + 'T00:00:00');
  const target = new Date(iso + 'T00:00:00');
  return Math.round((target - today) / 86400000);
}

function rerenderActiveView() {
  const active = document.querySelector('.view.active');
  if (!active) return;
  if (active.id === 'view-dashboard') renderDashboard();
  if (active.id === 'view-videos') renderVideos();
  if (active.id === 'view-calendar') renderCalendar();
}

/* ---------------- Statut : mise à jour ---------------- */

async function updateStatus(id, newStatus) {
  const video = videosState.find(v => v.id === id);
  const previous = video.status;
  video.status = newStatus; // optimiste

  if (DEMO_MODE) {
    saveOverride(id, { status: newStatus });
    return;
  }

  const { error } = await sbClient
    .from('videos')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    video.status = previous; // rollback
    rerenderActiveView();
    alert("La mise à jour n'a pas pu être enregistrée : " + error.message);
  }
}

async function updateDate(id, newDate) {
  const video = videosState.find(v => v.id === id);
  const previous = video.date;
  if (previous === newDate) return;
  video.date = newDate; // optimiste
  renderCalendar();

  if (DEMO_MODE) {
    saveOverride(id, { date: newDate });
    return;
  }

  const { error } = await sbClient
    .from('videos')
    .update({ date: newDate, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    video.date = previous; // rollback
    renderCalendar();
    alert("Le déplacement n'a pas pu être enregistré : " + error.message);
  }
}

/* ---------------- Sync status indicator ---------------- */

function setSyncStatus(state) {
  const el = document.getElementById('sync-status');
  el.classList.remove('live', 'offline');
  if (state === 'live') {
    el.classList.add('live');
    el.innerHTML = `<span class="sync-dot"></span> Synchronisé en direct`;
  } else if (state === 'offline') {
    el.classList.add('offline');
    el.innerHTML = `<span class="sync-dot"></span> Connexion perdue`;
  } else if (state === 'demo') {
    el.innerHTML = `<span class="sync-dot"></span> Mode démo local`;
  } else {
    el.innerHTML = `<span class="sync-dot"></span> Connexion…`;
  }
}

/* ---------------- Auth (admin) ---------------- */

function updateAdminUI() {
  const zone = document.getElementById('admin-zone');
  zone.innerHTML = isAdmin
    ? `<div class="admin-pill">✎ Mode édition<button id="btn-logout">Se déconnecter</button></div>`
    : `<button class="admin-link" id="btn-open-login">Connexion admin</button>`;

  const openBtn = document.getElementById('btn-open-login');
  if (openBtn) openBtn.addEventListener('click', openLoginModal);
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => sbClient.auth.signOut());
}

function openLoginModal() {
  document.getElementById('login-error').classList.add('hidden');
  document.getElementById('login-overlay').classList.remove('hidden');
}

function closeLoginModal() {
  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('login-form').reset();
}

document.getElementById('login-close').addEventListener('click', closeLoginModal);
document.getElementById('login-overlay').addEventListener('click', e => {
  if (e.target.id === 'login-overlay') closeLoginModal();
});

document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const submitBtn = document.getElementById('login-submit');
  const errorEl = document.getElementById('login-error');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Connexion…';
  errorEl.classList.add('hidden');

  const { error } = await sbClient.auth.signInWithPassword({ email, password });

  submitBtn.disabled = false;
  submitBtn.textContent = 'Se connecter';

  if (error) {
    errorEl.textContent = 'Identifiants incorrects.';
    errorEl.classList.remove('hidden');
    return;
  }
  closeLoginModal();
});

/* ---------------- Navigation ---------------- */

function switchView(view) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');
  document.querySelectorAll('.nav-item, .mobile-nav button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  if (view === 'dashboard') renderDashboard();
  if (view === 'videos') renderVideos();
  if (view === 'calendar') renderCalendar();
}

document.querySelectorAll('.nav-item, .mobile-nav button').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

/* ---------------- Dashboard ---------------- */

const STATUS_DESCRIPTIONS = {
  a_monter: 'pas encore commencé',
  monte: 'édition terminée',
  planifie: 'date de post fixée',
  poste: 'en ligne'
};

function renderLegend() {
  document.getElementById('legend').innerHTML = Object.entries(STATUS_META).map(([key, m]) => `
    <div class="legend-row">
      <span class="legend-icon badge-${key}">${STATUS_ICONS[key]}</span>
      <span><strong>${m.label}</strong> — ${STATUS_DESCRIPTIONS[key]}</span>
    </div>
  `).join('');
}

function renderDashboard() {
  renderLegend();
  const videos = getVideos();
  const counts = { a_monter: 0, monte: 0, planifie: 0, poste: 0 };
  videos.forEach(v => counts[v.status]++);

  document.getElementById('today-pill').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${videos.length}</div>
      <div class="stat-label">Vidéos au total</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${counts.monte}</div>
      <div class="stat-label">Montées</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${counts.planifie}</div>
      <div class="stat-label">Planifiées</div>
    </div>
    <div class="stat-card accent">
      <div class="stat-value">${counts.poste}</div>
      <div class="stat-label">Postées</div>
    </div>
  `;

  const pct = Math.round((counts.poste / videos.length) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '%';

  const upcoming = videos
    .filter(v => v.status !== 'poste')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  document.getElementById('upcoming-list').innerHTML = upcoming.length
    ? upcoming.map(v => {
        const d = daysUntil(v.date);
        const when = d === 0 ? "aujourd'hui" : d === 1 ? 'demain' : d < 0 ? `il y a ${-d} j` : `dans ${d} j`;
        return `
        <div class="upcoming-row">
          <div class="upcoming-badge">#${v.id}</div>
          <div class="upcoming-info">
            <div class="u-title">${v.titre}</div>
            <div class="u-date">${formatDateLong(v.date)} · ${when}</div>
          </div>
          ${statusBadge(v.status)}
        </div>`;
      }).join('')
    : `<p style="color:var(--grey-600);font-size:14px;">Toutes les vidéos sont postées 🎉</p>`;
}

/* ---------------- Videos ---------------- */

let activeFilter = 'all';

function renderFilters() {
  const filters = [{ key: 'all', label: 'Toutes', icon: '' }, ...Object.entries(STATUS_META).map(([key, m]) => ({ key, label: m.label, icon: STATUS_ICONS[key] }))];
  document.getElementById('filters').innerHTML = filters.map(f =>
    `<button class="filter-btn ${activeFilter === f.key ? 'active' : ''}" data-filter="${f.key}">${f.icon}${f.label}</button>`
  ).join('');
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => { activeFilter = btn.dataset.filter; renderVideos(); });
  });
}

function renderVideos() {
  renderFilters();
  const videos = getVideos()
    .filter(v => activeFilter === 'all' || v.status === activeFilter)
    .sort((a, b) => a.id - b.id);

  document.getElementById('videos-grid').innerHTML = videos.map(v => `
    <div class="video-card">
      <div class="video-card-top">
        <div>
          <div class="video-number">VIDÉO ${String(v.id).padStart(2, '0')}</div>
          <h4 data-open="${v.id}">${v.titre}</h4>
        </div>
      </div>
      <span class="video-tag">${v.categorie}</span>
      <p class="video-accroche">${v.accroche}</p>
      <div class="video-card-bottom">
        <span class="video-date">${formatDateLong(v.date)}</span>
        ${isAdmin ? `
          <select class="status-select" data-id="${v.id}">
            ${Object.entries(STATUS_META).map(([key, m]) =>
              `<option value="${key}" ${v.status === key ? 'selected' : ''}>${m.label}</option>`
            ).join('')}
          </select>
        ` : statusBadge(v.status)}
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', () => openModal(Number(el.dataset.open)));
  });

  document.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', () => {
      updateStatus(Number(sel.dataset.id), sel.value);
      renderVideos();
    });
  });
}

/* ---------------- Modal ---------------- */

let currentModalId = null;

function openModal(id) {
  const v = getVideos().find(x => x.id === id);
  currentModalId = id;
  document.getElementById('modal-tag').textContent = v.categorie;
  document.getElementById('modal-title').textContent = `${v.id}. ${v.titre}`;
  document.getElementById('modal-badge').className = `badge badge-${v.status}`;
  document.getElementById('modal-badge').innerHTML = `${STATUS_ICONS[v.status]}${STATUS_META[v.status].label}`;
  document.getElementById('modal-date').textContent = formatDateLong(v.date);
  document.getElementById('modal-script').textContent = v.script;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  currentModalId = null;
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-close2').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target.id === 'modal-overlay') closeModal();
});
document.getElementById('modal-copy').addEventListener('click', () => {
  const v = getVideos().find(x => x.id === currentModalId);
  navigator.clipboard.writeText(v.script).then(() => {
    const btn = document.getElementById('modal-copy');
    const original = btn.textContent;
    btn.textContent = 'Copié !';
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
});

/* ---------------- Calendar ---------------- */

let calYear, calMonth; // calMonth: 0-11

function initCalendarToCurrent() {
  const videos = getVideos();
  const firstUpcoming = videos.slice().sort((a, b) => a.date.localeCompare(b.date))[0];
  const ref = firstUpcoming ? new Date(firstUpcoming.date + 'T00:00:00') : new Date();
  calYear = ref.getFullYear();
  calMonth = ref.getMonth();
}

function renderCalendar() {
  const videos = getVideos();
  document.getElementById('cal-title').textContent = `${MONTHS_FR[calMonth]} ${calYear}`;
  document.getElementById('calendar-hint').classList.toggle('hidden', !isAdmin);

  const firstOfMonth = new Date(calYear, calMonth, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = todayISO();

  const eventsByDate = {};
  videos.forEach(v => {
    (eventsByDate[v.date] ||= []).push(v);
  });

  let cells = '';
  for (let i = 0; i < startOffset; i++) cells += `<div class="cal-day empty"></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = iso === today;
    const events = eventsByDate[iso] || [];
    cells += `
      <div class="cal-day ${isToday ? 'today' : ''}" data-date="${iso}">
        <div class="cal-daynum">${day}</div>
        ${events.map(v => `<div class="cal-event status-${v.status}" data-open="${v.id}" ${isAdmin ? 'draggable="true"' : ''}>${STATUS_ICONS[v.status]}#${v.id} ${v.titre}</div>`).join('')}
      </div>`;
  }

  document.getElementById('cal-days').innerHTML = cells;

  let suppressClick = false;

  document.querySelectorAll('#cal-days [data-open]').forEach(el => {
    el.addEventListener('click', () => {
      if (suppressClick) return;
      openModal(Number(el.dataset.open));
    });

    if (isAdmin) {
      el.addEventListener('dragstart', e => {
        suppressClick = false;
        e.dataTransfer.setData('text/plain', el.dataset.open);
        e.dataTransfer.effectAllowed = 'move';
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
      });
    }
  });

  if (isAdmin) {
    document.querySelectorAll('.cal-day[data-date]').forEach(cell => {
      cell.addEventListener('dragover', e => {
        e.preventDefault();
        cell.classList.add('drag-over');
      });
      cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
      cell.addEventListener('drop', e => {
        e.preventDefault();
        cell.classList.remove('drag-over');
        const id = Number(e.dataTransfer.getData('text/plain'));
        const newDate = cell.dataset.date;
        if (id && newDate) updateDate(id, newDate);
      });
    });
  }
}

document.getElementById('cal-prev').addEventListener('click', () => {
  calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});
document.getElementById('cal-next').addEventListener('click', () => {
  calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

/* ---------------- Init ---------------- */

async function init() {
  if (DEMO_MODE) {
    applyDemoOverrides();
    setSyncStatus('demo');
    document.getElementById('admin-zone').innerHTML = '';
  } else {
    sbClient = supabase.createClient(
      SUPABASE_CONFIG.url.startsWith('http') ? SUPABASE_CONFIG.url : `https://${SUPABASE_CONFIG.url}`,
      SUPABASE_CONFIG.anonKey
    );

    setSyncStatus('connecting');

    const { data, error } = await sbClient.from('videos').select('*');
    if (!error && data) {
      videosState = VIDEOS.map(v => {
        const row = data.find(r => r.id === v.id);
        return row ? { ...v, status: row.status, date: row.date } : v;
      });
    }

    sbClient
      .channel('videos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, payload => {
        const row = payload.new;
        if (!row) return;
        const v = videosState.find(x => x.id === row.id);
        if (v) { v.status = row.status; v.date = row.date; }
        rerenderActiveView();
      })
      .subscribe(status => {
        if (status === 'SUBSCRIBED') setSyncStatus('live');
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setSyncStatus('offline');
      });

    const { data: { session } } = await sbClient.auth.getSession();
    isAdmin = !!session;
    updateAdminUI();

    sbClient.auth.onAuthStateChange((_event, session) => {
      isAdmin = !!session;
      updateAdminUI();
      rerenderActiveView();
    });
  }

  initCalendarToCurrent();
  renderDashboard();
}

init();
