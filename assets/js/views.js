/* Pathfinder views */
(function () {
  const D = window.D, $ = H.$;
  const V = window.V = { actions: {} };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const TODAY = 6.45; // mid-July, 0-indexed months
  const SHORT = { I1: 'Manager Excellence', I2: 'Onboarding Journey', I3: 'Wellbeing 2.0', I4: 'Succession Cadence', I5: 'People Analytics', I6: 'Exit Insights', I7: 'Iberia Integration' };
  const gaps = () => D.topics.map(t => ({ ...t, gap: t.s - H.peer(t).m })).sort((a, b) => a.gap - b.gap);

  const ganttRows = (list, compact) => `<div class="gantt">
    <div></div><div class="gh">${MONTHS.map(m => `<span>${m}</span>`).join('')}</div>
    ${list.map(i => { const t = H.T(i.topic); const light = i.status === 'at-risk' ? '#FCD9A8' : i.status === 'new' ? 'repeating-linear-gradient(45deg,#DDD6FE,#DDD6FE 6px,#EDE9FE 6px,#EDE9FE 12px)' : t.color + '40'; const strong = i.status === 'at-risk' ? 'linear-gradient(90deg,#F59E0B,#F97316)' : i.status === 'new' ? '#8B5CF6' : `linear-gradient(90deg,${t.color},${t.color}DD)`; return `
      <div class="gname">${compact ? '' : `<span class="chip" style="background:${t.color}1A;color:${t.color}">${t.id}</span>`}<span class="b" title="${H.esc(i.name)}">${H.esc(i.name)}</span></div>
      <div class="gtrack">${i === list[0] ? `<div class="today" style="left:${TODAY / 12 * 100}%"></div>` : ''}
        <div class="gbar" data-open-init="${i.id}" style="left:${i.start / 12 * 100}%;width:${(i.end - i.start + 1) / 12 * 100}%;background:${light}">
          <div class="gp" style="width:${i.progress}%;background:${strong}"></div><span style="color:${i.progress < 12 ? t.color : '#fff'}">${i.progress}%</span></div></div>`; }).join('')}
  </div>`;

  /* ======================= OVERVIEW ======================= */
  V.overview = () => {
    const o = D.overall, proj = H.projected(), ms = H.milestones();
    const onTrack = S.inits.filter(i => i.status === 'on-track').length;
    const g = gaps().slice(0, 5);
    return `
    <div class="page-head"><div><div class="eyebrow">${IC('sparkles', 13)} Good morning, Maria</div><h1>Your people strategy at a glance</h1><p>Six months into your 2027 roadmap. Here is where you stand, what's working, and what needs you this week.</p></div>
      <div class="actions"><button class="btn sec" data-go="report">${IC('present', 15)} Board report</button><button class="btn pri" data-go="copilot">${IC('sparkles', 15)} Ask Pathfinder</button></div></div>

    <div class="grid g12">
      <div class="card hero s5" id="t-score"><div class="card-b" style="padding:22px">
        <div class="row between"><span class="chip" style="background:rgba(255,255,255,.14);color:#fff">${IC('shield', 13)} Assessed ${D.client.certYear} · ${D.client.seal}</span><span class="tiny muted">vs ${D.client.peerCount} peers</span></div>
        <div class="row" style="gap:22px;margin-top:16px">
          <div style="position:relative">${CH.ring(o.s, 132, 12)}<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center"><div><div style="font-size:30px;font-weight:800;letter-spacing:-.03em">${o.s}</div><div class="tiny muted">overall score</div></div></div></div>
          <div style="flex:1">
            <div class="row between small"><span class="muted">Peer median</span><b>${o.m}</b></div>
            <div class="row between small" style="margin-top:6px"><span class="muted">Top quartile</span><b>${o.t}</b></div>
            <div class="row between small" style="margin-top:6px"><span class="muted">Last cycle</span><b>${o.p} <span style="color:#FDA4AF">▼ ${H.fmt1(o.p - o.s)}</span></b></div>
            <div class="row between small" style="margin-top:6px"><span class="muted">Peer percentile</span><b>${D.client.percentile}th</b></div>
            <div style="margin-top:14px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15)">
              <div class="tiny muted">Projected next cycle if the roadmap is delivered</div>
              <div class="row" style="gap:8px;margin-top:2px"><b style="font-size:20px">${proj}</b><span class="chip" style="background:rgba(74,222,128,.18);color:#86EFAC">▲ ${H.fmt1(proj - o.s)} · top third</span></div>
            </div>
          </div>
        </div></div></div>

      <div class="card s7" id="t-journey"><div class="card-h"><h3>Your 2027 journey</h3><span class="sub">Fix → Maintain → Prove → Lead</span><div class="r"><span class="chip info">Stage: Execute</span></div></div>
        <div class="card-b">
          <div class="journey">
            ${[['Results in', 'Dec 2026 · 76.6', 'done'], ['Plan approved', D.client.planApproved, 'done'], ['Execute', 'Now · 6 initiatives', 'now'], ['Prove', 'Board review · Sep', ''], ['Next cycle', 'Survey opens 1 Oct', '']].map((s, i) => `<div class="jstep ${s[2]}"><div class="jd">${s[2] === 'done' ? IC('check', 14, 3) : i + 1}</div><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('')}
          </div>
          <div class="grid g3" style="margin-top:20px;gap:12px">
            <div class="empty-reason"><div class="tiny muted">Roadmap progress</div><div class="row" style="margin-top:4px"><b style="font-size:20px">${H.avgProgress()}%</b><span class="tiny muted">plan: 54%</span></div><div class="bar mt" style="margin-top:8px"><i style="width:${H.avgProgress()}%"></i></div></div>
            <div class="empty-reason"><div class="tiny muted">Milestones done</div><div class="row" style="margin-top:4px"><b style="font-size:20px">${ms.d}/${ms.t}</b><span class="tiny muted">${onTrack} of ${S.inits.length} initiatives on track</span></div><div class="bar ok" style="margin-top:8px"><i style="width:${ms.d / ms.t * 100}%"></i></div></div>
            <div class="empty-reason"><div class="tiny muted">Next assessment pre-filled</div><div class="row" style="margin-top:4px"><b style="font-size:20px">64%</b><span class="tiny muted">137 / 214 items</span></div><div class="bar" style="margin-top:8px"><i style="width:64%"></i></div></div>
          </div>
        </div></div>
    </div>

    <div class="grid g4 mt">
      <div class="card kpi"><div class="lbl">${IC('users', 14)} New-hire 90-day attrition</div><div class="val">5.4%<small>pilot countries</small></div><div class="foot"><span class="delta up">▼ 46%</span> vs 10.0% before onboarding pilot</div></div>
      <div class="card kpi"><div class="lbl">${IC('trend', 14)} Voluntary attrition (12m)</div><div class="val">11.2%</div><div class="foot"><span class="delta up">▼ 2.2 pts</span> since Jan 2026</div></div>
      <div class="card kpi"><div class="lbl">${IC('msg', 14)} eNPS</div><div class="val">+27</div><div class="foot"><span class="delta up">▲ 9</span> in 2 quarters</div></div>
      <div class="card kpi"><div class="lbl">${IC('euro', 14)} Est. value of lower attrition</div><div class="val">€2.3M</div><div class="foot">avoided replacement cost · <a data-go="outcomes">see method</a></div></div>
    </div>

    <div class="grid g12 mt">
      <div class="card s7" id="t-gaps"><div class="card-h"><h3>Biggest gaps vs peers</h3><span class="sub">${D.client.peerGroup}</span><div class="r"><button class="btn ghost sm" data-go="results">All 20 topics ${IC('arrow', 14)}</button></div></div>
        <div class="card-b">
          <div class="legend" style="margin-bottom:12px"><span><i style="background:linear-gradient(90deg,#F97316,#F43F5E)"></i>Helix</span><span><i style="background:#0E1630;width:3px"></i>Peer median</span><span><i style="background:#0EA5A4;width:3px"></i>Top quartile</span></div>
          ${g.map(t => `<div class="row" style="padding:9px 0;gap:14px">
            <div style="width:150px"><div class="b small">${t.name}</div><div class="tiny muted">${t.domainName}</div></div>
            <div style="flex:1">${H.cmp(t)}</div>
            <div style="width:52px;text-align:right" class="b mono">${t.s}</div>
            <span class="delta down" style="width:54px;justify-content:center">${t.gap}</span>
            <button class="btn ghost sm" data-ask="Why is ${t.name} below peers?">${IC('sparkles', 13)} Why?</button></div>`).join('')}
        </div></div>

      <div class="card ai s5" id="t-nudges"><div class="card-h"><span class="ai-tag">${IC('sparkles', 14)} Pathfinder · this week</span><div class="r"><span class="chip outline">4 nudges</span></div></div>
        <div class="card-b"><div class="list">
          <div class="li"><div class="li-ico warn">${IC('alert', 16)}</div><div style="flex:1"><b>Wellbeing Framework 2.0 is slipping</b><div class="small muted">Budget approval is stuck in FR, IT and BR. If it isn't approved by Aug, Wellbeing will stay below peers in the next cycle.</div><div class="acts"><button class="btn sec sm" data-open-init="I3">Open initiative</button><button class="btn ghost sm" data-action="draftEscalation">Draft escalation</button></div></div></div>
          <div class="li"><div class="li-ico risk">${IC('building', 16)}</div><div style="flex:1"><b>700 Iberia Bio employees aren't covered</b><div class="small muted">The May acquisition isn't on onboarding, wellbeing or manager programmes yet.</div><div class="acts"><button class="btn sec sm" data-go="countries">Review Spain</button></div></div></div>
          <div class="li"><div class="li-ico ok">${IC('trend', 16)}</div><div style="flex:1"><b>Onboarding pilot is working</b><div class="small muted">New-hire attrition in DE/CH is down 46%. Scaling to ES, BR and IN is due this month.</div><div class="acts"><button class="btn sec sm" data-go="outcomes">See proof</button></div></div></div>
        </div></div></div>
    </div>

    <div class="grid g12 mt">
      <div class="card s8"><div class="card-h"><h3>Roadmap · 2027</h3><span class="sub">Click any bar for details</span><div class="r"><button class="btn ghost sm" data-go="roadmap">Open roadmap ${IC('arrow', 14)}</button></div></div><div class="card-b" style="padding-top:28px">${ganttRows(S.inits, true)}</div></div>
      <div class="card s4"><div class="card-h"><h3>6 domains vs peers</h3></div><div class="card-b">${CH.radar(D.domains.map(d => d.name), [
        { values: D.domains.map(d => d.t), color: '#0EA5A4', dash: true, w: 1.5 },
        { values: D.domains.map(d => d.m), color: '#0E1630', w: 1.5, dash: true },
        { values: D.domains.map(d => d.s), color: '#5B4BF5', fill: 'rgba(91,75,245,.18)', dots: true, w: 2.4 }], 320)}
        <div class="legend" style="justify-content:center"><span><i style="background:#5B4BF5"></i>Helix</span><span><i style="background:#0E1630"></i>Median</span><span><i style="background:#0EA5A4"></i>Top quartile</span></div></div></div>
    </div>`;
  };

  /* ======================= RESULTS ======================= */
  V.results = () => {
    const ps = H.peerSets[S.peerSet];
    let rows = D.topics.map(t => ({ ...t, pp: H.peer(t) })).map(t => ({ ...t, gap: t.s - t.pp.m }));
    if (S.resultsFilter === 'gaps') rows = rows.filter(r => r.gap < 0).sort((a, b) => a.gap - b.gap);
    if (S.resultsFilter === 'strengths') rows = rows.filter(r => r.s >= r.pp.t - 1).sort((a, b) => b.gap - a.gap);
    const dm = D.domains.map(d => ({ ...d, pm: Math.round(d.topics.reduce((a, t) => a + H.peer(t).m, 0) / d.topics.length * 10) / 10, pt: Math.round(d.topics.reduce((a, t) => a + H.peer(t).t, 0) / d.topics.length * 10) / 10 }));
    return `
    <div class="page-head"><div><div class="eyebrow">${IC('chart', 13)} Diagnose</div><h1>Assessment results & benchmarks</h1><p>Your validated ${D.client.certYear} results across 6 domains and 20 topics, compared with peers like you. Benchmarks only use groups of 10+ organisations.</p></div>
      <div class="actions"><div class="row small"><span class="muted">Compare with</span><select class="sel" id="peer-sel">${Object.entries(H.peerSets).map(([k, v]) => `<option value="${k}" ${S.peerSet === k ? 'selected' : ''}>${v.label} (${v.n})</option>`).join('')}</select></div></div></div>

    <div class="grid g12">
      <div class="card s5"><div class="card-h"><h3>Domain profile</h3><span class="sub">${ps.n} peers</span></div><div class="card-b">
        ${CH.radar(D.domains.map(d => d.name), [{ values: dm.map(d => d.pt), color: '#0EA5A4', dash: true, w: 1.5 }, { values: dm.map(d => d.pm), color: '#0E1630', dash: true, w: 1.5 }, { values: dm.map(d => d.s), color: '#5B4BF5', fill: 'rgba(91,75,245,.18)', dots: true, w: 2.4 }], 360)}
        <div class="legend" style="justify-content:center"><span><i style="background:#5B4BF5"></i>Helix</span><span><i style="background:#0E1630"></i>Peer median</span><span><i style="background:#0EA5A4"></i>Top quartile</span></div></div></div>
      <div class="card s7"><div class="card-h"><h3>Domains</h3><span class="sub">score · change vs last cycle · gap to median</span></div><div class="card-b"><div class="grid g2" style="gap:12px">
        ${dm.map(d => `<div class="empty-reason" style="border-left:4px solid ${d.color}"><div class="row between"><b class="small">${d.name}</b>${H.delta(d.s, d.p)}</div>
          <div class="row" style="margin-top:6px;gap:10px"><b style="font-size:22px">${d.s}</b><span class="small ${d.s - d.pm < 0 ? '' : 'muted'}" style="color:${d.s - d.pm < 0 ? 'var(--rose)' : ''}">${d.s - d.pm >= 0 ? '+' : ''}${H.fmt1(d.s - d.pm)} vs median</span></div>
          <div class="tiny muted" style="margin-top:4px">${d.topics.map(t => `${t.name} <b style="color:${H.heat(t.s)}">${t.s}</b>`).join(' · ')}</div></div>`).join('')}
      </div></div></div>
    </div>

    <div class="card mt" id="t-topics"><div class="card-h"><h3>All topics</h3><div class="r"><div class="seg" id="rf">${[['all', 'All 20'], ['gaps', 'Gaps'], ['strengths', 'Strengths']].map(([k, l]) => `<button class="${S.resultsFilter === k ? 'on' : ''}" data-rf="${k}">${l}</button>`).join('')}</div></div></div>
      <div class="card-b" style="padding:12px 0 0"><table class="tbl"><thead><tr><th style="padding-left:18px">Topic</th><th>Score</th><th>vs last</th><th style="width:30%">Helix · median · top quartile</th><th>Gap</th><th>Status</th><th></th></tr></thead><tbody>
      ${rows.map(t => `<tr><td style="padding-left:18px"><div class="b">${t.name}</div><div class="tiny muted"><span style="color:${t.color}">●</span> ${t.domainName}</div></td>
        <td class="b mono" style="font-size:15px">${t.s}</td><td>${H.delta(t.s, t.p)}</td><td>${H.cmp(t, t.pp)}<div class="tiny muted" style="margin-top:5px">median ${t.pp.m} · top ${t.pp.t}</div></td>
        <td class="b mono" style="color:${t.gap < 0 ? 'var(--rose)' : 'var(--green)'}">${t.gap > 0 ? '+' : ''}${t.gap}</td>
        <td>${t.gap <= -8 ? '<span class="chip risk">Priority gap</span>' : t.gap < 0 ? '<span class="chip warn">Below median</span>' : t.s >= t.pp.t ? '<span class="chip teal">Top quartile</span>' : '<span class="chip ok">Above median</span>'}</td>
        <td><button class="btn ghost sm" data-ask="Tell me about ${t.name}">${IC('sparkles', 13)} Ask</button></td></tr>`).join('')}
      </tbody></table></div></div>`;
  };
  V.after_results = () => {
    $('#peer-sel').onchange = e => { S.peerSet = e.target.value; H.render(); H.toast('Benchmark updated: ' + H.peerSets[S.peerSet].label, 'chart'); };
    H.$$('[data-rf]').forEach(b => b.onclick = () => { S.resultsFilter = b.dataset.rf; H.render(); });
  };

  /* ======================= COPILOT ======================= */
  V.copilot = () => `
    <div class="page-head" style="margin-bottom:16px"><div><div class="eyebrow">${IC('sparkles', 13)} Diagnose</div><h1>Ask Pathfinder</h1><p>An AI analyst that only answers from your validated results, evidence and anonymised peer benchmarks, and shows its sources.</p></div>
      <div class="actions"><button class="btn sec sm" data-action="clearChat">${IC('refresh', 14)} New conversation</button></div></div>
    <div class="chat-wrap">
      <div class="card chat" id="t-chat"><div class="chat-scroll" id="chat-scroll"></div>
        <div class="composer"><textarea id="chat-in" rows="1" placeholder="Ask about scores, gaps, countries, peers, or say 'summarise for my CEO'…"></textarea><button class="send" id="chat-send" aria-label="Send">${IC('send', 18)}</button></div></div>
      <div class="ctx" style="display:flex;flex-direction:column;gap:14px;overflow-y:auto">
        <div class="card"><div class="card-h"><h3>What Pathfinder can see</h3></div><div class="card-b"><div class="list">
          ${[['shield', 'Assessment 2027 results', '20 topics · 214 survey items', 'ok'], ['file', 'Evidence vault', H.evidenceCount() + 66 + ' documents', 'ok'], ['users', 'Peer benchmark', '46 orgs · anonymised · k≥10', 'ok'], ['db', 'Workday HRIS', 'Connected · daily sync', 'ok'], ['msg', 'Glint engagement', 'Connected · quarterly', 'ok'], ['map', 'Roadmap & initiatives', S.inits.length + ' initiatives', 'ok']].map(x => `<div class="li" style="padding:9px 0"><div class="li-ico info" style="width:30px;height:30px">${IC(x[0], 15)}</div><div style="flex:1"><div class="small b">${x[1]}</div><div class="tiny muted">${x[2]}</div></div><span class="chip ok" style="padding:2px 6px">${IC('check', 11, 3)}</span></div>`).join('')}
        </div></div></div>
        <div class="card"><div class="card-h"><h3>Guardrails</h3></div><div class="card-b small muted">
          <div class="row" style="align-items:flex-start;gap:8px;margin-bottom:8px">${IC('link', 15)}<span>Every answer cites the survey items and data it used</span></div>
          <div class="row" style="align-items:flex-start;gap:8px;margin-bottom:8px">${IC('lock', 15)}<span>Peer data is aggregated. No single company can be identified.</span></div>
          <div class="row" style="align-items:flex-start;gap:8px;margin-bottom:8px">${IC('eye', 15)}<span>No individual employee data is shown, only aggregates of 20+ people</span></div>
          <div class="row" style="align-items:flex-start;gap:8px">${IC('users', 15)}<span>Recommendations are suggestions. Your team approves every change.</span></div>
        </div></div>
      </div>
    </div>`;
  V.after_copilot = () => COP.mount();

  /* ======================= ROADMAP ======================= */
  V.roadmap = () => {
    const ranked = H.rank();
    const proj = H.projected(), o = D.overall;
    const pts = ranked.map((i, k) => ({ id: i.id, x: i.effort, y: i.impact, r: 12 + i.uplift, color: H.T(i.topic).color, label: SHORT[i.id] || i.name, rank: k + 1 }));
    const W = S.weights;
    return `
    <div class="page-head"><div><div class="eyebrow">${IC('map', 13)} Plan</div><h1>2027 People Roadmap</h1><p>Generated by Pathfinder on ${D.client.planApproved} from your results, peer practices and business priorities. Approved by ${D.client.user.name}. It re-plans live as priorities change.</p></div>
      <div class="actions"><button class="btn sec" data-action="replay">${IC('play', 14)} Replay how this plan was built</button><button class="btn pri" data-action="addInit">${IC('plus', 15)} Add initiative</button></div></div>

    <div class="grid g12">
      <div class="card s4" id="t-weights"><div class="card-h"><h3>Your business priorities</h3><span class="sub">drag to re-plan</span></div><div class="card-b">
        ${[['retention', 'Reduce attrition'], ['leadership', 'Build leadership pipeline'], ['brand', 'Strengthen employer brand'], ['cost', 'Cost discipline (favour low effort)']].map(([k, l]) => `<div class="slider" style="margin-bottom:16px"><label><span>${l}</span><b id="wv-${k}">${W[k]}</b></label><input type="range" min="0" max="100" value="${W[k]}" data-w="${k}"></div>`).join('')}
        <div class="tiny muted" style="margin-bottom:8px">PRIORITY ORDER</div>
        <div id="rank-list">${rankList(ranked)}</div>
      </div></div>
      <div class="card s8"><div class="card-h"><h3>Impact vs effort</h3><span class="sub">bubble size = projected score uplift · number = priority</span></div><div class="card-b" id="matrix">${CH.matrix(pts, { w: 640, h: 380 })}</div></div>
    </div>

    <div class="card mt" id="t-gantt"><div class="card-h"><h3>Timeline</h3><span class="sub">Shaded part of each bar = progress</span><div class="r"><div class="legend"><span><i style="background:#5B4BF5"></i>On track</span><span><i style="background:#F59E0B"></i>At risk</span></div></div></div><div class="card-b" style="padding-top:30px">${ganttRows(ranked)}</div></div>

    <div class="grid g12 mt">
      <div class="card s6"><div class="card-h"><h3>Projected overall score</h3><span class="sub">with and without the roadmap</span></div><div class="card-b">
        ${CH.line([{ name: 'Without', color: '#9AA1B9', values: [74.9, 75.8, 76.9, 76.6, 76.0], dash: true, w: 2 }, { name: 'With roadmap', color: '#5B4BF5', area: true, values: [74.9, 75.8, 76.9, 76.6, proj] }], ['2024', '2025', '2026', '2027', '2028 (proj.)'], { h: 210, min: 72, max: 82 })}
        <div class="row wrap" style="gap:16px;margin-top:8px"><div class="legend"><span><i style="background:#5B4BF5"></i>With roadmap: <b style="color:var(--ink)">${proj}</b></span><span><i style="background:#9AA1B9"></i>Without: 76.0 (peers keep improving)</span></div></div></div></div>
      <div class="card ai s6"><div class="card-h"><span class="ai-tag">${IC('sparkles', 14)} Why this order</span></div><div class="card-b"><div class="list small">
        <div class="li"><div class="li-ico ok">${IC('zap', 15)}</div><div><b>Onboarding first: the quick win.</b> It's the biggest drop (−13). 3 of its 4 failed survey items can be fixed in one quarter, and 72% of peers already run a 90-day journey.</div></div>
        <div class="li"><div class="li-ico info">${IC('layers', 15)}</div><div><b>Manager Excellence: highest leverage.</b> Leadership is linked to Performance, Engagement and Succession, so one programme lifts 4 topics.</div></div>
        <div class="li"><div class="li-ico teal">${IC('db', 15)}</div><div><b>People Analytics runs underneath.</b> It's what lets us prove the outcomes of every other initiative, so it starts in January.</div></div>
        <div class="li"><div class="li-ico warn">${IC('clock', 15)}</div><div><b>Wellbeing after Q1 budgets.</b> It's sequenced after budget approval. That approval is now the risk.</div></div>
      </div></div></div>
    </div>`;
  };
  function rankList(ranked) {
    return ranked.map((i, k) => `<div class="row" style="padding:7px 0;border-top:1px solid var(--line2)"><span class="chip ${k < 2 ? 'info' : ''}" style="width:24px;justify-content:center;padding:3px 0">${k + 1}</span><span class="small b" style="flex:1">${i.name}</span><span class="tiny muted mono">${i.prio}</span></div>`).join('');
  }
  V.after_roadmap = () => {
    H.$$('[data-w]').forEach(r => r.oninput = () => {
      S.weights[r.dataset.w] = +r.value; $('#wv-' + r.dataset.w).textContent = r.value;
      const ranked = H.rank();
      $('#rank-list').innerHTML = rankList(ranked);
      $('#matrix').innerHTML = CH.matrix(ranked.map((i, k) => ({ id: i.id, x: i.effort, y: i.impact, r: 12 + i.uplift, color: H.T(i.topic).color, label: SHORT[i.id] || i.name, rank: k + 1 })), { w: 640, h: 380 });
    });
  };
  V.actions.replay = async () => {
    const steps = [
      ['Reading 214 validated survey answers across 20 topics', '20 topics scored · 6 below peer median'],
      ['Comparing with 46 peers in Pharma & Life Sciences · Europe', 'Gaps: Leadership −14, Onboarding −16, Wellbeing −11, Succession −11'],
      ['Finding root causes in evidence and survey items', 'ON-03, ON-07, ON-09 failed · LD-06 missing · WB-04 partial in 5 countries'],
      ['Matching 1,240 peer practices to your gaps', '7 practices with proven results at similar companies'],
      ['Weighting by your priorities: attrition, leadership pipeline', 'Retention ×0.8 · Leadership ×0.7 · Brand ×0.35 · Cost ×0.45'],
      ['Sequencing dependencies and capacity', 'Analytics → Onboarding → Managers → Wellbeing → Succession → Exit'],
      ['Projecting score and outcome impact', `Overall ${D.overall.s} → ${H.projected()} · new-hire attrition −30 to −45%`],
    ];
    H.openModal(`<div class="modal-h"><div class="ai-av">${IC('sparkles', 18)}</div><div><b>How Pathfinder built your 2027 roadmap</b><div class="tiny muted">Replay of the planning run on ${D.client.planApproved} · every step is auditable</div></div><button class="icon-btn" style="margin-left:auto" data-action="close">${IC('x', 16)}</button></div>
      <div class="modal-b"><div id="rs">${steps.map((s, k) => `<div class="rs-step" id="rs${k}"><div class="ic">${IC('clock', 12)}</div><div style="flex:1"><div>${s[0]}</div><div class="tiny muted" id="rso${k}" style="display:none">${s[1]}</div></div></div>`).join('')}</div>
      <div id="rs-done" style="display:none;margin-top:16px" class="empty-reason"><div class="row between"><div><b>Plan ready: 6 initiatives, 12 months, €1.25M</b><div class="small muted">Sent to Maria for approval · approved ${D.client.planApproved}</div></div><button class="btn pri sm" data-action="close">View roadmap</button></div></div></div>`);
    for (let k = 0; k < steps.length; k++) {
      const el = $('#rs' + k); if (!el) return;
      el.classList.add('on'); el.querySelector('.ic').innerHTML = '<div class="spin" style="width:12px;height:12px;border:2px solid var(--pri-soft);border-top-color:var(--pri);border-radius:50%;animation:spin .7s linear infinite"></div>';
      await H.sleep(650);
      el.classList.remove('on'); el.classList.add('done'); el.querySelector('.ic').innerHTML = IC('check', 12, 3); $('#rso' + k).style.display = 'block';
    }
    const d = $('#rs-done'); if (d) d.style.display = 'block';
  };
  V.actions.addInit = () => {
    H.openModal(`<div class="modal-h"><b>Add initiative</b><button class="icon-btn" style="margin-left:auto" data-action="close">${IC('x', 16)}</button></div><div class="modal-b">
      <div class="ai-tag" style="margin-bottom:10px">${IC('sparkles', 14)} Suggested by Pathfinder from your open gaps</div>
      <div class="grid g2">${[['Iberia Bio people integration (100-day playbook)', 'Organisation & Change', 'iberia'], ['Leadership coaching for top-200 leaders', 'Leadership', 'x1'], ['Succession for critical lab roles', 'Succession', 'x2'], ['Wellbeing champions network', 'Wellbeing', 'x3']].map(x => `<button class="empty-reason" style="text-align:left" data-action="${x[2] === 'iberia' ? 'addIberia' : 'addGeneric'}" data-name="${x[0]}"><b class="small">${x[0]}</b><div class="tiny muted">${x[1]} · based on matched peer practices</div></button>`).join('')}</div></div>`);
  };
  V.actions.addGeneric = el => { H.closeAll(); H.toast(`"${el.dataset.name}" added to the backlog for Q4 planning`, 'plus'); };

  /* ======================= INITIATIVES ======================= */
  V.initiatives = () => {
    let list = S.inits;
    if (S.initFilter !== 'all') list = list.filter(i => i.status === S.initFilter || (S.initFilter === 'planned' && i.status === 'new'));
    const ms = H.milestones();
    return `
    <div class="page-head"><div><div class="eyebrow">${IC('tasks', 13)} Execute</div><h1>Initiatives</h1><p>Every roadmap item has an owner, milestones, country rollout and evidence. Evidence you capture here pre-fills next year's survey.</p></div>
      <div class="actions"><div class="seg">${[['all', 'All'], ['on-track', 'On track'], ['at-risk', 'At risk'], ['planned', 'Planned']].map(([k, l]) => `<button class="${S.initFilter === k ? 'on' : ''}" data-if="${k}">${l}</button>`).join('')}</div><button class="btn pri" data-action="addInit">${IC('plus', 15)} New</button></div></div>
    <div class="grid g4">
      <div class="card kpi"><div class="lbl">Active initiatives</div><div class="val">${S.inits.length}</div><div class="foot">budget €${S.inits.length > 6 ? '1.43' : '1.25'}M</div></div>
      <div class="card kpi"><div class="lbl">On track</div><div class="val">${S.inits.filter(i => i.status === 'on-track').length}<small>/ ${S.inits.length}</small></div><div class="foot"><span class="delta down">${S.inits.filter(i => i.status === 'at-risk').length} at risk</span></div></div>
      <div class="card kpi"><div class="lbl">Milestones done</div><div class="val">${ms.d}<small>/ ${ms.t}</small></div><div class="bar ok" style="margin-top:10px"><i style="width:${ms.d / ms.t * 100}%"></i></div></div>
      <div class="card kpi"><div class="lbl">Evidence captured</div><div class="val">${H.evidenceCount()}<small>files</small></div><div class="foot">${IC('shield', 13)} auto-mapped to survey items</div></div>
    </div>
    <div class="card mt" id="t-itable"><div class="card-b" style="padding:0"><table class="tbl"><thead><tr><th style="padding-left:18px">Initiative</th><th>Owner</th><th>Timeline</th><th style="width:16%">Progress</th><th>Status</th><th>Projected uplift</th><th>Evidence</th></tr></thead><tbody>
      ${list.map(i => { const t = H.T(i.topic); return `<tr class="click" data-open-init="${i.id}"><td style="padding-left:18px"><div class="b">${i.name}</div><div class="tiny muted"><span style="color:${t.color}">●</span> ${t.name}${i.also.length ? ' + ' + i.also.map(a => H.T(a).name).join(', ') : ''}</div></td>
        <td><div class="row" style="gap:8px"><div class="avatar sm" style="background:linear-gradient(135deg,${t.color},#8B5CF6)">${H.initials(i.owner)}</div><div><div class="small b">${i.owner}</div><div class="tiny muted">${i.ownerRole}</div></div></div></td>
        <td class="small">${MONTHS[i.start]} – ${MONTHS[i.end]}</td>
        <td><div class="row" style="gap:8px"><div class="bar ${i.status === 'at-risk' ? 'warn' : ''}" style="flex:1"><i style="width:${i.progress}%"></i></div><span class="small b mono">${i.progress}%</span></div></td>
        <td>${H.status(i.status)}</td><td><span class="chip teal">+${i.uplift} ${t.name}</span></td><td class="small" style="white-space:nowrap">${IC('file', 13)} ${i.evidence.length}</td></tr>`; }).join('')}
    </tbody></table></div></div>`;
  };
  V.after_initiatives = () => H.$$('[data-if]').forEach(b => b.onclick = () => { S.initFilter = b.dataset.if; H.render(); });

  V.openInit = id => {
    const i = S.inits.find(x => x.id === id); if (!i) return;
    const t = H.T(i.topic);
    const items = Object.entries(D.surveyItems).filter(([k]) => k.startsWith(i.topic === 'ON' ? 'ON' : i.topic === 'LD' ? 'LD' : i.topic === 'WB' ? 'WB' : i.topic === 'SU' ? 'SU' : 'zz'));
    const pr = D.practices.find(p => p.topic === i.topic);
    H.openDrawer(`<div class="drawer-h"><div style="flex:1"><div class="row" style="gap:8px;margin-bottom:6px"><span class="chip" style="background:${t.color}1A;color:${t.color}">${t.name}</span>${H.status(i.status)}</div><h3 style="font-size:19px;letter-spacing:-.01em">${i.name}</h3><div class="small muted" style="margin-top:4px">${i.owner} · ${i.ownerRole} · ${MONTHS[i.start]}–${MONTHS[i.end]} 2027 · ${i.cost}</div></div><button class="icon-btn" data-action="close">${IC('x', 16)}</button></div>
      <div class="drawer-b">
        ${i.risk ? `<div class="card ai" style="margin-bottom:16px"><div class="card-b"><span class="ai-tag">${IC('sparkles', 13)} Pathfinder risk alert</span><div class="small" style="margin:8px 0">${i.risk} At this pace, Wellbeing is projected to stay at <b>66</b> next cycle (peer median 75).</div><div class="acts"><button class="btn pri sm" data-action="draftEscalation">${IC('msg', 13)} Draft escalation to CFO</button><button class="btn sec sm" data-ask="How can we de-risk the wellbeing initiative?">Ask how to de-risk</button></div><div id="esc"></div></div></div>` : ''}
        <div class="grid g3" style="gap:10px;margin-bottom:18px">
          <div class="empty-reason"><div class="tiny muted">Progress</div><b style="font-size:20px">${i.progress}%</b></div>
          <div class="empty-reason"><div class="tiny muted">Score uplift</div><b style="font-size:20px">+${i.uplift}</b></div>
          <div class="empty-reason"><div class="tiny muted">Peers doing this</div><b style="font-size:20px">${i.peerAdoption}%</b></div>
        </div>
        <div class="small" style="margin-bottom:18px"><b>Why this initiative:</b> <span class="muted">${i.why}</span></div>
        <h4 style="font-size:13.5px;margin-bottom:6px">Milestones</h4>
        <div class="list" id="ms-list">${i.milestones.map((m, k) => `<label class="row" style="padding:9px 0;cursor:pointer"><input type="checkbox" data-ms="${k}" ${m.done ? 'checked' : ''} style="accent-color:#5B4BF5;width:16px;height:16px"><span class="small" style="flex:1;${m.done ? 'text-decoration:line-through;color:var(--ink3)' : ''}">${m.name}</span><span class="tiny muted">${m.due}</span></label>`).join('')}</div>
        <h4 style="font-size:13.5px;margin:18px 0 8px">Country rollout</h4>
        <div class="grid" style="grid-template-columns:repeat(6,1fr);gap:6px">${Object.entries(i.rollout).map(([c, st]) => `<div title="${H.C(c).name}: ${st}" style="border-radius:9px;padding:7px 4px;text-align:center;font-size:11.5px;font-weight:600;background:${{ done: '#E6F6EC', active: '#EEEBFF', planned: '#F1F2F7', blocked: '#FDE8EE' }[st]};color:${{ done: '#16A34A', active: '#5B4BF5', planned: '#6B7390', blocked: '#E11D48' }[st]}">${H.C(c).flag} ${c}</div>`).join('')}</div>
        <div class="legend" style="margin-top:8px"><span><i style="background:#16A34A"></i>Done</span><span><i style="background:#5B4BF5"></i>In progress</span><span><i style="background:#C5C9D8"></i>Planned</span><span><i style="background:#E11D48"></i>Blocked</span></div>
        <h4 style="font-size:13.5px;margin:18px 0 4px">Evidence (feeds next assessment)</h4>
        <div class="list">${i.evidence.map(f => `<div class="file-row"><div class="file-ico">${IC('file', 16)}</div><div style="flex:1"><div class="small b">${f}</div><div class="tiny muted">Mapped to ${i.topic}-0${3 + (f.length % 5)} · confidence ${88 + (f.length % 10)}%</div></div><span class="chip ok">${IC('check', 11, 3)} mapped</span></div>`).join('') || '<div class="small muted" style="padding:10px 0">No evidence yet. Attach files as milestones complete.</div>'}</div>
        <button class="btn sec sm" style="margin-top:8px" data-go="readiness">${IC('upload', 13)} Attach evidence</button>
        ${items.length ? `<h4 style="font-size:13.5px;margin:18px 0 8px">Survey items this closes</h4>${items.map(([k, v]) => `<div class="cite" style="margin:0 6px 6px 0"><b>${k}</b>${v}</div>`).join('')}` : ''}
        ${pr ? `<div class="empty-reason" style="margin-top:18px"><div class="tiny muted">PEER PRACTICE THIS IS BASED ON</div><div class="small b" style="margin-top:4px">${pr.title}</div><div class="tiny muted">${pr.co} · ${pr.result}</div></div>` : ''}
      </div>`);
    H.$$('[data-ms]').forEach(cb => cb.onchange = () => {
      const m = i.milestones[+cb.dataset.ms]; m.done = cb.checked;
      i.progress = Math.max(i.progress, Math.round(i.milestones.filter(x => x.done).length / i.milestones.length * 100));
      if (!cb.checked) i.progress = Math.round(i.milestones.filter(x => x.done).length / i.milestones.length * 100);
      H.toast(cb.checked ? `Milestone done. ${i.name} is now ${i.progress}%` : 'Milestone reopened', 'check');
      V.openInit(id); if (['initiatives', 'overview', 'roadmap'].includes(H.route())) H.render();
      H.$('#drawer').classList.add('on'); H.$('#scrim').classList.add('on');
    });
  };
  V.actions.draftEscalation = async () => {
    if (!$('#esc')) { V.openInit('I3'); await H.sleep(350); }
    const box = $('#esc'); if (!box) return;
    box.innerHTML = `<div class="blk small" id="esc-t"></div>`;
    const txt = `<b>To:</b> Henrik Aalto, CFO · <b>Cc:</b> Country GMs FR, IT, BR<br><b>Subject:</b> Decision needed by 31 Jul: €85k for Wellbeing Framework 2.0<br><br>Henrik, Wellbeing is our second-largest gap vs pharma peers (64 vs 75). The EAP and mental-health first-aider rollout is live in DE, CH, UK and NL, but France, Italy and Brazil are still waiting on local budget approval (€85k total). Without it, we project Wellbeing to stay at ~66 in the next assessment, and we will miss our global rollout target. In the countries where it's live, early pulse data shows a 7-point gain in wellbeing sentiment. Can we approve this centrally by 31 Jul?<br><br>Maria`;
    const el = $('#esc-t'); let i = 0; const words = txt.split(' ');
    while (i < words.length) { el.innerHTML = words.slice(0, i += 3).join(' ') + '<span class="typing-cursor"></span>'; await H.sleep(28); }
    el.innerHTML = txt + `<div class="acts"><button class="btn pri sm" data-action="sentEsc">Copy & open in Outlook</button><span class="tiny muted">Grounded in: WB-04, Glint Q2 pulse, initiative budget</span></div>`;
  };
  V.actions.sentEsc = () => H.toast('Draft copied (demo: nothing is sent)', 'msg');

  /* ======================= COUNTRIES ======================= */
  V.countries = () => {
    const tps = ['LD', 'ON', 'WB', 'SU', 'HA'];
    const cov = c => { let s = 0, n = 0; S.inits.forEach(i => { const st = i.rollout[c]; if (st) { n++; s += st === 'done' ? 1 : st === 'active' ? .5 : 0; } }); return Math.round(s / n * 100); };
    const es = H.C('ES');
    return `
    <div class="page-head"><div><div class="eyebrow">${IC('globe', 13)} Execute</div><h1>Countries</h1><p>One global view of 12 countries and 8,400 people. See where each gap topic is strong or weak and how far each initiative has rolled out.</p></div></div>
    ${S.iberiaAdded ? `<div class="card" style="border-color:#BBF7D0;background:#F0FDF4"><div class="card-b row" style="gap:14px"><div class="li-ico ok">${IC('check', 16)}</div><div style="flex:1"><b>Iberia Bio integration initiative created</b><div class="small muted">700 employees will join core programmes within 100 days. Owner: Sofia Marín. Tracking is in Initiatives.</div></div><button class="btn sec sm" data-open-init="I7">Open</button></div></div>` : `
    <div class="card ai" id="t-iberia"><div class="card-b row" style="gap:16px;align-items:flex-start"><div class="li-ico risk" style="width:42px;height:42px">${IC('building', 20)}</div>
      <div style="flex:1"><span class="ai-tag">${IC('sparkles', 13)} Detected by Pathfinder · from Workday org changes</span><div class="b" style="font-size:15px;margin-top:4px">Spain: ${es.alert}</div>
      <div class="small muted" style="margin-top:4px">If they aren't covered, Spain's score (69) pulls the regional average down by about 0.9 pts, and acquired staff typically leave at 2× the rate in year one.</div>
      <div class="acts"><button class="btn pri sm" data-action="addIberia">${IC('plus', 13)} Create 100-day integration initiative</button><button class="btn sec sm" data-go="practices">See Sentra Telecom's playbook</button><button class="btn ghost sm" data-ask="Which country is lagging and why?">Ask Pathfinder</button></div></div></div></div>`}

    <div class="grid g12 mt">
      <div class="card s7" id="t-heat"><div class="card-h"><h3>Gap topics by country</h3><span class="sub">validated scores · 2027 cycle</span></div><div class="card-b">
        <div class="heat" style="grid-template-columns:150px repeat(${tps.length + 1},1fr)">
          <div></div>${tps.map(t => `<div class="hh">${H.T(t).name}</div>`).join('')}<div class="hh">Overall</div>
          ${D.countries.map(c => `<div class="hr">${c.flag} ${c.name}</div>${tps.map(t => { const v = D.countryTopic[c.code][t]; return `<div class="hc" style="background:${H.heat(v)}">${v}</div>`; }).join('')}<div class="hc" style="background:#0E1630">${c.score}</div>`).join('')}
        </div>
        <div class="legend" style="margin-top:12px">${[[55, '<58'], [60, '58–62'], [65, '63–66'], [69, '67–70'], [73, '71–74'], [78, '75–79'], [82, '80+']].map(([v, l]) => `<span><i style="background:${H.heat(v)}"></i>${l}</span>`).join('')}</div>
      </div></div>
      <div class="card s5"><div class="card-h"><h3>Country status</h3><span class="sub">initiative coverage</span></div><div class="card-b" style="padding-top:8px"><div class="list">
        ${D.countries.slice().sort((a, b) => cov(a.code) - cov(b.code)).map(c => `<div class="row" style="padding:9px 0;gap:12px"><span style="font-size:20px">${c.flag}</span><div style="flex:1;min-width:0"><div class="row between"><b class="small">${c.name}</b>${H.status(c.status)}</div><div class="row" style="gap:8px;margin-top:5px"><div class="bar ${cov(c.code) < 30 ? 'risk' : cov(c.code) < 50 ? 'warn' : 'ok'}" style="flex:1"><i style="width:${cov(c.code)}%"></i></div><span class="tiny muted mono" style="width:90px;text-align:right">${cov(c.code)}% · ${c.hc.toLocaleString()} ppl</span></div><div class="tiny muted">HR lead: ${c.lead}</div></div></div>`).join('')}
      </div></div></div>
    </div>`;
  };
  V.actions.addIberia = () => {
    if (S.iberiaAdded) return H.go('countries');
    S.iberiaAdded = true;
    const rollout = {}; D.countries.forEach(c => rollout[c.code] = c.code === 'ES' ? 'active' : 'planned');
    S.inits.push({ id: 'I7', name: 'Iberia Bio People Integration', topic: 'OC', also: ['ON', 'WB'], owner: 'Sofia Marín', ownerRole: 'Talent Acquisition Lead', start: 7, end: 10, progress: 0, status: 'new', uplift: 3, impact: 74, effort: 40, peerAdoption: 64, cost: '€180k',
      why: 'Bring 700 acquired employees onto core programmes within 100 days. Based on Sentra Telecom\'s playbook, which halved year-one attrition.',
      milestones: [{ name: 'Policy gap scan: Iberia vs Helix', due: 'Aug', done: false }, { name: 'Onboarding + buddy for all Iberia staff', due: 'Sep', done: false }, { name: 'Managers into Manager Excellence wave 2', due: 'Oct', done: false }, { name: 'Monthly integration pulse', due: 'Nov', done: false }],
      evidence: [], rollout });
    H.closeAll(); H.render(); H.toast('Initiative created and added to the roadmap. Projected score updated.', 'plus');
  };

  /* ======================= PRACTICES ======================= */
  V.practices = () => {
    const gapIds = gaps().filter(g => g.gap < 0).map(g => g.id).concat(['OC']);
    const list = S.practiceFilter === 'gaps' ? D.practices.filter(p => gapIds.includes(p.topic)) : D.practices;
    return `
    <div class="page-head"><div><div class="eyebrow">${IC('book', 13)} Plan</div><h1>Peer practice library</h1><p>Validated practices from assessed organisations, matched to your gaps by industry, size and maturity. Organisations share practices with consent. Results are verified at assessment.</p></div>
      <div class="actions"><div class="seg">${[['gaps', 'Matched to my gaps'], ['all', 'All practices']].map(([k, l]) => `<button class="${S.practiceFilter === k ? 'on' : ''}" data-pf="${k}">${l}</button>`).join('')}</div></div></div>
    <div class="grid g3">${list.sort((a, b) => b.match - a.match).map(p => { const t = H.T(p.topic); return `<div class="card pcard">
      <div class="row between"><span class="chip" style="background:${t.color}1A;color:${t.color}">${t.name}</span><span class="match">${p.match}% match</span></div>
      <h4>${p.title}</h4><div class="tiny muted">${IC('building', 12)} ${p.co} · ${p.size}</div>
      <div class="res">${IC('trend', 15)} ${p.result}</div>
      <div class="small muted" style="flex:1">${p.body}</div>
      <div class="row wrap" style="gap:6px"><span class="chip outline">Effort: ${p.effort}</span><span class="chip outline">${IC('clock', 11)} ${p.time}</span></div>
      <div class="row" style="gap:8px;margin-top:4px"><button class="btn sec sm" data-ask="How would ${p.co}'s practice on ${t.name} apply to Helix?">${IC('sparkles', 13)} Apply to Helix</button><button class="btn ghost sm" data-action="${p.topic === 'OC' ? 'addIberia' : 'practiceAdd'}">${IC('plus', 13)} Add to roadmap</button></div>
    </div>`; }).join('')}</div>`;
  };
  V.after_practices = () => H.$$('[data-pf]').forEach(b => b.onclick = () => { S.practiceFilter = b.dataset.pf; H.render(); });
  V.actions.practiceAdd = () => H.toast('Already covered by an initiative on your roadmap. Linked as the reference practice.', 'link');

  /* ======================= OUTCOMES ======================= */
  V.outcomes = () => {
    const O = D.outcomes;
    const lbl = O.months.map((m, i) => m + (i === 0 || i === 12 ? (i ? " '27" : " '26") : ''));
    return `
    <div class="page-head"><div><div class="eyebrow">${IC('trend', 13)} Prove</div><h1>Outcomes: is it working?</h1><p>Pathfinder connects initiative milestones with your HRIS and engagement data, comparing pilot and non-pilot countries so you can see real business impact.</p></div>
      <div class="actions"><span class="chip ok">${IC('db', 12)} Workday · synced today</span><span class="chip ok">${IC('msg', 12)} Glint · Q2 2027</span><span class="chip outline">${IC('plus', 12)} Connect ATS</span></div></div>
    <div class="grid g4">
      <div class="card kpi"><div class="lbl">New-hire 90-day attrition · pilot</div><div class="val">5.4%</div><div class="foot"><span class="delta up">▼ 4.6 pts</span> vs 10.0% baseline</div></div>
      <div class="card kpi"><div class="lbl">Same metric · non-pilot</div><div class="val">8.5%</div><div class="foot"><span class="delta flat">▼ 1.1 pts</span> market drift</div></div>
      <div class="card kpi"><div class="lbl">Voluntary attrition (12m)</div><div class="val">11.2%</div><div class="foot"><span class="delta up">▼ 2.2 pts</span> since Jan 2026</div></div>
      <div class="card kpi"><div class="lbl">Manager effectiveness · pilot</div><div class="val">76</div><div class="foot"><span class="delta up">▲ 10</span> vs 66 non-pilot</div></div>
    </div>
    <div class="grid g12 mt">
      <div class="card s8" id="t-outcome"><div class="card-h"><h3>New-hire 90-day attrition</h3><span class="sub">pilot (DE, CH) vs other countries</span><div class="r"><div class="legend"><span><i style="background:#5B4BF5"></i>Pilot countries</span><span><i style="background:#9AA1B9"></i>Other countries</span></div></div></div>
        <div class="card-b">${CH.line([{ color: '#9AA1B9', values: O.newHireAttrOther, w: 2, dash: true }, { color: '#5B4BF5', values: O.newHireAttrPilot, area: true }], lbl, { h: 250, min: 4, max: 12, suffix: '%', bands: [{ from: 12, to: 17, label: 'Onboarding journey live' }] })}</div></div>
      <div class="card ai s4"><div class="card-h"><span class="ai-tag">${IC('sparkles', 14)} What this means</span></div><div class="card-b small">
        <p>In pilot countries, new-hire attrition fell <b>46%</b> after the 90-day journey went live. Other countries fell only 11% over the same period, so most of the effect is <b>attributable to the initiative</b>.</p>
        <div class="blk" style="margin-top:12px"><div class="tiny muted" style="margin-bottom:6px">VALUE ESTIMATE · METHOD</div>
          <div class="row between"><span>Attrition reduction</span><b>2.2 pts</b></div>
          <div class="row between"><span>× workforce</span><b>8,400</b></div>
          <div class="row between"><span>= leavers avoided / yr</span><b>~185</b></div>
          <div class="row between"><span>× replacement cost</span><b>€12.5k</b></div>
          <div class="row between" style="border-top:1px solid var(--line);margin-top:6px;padding-top:6px"><span class="b">Annual value</span><b style="color:var(--green)">≈ €2.3M</b></div></div>
        <p class="tiny muted" style="margin-top:10px">Compares pilot and non-pilot countries, controlling for function and seniority. This shows correlation and is directional, not causal proof.</p>
        <button class="btn sec sm" style="margin-top:8px" data-go="report">${IC('present', 13)} Add to board report</button></div></div>
    </div>
    <div class="grid g2 mt">
      <div class="card"><div class="card-h"><h3>eNPS</h3><span class="sub">quarterly · Glint</span></div><div class="card-b">${CH.vbars(O.enpsQ.labels.map((l, i) => ({ label: l, value: O.enpsQ.values[i], color: i >= 4 ? '#5B4BF5' : '#C9C3FF' })), { h: 210, max: 32 })}</div></div>
      <div class="card"><div class="card-h"><h3>Manager effectiveness</h3><span class="sub">Manager Excellence pilot vs others</span></div><div class="card-b">${CH.line([{ color: '#9AA1B9', values: O.mgrEffect.other, dash: true, w: 2 }, { color: '#14B8A6', values: O.mgrEffect.pilot, area: true }], O.mgrEffect.labels, { h: 210, min: 60, max: 80, markers: [{ x: 4, label: 'Pilot cohort' }] })}</div></div>
    </div>`;
  };

  /* ======================= BOARD REPORT ======================= */
  V.report = () => `
    <div class="page-head"><div><div class="eyebrow">${IC('present', 13)} Prove</div><h1>Board report builder</h1><p>Turn live data into a board-ready narrative in one click: where we stand, what we're doing, early proof, and the decisions we need.</p></div>
      <div class="actions">${S.reportReady ? `<button class="btn sec" data-action="printReport">${IC('download', 15)} Export PDF</button>` : ''}<button class="btn pri" data-action="genReport">${IC('sparkles', 15)} ${S.reportReady ? 'Regenerate' : 'Generate report'}</button></div></div>
    <div class="grid g12">
      <div class="card s3"><div class="card-h"><h3>Settings</h3></div><div class="card-b">
        <div class="tiny muted" style="margin-bottom:6px">AUDIENCE</div><div class="seg" style="margin-bottom:16px"><button class="on">Board</button><button>ExCo</button><button>Country HR</button></div>
        <div class="tiny muted" style="margin-bottom:6px">SECTIONS</div>
        ${['Where we stand', 'Roadmap & progress', 'Early proof of impact', 'Risks & decisions', 'Peer benchmark appendix'].map((s, k) => `<label class="row small" style="padding:6px 0"><input type="checkbox" ${k < 4 ? 'checked' : ''} style="accent-color:#5B4BF5"> ${s}</label>`).join('')}
        <div class="tiny muted" style="margin:14px 0 6px">TONE</div><select class="sel" style="width:100%"><option>Concise & data-led</option><option>Narrative</option></select>
        <div class="empty-reason small muted" style="margin-top:16px">${IC('shield', 14)} Every number links back to its source in Pathfinder.</div>
      </div></div>
      <div class="s9" style="grid-column:span 9" id="report-area">${S.reportReady ? slidesHTML() : `<div class="card" style="height:100%;min-height:420px;display:grid;place-items:center;text-align:center"><div><div class="ai-av" style="margin:0 auto 12px;width:52px;height:52px">${IC('present', 24)}</div><b style="font-size:16px">Your Q3 board update, ready in about 10 seconds</b><div class="small muted" style="margin:6px 0 16px">6 slides built from live results, roadmap and outcomes data</div><button class="btn pri" data-action="genReport">${IC('sparkles', 15)} Generate report</button></div></div>`}</div>
    </div>`;
  function slides() {
    const o = D.overall, proj = H.projected();
    const top = gaps().slice(0, 4);
    return [
      `<div class="slide dark"><div class="sl-k">${D.client.name} · Board of Directors · Q3 2027</div><div style="margin-top:auto;margin-bottom:auto"><h2 style="font-size:clamp(22px,3vw,40px)">People Strategy Update</h2><div style="color:#C9CEF0;margin-top:10px;font-size:clamp(11px,1.2vw,15px)">Assessment results, 2027 roadmap progress and early business impact</div><div style="margin-top:18px;font-size:12px;color:#C9CEF0">Presented by ${D.client.user.name}, ${D.client.user.role}</div></div><div class="sl-foot"><span>Confidential</span><span>Generated by Pathfinder · ${D.client.today}</span></div></div>`,
      `<div class="slide"><div class="sl-k">1 · Where we stand</div><h2>Above the median, but slipping behind where peers are heading</h2><div style="display:grid;grid-template-columns:1fr 1.3fr;gap:4%;margin-top:3%;flex:1;align-items:center"><div><div style="font-size:clamp(30px,5vw,64px);font-weight:800;letter-spacing:-.03em;color:#5B4BF5">${o.s}</div><div class="small muted">overall score · peer median ${o.m} · top quartile ${o.t}</div><div class="small" style="margin-top:10px">Strengths: <b>Employer Branding 91</b>, <b>Learning 88</b>, <b>Purpose 87</b></div></div><div>${top.map(t => `<div style="margin-bottom:10px"><div class="row between small"><b>${t.name}</b><span style="color:var(--rose);font-weight:700">${t.gap} vs peers</span></div>${H.cmp(t)}</div>`).join('')}</div></div><div class="sl-foot"><span>Source: Northstar assessment ${D.client.certYear} · ${D.client.peerCount} pharma peers</span><span>2</span></div></div>`,
      `<div class="slide"><div class="sl-k">2 · What we are doing</div><h2>6 initiatives target our 4 largest gaps, projected to lift us to ${proj}</h2><div style="margin-top:3%;flex:1">${S.inits.map(i => `<div class="row" style="gap:10px;margin-bottom:8px"><span class="small b" style="width:42%">${i.name}</span><div class="bar ${i.status === 'at-risk' ? 'warn' : ''}" style="flex:1"><i style="width:${i.progress}%"></i></div><span class="small mono" style="width:40px">${i.progress}%</span>${H.status(i.status)}</div>`).join('')}</div><div class="sl-foot"><span>€${S.inits.length > 6 ? '1.43' : '1.25'}M total budget · ${H.milestones().d}/${H.milestones().t} milestones delivered</span><span>3</span></div></div>`,
      `<div class="slide"><div class="sl-k">3 · Early proof</div><h2>Onboarding pilot cut new-hire attrition by 46%, worth ≈ €2.3M a year</h2><div style="display:grid;grid-template-columns:1.6fr 1fr;gap:4%;margin-top:2%;flex:1;align-items:center"><div>${CH.line([{ color: '#9AA1B9', values: D.outcomes.newHireAttrOther, w: 2, dash: true }, { color: '#5B4BF5', values: D.outcomes.newHireAttrPilot, area: true }], D.outcomes.months, { h: 200, min: 4, max: 12, suffix: '%', bands: [{ from: 12, to: 17 }] })}</div><div class="small"><div style="margin-bottom:10px"><b style="font-size:22px;color:#16A34A">−46%</b><div class="muted">new-hire attrition, pilot countries</div></div><div style="margin-bottom:10px"><b style="font-size:22px;color:#5B4BF5">+9</b><div class="muted">eNPS in 2 quarters</div></div><div><b style="font-size:22px;color:#0EA5A4">+10</b><div class="muted">manager effectiveness (pilot)</div></div></div></div><div class="sl-foot"><span>Source: Workday, Glint · pilot vs non-pilot comparison</span><span>4</span></div></div>`,
      `<div class="slide"><div class="sl-k">4 · Decisions we need</div><h2>Three decisions to stay on track for global scope in 2028</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:3%;margin-top:4%;flex:1">${[['€85k', 'Approve the Wellbeing budget centrally for FR, IT and BR', 'Unblocks our 2nd-largest gap'], ['100 days', 'Sponsor the Iberia Bio people integration', '700 people are outside core programmes'], ['Global', 'Extend the 2028 assessment to global scope', 'US, IN, BR, JP and SG are above threshold']].map(x => `<div style="border:1px solid var(--line);border-radius:12px;padding:8%"><div style="font-size:clamp(18px,2.4vw,30px);font-weight:800;color:#5B4BF5">${x[0]}</div><div class="small b" style="margin-top:6px">${x[1]}</div><div class="tiny muted" style="margin-top:4px">${x[2]}</div></div>`).join('')}</div><div class="sl-foot"><span>Recommended by Pathfinder · approved for circulation by ${D.client.user.name}</span><span>5</span></div></div>`,
    ];
  }
  function slidesHTML() {
    const s = slides();
    return `<div class="card"><div class="card-b"><div class="slides-nav">${['Title', 'Where we stand', 'What we\'re doing', 'Early proof', 'Decisions'].map((l, k) => `<button class="${k === 0 ? 'on' : ''}" data-slide="${k}">${k + 1}. ${l}</button>`).join('')}<span class="chip ok" style="margin-left:auto">${IC('check', 11, 3)} 5 slides · generated just now</span></div><div id="slide-view">${s[0]}</div>
      <div class="row between mt"><button class="btn sec sm" data-action="slidePrev">← Previous</button><span class="tiny muted">Use ← → keys</span><button class="btn sec sm" data-action="slideNext">Next →</button></div></div></div>`;
  }
  let slideIdx = 0;
  function showSlide(k) { const s = slides(); slideIdx = (k + s.length) % s.length; $('#slide-view').innerHTML = s[slideIdx]; H.$$('[data-slide]').forEach(b => b.classList.toggle('on', +b.dataset.slide === slideIdx)); }
  V.after_report = () => {
    slideIdx = 0;
    H.$$('[data-slide]').forEach(b => b.onclick = () => showSlide(+b.dataset.slide));
    document.onkeydown = e => { if (H.route() !== 'report' || !$('#slide-view')) return; if (e.key === 'ArrowRight') showSlide(slideIdx + 1); if (e.key === 'ArrowLeft') showSlide(slideIdx - 1); };
  };
  V.actions.slideNext = () => showSlide(slideIdx + 1);
  V.actions.slidePrev = () => showSlide(slideIdx - 1);
  V.actions.genReport = async () => {
    const area = $('#report-area');
    const steps = ['Pulling live assessment and benchmark data', 'Summarising roadmap progress across 6 initiatives', 'Quantifying outcomes from Workday and Glint', 'Drafting a narrative for a board audience', 'Building 5 slides with sources'];
    area.innerHTML = `<div class="card" style="min-height:420px;display:grid;place-items:center"><div style="width:380px">${steps.map((s, k) => `<div class="rs-step" id="g${k}"><div class="ic">${IC('clock', 12)}</div>${s}</div>`).join('')}</div></div>`;
    for (let k = 0; k < steps.length; k++) { const el = $('#g' + k); if (!el) return; el.classList.add('on'); await H.sleep(420); el.classList.remove('on'); el.classList.add('done'); el.querySelector('.ic').innerHTML = IC('check', 12, 3); }
    S.reportReady = true; H.render(); H.toast('Board report generated: 5 slides', 'present');
  };
  V.actions.printReport = () => {
    const p = $('#print'); p.innerHTML = slides().join(''); p.style.display = 'block';
    setTimeout(() => { window.print(); p.style.display = 'none'; }, 100);
  };

  /* ======================= READINESS ======================= */
  V.readiness = () => {
    const doms = [['Strategy & Leadership', 44, 30, 9, 5], ['Talent Acquisition', 34, 26, 5, 3], ['Learning & Growth', 42, 27, 10, 5], ['Wellbeing & Engagement', 32, 15, 9, 8], ['Work Environment', 30, 21, 6, 3], ['Inclusion & Purpose', 32, 18 + S.uploads.length, 8, 6]];
    const pre = doms.reduce((a, d) => a + d[2], 0), tot = doms.reduce((a, d) => a + d[1], 0), pct = Math.round(pre / tot * 100);
    return `
    <div class="page-head"><div><div class="eyebrow">${IC('shield', 13)} Next cycle</div><h1>Next assessment readiness · 2028 cycle</h1><p>Evidence and progress captured during the year pre-fill next year's survey, so the next assessment takes weeks, not months.</p></div>
      <div class="actions"><span class="chip warn">${IC('clock', 12)} Survey opens ${D.client.nextSurveyOpens} · deadline ${D.client.nextSurveyDeadline}</span></div></div>
    <div class="grid g12">
      <div class="card hero s5" id="t-ready"><div class="card-b row" style="gap:22px;padding:22px">
        <div style="position:relative">${CH.ring(pct, 150, 14)}<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center"><div><div style="font-size:34px;font-weight:800">${pct}%</div><div class="tiny muted">pre-filled</div></div></div></div>
        <div style="flex:1"><div class="b" style="font-size:16px">${pre} of ${tot} survey items are already answered</div><div class="small muted" style="margin-top:4px">From initiative evidence, HRIS data and last year's validated answers.</div>
          <div class="grid g2" style="gap:10px;margin-top:14px"><div><div class="tiny muted">Time saved</div><b style="font-size:18px">~6 weeks</b></div><div><div class="tiny muted">Evidence auto-mapped</div><b style="font-size:18px">${52 + S.uploads.length} docs</b></div><div><div class="tiny muted">Need review</div><b style="font-size:18px">47 items</b></div><div><div class="tiny muted">Missing evidence</div><b style="font-size:18px">${30 - S.uploads.length} items</b></div></div></div></div></div>
      <div class="card s7"><div class="card-h"><h3>By domain</h3><div class="r legend"><span><i style="background:#5B4BF5"></i>Pre-filled</span><span><i style="background:#FBBF24"></i>Needs review</span><span><i style="background:#FDA4AF"></i>Missing</span></div></div><div class="card-b">
        ${doms.map(d => `<div style="margin-bottom:13px"><div class="row between small"><b>${d[0]}</b><span class="muted mono">${d[2]}/${d[1]}</span></div><div style="display:flex;height:9px;border-radius:9px;overflow:hidden;margin-top:5px;background:var(--line2)"><div style="width:${d[2] / d[1] * 100}%;background:linear-gradient(90deg,#5B4BF5,#8B5CF6)"></div><div style="width:${d[3] / d[1] * 100}%;background:#FBBF24"></div><div style="width:${d[4] / d[1] * 100}%;background:#FDA4AF"></div></div></div>`).join('')}
      </div></div>
    </div>
    <div class="grid g12 mt">
      <div class="card s5" id="t-upload"><div class="card-h"><h3>Add evidence</h3><span class="sub">AI maps it to survey items</span></div><div class="card-b">
        <div class="drop" id="drop" data-action="upload"><div class="ai-av" style="margin:0 auto 10px">${IC('upload', 18)}</div><b>Drop a policy, report or deck</b><div class="small muted">or click to try a sample: <u>Wellbeing_Policy_2027.pdf</u></div></div>
        <div id="up-res"></div>
        <div class="list" style="margin-top:8px">${S.uploads.map(u => `<div class="file-row"><div class="file-ico">${IC('file', 16)}</div><div style="flex:1"><div class="small b">${u}</div><div class="tiny muted">Mapped to WB-04, WB-08 · just now</div></div><span class="chip ok">mapped</span></div>`).join('')}</div>
      </div></div>
      <div class="card s7"><div class="card-h"><h3>Items that need attention</h3><span class="sub">prioritised by score impact</span></div><div class="card-b" style="padding-top:6px"><div class="list">
        ${[['ok', 'check', 'ON-07', D.surveyItems['ON-07'], 'Now met: pre-boarding app live in 12 countries (auto-detected)', 'Auto-answered'], ['warn', 'alert', 'WB-04', D.surveyItems['WB-04'], 'Partial: live in 7 of 12 countries. FR, IT, BR, US and JP are pending.', 'Needs review'], ['warn', 'alert', 'LD-06', D.surveyItems['LD-06'], 'Partial: mandatory in DE and CH. Wave 1 rollout is due in Aug.', 'Needs review'], ['risk', 'x', 'SU-03', D.surveyItems['SU-03'], 'Evidence pending: succession plans due in Sep', 'Missing'], ['ok', 'check', 'ON-05', D.surveyItems['ON-05'], 'Now met: Onboarding_Policy_2027.pdf (signed off in May)', 'Auto-answered']].map(x => `<div class="li"><div class="li-ico ${x[0]}">${IC(x[1], 15)}</div><div style="flex:1"><div class="row between"><span class="small"><b>${x[2]}</b> · ${x[3]}</span><span class="chip ${x[0] === 'ok' ? 'ok' : x[0] === 'warn' ? 'warn' : 'risk'}">${x[5]}</span></div><div class="tiny muted" style="margin-top:3px">${x[4]}</div></div></div>`).join('')}
      </div></div></div>
    </div>`;
  };
  V.actions.upload = async () => {
    const name = 'Wellbeing_Policy_2027.pdf';
    if (S.uploads.includes(name)) return H.toast('Already mapped. Try dropping your own file.', 'file');
    const r = $('#up-res');
    const steps = ['Reading 14 pages', 'Extracting policy clauses', 'Matching to 214 survey items', 'Checking evidence quality'];
    r.innerHTML = `<div class="blk">${steps.map((s, k) => `<div class="rs-step" id="u${k}"><div class="ic">${IC('clock', 12)}</div>${s}</div>`).join('')}</div>`;
    for (let k = 0; k < steps.length; k++) { const el = $('#u' + k); if (!el) return; el.classList.add('on'); await H.sleep(450); el.classList.remove('on'); el.classList.add('done'); el.querySelector('.ic').innerHTML = IC('check', 12, 3); }
    r.innerHTML = `<div class="blk"><b class="small">${IC('file', 14)} ${name}</b><div class="tiny muted" style="margin:4px 0 8px">Pathfinder found evidence for 2 survey items</div>
      <div class="row between small" style="padding:5px 0"><span><b>WB-04</b> Mental health support in all locations</span><span class="chip ok">94% match</span></div>
      <div class="row between small" style="padding:5px 0"><span><b>WB-08</b> Wellbeing impact measured & reported</span><span class="chip warn">71%, add the KPI appendix</span></div>
      <div class="acts"><button class="btn pri sm" data-action="confirmUpload">Confirm mapping</button><button class="btn ghost sm">Edit</button></div></div>`;
  };
  V.actions.confirmUpload = () => { S.uploads.push('Wellbeing_Policy_2027.pdf'); H.render(); H.toast('Evidence mapped. Readiness updated.', 'shield'); };

  /* ======================= ADVISOR ======================= */
  V.advisor = () => {
    const C = D.advisorClients, sel = C[S.advisorSel];
    const arr = C.reduce((a, c) => a + c.arr, 0);
    return `
    <div class="page-head"><div><div class="eyebrow" style="color:var(--sky)">${IC('brief', 13)} Northstar Workplace Institute · internal</div><h1>Client portfolio</h1><p>The same data that helps clients also tells advisors who needs help, who is at risk and where to expand. Every signal comes from real product usage.</p></div>
      <div class="actions"><div class="row" style="gap:8px"><div class="avatar adv sm">JO</div><div class="small"><b>James Okafor</b><div class="tiny muted">Senior Strategic Advisor · EMEA</div></div></div></div></div>
    <div class="grid g4">
      <div class="card kpi"><div class="lbl">Portfolio ARR</div><div class="val">€${arr}k</div><div class="foot"><span class="delta up">▲ 18%</span> YoY</div></div>
      <div class="card kpi"><div class="lbl">Avg. client health</div><div class="val">${Math.round(C.reduce((a, c) => a + c.health, 0) / C.length)}</div><div class="foot">usage · progress · sentiment</div></div>
      <div class="card kpi"><div class="lbl">Renewals at risk</div><div class="val" style="color:var(--rose)">2</div><div class="foot">€93k ARR · next 6 months</div></div>
      <div class="card kpi"><div class="lbl">Expansion pipeline</div><div class="val" style="color:var(--green)">€96k</div><div class="foot">5 signals from product usage</div></div>
    </div>
    <div class="grid g12 mt">
      <div class="card s7" id="t-portfolio"><div class="card-b" style="padding:0"><table class="tbl"><thead><tr><th style="padding-left:18px">Client</th><th>ARR</th><th>Health</th><th>Weekly users</th><th>Stage</th><th>Renewal</th></tr></thead><tbody>
        ${C.map((c, k) => `<tr class="click" data-action="advSel" data-k="${k}" style="${k === S.advisorSel ? 'background:#FAF9FF' : ''}"><td style="padding-left:18px;${k === S.advisorSel ? 'box-shadow:inset 3px 0 0 #5B4BF5' : ''}"><div class="b">${c.name}</div><div class="tiny muted">${c.ind} · ${c.seal}</div></td><td class="mono b">€${c.arr}k</td>
          <td><div class="row" style="gap:8px"><b class="mono" style="color:${c.health < 50 ? 'var(--rose)' : c.health < 65 ? 'var(--amber)' : 'var(--green)'}">${c.health}</b>${CH.spark(c.trend, c.health < 50 ? '#E11D48' : c.health < 65 ? '#D97706' : '#16A34A', 70, 24)}</div></td>
          <td class="mono small">${c.wau}</td><td><span class="chip ${c.stage === 'Lead' ? 'teal' : c.stage === 'Fix' ? 'warn' : 'info'}">${c.stage}</span></td><td class="small">${c.renewal}</td></tr>`).join('')}
      </tbody></table></div></div>
      <div class="card ai s5"><div class="card-h"><span class="ai-tag">${IC('sparkles', 14)} Account brief · ${sel.name}</span></div><div class="card-b">
        <div class="li" style="padding-top:0"><div class="li-ico ${sel.signal.type === 'risk' ? 'risk' : 'ok'}">${IC(sel.signal.type === 'risk' ? 'alert' : 'zap', 16)}</div><div><b class="small">${sel.signal.type === 'risk' ? 'Churn signal' : 'Opportunity'}</b><div class="small muted">${sel.signal.text}</div></div></div>
        ${sel.upsell ? `<div class="li"><div class="li-ico info">${IC('trend', 16)}</div><div><b class="small">Expansion</b><div class="small muted">${sel.upsell}</div></div></div>` : ''}
        ${S.advisorSel === 0 ? `<div class="blk small"><div class="tiny muted" style="margin-bottom:6px">QBR PREP · GENERATED FROM PRODUCT DATA</div>
          <div style="margin-bottom:6px"><b>Wins to celebrate:</b> onboarding pilot cut new-hire attrition by 46%. 37 weekly users (top 15% of clients).</div>
          <div style="margin-bottom:6px"><b>Risks:</b> Wellbeing is 6 weeks late. The Iberia Bio acquisition isn't integrated yet.</div>
          <div><b>Recommended plays:</b><br>1. Wellbeing Deep-Dive session (€18k)<br>2. Global scope for the 2028 cycle (+€24k ARR)<br>3. Invite Maria to speak at Summit about onboarding</div></div>
          <div class="acts"><button class="btn pri sm" data-action="advBook">${IC('clock', 13)} Book QBR with Maria</button><button class="btn sec sm" data-go="overview">Open client workspace</button></div>` : `<div class="acts"><button class="btn pri sm" data-action="advBook">${IC('clock', 13)} Schedule outreach</button></div>`}
      </div></div>
    </div>
    <div class="card mt"><div class="card-h"><h3>How the product feeds the Northstar business</h3></div><div class="card-b"><div class="grid g4" style="gap:12px">
      ${[['users', 'Usage → retention', 'Weekly use outside assessment season is the best predictor of renewal'], ['zap', 'Signals → advisory', 'Stuck initiatives and repeated questions become qualified advisory leads'], ['globe', 'Progress → scope expansion', 'Countries that cross the threshold trigger regional or global scope upsells'], ['db', 'Outcomes → data moat', 'Which interventions actually work, across 2,500 clients, is a dataset no competitor has']].map(x => `<div class="empty-reason"><div class="li-ico info" style="margin-bottom:8px">${IC(x[0], 16)}</div><b class="small">${x[1]}</b><div class="tiny muted" style="margin-top:3px">${x[2]}</div></div>`).join('')}
    </div></div></div>`;
  };
  V.actions.advSel = el => { S.advisorSel = +el.dataset.k; H.render(); };
  V.actions.advBook = () => H.toast('Meeting request drafted (demo)', 'clock');

  /* ======================= VISION ======================= */
  V.vision = () => `
    <div class="page-head"><div><div class="eyebrow">${IC('layers', 13)} Product vision</div><h1>Why Pathfinder exists</h1><p>The product thinking behind this prototype: the problem, users, solution, business model, metrics and rollout.</p></div></div>
    <div class="card hero"><div class="card-b" style="padding:28px">
      <div class="grid g3" style="gap:24px">
        <div><div class="tiny muted">THE PROBLEM</div><div class="b" style="font-size:17px;margin-top:6px">The annual assessment delivers value once a year</div><div class="small muted" style="margin-top:6px">Survey → audit → report → silence for 9 months. Insights sit in a PDF, renewal gets harder to justify, and advisory is the only way to act on the insights. That needs one advisor per engagement.</div></div>
        <div><div class="tiny muted">THE INSIGHT</div><div class="b" style="font-size:17px;margin-top:6px">The data is the asset. The workflow is missing.</div><div class="small muted" style="margin-top:6px">Validated practice data from ~2,500 organisations is unique. What's missing is the layer that turns it into decisions, execution and proof all year round.</div></div>
        <div><div class="tiny muted">THE PRODUCT</div><div class="b" style="font-size:17px;margin-top:6px">An always-on HR Roadmap Copilot</div><div class="small muted" style="margin-top:6px">Diagnose → Plan → Execute → Prove → Next cycle, in one loop. AI does the analysis, and HR leaders make the decisions.</div></div>
      </div></div></div>
    <div class="grid g12 mt">
      <div class="card s6"><div class="card-h"><h3>Users & jobs to be done</h3></div><div class="card-b"><table class="tbl"><tbody>
        ${[['Chief People Officer', 'Set priorities, win board support, prove ROI'], ['Country HR leads', 'Know local gaps, execute, report progress'], ['HR business partners', 'Bring data-backed advice to business leaders'], ['Northstar advisors', 'Spot clients who need help, prepare in minutes'], ['Northstar account managers', 'Predict churn, find expansion']].map(r => `<tr><td class="b small" style="padding-left:0">${r[0]}</td><td class="small muted">${r[1]}</td></tr>`).join('')}</tbody></table></div></div>
      <div class="card s6"><div class="card-h"><h3>Success metrics</h3></div><div class="card-b"><div class="list">
        ${[['North star', 'Monthly active client accounts outside assessment season', 'target 60%'], ['Retention', 'Gross revenue retention', '88% → 94%'], ['Expansion', 'Net revenue retention (scope upgrades, add-ons)', '→ 112%'], ['Client value', 'Avg. score uplift of copilot clients vs non-users', '+2.5 pts'], ['Efficiency', 'Survey completion time / audit hours per client', '−40% / −30%']].map(r => `<div class="row" style="padding:9px 0"><span class="chip info" style="width:86px;justify-content:center">${r[0]}</span><span class="small" style="flex:1">${r[1]}</span><b class="small">${r[2]}</b></div>`).join('')}
      </div></div></div>
    </div>
    <div class="grid g12 mt">
      <div class="card s7"><div class="card-h"><h3>Packaging</h3><span class="sub">illustrative</span></div><div class="card-b"><div class="grid g3" style="gap:12px">
        ${[['Assess', 'Today\'s programme', ['Survey + validation', 'Employer-brand kit', 'Static results report']], ['Assess + Pathfinder', 'Recommended', ['Ask your results (AI)', 'AI roadmap & tracker', 'Board reports', 'Pre-filled next assessment']], ['Enterprise', 'Global groups', ['Multi-country workspace', 'HRIS & engagement integrations', 'Outcome analytics', 'Advisory hours included']]].map((p, k) => `<div class="empty-reason" style="${k === 1 ? 'border:2px solid #8B5CF6;background:#FBFAFF' : ''}"><b>${p[0]}</b><div class="tiny muted">${p[1]}</div><div style="margin-top:8px">${p[2].map(f => `<div class="small row" style="gap:6px;padding:3px 0"><span style="color:var(--green)">${IC('check', 13, 3)}</span>${f}</div>`).join('')}</div></div>`).join('')}
      </div></div></div>
      <div class="card s5"><div class="card-h"><h3>Rollout</h3></div><div class="card-b"><div class="list">
        ${[['Phase 1 · MVP', 'Ask your results + roadmap generator on existing assessment data', '1 quarter'], ['Phase 2', 'Initiative tracker, countries, board reports, pre-filled survey', '+2 quarters'], ['Phase 3', 'HRIS integrations, outcome analytics, advisor console, partner marketplace', '+2 quarters']].map((r, k) => `<div class="li"><div class="li-ico ${['info', 'teal', 'ok'][k]}">${k + 1}</div><div style="flex:1"><b class="small">${r[0]}</b><div class="tiny muted">${r[1]}</div></div><span class="chip outline">${r[2]}</span></div>`).join('')}
      </div></div></div>
    </div>
    <div class="card mt"><div class="card-h"><h3>Risks & how the design handles them</h3></div><div class="card-b"><div class="grid g4" style="gap:12px">
      ${[['lock', 'Confidentiality', 'Peer data is only shown in groups of 10+ organisations and never identifies a company'], ['link', 'AI accuracy', 'Answers come only from client and benchmark data, cite survey items, and are approved by a human'], ['brief', 'Advisory cannibalisation', 'The copilot produces advisory leads instead of replacing advisors'], ['users', 'Adoption', 'Board reports and a pre-filled next assessment give HR teams a reason to log in every week']].map(x => `<div class="empty-reason"><div class="li-ico warn" style="margin-bottom:8px">${IC(x[0], 16)}</div><b class="small">${x[1]}</b><div class="tiny muted" style="margin-top:3px">${x[2]}</div></div>`).join('')}
    </div></div></div>`;

  V.actions.clearChat = () => { S.chat = []; COP.mount(); };
})();
