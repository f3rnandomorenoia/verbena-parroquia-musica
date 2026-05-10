
const playlistEl = document.querySelector('#playlist');
const searchEl = document.querySelector('#search');
const categoryEl = document.querySelector('#category');
const copyBtn = document.querySelector('#copyAll');

const categories = [...new Set(window.PLAYLIST.map(s => s.cat))];
for (const cat of categories) {
  const opt = document.createElement('option');
  opt.value = cat;
  opt.textContent = cat;
  categoryEl.appendChild(opt);
}

function youtubeSearchUrl(song) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.artist} ${song.title}`)}`;
}

function render() {
  const q = searchEl.value.trim().toLowerCase();
  const cat = categoryEl.value;
  const filtered = window.PLAYLIST.filter(s => {
    const hay = `${s.time} ${s.block} ${s.cat} ${s.artist} ${s.title} ${s.note}`.toLowerCase();
    return (!q || hay.includes(q)) && (!cat || s.cat === cat);
  });

  const groups = new Map();
  for (const song of filtered) {
    if (!groups.has(song.block)) groups.set(song.block, []);
    groups.get(song.block).push(song);
  }

  playlistEl.innerHTML = '';
  for (const [block, songs] of groups) {
    const section = document.createElement('section');
    section.className = 'block';
    section.innerHTML = `<h2>${block}<small>${songs.length} canciones</small></h2>`;
    for (const s of songs) {
      const row = document.createElement('article');
      row.className = 'song';
      row.innerHTML = `
        <div class="time">${s.time}</div>
        <div>
          <a class="title song-link" href="${youtubeSearchUrl(s)}" target="_blank" rel="noopener noreferrer" title="Buscar en YouTube">${s.title}</a>
          <div class="artist">${s.artist} · ${s.dur}</div>
          <div class="note">${s.note}</div>
        </div>
        <a class="cat youtube-pill" href="${youtubeSearchUrl(s)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>`;
      section.appendChild(row);
    }
    playlistEl.appendChild(section);
  }
}

function asText() {
  return window.PLAYLIST.map(s => `${s.time} — ${s.artist} - ${s.title} (${s.cat})`).join('\n');
}

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(asText());
  copyBtn.textContent = 'Copiada ✓';
  setTimeout(() => copyBtn.textContent = 'Copiar lista completa', 1800);
});
searchEl.addEventListener('input', render);
categoryEl.addEventListener('change', render);
render();
