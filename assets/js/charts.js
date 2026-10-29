/* Lightweight SVG chart + icon helpers (no dependencies) */
window.IC = (function () {
  const P = {
    home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    chart: 'M4 20V10M10 20V4M16 20v-7M2 20h20',
    sparkles: 'M12 3l1.9 4.9L19 9.8l-5.1 1.9L12 17l-1.9-5.3L5 9.8l5.1-1.9zM19 15.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z',
    map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
    check: 'M20 6 9 17l-5-5',
    tasks: 'M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11',
    globe: 'M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
    book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
    trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
    present: 'M3 4h18M4 4v11h16V4M12 15v5M8 20h8',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
    brief: 'M3 7h18v13H3zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18',
    bell: 'M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 1 0 0-14M21 21l-4.3-4.3',
    play: 'M6 4l14 8-14 8z',
    send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
    x: 'M18 6 6 18M6 6l12 12',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
    file: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5',
    alert: 'M12 3 2 20h20zM12 10v4M12 17h.01',
    users: 'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 4a4 4 0 1 0 0 8 4 4 0 1 0 0-8M22 20v-2a4 4 0 0 0-3-3.9M16 4.1a4 4 0 0 1 0 7.8',
    target: 'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20M12 6a6 6 0 1 0 0 12 6 6 0 1 0 0-12M12 10a2 2 0 1 0 0 4 2 2 0 1 0 0-4',
    zap: 'M13 2 4 14h7l-1 8 9-12h-7z',
    chev: 'M9 6l6 6-6 6',
    plus: 'M12 5v14M5 12h14',
    download: 'M12 4v12M7 11l5 5 5-5M4 20h16',
    clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20M12 6v6l4 2',
    link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
    layers: 'M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    msg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    refresh: 'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5',
    flag: 'M4 22V4M4 4h13l-2 4 2 4H4',
    star: 'M12 2l3 6.5 7 .9-5.2 4.8 1.4 7-6.2-3.6-6.2 3.6 1.4-7L2 9.4l7-.9z',
    building: 'M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h3a1 1 0 0 1 1 1v11M2 21h20M8 7h4M8 11h4M8 15h4',
    euro: 'M18 6a7 7 0 1 0 0 12M4 10h10M4 14h10',
    db: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
    lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6',
  };
  return function (name, size = 18, sw = 2) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${P[name] || ''}"/></svg>`;
  };
})();

window.CH = (function () {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function radar(labels, series, size = 340) {
    const n = labels.length, cx = size / 2, cy = size / 2, R = size / 2 - 84;
    const pt = (i, v) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; const r = R * (v - 40) / 60; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    let g = '';
    [50, 60, 70, 80, 90, 100].forEach(l => {
      const pts = labels.map((_, i) => pt(i, l).join(',')).join(' ');
      g += `<polygon points="${pts}" fill="none" stroke="#E6E8F0" stroke-width="1"/>`;
    });
    labels.forEach((lab, i) => {
      const [x, y] = pt(i, 100); g += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#E6E8F0"/>`;
      const [lx, ly] = pt(i, 118);
      const anchor = Math.abs(lx - cx) < 8 ? 'middle' : lx > cx ? 'start' : 'end';
      const words = lab.split(' & ');
      g += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="11" font-weight="600" fill="#3B4462">${words.map((w, k) => `<tspan x="${lx}" dy="${k ? 13 : (words.length > 1 ? -2 : 4)}">${esc(w)}${k < words.length - 1 ? ' &amp;' : ''}</tspan>`).join('')}</text>`;
    });
    series.forEach(s => {
      const pts = s.values.map((v, i) => pt(i, v).join(',')).join(' ');
      g += `<polygon points="${pts}" fill="${s.fill || 'none'}" stroke="${s.color}" stroke-width="${s.w || 2}" ${s.dash ? 'stroke-dasharray="4 4"' : ''} style="transition:.4s"/>`;
      if (s.dots) s.values.forEach((v, i) => { const [x, y] = pt(i, v); g += `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" stroke="${s.color}" stroke-width="2"/>`; });
    });
    return `<svg viewBox="0 0 ${size} ${size}" width="100%" style="max-width:${size}px;margin:auto;overflow:visible">${g}</svg>`;
  }

  function line(series, xLabels, o = {}) {
    const W = o.w || 640, H = o.h || 220, pl = 38, pr = 14, pt = 14, pb = 26;
    const all = series.flatMap(s => s.values);
    const min = o.min ?? Math.floor(Math.min(...all) - 1), max = o.max ?? Math.ceil(Math.max(...all) + 1);
    const n = xLabels.length;
    const X = i => pl + i * (W - pl - pr) / (n - 1), Y = v => pt + (H - pt - pb) * (1 - (v - min) / (max - min));
    let g = '';
    const ticks = 4;
    for (let k = 0; k <= ticks; k++) {
      const v = min + (max - min) * k / ticks, y = Y(v);
      g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" stroke="#EEF0F6"/><text x="${pl - 8}" y="${y + 4}" font-size="10.5" fill="#9AA1B9" text-anchor="end">${(Math.round(v * 10) / 10)}${o.suffix || ''}</text>`;
    }
    xLabels.forEach((l, i) => { if (n <= 8 || i % 3 === 0 || i === n - 1) g += `<text x="${X(i)}" y="${H - 6}" font-size="10.5" fill="#9AA1B9" text-anchor="middle">${esc(l)}</text>`; });
    (o.bands || []).forEach(b => { g += `<rect x="${X(b.from)}" y="${pt}" width="${X(b.to) - X(b.from)}" height="${H - pt - pb}" fill="${b.color || 'rgba(91,75,245,.06)'}"/>`; if (b.label) g += `<text x="${X(b.from) + 6}" y="${pt + 13}" font-size="10.5" font-weight="700" fill="#5B4BF5">${esc(b.label)}</text>`; });
    const uid = 'g' + Math.random().toString(36).slice(2, 8);
    series.forEach((s, si) => {
      const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join('');
      if (s.area) {
        g += `<defs><linearGradient id="${uid}${si}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".22"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs>`;
        g += `<path d="${d}L${X(n - 1)},${H - pb}L${X(0)},${H - pb}Z" fill="url(#${uid}${si})"/>`;
      }
      g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.w || 2.4}" stroke-linejoin="round" stroke-linecap="round" ${s.dash ? 'stroke-dasharray="5 5"' : ''}/>`;
      const li = n - 1; g += `<circle cx="${X(li)}" cy="${Y(s.values[li])}" r="4" fill="#fff" stroke="${s.color}" stroke-width="2.4"/>`;
    });
    (o.markers || []).forEach(m => { g += `<line x1="${X(m.x)}" x2="${X(m.x)}" y1="${pt}" y2="${H - pb}" stroke="#5B4BF5" stroke-dasharray="3 3"/><rect x="${X(m.x) - 4}" y="${pt - 2}" width="${m.label.length * 6 + 14}" height="18" rx="5" fill="#5B4BF5"/><text x="${X(m.x) + 3}" y="${pt + 10}" font-size="10.5" font-weight="600" fill="#fff">${esc(m.label)}</text>`; });
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="none" style="height:auto">${g}</svg>`;
  }

  function ring(pct, size = 120, sw = 11, color = 'url(#rg)', inner = '') {
    const r = (size - sw) / 2, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5B4BF5"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="rgba(150,160,200,.18)" stroke-width="${sw}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size / 2} ${size / 2})" style="transition:stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)"/>
      ${inner}</svg>`;
  }

  function spark(values, color = '#5B4BF5', w = 90, h = 28) {
    const min = Math.min(...values), max = Math.max(...values), n = values.length;
    const X = i => i * (w - 4) / (n - 1) + 2, Y = v => h - 3 - (h - 6) * (v - min) / ((max - min) || 1);
    const d = values.map((v, i) => `${i ? 'L' : 'M'}${X(i)},${Y(v)}`).join('');
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${X(n - 1)}" cy="${Y(values[n - 1])}" r="2.6" fill="${color}"/></svg>`;
  }

  // impact (y) vs effort (x) bubble matrix
  function matrix(points, o = {}) {
    const W = o.w || 520, H = o.h || 360, p = 40;
    const X = v => p + (W - p * 1.4) * v / 100, Y = v => H - p - (H - p * 1.8) * v / 100;
    let g = `<rect x="${X(0)}" y="${Y(100)}" width="${X(50) - X(0)}" height="${Y(50) - Y(100)}" fill="#E6F6EC" rx="8"/>
      <rect x="${X(50)}" y="${Y(100)}" width="${X(100) - X(50)}" height="${Y(50) - Y(100)}" fill="#EEEBFF" rx="8"/>
      <rect x="${X(0)}" y="${Y(50)}" width="${X(50) - X(0)}" height="${Y(0) - Y(50)}" fill="#F5F6FB" rx="8"/>
      <rect x="${X(50)}" y="${Y(50)}" width="${X(100) - X(50)}" height="${Y(0) - Y(50)}" fill="#FDF4F6" rx="8"/>
      <text x="${X(2)}" y="${Y(100) + 16}" font-size="11" font-weight="700" fill="#16A34A">QUICK WINS</text>
      <text x="${X(98)}" y="${Y(100) + 16}" font-size="11" font-weight="700" fill="#5B4BF5" text-anchor="end">STRATEGIC BETS</text>
      <text x="${X(2)}" y="${Y(0) - 8}" font-size="11" font-weight="700" fill="#9AA1B9">FILL-INS</text>
      <text x="${X(98)}" y="${Y(0) - 8}" font-size="11" font-weight="700" fill="#E11D48" text-anchor="end">DEPRIORITISE</text>
      <text x="${W / 2}" y="${H - 8}" font-size="11" fill="#6B7390" text-anchor="middle">Effort & cost →</text>
      <text x="12" y="${H / 2}" font-size="11" fill="#6B7390" text-anchor="middle" transform="rotate(-90 12 ${H / 2})">Impact on score & outcomes →</text>`;
    points.forEach(pt => {
      g += `<g style="cursor:pointer" data-open-init="${pt.id}"><circle cx="${X(pt.x)}" cy="${Y(pt.y)}" r="${pt.r}" fill="${pt.color}" fill-opacity=".9" stroke="#fff" stroke-width="3"/>
        <text x="${X(pt.x)}" y="${Y(pt.y) + 4}" font-size="11.5" font-weight="700" fill="#fff" text-anchor="middle">${pt.rank}</text>
        <text x="${pt.x < 50 ? X(pt.x) - pt.r - 6 : X(pt.x) + pt.r + 6}" y="${Y(pt.y) + 4}" font-size="11.5" font-weight="600" fill="#0E1630" text-anchor="${pt.x < 50 ? 'end' : 'start'}">${esc(pt.label)}</text></g>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" width="100%">${g}</svg>`;
  }

  function vbars(rows, o = {}) { // rows: [{label, value, color}]
    const W = o.w || 520, H = o.h || 200, pb = 26, pt = 18, max = o.max || Math.max(...rows.map(r => r.value)) * 1.15;
    const bw = (W - 20) / rows.length;
    let g = '';
    rows.forEach((r, i) => {
      const h = (H - pb - pt) * r.value / max, x = 10 + i * bw + bw * .2, y = H - pb - h;
      g += `<rect x="${x}" y="${y}" width="${bw * .6}" height="${h}" rx="6" fill="${r.color}"/><text x="${x + bw * .3}" y="${y - 6}" font-size="11.5" font-weight="700" fill="#0E1630" text-anchor="middle">${r.value}${o.suffix || ''}</text><text x="${x + bw * .3}" y="${H - 8}" font-size="10.5" fill="#6B7390" text-anchor="middle">${esc(r.label)}</text>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" width="100%">${g}</svg>`;
  }

  return { radar, line, ring, spark, matrix, vbars };
})();
