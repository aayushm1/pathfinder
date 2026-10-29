/* Pathfinder app shell: state, router, layout, shared UI helpers */
(function () {
  const D = window.D;

  window.S = {
    role: 'chro',
    inits: JSON.parse(JSON.stringify(D.initiatives)),
    weights: { retention: 80, leadership: 70, brand: 35, cost: 45 },
    chat: [],
    uploads: [],
    peerSet: 'core',
    resultsFilter: 'all',
    initFilter: 'all',
    practiceFilter: 'gaps',
    reportReady: false,
    advisorSel: 0,
    iberiaAdded: false,
  };

  /* ---------- helpers ---------- */
  const H = window.H = {};
  H.$ = s => document.querySelector(s);
  H.$$ = s => [...document.querySelectorAll(s)];
  H.esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  H.T = id => D.topics.find(t => t.id === id);
  H.C = code => D.countries.find(c => c.code === code);
  H.initials = n => n.split(' ').map(x => x[0]).join('').slice(0, 2);
  H.sleep = ms => new Promise(r => setTimeout(r, ms));
  H.fmt1 = v => (Math.round(v * 10) / 10).toFixed(1);
  H.status = st => ({
    'on-track': '<span class="chip ok"><span class="cd"></span>On track</span>',
    'at-risk': '<span class="chip warn"><span class="cd"></span>At risk</span>',
    'planned': '<span class="chip"><span class="cd"></span>Planned</span>',
    'behind': '<span class="chip risk"><span class="cd"></span>Behind</span>',
    'ahead': '<span class="chip teal"><span class="cd"></span>Ahead</span>',
    'done': '<span class="chip ok"><span class="cd"></span>Done</span>',
    'blocked': '<span class="chip risk"><span class="cd"></span>Blocked</span>',
    'active': '<span class="chip info"><span class="cd"></span>In progress</span>',
    'new': '<span class="chip info"><span class="cd"></span>New · suggested</span>',
  }[st] || `<span class="chip">${st}</span>`);
  H.heat = v => v < 58 ? '#E11D48' : v < 63 ? '#F43F5E' : v < 67 ? '#F97316' : v < 71 ? '#F59E0B' : v < 75 ? '#65A30D' : v < 80 ? '#16A34A' : '#0D9488';
  H.delta = (a, b, suffix = '') => { const d = Math.round((a - b) * 10) / 10; const cls = d > 0 ? 'up' : d < 0 ? 'down' : 'flat'; return `<span class="delta ${cls}">${d > 0 ? '▲' : d < 0 ? '▼' : '•'} ${Math.abs(d)}${suffix}</span>`; };
  H.cmp = (t, peer) => { const m = peer ? peer.m : t.m, tq = peer ? peer.t : t.t; const col = t.s < m - 4 ? 'linear-gradient(90deg,#F97316,#F43F5E)' : t.s >= tq ? 'linear-gradient(90deg,#14B8A6,#22C55E)' : 'linear-gradient(90deg,#5B4BF5,#8B5CF6)'; const pos = v => Math.max(0, Math.min(100, (v - 40) / 60 * 100)); return `<div class="cmp" title="You ${t.s} · Peer median ${m} · Top quartile ${tq}"><div class="you" style="width:${pos(t.s)}%;background:${col}"></div><div class="med" style="left:${pos(m)}%"></div><div class="top" style="left:${pos(tq)}%"></div></div>`; };

  // peer set variants (benchmark explorer)
  H.peerSets = {
    core: { label: D.client.peerGroup, n: D.client.peerCount, off: 0 },
    eu: { label: 'All industries · Europe', n: 612, off: -3 },
    pharma: { label: 'Pharma & Life Sciences · Global', n: 138, off: 1 },
    top: { label: 'Top 10% of all assessed employers', n: 248, off: 7 },
  };
  H.peer = t => { const o = H.peerSets[S.peerSet].off; return { m: Math.round(t.m + o), t: Math.min(99, Math.round(t.t + o * 0.6)) }; };

  // projections
  H.projected = (inits = S.inits) => {
    const total = D.topics.reduce((a, t) => a + t.s, 0);
    const up = inits.reduce((a, i) => a + i.uplift + (i.also || []).length, 0);
    return Math.round((total + up) * 10 / D.topics.length) / 10;
  };
  H.avgProgress = () => Math.round(S.inits.reduce((a, i) => a + i.progress, 0) / S.inits.length);
  H.milestones = () => { let d = 0, t = 0; S.inits.forEach(i => i.milestones.forEach(m => { t++; if (m.done) d++; })); return { d, t }; };
  H.evidenceCount = () => S.inits.reduce((a, i) => a + i.evidence.length, 0) + S.uploads.length;

  H.rel = { I1: { retention: 70, leadership: 100, brand: 40, cost: 30 }, I2: { retention: 100, leadership: 20, brand: 70, cost: 90 }, I3: { retention: 80, leadership: 20, brand: 60, cost: 40 }, I4: { retention: 50, leadership: 90, brand: 10, cost: 60 }, I5: { retention: 60, leadership: 50, brand: 10, cost: 20 }, I6: { retention: 50, leadership: 10, brand: 40, cost: 95 }, I7: { retention: 90, leadership: 40, brand: 30, cost: 50 } };
  H.rank = () => {
    const w = S.weights, sw = Object.values(w).reduce((a, b) => a + b, 0) || 1;
    return S.inits.map(i => { const r = H.rel[i.id] || { retention: 50, leadership: 50, brand: 50, cost: 50 }; const fit = Object.keys(w).reduce((a, k) => a + w[k] * r[k], 0) / sw; return { ...i, prio: Math.round(fit * 0.6 + i.impact * 0.4) }; }).sort((a, b) => b.prio - a.prio);
  };

  /* ---------- toast / drawer / modal ---------- */
  H.toast = (msg, icon = 'check') => { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = IC(icon, 16) + '<span>' + msg + '</span>'; H.$('#toasts').appendChild(t); setTimeout(() => { t.style.transition = '.3s'; t.style.opacity = 0; setTimeout(() => t.remove(), 300); }, 2800); };
  H.openDrawer = html => { const d = H.$('#drawer'); d.innerHTML = html; d.classList.add('on'); H.$('#scrim').classList.add('on'); };
  H.openModal = html => { const m = H.$('#modal'); m.innerHTML = html; m.classList.add('on'); H.$('#scrim').classList.add('on'); };
  H.closeAll = () => { H.$('#drawer').classList.remove('on'); H.$('#modal').classList.remove('on'); H.$('#scrim').classList.remove('on'); };

  /* ---------- nav ---------- */
  const NAV = {
    chro: [
      { items: [{ r: 'overview', l: 'Overview', i: 'home' }] },
      { g: 'Diagnose', items: [{ r: 'results', l: 'Results & Benchmarks', i: 'chart' }, { r: 'copilot', l: 'Ask Pathfinder', i: 'sparkles', b: 'AI', bc: 'ai' }] },
      { g: 'Plan', items: [{ r: 'roadmap', l: 'Roadmap', i: 'map' }, { r: 'practices', l: 'Peer Practices', i: 'book' }] },
      { g: 'Execute', items: [{ r: 'initiatives', l: 'Initiatives', i: 'tasks', b: '1', bc: 'hot' }, { r: 'countries', l: 'Countries', i: 'globe', b: '!', bc: 'hot' }] },
      { g: 'Prove', items: [{ r: 'outcomes', l: 'Outcomes', i: 'trend' }, { r: 'report', l: 'Board Report', i: 'present' }] },
      { g: 'Next cycle', items: [{ r: 'readiness', l: 'Readiness', i: 'shield', b: '64%' }] },
      { g: 'About', items: [{ r: 'vision', l: 'Product vision', i: 'layers' }] },
    ],
    advisor: [
      { g: 'Northstar Advisor', items: [{ r: 'advisor', l: 'Client Portfolio', i: 'brief', b: '2', bc: 'hot' }] },
      { g: 'Client view', items: [{ r: 'overview', l: 'Open Helix workspace', i: 'building' }] },
      { g: 'About', items: [{ r: 'vision', l: 'Product vision', i: 'layers' }] },
    ],
  };
  const TITLES = { overview: 'Overview', results: 'Results & Benchmarks', copilot: 'Ask Pathfinder', roadmap: 'Roadmap', practices: 'Peer Practices', initiatives: 'Initiatives', countries: 'Countries', outcomes: 'Outcomes', report: 'Board Report', readiness: 'Next Assessment Readiness', advisor: 'Client Portfolio', vision: 'Product vision' };

  function shell() {
    const isAdv = S.role === 'advisor';
    H.$('#app').innerHTML = `
      <nav class="sidebar">
        <div class="brand"><div class="brand-mark">${IC('sparkles', 18)}</div><div class="brand-txt"><div class="brand-name">Pathfinder</div><div class="brand-sub">by ${D.institute.name}</div></div></div>
        <div id="nav"></div>
        <div class="side-foot">
          <div class="client-card">${isAdv ? `<div class="client-logo" style="background:linear-gradient(135deg,#0EA5E9,#6366F1)">NS</div><div><b>Northstar Advisory</b><span>7 clients · EMEA</span></div>` : `<div class="client-logo">${D.client.initials}</div><div><b>${D.client.name}</b><span>${D.client.seal}</span></div>`}</div>
          <div class="disclaimer">Concept prototype. All companies, people and figures are fictional.</div>
        </div>
      </nav>
      <div class="main">
        <header class="topbar">
          <div class="crumbs"><span>${isAdv ? 'Northstar' : D.client.name}</span>${IC('chev', 14)}<b id="crumb"></b></div>
          <div class="search" data-go="copilot" data-focus="1">${IC('search', 16)}<span>Ask Pathfinder anything…</span><span class="kbd">/</span></div>
          <div class="tb-right">
            <div class="date-chip">${IC('clock', 14)} Demo date · ${D.client.today}</div>
            <button class="btn sec sm" data-action="tour">${IC('play', 14)} Guided demo</button>
            <div style="position:relative"><button class="icon-btn" data-action="notif" aria-label="Notifications">${IC('bell', 18)}<span class="dot"></span></button><div id="notif"></div></div>
            <div class="role-switch" title="Switch persona"><button class="${!isAdv ? 'on' : ''}" data-role="chro">Client view</button><button class="${isAdv ? 'on' : ''}" data-role="advisor">Advisor view</button></div>
            <div class="avatar ${isAdv ? 'adv' : ''}" title="${isAdv ? 'James Okafor · Senior Strategic Advisor' : D.client.user.name + ' · ' + D.client.user.role}">${isAdv ? 'JO' : D.client.user.initials}</div>
          </div>
        </header>
        <main id="view"></main>
      </div>
      <button class="fab pulse" id="fab" data-go="copilot">${IC('sparkles', 18)} Ask Pathfinder</button>`;
  }

  function nav(route) {
    H.$('#nav').innerHTML = NAV[S.role].map(g => `<div class="nav-group">${g.g ? `<div class="nav-label">${g.g}</div>` : ''}${g.items.map(it => {
      let b = it.b; if (it.r === 'initiatives') b = String(S.inits.filter(i => i.status === 'at-risk').length || ''); if (it.r === 'countries' && S.iberiaAdded) b = '';
      return `<button class="nav-item ${route === it.r ? 'active' : ''}" data-go="${it.r}" title="${it.l}">${IC(it.i, 18)}<span>${it.l}</span>${b ? `<i class="nb ${it.bc || ''}">${b}</i>` : ''}</button>`;
    }).join('')}</div>`).join('');
  }

  /* ---------- router ---------- */
  H.route = () => (location.hash.replace('#/', '') || 'overview').split('?')[0];
  H.go = r => { if (H.route() === r) render(); else location.hash = '#/' + r; };
  function render() {
    const r = H.route();
    const V = window.V;
    const fn = V[r] || V.overview;
    nav(r);
    H.$('#crumb').textContent = TITLES[r] || 'Overview';
    const out = fn();
    H.$('#view').innerHTML = `<div class="page">${out}</div>`;
    H.$('#fab').style.display = (r === 'copilot' || r === 'advisor' || r === 'vision') ? 'none' : '';
    if (V['after_' + r]) V['after_' + r]();
    window.scrollTo(0, 0);
  }
  H.render = render;

  function setRole(role) {
    if (S.role === role) return;
    S.role = role; shell();
    if (role === 'advisor') { location.hash = '#/advisor'; render(); } else { location.hash = '#/overview'; render(); }
    H.toast(role === 'advisor' ? 'Switched to the Northstar advisor view' : 'Switched to the Helix CPO view', 'users');
  }
  H.setRole = setRole;

  /* ---------- notifications ---------- */
  function notif() {
    const n = H.$('#notif');
    if (n.innerHTML) { n.innerHTML = ''; return; }
    const items = [
      { c: 'warn', i: 'alert', t: '<b>Wellbeing Framework 2.0</b> is 6 weeks behind. Budget approval is pending in FR, IT and BR.', go: 'initiatives' },
      { c: 'risk', i: 'building', t: '<b>Iberia Bio</b> (700 people) is not covered by any initiative yet.', go: 'countries' },
      { c: 'ok', i: 'trend', t: 'Onboarding pilot: new-hire attrition in DE/CH is <b>down 46%</b>.', go: 'outcomes' },
      { c: 'info', i: 'shield', t: 'The next assessment survey opens in <b>78 days</b>. 64% of it is already pre-filled.', go: 'readiness' },
    ];
    n.innerHTML = `<div class="notif"><div class="row between" style="padding:8px 10px"><b>Pathfinder nudges</b><span class="chip info">4 new</span></div><div class="list">${items.map(x => `<div class="li" data-go="${x.go}"><div class="li-ico ${x.c}">${IC(x.i, 16)}</div><div class="small">${x.t}</div></div>`).join('')}</div></div>`;
  }

  /* ---------- global delegation ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-go],[data-action],[data-role],[data-ask],[data-open-init]');
    if (!el) { if (!e.target.closest('#notif')) { const n = H.$('#notif'); if (n) n.innerHTML = ''; } return; }
    if (el.dataset.role) return setRole(el.dataset.role);
    if (el.dataset.openInit) return window.V.openInit(el.dataset.openInit);
    if (el.dataset.ask) { const q = el.dataset.ask; if (H.route() !== 'copilot') { location.hash = '#/copilot'; setTimeout(() => COP.ask(q), 300); } else COP.ask(q); return; }
    if (el.dataset.go) {
      const n = H.$('#notif'); if (n) n.innerHTML = '';
      H.closeAll();
      if (S.role === 'advisor' && el.dataset.go === 'overview') { S.role = 'chro'; shell(); }
      H.go(el.dataset.go);
      if (el.dataset.focus) setTimeout(() => { const t = H.$('#chat-in'); t && t.focus(); }, 350);
      return;
    }
    const a = el.dataset.action;
    if (a === 'close') return H.closeAll();
    if (a === 'notif') return notif();
    if (a === 'tour') return TOUR.start();
    if (window.V.actions[a]) return window.V.actions[a](el, e);
  });
  H.$('#scrim') && H.$('#scrim').addEventListener('click', H.closeAll);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { H.closeAll(); if (window.TOUR) TOUR.end(); }
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); H.go('copilot'); setTimeout(() => { const t = H.$('#chat-in'); t && t.focus(); }, 350); }
  });
  window.addEventListener('hashchange', render);

  function welcome() {
    const w = document.createElement('div'); w.className = 'welcome'; w.id = 'welcome';
    w.innerHTML = `<div class="welcome-card">
      <div class="welcome-top"><span class="chip" style="background:rgba(255,255,255,.14);color:#fff">${IC('sparkles', 13)} Concept prototype · fictional data</span>
        <h2>Pathfinder: from a once-a-year report to an always-on HR strategy</h2>
        <p>You are <b>${D.client.user.name}</b>, CPO of <b>${D.client.name}</b> (8,400 people, 12 countries). Your ${D.client.certYear} assessment results are in. Pathfinder helps you understand them, plan, execute, prove impact and prepare for the next assessment, all in one place.</p></div>
      <div class="welcome-b">
        <div class="wsteps">
          <div><span class="chip info">1 · Diagnose</span><b>Ask your results</b><span>AI answers that cite your survey items</span></div>
          <div><span class="chip teal">2 · Plan</span><b>AI roadmap</b><span>Ranked by impact and your priorities</span></div>
          <div><span class="chip warn">3 · Execute</span><b>Track it all year</b><span>Initiatives, countries, nudges</span></div>
          <div><span class="chip ok">4 · Prove</span><b>Board-ready proof</b><span>Outcomes plus a pre-filled next assessment</span></div>
        </div>
        <div class="row mt" style="justify-content:flex-end;gap:10px">
          <button class="btn sec" id="w-skip">Explore on my own</button>
          <button class="btn pri" id="w-tour">${IC('play', 14)} Start the 3-minute guided demo</button>
        </div>
      </div></div>`;
    document.body.appendChild(w);
    H.$('#w-skip').onclick = () => w.remove();
    H.$('#w-tour').onclick = () => { w.remove(); TOUR.start(); };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const qs = new URLSearchParams(location.search);
    if (H.route() === 'advisor') S.role = 'advisor';
    shell();
    if (!location.hash) location.hash = '#/overview';
    render();
    // deep links: ?tour=1 starts the guided demo, ?shot=1 skips the welcome, #/copilot?ask=... runs a question
    if (qs.get('tour')) { sessionStorage.setItem('pf-welcomed', '1'); setTimeout(() => TOUR.start(), 400); }
    else if (!qs.get('shot') && !sessionStorage.getItem('pf-welcomed')) { sessionStorage.setItem('pf-welcomed', '1'); welcome(); }
    if (qs.get('report') && H.route() === 'report') { S.reportReady = true; render(); }
    if (qs.get('shot')) document.body.classList.add('shot');
  });
})();
