/* Guided demo tour */
(function () {
  const $ = H.$;
  const STEPS = [
    { r: 'overview', sel: '#t-score', k: 'Diagnose', t: 'The results are in, and they stay alive', b: 'Helix Biosciences scores 76.6. Instead of a 60-page PDF, Maria gets a live view: peer median, top quartile, the trend, and a projection of where the roadmap takes her.' },
    { r: 'overview', sel: '#t-journey', k: 'The loop', t: 'One continuous loop, not a once-a-year event', b: 'Results → Plan → Execute → Prove → Next cycle. Pathfinder keeps HR engaged for 12 months, which is the whole point: value all year means renewal is easy to justify.' },
    { r: 'overview', sel: '#t-gaps', k: 'Diagnose', t: 'Gaps vs peers like you', b: 'Benchmarked against 46 pharma companies in Europe of similar size. Each gap has a "Why?" button that asks the AI analyst directly.' },
    { r: 'copilot', sel: '#t-chat', k: 'AI analyst', t: 'Ask your results, and get answers with sources', b: 'Pathfinder explains why Onboarding dropped 13 points: a new survey item, an inconsistent rollout and rejected evidence. Every claim cites survey items, so HR leaders can trust and defend it.', enter: () => { if (!S.chat.length) setTimeout(() => COP.ask('Why did our Onboarding score drop?'), 500); }, place: 'inside' },
    { r: 'roadmap', sel: '#t-weights', k: 'Plan', t: 'An AI roadmap that re-plans with your priorities', b: 'Initiatives are ranked by impact, effort and the business priorities Maria sets. Move a slider and the order and the matrix update live. "Replay" shows every step of how the plan was built.' },
    { r: 'roadmap', sel: '#t-gantt', k: 'Plan', t: 'A 12-month plan with a projected score', b: '6 initiatives sequenced by dependency. People analytics goes first so everything can be measured, then the onboarding quick win. Projected: 76.6 → ~80.' },
    { r: 'initiatives', sel: '#t-itable', k: 'Execute', t: 'Track execution all year', b: 'Owners, milestones, country rollout and evidence. When Wellbeing slipped because budgets were stuck, Pathfinder flagged it and can draft the escalation to the CFO. Click any row to see it.' },
    { r: 'countries', sel: '#t-iberia', alt: '#t-heat', k: 'Execute', t: 'It catches what humans miss', b: 'From Workday org changes, Pathfinder spotted that the 700 people from the Iberia Bio acquisition aren\'t on any programme, and suggests a 100-day playbook from a peer who halved acquired-staff attrition.' },
    { r: 'outcomes', sel: '#t-outcome', k: 'Prove', t: 'Proof that it works, in euros', b: 'Connected to the HRIS, the pilot countries show new-hire attrition down 46% vs non-pilot countries. That is worth about €2.3M a year. This is what makes the CFO renew.' },
    { r: 'report', sel: '#report-area', k: 'Prove', t: 'A board report in one click', b: 'Live data becomes a 5-slide board narrative: where we stand, what we\'re doing, early proof, and the decisions we need. Exports to PDF.', enter: () => { if (!S.reportReady) setTimeout(() => V.actions.genReport(), 400); }, place: 'left' },
    { r: 'readiness', sel: '#t-ready', k: 'Next cycle', t: 'Next year\'s survey is already 64% done', b: 'Evidence captured during the year is auto-mapped to next cycle\'s survey items, saving about 6 weeks of HR effort. The next assessment goes from a burden to a formality.' },
    { r: 'advisor', role: 'advisor', sel: '#t-portfolio', k: 'Northstar side', t: 'The same data runs the provider\'s business', b: 'Advisors see client health, churn risk and expansion signals from real usage. Helix → Wellbeing Deep-Dive plus a global scope upgrade. Kestrel Bank → a churn risk after their CPO left.' },
    { r: 'vision', role: 'chro', sel: null, k: 'That\'s Pathfinder', t: 'From a once-a-year report to an always-on HR system', b: 'Clients improve faster and can prove it. The assessment provider gets higher retention, upsell signals and a dataset no competitor has. Explore freely. Everything is clickable.' },
  ];
  let i = -1, spot, tip, block;

  async function show(k) {
    i = k; const s = STEPS[i];
    H.closeAll();
    if (s.role && S.role !== s.role) { H.setRole(s.role); await H.sleep(250); }
    if (H.route() !== s.r) { location.hash = '#/' + s.r; await H.sleep(420); }
    if (s.enter) s.enter();
    let el = s.sel ? ($(s.sel) || (s.alt && $(s.alt))) : null;
    if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); await H.sleep(450); }
    if (i !== k) return;
    place(el, s);
  }

  function place(el, s) {
    const vw = innerWidth, vh = innerHeight, tw = 360;
    let th = 0;
    tip.innerHTML = `<span class="chip info">${s.k} · ${i + 1}/${STEPS.length}</span><h4>${s.t}</h4><p>${s.b}</p>
      <div class="tf"><div class="tour-dots">${STEPS.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
      ${i > 0 ? '<button class="btn sec sm" id="tb">Back</button>' : '<button class="btn ghost sm" id="tx">Skip</button>'}
      <button class="btn pri sm" id="tn">${i === STEPS.length - 1 ? 'Finish' : 'Next →'}</button></div>`;
    th = tip.offsetHeight;
    if (!el) {
      spot.style.cssText = `left:${vw / 2}px;top:${vh / 2}px;width:0;height:0`;
      tip.style.left = (vw - tw) / 2 + 'px'; tip.style.top = (vh - th) / 2 + 'px';
    } else {
      const r = el.getBoundingClientRect(), p = 8;
      const top = Math.max(70, r.top - p), bottom = Math.min(vh - 8, r.bottom + p);
      spot.style.cssText = `left:${r.left - p}px;top:${top}px;width:${r.width + p * 2}px;height:${bottom - top}px`;
      let x, y;
      if (s.place === 'inside') { x = vw - tw - 16; y = top + 30; }
      else if (s.place === 'left' && r.left - tw - 24 > 0) { x = r.left - tw - 24; y = top; }
      else if (r.right + tw + 24 < vw) { x = r.right + 20; y = top; }
      else if (r.left - tw - 24 > 0) { x = r.left - tw - 24; y = top; }
      else if (bottom + th + 16 < vh) { x = Math.min(r.left, vw - tw - 16); y = bottom + 14; }
      else { x = Math.min(r.left + 16, vw - tw - 16); y = Math.max(80, top - th - 14); if (y < 80 || top - th - 14 < 70) { y = bottom - th - 16; x = r.right - tw - 16; } }
      tip.style.left = Math.max(12, Math.min(x, vw - tw - 12)) + 'px';
      tip.style.top = Math.max(76, Math.min(y, vh - th - 12)) + 'px';
    }
    $('#tn').onclick = () => i === STEPS.length - 1 ? end() : show(i + 1);
    const b = $('#tb'); if (b) b.onclick = () => show(i - 1);
    const x = $('#tx'); if (x) x.onclick = end;
  }

  function start() {
    end(true);
    block = document.createElement('div'); block.className = 'tour-block';
    spot = document.createElement('div'); spot.className = 'tour-spot';
    tip = document.createElement('div'); tip.className = 'tour-tip';
    document.body.append(block, spot, tip);
    addEventListener('resize', onResize);
    addEventListener('keydown', onKey);
    show(0);
  }
  function onResize() { if (i >= 0) { const s = STEPS[i]; place(s.sel ? ($(s.sel) || (s.alt && $(s.alt))) : null, s); } }
  function onKey(e) { if (i < 0) return; if (e.key === 'ArrowRight') { e.stopPropagation(); i === STEPS.length - 1 ? end() : show(i + 1); } if (e.key === 'ArrowLeft' && i > 0) show(i - 1); }
  function end(silent) {
    [block, spot, tip].forEach(x => x && x.remove()); block = spot = tip = null;
    removeEventListener('resize', onResize); removeEventListener('keydown', onKey);
    if (i >= 0 && !silent) H.toast('Tour complete. Everything is clickable, so explore freely.', 'sparkles');
    i = -1;
  }
  window.TOUR = { start, end: () => { if (i >= 0) end(); } };
})();
