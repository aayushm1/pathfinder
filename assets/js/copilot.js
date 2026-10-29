/* Ask Pathfinder: grounded, scripted AI analyst for the demo */
(function () {
  const D = window.D, $ = H.$;
  let busy = false;

  const STARTERS = [
    ['chart', 'What are our 3 biggest gaps vs pharma peers?', 'Benchmark against 46 peers'],
    ['search', 'Why did our Onboarding score drop?', 'Root cause from survey items'],
    ['star', 'What do top performers do on Wellbeing?', 'Practices from peers'],
    ['globe', 'Which country is lagging and why?', 'Country-level view'],
    ['present', 'Summarise our position for my CEO', 'Exec-ready summary'],
    ['trend', 'Is the roadmap actually working?', 'Outcomes from Workday & Glint'],
  ];

  const pct = (a, b) => Math.round((a - b) / b * 100);
  const topicByText = q => D.topics.find(t => q.toLowerCase().includes(t.name.toLowerCase())) || D.topics.find(t => q.toLowerCase().includes(t.name.toLowerCase().split(' ')[0]) && t.name.split(' ')[0].length > 4);
  const initFor = id => S.inits.find(i => i.topic === id || (i.also || []).includes(id));

  /* ---------- intents ---------- */
  const R = {};
  R.gaps = () => {
    const g = D.topics.map(t => ({ ...t, gap: t.s - t.m })).sort((a, b) => a.gap - b.gap).slice(0, 4);
    return {
      think: ['Reading 20 topic scores from your 2027 results', 'Comparing with 46 peers · Pharma & Life Sciences · Europe', 'Ranking gaps by size and business impact'],
      text: `<p>Against your <b>46 pharma peers</b>, your three biggest gaps are <b>Onboarding (−16)</b>, <b>Leadership (−14)</b> and <b>Wellbeing (−11)</b>, with Succession close behind.</p><p>They're connected. Weak first-line leadership shows up in onboarding experience, wellbeing and succession readiness. That's why your roadmap puts the <b>Manager Excellence Programme</b> at the centre.</p>`,
      blocks: [{ type: 'bars', rows: g }],
      cites: ['Assessment 2027 · validated scores', 'Peer benchmark · n=46', 'LD-02', 'ON-03', 'WB-04'],
      actions: [{ l: 'Open roadmap', a: 'data-go="roadmap"', pri: 1 }, { l: 'See all topics', a: 'data-go="results"' }],
      fu: ['Why did our Onboarding score drop?', 'What do top performers do on Wellbeing?', 'What if we deliver the whole roadmap?'],
    };
  };
  R.onboarding = () => ({
    think: ['Loading Onboarding answers: 2026 vs 2027 cycle', 'Checking 9 onboarding survey items and evidence log', 'Comparing country-level onboarding scores'],
    text: `<p>Onboarding fell from <b>71 to 58</b> (−13). Three things drove it:</p>
      <p><b>1. The standard moved.</b> The 2027 standard added <b>ON-07 · digital pre-boarding</b>. Helix had no pre-boarding before day one, while 64% of peers already did.</p>
      <p><b>2. Inconsistent rollout.</b> <b>ON-03</b> (structured 90-day plan) and <b>ON-09</b> (buddy for every new hire) were only met in Germany and Switzerland. Spain (52) and Brazil (55) pulled the average down.</p>
      <p><b>3. Evidence was rejected.</b> Your onboarding policy for <b>ON-05</b> was dated 2021, outside the 24-month window, so auditors scored it as not evidenced.</p>
      <p>The good news: all three are fixable in one cycle. Your <b>90-Day Onboarding Journey</b> initiative is 80% complete and has already cut new-hire attrition by 46% in pilot countries.</p>`,
    blocks: [{ type: 'table', head: ['Survey item', '2026', '2027', 'Now'], rows: [['ON-03 · 90-day plan in all countries', 'Partial', 'Partial', '<span class="chip ok">10/12 countries</span>'], ['ON-05 · Policy reviewed < 24 months', 'Met', '<span style="color:var(--rose)">Not evidenced</span>', '<span class="chip ok">Fixed · May</span>'], ['ON-07 · Digital pre-boarding (new)', '—', '<span style="color:var(--rose)">Not met</span>', '<span class="chip ok">Live</span>'], ['ON-09 · Buddy for every new hire', 'Partial', 'Partial', '<span class="chip warn">ES, BR, IN pending</span>']] }],
    cites: ['ON-03', 'ON-05', 'ON-07', 'ON-09', 'Auditor notes · 2027', 'Country scores'],
    actions: [{ l: 'Open onboarding initiative', a: 'data-open-init="I2"', pri: 1 }, { l: 'See Corvane Pharma\'s practice', a: 'data-go="practices"' }],
    fu: ['Which country is lagging and why?', 'Is the roadmap actually working?', 'How ready are we for the next assessment?'],
  });
  R.leadership = () => {
    const t = H.T('LD');
    return {
      think: ['Loading Leadership topic and related items', 'Comparing with peers and top quartile', 'Tracing links to Performance, Engagement and Succession'],
      text: `<p>Leadership scores <b>${t.s}</b> against a peer median of <b>${t.m}</b> and a top quartile of <b>${t.t}</b>. It dropped 4 points since last cycle.</p><p>The main driver is <b>LD-06</b>: only 2 of 12 countries have a <b>mandatory programme for first-line managers</b>. 81% of peers do. Leadership also correlates strongly with your Engagement (r=0.71) and Succession (r=0.64) scores, so fixing it lifts several topics at once.</p><p>Your <b>Manager Excellence Programme</b> is 55% complete. Pilot managers in Germany improved effectiveness scores by <b>+10 points</b> compared with non-pilot managers.</p>`,
      blocks: [{ type: 'bars', rows: ['LD', 'PM', 'EN', 'SU'].map(H.T) }],
      cites: ['LD-02', 'LD-06', 'Glint manager index', 'Peer benchmark · n=46'],
      actions: [{ l: 'Open Manager Excellence', a: 'data-open-init="I1"', pri: 1 }, { l: 'Lumera Health practice', a: 'data-go="practices"' }],
      fu: ['What if we deliver the whole roadmap?', 'Summarise our position for my CEO'],
    };
  };
  R.wellbeing = (q) => {
    const derisk = /de-?risk|unblock|budget|slip/i.test(q);
    if (derisk) return {
      think: ['Reading initiative status, budget log and blockers', 'Checking how peers sequenced similar rollouts', 'Estimating score impact of options'],
      text: `<p>The Wellbeing initiative is <b>6 weeks behind</b> because local budgets are pending in <b>France, Italy and Brazil</b> (€85k total). Three options, ranked:</p>
        <p><b>1. Fund it centrally (recommended).</b> Ask the CFO to approve €85k from the global HR budget. This protects the projected <b>+10</b> on Wellbeing and keeps the global rollout target on track.</p>
        <p><b>2. Phase it.</b> Launch the low-cost parts now (mental-health first aiders, menopause policy) and move the EAP to Q4. This keeps about +6 of the uplift.</p>
        <p><b>3. Re-scope.</b> Cover only the 7 live countries. WB-04 would stay "partial" and Wellbeing would land at about 68.</p>`,
      blocks: [{ type: 'table', head: ['Option', 'Cost', 'Wellbeing next cycle', 'Risk'], rows: [['Fund centrally', '€85k', '<b>74</b>', '<span class="chip ok">Low</span>'], ['Phase it', '€30k now', '70', '<span class="chip warn">Medium</span>'], ['Re-scope', '€0', '68', '<span class="chip risk">High</span>']] }],
      cites: ['WB-04', 'Initiative budget log', 'Aurelis Foods practice'],
      actions: [{ l: 'Draft escalation to CFO', a: 'data-action="draftEscalation"', pri: 1 }, { l: 'Open initiative', a: 'data-open-init="I3"' }],
      fu: ['Summarise our position for my CEO', 'Which country is lagging and why?'],
    };
    return {
      think: ['Filtering peers in the top quartile on Wellbeing', 'Extracting their validated practices', 'Matching to your gaps and countries'],
      text: `<p>Top-quartile pharma employers score <b>85</b> on Wellbeing. You score <b>64</b>. Practices that <b>80%+ of them</b> have and Helix is missing:</p>
        <p>• <b>Mental-health support in every location</b> (WB-04). You cover 7 of 12 countries.<br>• <b>Trained mental-health first aiders</b>, typically 1 per 50 employees.<br>• <b>Wellbeing impact reported to the ExCo</b> every quarter (WB-08).<br>• <b>Menopause and caregiver policies</b>, now on the agenda at 71% of top-quartile peers.</p>
        <p>The closest match is <b>Aurelis Foods</b> (88% match). They rolled out first aiders across 22 sites in 2 quarters and gained <b>+9 points</b> with 14% fewer sick days.</p>`,
      blocks: [{ type: 'kpis', items: [{ l: 'Helix', v: '64' }, { l: 'Peer median', v: '75' }, { l: 'Top quartile', v: '85' }, { l: 'Projected with roadmap', v: '74' }] }],
      cites: ['WB-04', 'WB-08', 'Top-quartile peers · n=12', 'Aurelis Foods case'],
      actions: [{ l: 'Open Wellbeing initiative', a: 'data-open-init="I3"', pri: 1 }, { l: 'Browse peer practices', a: 'data-go="practices"' }],
      fu: ['How can we de-risk the wellbeing initiative?', 'What are our 3 biggest gaps vs pharma peers?'],
    };
  };
  R.country = () => ({
    think: ['Loading scores for 12 countries', 'Checking initiative rollout coverage', 'Scanning Workday for org changes'],
    text: `<p><b>Spain</b> is the clearest laggard at <b>69</b>, below the Helix average and the lowest on Onboarding (52) and Leadership (55).</p><p>The root cause is structural. In May you acquired <b>Iberia Bio</b>, and its <b>700 employees</b> aren't on any Helix programme yet. Acquired employees typically leave at 2× the normal rate in year one.</p><p><b>Brazil</b> (70) and <b>Italy</b> (73) are next. Both are waiting on Wellbeing budgets. I recommend a 100-day integration initiative for Iberia Bio, modelled on Sentra Telecom's playbook, which halved acquired-staff attrition.</p>`,
    blocks: [{ type: 'table', head: ['Country', 'Overall', 'Onboarding', 'Leadership', 'Wellbeing'], rows: ['ES', 'BR', 'IT', 'FR'].map(c => { const x = H.C(c), t = D.countryTopic[c]; return [`${x.flag} ${x.name}`, `<b>${x.score}</b>`, t.ON, t.LD, t.WB]; }) }],
    cites: ['Country scores 2027', 'Workday org change · May 2027', 'Sentra Telecom case'],
    actions: [{ l: 'Create Iberia Bio initiative', a: 'data-action="addIberia"', pri: 1 }, { l: 'Open countries', a: 'data-go="countries"' }],
    fu: ['Why did our Onboarding score drop?', 'How can we de-risk the wellbeing initiative?'],
  });
  R.ceo = () => {
    const o = D.overall, p = H.projected();
    return {
      think: ['Pulling results, roadmap and outcome data', 'Prioritising what a CEO needs to know', 'Writing a concise summary'],
      text: `<p><b>Summary for the CEO</b></p>
        <p>• <b>Above the peer median</b> at ${o.s}, above the peer median (${o.m}) but ${H.fmt1(o.t - o.s)} below the top quartile. We slipped ${H.fmt1(o.p - o.s)} because the standard got tougher on onboarding.<br>
        • <b>Strengths</b> that support our talent brand: Employer Branding (91, top quartile), Learning (88), Purpose (87).<br>
        • <b>The plan</b>: 6 initiatives (€1.25M) target Onboarding, Leadership, Wellbeing and Succession. We are ${H.avgProgress()}% through and projected to reach <b>${p}</b>.<br>
        • <b>Early proof</b>: new-hire attrition is down 46% in pilot countries, eNPS is up 9, worth about <b>€2.3M a year</b>.<br>
        • <b>Decisions needed</b>: €85k Wellbeing budget, a sponsor for the Iberia Bio integration, and global scope for the 2028 assessment.</p>`,
      blocks: [],
      cites: ['Assessment 2027', 'Roadmap', 'Workday', 'Glint'],
      actions: [{ l: 'Turn into board slides', a: 'data-go="report"', pri: 1 }, { l: 'Copy summary', a: 'data-action="copySum"' }],
      fu: ['Is the roadmap actually working?', 'What if we deliver the whole roadmap?'],
    };
  };
  R.outcomes = () => ({
    think: ['Querying Workday attrition data · Jan 2026 to Jun 2027', 'Comparing pilot and non-pilot countries', 'Checking Glint engagement trend'],
    text: `<p><b>Yes, and you can show it.</b> Since the onboarding journey went live in Germany and Switzerland, new-hire 90-day attrition fell from <b>10.0% to 5.4% (−46%)</b>. In non-pilot countries it fell only 11% over the same period, so most of the effect is attributable to the initiative.</p><p>Company-wide voluntary attrition is down <b>2.2 points</b> to 11.2% and eNPS is up from 18 to <b>27</b>. At a €12.5k replacement cost, that's about <b>€2.3M a year</b> in avoided cost.</p>`,
    blocks: [{ type: 'kpis', items: [{ l: 'New-hire attrition · pilot', v: '5.4%', d: '−46%' }, { l: 'Voluntary attrition', v: '11.2%', d: '−2.2 pts' }, { l: 'eNPS', v: '+27', d: '+9' }, { l: 'Annual value', v: '€2.3M', d: 'est.' }] }],
    cites: ['Workday · synced today', 'Glint · Q2 2027', 'Pilot vs control method'],
    actions: [{ l: 'Open outcomes', a: 'data-go="outcomes"', pri: 1 }, { l: 'Add to board report', a: 'data-go="report"' }],
    fu: ['Summarise our position for my CEO', 'How ready are we for the next assessment?'],
  });
  R.recert = () => ({
    think: ['Mapping tracked evidence to 214 next-cycle survey items', 'Checking which answers changed since 2027', 'Estimating effort left'],
    text: `<p>You're <b>64% ready</b>: 137 of 214 survey items are already pre-filled from initiative evidence, HRIS data and last year's validated answers. That saves your team about <b>6 weeks</b>.</p><p>Biggest movers: <b>ON-07</b> and <b>ON-05</b> are now met automatically. <b>WB-04</b> and <b>LD-06</b> are partial and depend on rollouts this quarter. <b>SU-03</b> needs the succession plans due in September.</p>`,
    blocks: [{ type: 'kpis', items: [{ l: 'Pre-filled', v: '64%' }, { l: 'Needs review', v: '47' }, { l: 'Missing evidence', v: String(30 - S.uploads.length) }, { l: 'Days to deadline', v: String(D.client.daysToDeadline) }] }],
    cites: ['Evidence vault', 'ON-05', 'ON-07', 'WB-04', 'LD-06', 'SU-03'],
    actions: [{ l: 'Open readiness', a: 'data-go="readiness"', pri: 1 }],
    fu: ['How can we de-risk the wellbeing initiative?', 'Summarise our position for my CEO'],
  });
  R.whatif = () => {
    const rows = S.inits.map(i => [i.name, `+${i.uplift} ${H.T(i.topic).name}`, `${i.progress}%`, H.status(i.status)]);
    return {
      think: ['Loading projected uplift for each initiative', 'Applying spillover effects between topics', 'Re-scoring all 20 topics'],
      text: `<p>If every initiative lands, your overall score is projected to rise from <b>${D.overall.s} to ${H.projected()}</b>. That moves Helix from the 56th to roughly the <b>70th percentile</b> of pharma peers and makes <b>global scope</b> realistic in 2028.</p><p>The biggest contributors are Onboarding (+14) and Manager Excellence (+9, plus spillover into Performance, Engagement and Succession). Wellbeing is the swing factor: if it stays blocked, the projection drops by about 0.5.</p>`,
      blocks: [{ type: 'table', head: ['Initiative', 'Projected uplift', 'Progress', 'Status'], rows }],
      cites: ['Roadmap model', 'Peer uplift history · 1,240 initiatives'],
      actions: [{ l: 'Open roadmap', a: 'data-go="roadmap"', pri: 1 }],
      fu: ['How can we de-risk the wellbeing initiative?', 'Summarise our position for my CEO'],
    };
  };
  R.apply = q => {
    const p = D.practices.find(x => q.includes(x.co)) || D.practices[0];
    const t = H.T(p.topic), ini = initFor(p.topic);
    return {
      think: [`Reading ${p.co}'s validated practice`, 'Comparing their context with Helix (size, countries, maturity)', 'Adapting it into steps for Helix'],
      text: `<p><b>${p.co}</b> is a strong match (${p.match}%): ${p.size.toLowerCase()}. Their result: <b>${p.result}</b>.</p><p>Adapted for Helix:</p><p>• <b>Start where you're strong.</b> Germany and Switzerland already score highest on ${t.name}, so use them as the template.<br>• <b>Fix the weakest countries first.</b> Spain and Brazil are lowest, and the Iberia Bio employees need it most.<br>• <b>Measure it the same way.</b> Track the KPI behind their result in Workday from day one.<br>• <b>Timeline:</b> ${p.time}. Effort is ${p.effort.toLowerCase()} for a company your size.</p>${ini ? `<p>This is already part of your <b>${ini.name}</b> initiative (${ini.progress}% done).</p>` : ''}`,
      blocks: [],
      cites: [p.co + ' case', t.name + ' scores', 'Country scores'],
      actions: ini ? [{ l: 'Open ' + ini.name, a: `data-open-init="${ini.id}"`, pri: 1 }] : [{ l: 'Add to roadmap', a: 'data-action="addIberia"', pri: 1 }],
      fu: ['Which country is lagging and why?', 'What if we deliver the whole roadmap?'],
    };
  };
  R.topic = t => {
    const items = Object.entries(D.surveyItems).filter(([k]) => k.startsWith(t.id === 'SU' ? 'SU' : t.id));
    const ini = initFor(t.id), gap = t.s - t.m, strong = t.s >= t.t;
    return {
      think: [`Loading ${t.name} results and evidence`, 'Comparing with 46 peers', 'Looking for linked initiatives and practices'],
      text: strong
        ? `<p><b>${t.name}</b> is a real strength: <b>${t.s}</b>, at or above the top quartile (${t.t}) and ${gap > 0 ? '+' : ''}${gap} vs the peer median.</p><p>Recommendation: <b>protect it, then show it off.</b> Use it in employer-brand content and consider sharing it as a peer practice. That raises your profile and earns community recognition.</p>`
        : `<p><b>${t.name}</b> scores <b>${t.s}</b> against a peer median of <b>${t.m}</b> (${gap > 0 ? '+' : ''}${gap}) and a top quartile of ${t.t}. It moved ${t.s - t.p >= 0 ? '+' : ''}${t.s - t.p} since last cycle.</p>${t.id === 'SU' ? '<p>The main driver is <b>SU-03</b>: only 41% of critical roles have a ready-now successor, while top-quartile peers average 78%. Succession plans aren\'t reviewed every year in 3 of 5 business units.</p>' : ''}${ini ? `<p>It's covered by <b>${ini.name}</b>, which is ${ini.progress}% complete and projected to add <b>+${ini.uplift}</b>.</p>` : '<p>No initiative covers it yet. It\'s a candidate for the next planning cycle.</p>'}`,
      blocks: [{ type: 'bars', rows: [t] }],
      cites: items.map(([k]) => k).concat(['Peer benchmark · n=46']),
      actions: ini ? [{ l: 'Open ' + ini.name, a: `data-open-init="${ini.id}"`, pri: 1 }, { l: 'See all topics', a: 'data-go="results"' }] : [{ l: 'See all topics', a: 'data-go="results"', pri: 1 }],
      fu: ['What are our 3 biggest gaps vs pharma peers?', 'What if we deliver the whole roadmap?'],
    };
  };
  R.fallback = () => ({
    think: ['Searching your results, roadmap and evidence'],
    text: `<p>In this demo I can answer questions about your <b>scores and gaps</b>, <b>root causes</b>, <b>countries</b>, <b>peer practices</b>, <b>roadmap projections</b>, <b>outcomes</b> and <b>next-cycle readiness</b>. I can also write summaries for your CEO or board.</p><p>Try one of these:</p>`,
    blocks: [], cites: [], actions: [],
    fu: STARTERS.map(s => s[1]).slice(0, 4),
  });

  function route(q) {
    const s = q.toLowerCase();
    if (/^(tell me about|why is)/.test(s)) {
      const t = topicByText(q);
      if (t) return t.id === 'ON' ? R.onboarding() : t.id === 'LD' ? R.leadership() : t.id === 'WB' ? R.wellbeing('') : R.topic(t);
    }
    if (/apply to helix|how would .* apply/.test(s)) return R.apply(q);
    if (/\bceo\b|summar|\bboard\b|\bexec|\bbrief/.test(s)) return R.ceo();
    if (/recert|\bready\b|readiness|next survey|next year/.test(s)) return R.recert();
    if (/working|roi|outcome|attrition|value|saving|impact so far|proof/.test(s)) return R.outcomes();
    if (/what if|whole roadmap|project|forecast|deliver/.test(s)) return R.whatif();
    if (/country|countries|spain|iberia|lagging|brazil|region/.test(s)) return R.country();
    if (/wellbeing|well-being|mental|wellness/.test(s)) return R.wellbeing(q);
    if (/onboard/.test(s)) return R.onboarding();
    if (/leader|manager/.test(s)) return R.leadership();
    if (/gap|weak|biggest|worst|behind|below peers|vs peers|compare/.test(s) && !topicByText(q)) return R.gaps();
    const t = topicByText(q); if (t) return R.topic(t);
    if (/top perform|best|what do peers|others do/.test(s)) return R.wellbeing('');
    return R.fallback();
  }

  /* ---------- rendering ---------- */
  function blocksHTML(m) {
    let h = '';
    (m.blocks || []).forEach(b => {
      if (b.type === 'bars') h += `<div class="blk"><div class="legend" style="margin-bottom:10px"><span><i style="background:#5B4BF5"></i>Helix</span><span><i style="background:#0E1630;width:3px"></i>Median</span><span><i style="background:#0EA5A4;width:3px"></i>Top quartile</span></div>${b.rows.map(t => `<div class="row" style="gap:12px;padding:6px 0"><span class="small b" style="width:150px">${t.name}</span><div style="flex:1">${H.cmp(t)}</div><span class="small mono b" style="width:30px;text-align:right">${t.s}</span><span class="tiny mono" style="width:40px;color:${t.s - t.m < 0 ? 'var(--rose)' : 'var(--green)'}">${t.s - t.m > 0 ? '+' : ''}${t.s - t.m}</span></div>`).join('')}</div>`;
      if (b.type === 'table') h += `<div class="blk" style="padding:0;overflow:hidden"><table class="tbl"><thead><tr>${b.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map((c, k) => `<td class="small ${k === 0 ? 'b' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      if (b.type === 'kpis') h += `<div class="blk"><div class="grid g4" style="gap:10px">${b.items.map(k => `<div><div class="tiny muted">${k.l}</div><div class="row" style="gap:6px"><b style="font-size:20px">${k.v}</b>${k.d ? `<span class="delta up">${k.d}</span>` : ''}</div></div>`).join('')}</div></div>`;
    });
    if (m.cites && m.cites.length) h += `<div class="cites"><span class="tiny muted" style="align-self:center">Sources:</span>${m.cites.map(c => `<span class="cite" title="${H.esc(D.surveyItems[c] || c)}">${D.surveyItems[c] ? `<b>${c}</b>${D.surveyItems[c].slice(0, 38)}…` : IC('link', 11) + c}</span>`).join('')}</div>`;
    if (m.actions && m.actions.length) h += `<div class="acts">${m.actions.map(a => `<button class="btn ${a.pri ? 'pri' : 'sec'} sm" ${a.a}>${a.l}</button>`).join('')}</div>`;
    if (m.fu && m.fu.length) h += `<div class="followups">${m.fu.map(f => `<button class="fu" data-ask="${H.esc(f)}">${f}</button>`).join('')}</div>`;
    return h;
  }
  const userHTML = t => `<div class="msg user"><div class="bubble">${H.esc(t)}</div></div>`;
  const aiHTML = m => `<div class="msg ai"><div class="ai-av">${IC('sparkles', 17)}</div><div class="bubble"><div class="ai-text">${m.text}</div>${blocksHTML(m)}</div></div>`;

  function empty() {
    return `<div style="max-width:720px;margin:30px auto 0;text-align:center"><div class="ai-av" style="width:56px;height:56px;margin:0 auto 14px;border-radius:16px">${IC('sparkles', 26)}</div>
      <h2 style="font-size:22px;letter-spacing:-.02em">Hi Maria, what would you like to understand?</h2><p class="muted" style="margin-top:6px">I've read your 2027 results, 86 evidence documents, your roadmap, and live Workday and Glint data.</p>
      <div class="starter">${STARTERS.map(s => `<button data-ask="${H.esc(s[1])}"><span class="li-ico info" style="width:32px;height:32px">${IC(s[0], 15)}</span><div><b>${s[1]}</b><span>${s[2]}</span></div></button>`).join('')}</div></div>`;
  }

  function mount() {
    const box = $('#chat-scroll'); if (!box) return;
    box.innerHTML = S.chat.length ? S.chat.map(m => m.role === 'user' ? userHTML(m.text) : aiHTML(m)).join('') : empty();
    box.scrollTop = box.scrollHeight;
    const inp = $('#chat-in'), send = $('#chat-send');
    const go = () => { const v = inp.value.trim(); if (!v) return; inp.value = ''; ask(v); };
    send.onclick = go;
    inp.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go(); } };
    const dl = new URLSearchParams(location.search).get('ask');
    if (dl && !S.chat.length && !mount.done) { mount.done = true; setTimeout(() => ask(dl), 300); }
  }

  async function ask(q) {
    if (busy) return;
    const box = $('#chat-scroll'); if (!box) return;
    busy = true;
    if (!S.chat.length) box.innerHTML = '';
    S.chat.push({ role: 'user', text: q });
    box.insertAdjacentHTML('beforeend', userHTML(q));
    const m = route(q);
    const wrap = document.createElement('div'); wrap.className = 'msg ai';
    wrap.innerHTML = `<div class="ai-av">${IC('sparkles', 17)}</div><div class="bubble"><div class="thinking"></div><div class="ai-text"></div><div class="extra"></div></div>`;
    box.appendChild(wrap); box.scrollTop = box.scrollHeight;
    const th = wrap.querySelector('.thinking');
    for (const s of m.think) {
      const el = document.createElement('div'); el.className = 'think-step'; el.innerHTML = `<div class="spin"></div><span>${s}</span>`; th.appendChild(el); box.scrollTop = box.scrollHeight;
      await H.sleep(520);
      el.innerHTML = IC('check', 14, 3) + `<span>${s}</span>`;
    }
    await H.sleep(200);
    th.style.opacity = .7;
    const tx = wrap.querySelector('.ai-text');
    const tokens = m.text.match(/<[^>]+>|[^<\s]+\s*|\s+/g) || [];
    let out = '';
    for (let i = 0; i < tokens.length; i++) {
      out += tokens[i];
      if (i % 3 === 0) { tx.innerHTML = out + '<span class="typing-cursor"></span>'; box.scrollTop = box.scrollHeight; await H.sleep(16); }
    }
    tx.innerHTML = m.text;
    wrap.querySelector('.extra').innerHTML = blocksHTML(m);
    box.scrollTop = box.scrollHeight;
    S.chat.push({ role: 'ai', ...m });
    busy = false;
  }

  V.actions.copySum = () => { try { navigator.clipboard.writeText(document.querySelector('.msg.ai:last-child .ai-text').innerText); } catch (e) { } H.toast('Summary copied to clipboard', 'check'); };

  window.COP = { mount, ask, isBusy: () => busy };
})();
