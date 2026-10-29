/* Pathfinder demo data. Everything here is fictional. */
window.D = (function () {
  const institute = { name: 'Northstar Workplace Institute', short: 'Northstar' };
  const product = { name: 'Pathfinder', tagline: 'AI People Strategy Platform' };

  const client = {
    name: 'Helix Biosciences',
    initials: 'HB',
    industry: 'Pharma & Life Sciences',
    hq: 'Basel, Switzerland',
    employees: 8400,
    countries: 12,
    seal: 'Regional scope · Europe',
    certYear: 2027,
    user: { name: 'Maria Lindqvist', role: 'Chief People Officer', initials: 'ML' },
    today: '15 Jul 2027',
    planApproved: '14 Jan 2027',
    nextSurveyOpens: '1 Oct 2027',
    nextSurveyDeadline: '30 Nov 2027',
    daysToDeadline: 138,
    peerGroup: 'Pharma & Life Sciences · Europe · 5k–20k employees',
    peerCount: 46,
    percentile: 56,
  };

  // 6 domains / 20 topics. s = 2027 score, p = last cycle, m = peer median, t = peer top quartile
  const domains = [
    { id: 'SL', name: 'Strategy & Leadership', color: '#6366F1', topics: [
      { id: 'PS', name: 'People Strategy', s: 84, p: 83, m: 79, t: 88 },
      { id: 'LD', name: 'Leadership', s: 62, p: 66, m: 76, t: 85 },
      { id: 'OC', name: 'Organisation & Change', s: 74, p: 76, m: 73, t: 82 },
      { id: 'HA', name: 'HR Analytics', s: 66, p: 64, m: 72, t: 83 },
    ]},
    { id: 'TA', name: 'Talent Acquisition', color: '#0EA5E9', topics: [
      { id: 'EB', name: 'Employer Branding', s: 91, p: 89, m: 80, t: 89 },
      { id: 'RC', name: 'Recruitment', s: 85, p: 84, m: 78, t: 86 },
      { id: 'ON', name: 'Onboarding', s: 58, p: 71, m: 74, t: 86 },
    ]},
    { id: 'LG', name: 'Learning & Growth', color: '#14B8A6', topics: [
      { id: 'LE', name: 'Learning', s: 88, p: 86, m: 79, t: 88 },
      { id: 'CD', name: 'Career Development', s: 79, p: 78, m: 75, t: 84 },
      { id: 'PM', name: 'Performance', s: 73, p: 74, m: 74, t: 83 },
      { id: 'SU', name: 'Succession', s: 60, p: 61, m: 71, t: 82 },
    ]},
    { id: 'WE', name: 'Wellbeing & Engagement', color: '#F59E0B', topics: [
      { id: 'WB', name: 'Wellbeing', s: 64, p: 67, m: 75, t: 85 },
      { id: 'EN', name: 'Engagement', s: 77, p: 79, m: 76, t: 84 },
      { id: 'RR', name: 'Rewards & Recognition', s: 86, p: 85, m: 78, t: 87 },
    ]},
    { id: 'WO', name: 'Work Environment', color: '#8B5CF6', topics: [
      { id: 'WW', name: 'Ways of Working', s: 83, p: 82, m: 77, t: 86 },
      { id: 'DH', name: 'Digital HR', s: 80, p: 76, m: 74, t: 84 },
      { id: 'OF', name: 'Offboarding', s: 69, p: 70, m: 68, t: 79 },
    ]},
    { id: 'IP', name: 'Inclusion & Purpose', color: '#EC4899', topics: [
      { id: 'DI', name: 'Diversity & Inclusion', s: 84, p: 82, m: 76, t: 86 },
      { id: 'PV', name: 'Purpose & Values', s: 87, p: 86, m: 81, t: 89 },
      { id: 'SB', name: 'Sustainability', s: 81, p: 79, m: 74, t: 85 },
    ]},
  ];

  const topics = [];
  domains.forEach(d => d.topics.forEach(t => { t.domain = d.id; t.domainName = d.name; t.color = d.color; topics.push(t); }));
  const avg = (arr, k) => Math.round(arr.reduce((a, x) => a + x[k], 0) * 10 / arr.length) / 10;
  domains.forEach(d => { d.s = avg(d.topics, 's'); d.p = avg(d.topics, 'p'); d.m = avg(d.topics, 'm'); d.t = avg(d.topics, 't'); });
  const overall = { s: avg(topics, 's'), p: avg(topics, 'p'), m: avg(topics, 'm'), t: avg(topics, 't'), threshold: 70 };

  // Evidence the scores are grounded in (cited by Ask Pathfinder)
  const surveyItems = {
    'ON-03': 'Structured 90-day onboarding plan applied in all countries',
    'ON-05': 'Documented onboarding policy reviewed in the last 24 months',
    'ON-07': 'Digital pre-boarding experience before day one (new in 2027 standard)',
    'ON-09': 'Buddy or mentor assigned to every new hire',
    'LD-02': 'Leadership capability framework linked to performance',
    'LD-06': 'Mandatory development programme for first-line managers',
    'WB-04': 'Mental health support available in all locations',
    'WB-08': 'Wellbeing impact measured and reported to leadership',
    'SU-03': 'Succession plans for critical roles reviewed annually',
  };

  const initiatives = [
    { id: 'I1', name: 'Manager Excellence Programme', topic: 'LD', also: ['PM', 'EN', 'SU'], owner: 'Daniel Weber', ownerRole: 'Head of L&D', start: 1, end: 9, progress: 55, status: 'on-track', uplift: 9, impact: 92, effort: 62, peerAdoption: 81, cost: '€420k',
      why: 'Leadership is the widest gap vs peers (−14) and lifts Performance, Engagement and Succession.',
      milestones: [
        { name: 'Capability framework designed', due: 'Feb', done: true },
        { name: 'Pilot cohort · 40 managers in Germany', due: 'Apr', done: true },
        { name: '360° feedback baseline captured', due: 'May', done: true },
        { name: 'Wave 1 rollout · UK, US, CH', due: 'Aug', done: false },
        { name: 'Wave 2 rollout · APAC & LATAM', due: 'Oct', done: false },
      ],
      evidence: ['Manager_Framework_v3.pdf', 'Pilot_Cohort_Results.xlsx', '360_Baseline_Summary.pdf'],
      rollout: { DE: 'done', CH: 'done', UK: 'active', US: 'active', FR: 'planned', ES: 'planned', IT: 'planned', NL: 'planned', IN: 'planned', BR: 'planned', JP: 'planned', SG: 'planned' } },
    { id: 'I2', name: '90-Day Onboarding Journey + Buddy', topic: 'ON', also: ['EN'], owner: 'Sofia Marín', ownerRole: 'Talent Acquisition Lead', start: 0, end: 5, progress: 80, status: 'on-track', uplift: 14, impact: 88, effort: 30, peerAdoption: 72, cost: '€140k',
      why: 'Onboarding fell 13 points, the biggest drop of any topic. Three survey items can be fixed in one quarter.',
      milestones: [
        { name: 'Global 90-day journey template', due: 'Jan', done: true },
        { name: 'Digital pre-boarding app live', due: 'Mar', done: true },
        { name: 'Buddy programme · DE, CH, NL, UK', due: 'Apr', done: true },
        { name: 'Policy refresh signed off', due: 'May', done: true },
        { name: 'Buddy programme · ES, BR, IN', due: 'Jul', done: false },
      ],
      evidence: ['Onboarding_Policy_2027.pdf', 'Preboarding_App_Screens.pdf', 'Buddy_Guide.pdf', 'Onboarding_Survey_Q2.xlsx'],
      rollout: { DE: 'done', CH: 'done', UK: 'done', US: 'done', FR: 'done', ES: 'active', IT: 'done', NL: 'done', IN: 'active', BR: 'active', JP: 'done', SG: 'done' } },
    { id: 'I3', name: 'Wellbeing Framework 2.0', topic: 'WB', also: ['EN'], owner: 'Aisha Khan', ownerRole: 'Global Wellbeing Lead', start: 2, end: 8, progress: 30, status: 'at-risk', uplift: 10, impact: 78, effort: 55, peerAdoption: 68, cost: '€260k',
      risk: 'Budget approval is still pending in France, Italy and Brazil. Rollout is 6 weeks behind plan.',
      why: 'Wellbeing is 11 points below peers and mental health support is missing in 5 countries (WB-04).',
      milestones: [
        { name: 'Wellbeing needs survey', due: 'Mar', done: true },
        { name: 'EAP vendor selected', due: 'Apr', done: true },
        { name: 'Mental-health first aiders trained', due: 'Jun', done: false },
        { name: 'Menopause & caregiver policy', due: 'Jul', done: false },
        { name: 'Wellbeing dashboard to ExCo', due: 'Sep', done: false },
      ],
      evidence: ['Wellbeing_Needs_Survey.pdf'],
      rollout: { DE: 'active', CH: 'active', UK: 'active', US: 'planned', FR: 'blocked', ES: 'planned', IT: 'blocked', NL: 'active', IN: 'planned', BR: 'blocked', JP: 'planned', SG: 'planned' } },
    { id: 'I4', name: 'Talent Review & Succession Cadence', topic: 'SU', also: ['CD', 'LD'], owner: 'Daniel Weber', ownerRole: 'Head of L&D', start: 3, end: 10, progress: 35, status: 'on-track', uplift: 8, impact: 64, effort: 42, peerAdoption: 74, cost: '€90k',
      why: 'Only 41% of critical roles have a ready-now successor. Top-quartile peers average 78%.',
      milestones: [
        { name: 'Critical roles mapped (212 roles)', due: 'Apr', done: true },
        { name: 'Talent review calibration · ExCo', due: 'Jun', done: true },
        { name: 'Succession plans · all BUs', due: 'Sep', done: false },
        { name: 'Annual review cadence in HRIS', due: 'Nov', done: false },
      ],
      evidence: ['Critical_Roles_Map.xlsx', 'ExCo_Calibration_Notes.pdf'],
      rollout: { DE: 'active', CH: 'active', UK: 'active', US: 'active', FR: 'planned', ES: 'planned', IT: 'planned', NL: 'planned', IN: 'planned', BR: 'planned', JP: 'planned', SG: 'planned' } },
    { id: 'I5', name: 'People Analytics Foundation', topic: 'HA', also: ['WB', 'OF'], owner: 'Tomás Ruiz', ownerRole: 'HRIS & Analytics Lead', start: 0, end: 11, progress: 60, status: 'on-track', uplift: 6, impact: 58, effort: 72, peerAdoption: 63, cost: '€310k',
      why: 'This is the foundation for measuring every other initiative, and it unlocks the Outcomes view.',
      milestones: [
        { name: 'Workday + Glint connected to Pathfinder', due: 'Feb', done: true },
        { name: 'Attrition & eNPS dashboards', due: 'Apr', done: true },
        { name: 'Country HR scorecards', due: 'Jul', done: false },
        { name: 'Predictive attrition model', due: 'Nov', done: false },
      ],
      evidence: ['Data_Dictionary_v2.pdf', 'Attrition_Dashboard.png'],
      rollout: { DE: 'done', CH: 'done', UK: 'done', US: 'done', FR: 'active', ES: 'active', IT: 'active', NL: 'done', IN: 'active', BR: 'planned', JP: 'planned', SG: 'active' } },
    { id: 'I6', name: 'Exit Insights Loop', topic: 'OF', also: ['HA'], owner: 'Elena Rossi', ownerRole: 'HRBP Lead', start: 6, end: 8, progress: 5, status: 'planned', uplift: 5, impact: 44, effort: 22, peerAdoption: 58, cost: '€25k',
      why: 'A quick win. A structured exit survey closes 2 survey items and feeds HR Analytics.',
      milestones: [
        { name: 'Exit survey design', due: 'Jul', done: false },
        { name: 'Alumni network pilot', due: 'Aug', done: false },
        { name: 'Quarterly exit insight report', due: 'Sep', done: false },
      ],
      evidence: [],
      rollout: { DE: 'planned', CH: 'planned', UK: 'planned', US: 'planned', FR: 'planned', ES: 'planned', IT: 'planned', NL: 'planned', IN: 'planned', BR: 'planned', JP: 'planned', SG: 'planned' } },
  ];

  const countries = [
    { code: 'DE', name: 'Germany', flag: '🇩🇪', hc: 2100, score: 81, lead: 'Jonas Becker', status: 'ahead' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', hc: 950, score: 80, lead: 'Lea Meier', status: 'ahead' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', hc: 780, score: 78, lead: 'Oliver Grant', status: 'on-track' },
    { code: 'US', name: 'United States', flag: '🇺🇸', hc: 1050, score: 77, lead: 'Rachel Kim', status: 'on-track' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', hc: 330, score: 79, lead: 'Sanne de Vries', status: 'on-track' },
    { code: 'FR', name: 'France', flag: '🇫🇷', hc: 620, score: 74, lead: 'Camille Laurent', status: 'at-risk' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', hc: 410, score: 73, lead: 'Marco Bianchi', status: 'at-risk' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', hc: 1100, score: 69, lead: 'Lucía Ortega', status: 'behind', alert: 'In May you acquired Iberia Bio: 700 people who are not yet on Helix onboarding, wellbeing or manager programmes.' },
    { code: 'IN', name: 'India', flag: '🇮🇳', hc: 520, score: 76, lead: 'Priya Nair', status: 'on-track' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', hc: 260, score: 70, lead: 'Bruno Costa', status: 'at-risk' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', hc: 180, score: 75, lead: 'Yuki Tanaka', status: 'on-track' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', hc: 100, score: 78, lead: 'Wei Ling Tan', status: 'on-track' },
  ];
  // per-country scores for the gap topics (heatmap)
  const countryTopic = {
    DE: { LD: 72, ON: 79, WB: 70, SU: 66, HA: 74 }, CH: { LD: 70, ON: 77, WB: 72, SU: 64, HA: 72 },
    UK: { LD: 66, ON: 72, WB: 68, SU: 62, HA: 70 }, US: { LD: 64, ON: 70, WB: 62, SU: 63, HA: 71 },
    NL: { LD: 65, ON: 75, WB: 71, SU: 60, HA: 68 }, FR: { LD: 60, ON: 66, WB: 58, SU: 58, HA: 64 },
    IT: { LD: 58, ON: 65, WB: 57, SU: 57, HA: 62 }, ES: { LD: 55, ON: 52, WB: 56, SU: 54, HA: 58 },
    IN: { LD: 63, ON: 68, WB: 64, SU: 59, HA: 66 }, BR: { LD: 57, ON: 55, WB: 55, SU: 55, HA: 60 },
    JP: { LD: 61, ON: 71, WB: 63, SU: 58, HA: 64 }, SG: { LD: 66, ON: 74, WB: 66, SU: 61, HA: 69 },
  };

  const practices = [
    { co: 'Corvane Pharma', size: '11k employees · Pharma · DACH', topic: 'ON', title: 'The "First 90" onboarding journey with buddy pairing', result: '90-day new-hire attrition 11% → 5%', effort: 'Low', time: '1 quarter', match: 96,
      body: 'Every new hire gets a 90-day digital journey that starts 3 weeks before day one: equipment, a welcome video from their manager, and a named buddy. Managers have 3 structured check-ins (days 7, 30 and 90). The checklist runs inside the HRIS.' },
    { co: 'Lumera Health', size: '7k employees · MedTech · Nordics', topic: 'LD', title: 'Manager Academy: mandatory first-line manager programme', result: 'Leadership score +12 in one cycle', effort: 'Medium', time: '2–3 quarters', match: 93,
      body: 'Every new manager completes 6 modules in their first 6 months, with peer coaching circles. Completion is part of the manager\'s own objectives, and 360° feedback is captured before and after.' },
    { co: 'Aurelis Foods', size: '15k employees · FMCG · Europe', topic: 'WB', title: 'Mental-health first aiders in every site', result: 'Wellbeing score +9 · sick days −14%', effort: 'Medium', time: '2 quarters', match: 88,
      body: 'Trained 1 mental-health first aider per 50 employees across 22 sites, alongside a global EAP and a quarterly wellbeing pulse. Results are reported to the ExCo dashboard every quarter.' },
    { co: 'Kestrel Bank', size: '9k employees · Financial Services · UK', topic: 'SU', title: 'Twice-yearly talent reviews with "ready-now" tracking', result: 'Ready-now successors 38% → 74%', effort: 'Medium', time: '3 quarters', match: 84,
      body: 'Calibrated talent reviews for 180 critical roles, with successors tracked as ready now / 1–2 years / 3+ years. Each successor gets a development plan tied to a stretch assignment.' },
    { co: 'Tidewell Energy', size: '6k employees · Energy · Benelux', topic: 'HA', title: 'Country HR scorecards owned by local leaders', result: 'Data-driven decisions in 9 of 10 countries', effort: 'High', time: '3–4 quarters', match: 79,
      body: 'Each country HR lead owns a monthly scorecard: attrition, eNPS, onboarding completion and wellbeing usage. Country scorecards are reviewed side by side in the quarterly business review.' },
    { co: 'Sentra Telecom', size: '12k employees · Telecom · Southern Europe', topic: 'OC', title: 'A 100-day people-integration playbook for acquisitions', result: 'Acquired-staff attrition halved in year 1', effort: 'Medium', time: '100 days', match: 91,
      body: 'After an acquisition, a dedicated integration squad maps policy gaps in 2 weeks, moves acquired staff onto core programmes (onboarding, wellbeing, manager training) within 100 days, and runs a pulse survey every month.' },
    { co: 'Brightfield Retail', size: '20k employees · Retail · Europe', topic: 'OF', title: 'Exit-insight loop and alumni network', result: '18% of leavers re-hired within 3 years', effort: 'Low', time: '1 quarter', match: 74,
      body: 'Structured exit interviews feed a quarterly report to the ExCo. Leavers join an alumni network that gets job alerts, and boomerang hires are tracked as a KPI.' },
  ];

  // Outcomes · monthly Jan 2026 → Jun 2027
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const outcomes = {
    months,
    newHireAttrPilot: [10.1, 9.9, 10.3, 9.7, 9.8, 10.0, 9.6, 9.9, 10.2, 9.8, 9.7, 9.9, 9.1, 8.2, 7.1, 6.3, 5.8, 5.4],
    newHireAttrOther: [9.4, 9.6, 9.3, 9.7, 9.5, 9.8, 9.6, 9.4, 9.7, 9.9, 9.6, 9.5, 9.6, 9.4, 9.5, 9.0, 8.7, 8.5],
    volAttr: [13.4, 13.3, 13.3, 13.2, 13.1, 13.2, 13.0, 13.1, 12.9, 12.9, 12.8, 12.8, 12.6, 12.4, 12.1, 11.8, 11.5, 11.2],
    enpsQ: { labels: ["Q1 '26", "Q2 '26", "Q3 '26", "Q4 '26", "Q1 '27", "Q2 '27"], values: [17, 18, 16, 18, 22, 27] },
    mgrEffect: { labels: ["Q1 '26", "Q2 '26", "Q3 '26", "Q4 '26", "Q1 '27", "Q2 '27"], pilot: [64, 65, 63, 66, 71, 76], other: [63, 64, 64, 65, 65, 66] },
  };

  const advisorClients = [
    { name: 'Helix Biosciences', ind: 'Pharma', seal: 'Regional · Europe', arr: 68, health: 84, trend: [62, 66, 70, 74, 79, 84], wau: 37, stage: 'Execute', renewal: 'Mar 2028',
      signal: { type: 'upsell', text: 'Wellbeing initiative at risk for 6 weeks. Offer the Wellbeing Deep-Dive (Advisory).' }, upsell: 'Global scope: US, IN, BR, JP and SG are all above threshold' },
    { name: 'Kestrel Bank', ind: 'Financial Services', seal: 'Country · UK', arr: 32, health: 41, trend: [78, 74, 66, 58, 49, 41], wau: 4, stage: 'Fix', renewal: 'Nov 2027',
      signal: { type: 'risk', text: 'Weekly users dropped 80% after the CPO left in April. Re-onboard the new CPO before renewal.' }, upsell: null },
    { name: 'Corvane Pharma', ind: 'Pharma', seal: 'Global', arr: 112, health: 91, trend: [80, 83, 85, 88, 90, 91], wau: 64, stage: 'Lead', renewal: 'Jan 2028',
      signal: { type: 'upsell', text: 'They are a top-decile performer on Onboarding. Invite them to speak at Summit 2028 as a case study.' }, upsell: 'Outcome Analytics add-on' },
    { name: 'Aurelis Foods', ind: 'FMCG', seal: 'Regional · Europe', arr: 74, health: 77, trend: [70, 72, 71, 74, 76, 77], wau: 29, stage: 'Prove', renewal: 'Apr 2028',
      signal: { type: 'upsell', text: 'They export ESG data to spreadsheets every quarter. Pitch the CSRD S1 reporting module.' }, upsell: 'CSRD S1 module' },
    { name: 'Tidewell Energy', ind: 'Energy', seal: 'Country · NL', arr: 28, health: 69, trend: [60, 63, 65, 66, 68, 69], wau: 12, stage: 'Execute', renewal: 'Feb 2028',
      signal: { type: 'upsell', text: '3 more countries are above threshold. Expand to regional scope.' }, upsell: 'Regional scope' },
    { name: 'Sentra Telecom', ind: 'Telecom', seal: 'Regional · S. Europe', arr: 61, health: 58, trend: [72, 70, 66, 63, 60, 58], wau: 9, stage: 'Maintain', renewal: 'Dec 2027',
      signal: { type: 'risk', text: 'They haven\'t updated their roadmap in 90 days. Book a re-planning session.' }, upsell: null },
    { name: 'Brightfield Retail', ind: 'Retail', seal: 'Country · DE', arr: 24, health: 73, trend: [55, 60, 64, 68, 71, 73], wau: 15, stage: 'Fix', renewal: 'May 2028',
      signal: { type: 'upsell', text: 'They asked Pathfinder 14 questions about DE&I. Offer the DE&I Advisory module.' }, upsell: 'Advisory Lite · DE&I' },
  ];

  return { institute, product, client, domains, topics, overall, surveyItems, initiatives, countries, countryTopic, practices, outcomes, advisorClients };
})();
