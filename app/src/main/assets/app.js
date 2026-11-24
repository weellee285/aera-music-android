function hideAllViews(){["homeView","searchView","artistView","playerWrap"].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display="none";});} function showHome(){document.getElementById("homeView").style.display="flex";document.getElementById("searchView").style.display="none";document.getElementById("artistView").style.display="none";document.getElementById("playerWrap").style.display="none";}
function _oldShowHome(){hideAllViews();document.getElementById("homeView").style.display="flex";} function showPlayer(){hideAllViews();document.getElementById("playerWrap").style.display="flex";} async function openArtist(name){if(!name)return;hideAllViews();const av=document.getElementById("artistView");av.style.display="flex";const hero=document.getElementById("artistHero");const list=document.getElementById("artistTopSongs");hero.innerText="Loading "+name+"...";list.innerText="";const d=await (await fetch("/api/artist?name="+encodeURIComponent(name))).json();hero.innerText="";const im=document.createElement("img");im.src=d.image?d.image:"";im.style.cssText="width:92px;height:92px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid #8bc35a;";const info=document.createElement("div");info.style.flex="1";const nm=document.createElement("div");nm.style.cssText="font-size:24px;font-weight:900;color:#fff;";nm.innerText=d.name;const bio=document.createElement("div");bio.style.cssText="font-size:12px;color:#b5c7bc;margin-top:4px;line-height:1.4;";bio.innerText=d.bio.slice(0,220);const pb=document.createElement("button");pb.className="side-go";pb.style.cssText="margin-top:10px;padding:6px 16px;font-size:12px;";pb.innerText="▶ Play Top Songs";pb.onclick=()=>{if(d.songs.length){tracks=d.songs;renderQueue();playIndex(null,0);}};info.append(nm,bio,pb);hero.append(im,info);tracks=d.songs;renderQueue();d.songs.forEach((t,i)=>{const r=document.createElement("div");r.className="q-item";r.style.background="rgba(255,255,255,0.04)";const num=document.createElement("span");num.style.cssText="width:18px;font-size:11px;color:#7f9488;text-align:center;";num.innerText=i+1;const tw=document.createElement("div");tw.className="q-thumb-wrap";if(t.thumb){const ti=document.createElement("img");ti.src=t.thumb;tw.appendChild(ti);}const inf=document.createElement("div");inf.className="q-info";const te=document.createElement("div");te.className="q-t";te.innerText=t.title;inf.appendChild(te);const dl=document.createElement("button");dl.className="ctrl-btn";dl.style.cssText="font-size:15px;padding:4px 7px;color:#b8c9be;";dl.innerText="↓";dl.onclick=(e)=>{e.stopPropagation();dl.innerText="↻";dl.classList.add("dl-spin");window._activeDlBtn=dl;fetch("/api/download",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Array.of(t))});};const pl=document.createElement("button");pl.className="icon-btn";pl.innerText="▶";pl.onclick=(e)=>playIndex(e,i);r.append(num,tw,inf,dl,pl);list.appendChild(r);});} function renderMainSearch(q){hideAllViews();document.getElementById("searchView").style.display="flex";document.getElementById("searchHeading").innerText="Results for "+q;const card=document.getElementById("topArtistCard");const sl=document.getElementById("searchSongList");card.innerText="";sl.innerText="";if(!tracks.length)return;const top=tracks.slice(0,1).pop();const artName=top.artist?top.artist:q;const im=document.createElement("img");im.src=top.thumb?top.thumb:"";im.style.cssText="width:84px;height:84px;border-radius:50%;object-fit:cover;border:2px solid #8bc35a;";const nm=document.createElement("div");nm.style.cssText="font-size:18px;font-weight:800;color:#fff;";nm.innerText=artName;const tag=document.createElement("span");tag.className="badge-cnt";tag.innerText="Artist • Click for Profile";card.append(im,nm,tag);card.onclick=()=>openArtist(artName);tracks.forEach((t,i)=>{const r=document.createElement("div");r.className="q-item";r.style.background="rgba(255,255,255,0.04)";const tw=document.createElement("div");tw.className="q-thumb-wrap";if(t.thumb){const ti=document.createElement("img");ti.src=t.thumb;tw.appendChild(ti);}const inf=document.createElement("div");inf.className="q-info";const te=document.createElement("div");te.className="q-t";te.innerText=t.title;const ae=document.createElement("div");ae.className="q-a";ae.style.textDecoration="underline";ae.innerText=t.artist?t.artist:"";ae.onclick=(e)=>{e.stopPropagation();openArtist(t.artist);};inf.append(te,ae);const dl=document.createElement("button");dl.className="ctrl-btn";dl.style.cssText="font-size:15px;padding:4px 7px;color:#b8c9be;";dl.innerText="↓";dl.onclick=(e)=>{e.stopPropagation();dl.innerText="↻";dl.classList.add("dl-spin");window._activeDlBtn=dl;fetch("/api/download",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Array.of(t))});};const pl=document.createElement("button");pl.className="icon-btn";pl.innerText="▶";pl.onclick=(e)=>playIndex(e,i);r.append(tw,inf,dl,pl);sl.appendChild(r);});} const GENRES=[{name:"Pop",q:"Top Pop Hits 2026"},{name:"Bangla Rock",q:"Bangla Band Rock Hits"},{name:"Hip-Hop",q:"Hip Hop Rap Hits 2026"},{name:"Lo-Fi",q:"Lofi Hip Hop Beats"},{name:"RnB / Soul",q:"RnB Soul Hits"},{name:"EDM",q:"Electronic Dance Music Hits"},{name:"Acoustic",q:"Acoustic Indie Songs"},{name:"Jazz",q:"Smooth Jazz Classics"}]; async function pickGenre(g){localStorage.setItem("aera_genre",g.name);document.getElementById("sugTitle").innerText="SUGGESTED IN "+g.name.toUpperCase();document.querySelectorAll(".g-card").forEach(el=>el.style.borderColor=el.dataset.g===g.name?"#8bc35a":"rgba(255,255,255,0.06)");const box=document.getElementById("homeSugList");box.innerText="Loading "+g.name+" suggestions...";try{const res=await (await fetch("/api/search?q="+encodeURIComponent(g.q))).json();tracks=res;renderQueue(); if(document.getElementById("q").value.trim()) renderMainSearch(document.getElementById("q").value.trim());box.innerText="";(Array.isArray(res)?res:[]).slice(0,6).forEach((t,i)=>{const r=document.createElement("div");r.className="q-item";r.style.background="rgba(255,255,255,0.04)";const tw=document.createElement("div");tw.className="q-thumb-wrap";if(t.thumb){const im=document.createElement("img");im.src=t.thumb;tw.appendChild(im);}const inf=document.createElement("div");inf.className="q-info";const te=document.createElement("div");te.className="q-t";te.innerText=t.title;const ae=document.createElement("div");ae.className="q-a";ae.innerText=t.artist?t.artist:"";inf.append(te,ae);const dl=document.createElement("button");dl.className="ctrl-btn";dl.style.cssText="font-size:15px;padding:4px 7px;color:#b8c9be;";dl.innerText="↓";dl.onclick=(e)=>{e.stopPropagation();dl.innerText="↻";dl.classList.add("dl-spin");window._activeDlBtn=dl;fetch("/api/download",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Array.of(t))});};const pl=document.createElement("button");pl.className="icon-btn";pl.innerText="▶";pl.onclick=(e)=>playIndex(e,i);r.append(tw,inf,dl,pl);box.appendChild(r);});}catch(e){box.innerText="Err: "+e.message;}} function initGenres(){const gg=document.getElementById("genreGrid");if(!gg)return;gg.innerText="";GENRES.forEach(g=>{const c=document.createElement("div");c.className="q-item g-card";c.dataset.g=g.name;c.style.cssText="justify-content:center;background:rgba(255,255,255,0.05);padding:11px 8px;font-weight:700;font-size:12px;text-align:center;";c.innerText=g.name;c.onclick=()=>pickGenre(g);gg.appendChild(c);});const saved=localStorage.getItem("aera_genre")?localStorage.getItem("aera_genre"):"Pop";const found=GENRES.find(x=>x.name===saved);pickGenre(found?found:GENRES.at(0));} function showHome(){document.getElementById("homeView").style.display="flex";document.getElementById("searchView").style.display="none";document.getElementById("artistView").style.display="none";document.getElementById("playerWrap").style.display="none";}
function _oldShowHome(){document.getElementById("homeView").style.display="flex";document.getElementById("playerWrap").style.display="none";document.getElementById("navHome").classList.add("active");document.getElementById("navNow").classList.remove("active");} function showPlayer(){document.getElementById("homeView").style.display="none";document.getElementById("playerWrap").style.display="flex";document.getElementById("navHome").classList.remove("active");document.getElementById("navNow").classList.add("active");} let tracks = [], selected = new Set(), libSongs = [], syncedLines = [], curIdx = -1, mode = 'search', lrcOpen = false, isShuffle = false, repeatMode = 0, syncOffset = 0, lrcStyle = "line", dataSaver = false, curTrack = null, renderedLineIdx = -2;
const audio = document.getElementById('audio');

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const cfg = await (await fetch('/api/settings')).json();
    dataSaver = !!cfg.data_saver;
    updateSaverUI();
    loadLibrary(true); initGenres(); const hr=new Date().getHours(); document.getElementById("greetText").innerText=hr<12?"Good Morning":(hr<18?"Good Afternoon":"Good Evening");
  } catch (e) {}
});

setInterval(async () => {
  try {
    const r = await (await fetch('/api/status')).json();
    document.getElementById('st').innerText = r.text;
    document.getElementById('bar').style.width = r.pct + '%'; if(r.pct>=100 && window._activeDlBtn){window._activeDlBtn.classList.remove("dl-spin");window._activeDlBtn.classList.add("dl-done");window._activeDlBtn.innerText="✓";window._activeDlBtn=null;loadLibrary(true); initGenres(); const hr=new Date().getHours(); document.getElementById("greetText").innerText=hr<12?"Good Morning":(hr<18?"Good Afternoon":"Good Evening");}
  } catch (e) {}
}, 700);

function updateSaverUI() {
  const btn = document.getElementById('saverBtn');
  btn.classList.toggle('on', dataSaver);
  btn.innerText = dataSaver ? 'Data Saver: ON (96k)' : 'Data Saver: OFF';
}

async function toggleDataSaver() {
  dataSaver = !dataSaver;
  updateSaverUI();
  await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data_saver: dataSaver }) });
}

async function restoreData() {
  const r = await (await fetch('/api/import_data')).json();
  if (r.ok) {
    const cfg = await (await fetch('/api/settings')).json();
    dataSaver = !!cfg.data_saver;
    updateSaverUI();
    loadLibrary(false);
  }
}

async function addLocalSongs() {
  const r = await (await fetch('/api/add_local')).json();
  if (r.added > 0) setTab('lib');
}

function shiftSync(d) { syncOffset = Math.round((syncOffset + d) * 10) / 10; document.getElementById("syncLbl").innerText = (syncOffset > 0 ? "+" : "") + syncOffset.toFixed(1) + "s"; renderedLineIdx = -2; onTick(); }
function toggleLyricStyle() { lrcStyle = lrcStyle === "rolling" ? "line" : "rolling"; document.getElementById("lrcStyleBtn").innerText = lrcStyle === "rolling" ? "Style: Rolling" : "Style: Full Line"; renderedLineIdx = -2; onTick(); }
function toggleLyrics() {
  lrcOpen = !lrcOpen;
  document.getElementById('lyricsDrawer').classList.toggle('open', lrcOpen);
  document.getElementById('lrcBtn').classList.toggle('open', lrcOpen);
}

function setTab(t) {
  mode = t;
  document.getElementById('navNow').classList.toggle('active', t === 'search');
  document.getElementById('navLib').classList.toggle('active', t === 'lib');
  document.getElementById('navLiked').classList.toggle('active', t === 'liked');
  document.getElementById('dlBar').style.display = t === 'search' ? 'block' : 'none';
  document.getElementById('refreshLibBtn').style.display = t === 'search' ? 'none' : 'inline-block';
  if (t === 'search') renderQueue(); if(document.getElementById("q").value.trim()) renderMainSearch(document.getElementById("q").value.trim());
  else loadLibrary(false);
}

function quickSearch(term) {
  document.getElementById('q').value = term;
  doSearch();
}

async function doSearch() {
  const q = document.getElementById('q').value.trim();
  if (!q) return;
  setTab('search');
  document.getElementById('st').innerText = 'Searching...';
  if (q.startsWith('http')) {
    fetch('/api/download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Array.of({ url: q, title: '', artist: '', album: '' })) });
    return;
  }
  tracks = await (await fetch('/api/search?q=' + encodeURIComponent(q))).json();
  selected.clear();
  if (tracks.length > 0) selected.add(0);
  renderQueue(); if(document.getElementById("q").value.trim()) renderMainSearch(document.getElementById("q").value.trim());
}

function getActiveList() {
  if (mode === 'lib') return libSongs;
  if (mode === 'liked') return libSongs.filter(s => s.liked);
  return tracks;
}

function renderQueue(){document.getElementById("rightTitle").innerText=mode==="lib"?"Your Library":(mode==="liked"?"Liked Songs":"Search Results");const _raw=getActiveList();const list=Array.isArray(_raw)?_raw:[];const c=document.getElementById("queueList");c.innerText="";list.forEach((t,i)=>{const r=document.createElement("div");r.className="q-item"+((mode==="search"&&selected.has(i))?" selected":"");r.onclick=()=>handleItemClick(i);const tw=document.createElement("div");tw.className="q-thumb-wrap";if(t.thumb){const im=document.createElement("img");im.src=t.thumb;tw.appendChild(im);}const inf=document.createElement("div");inf.className="q-info";const te=document.createElement("div");te.className="q-t";te.innerText=t.title;const ae=document.createElement("div");ae.className="q-a";ae.innerText=t.artist?t.artist:(t.album?t.album:"");inf.append(te,ae);r.append(tw,inf);if(mode==="search"){const dl=document.createElement("button");dl.className="ctrl-btn";dl.style.cssText="font-size:15px;padding:4px 7px;color:#b8c9be;";dl.innerText="↓";dl.title="Download MP3";dl.onclick=(e)=>{e.stopPropagation();dl.innerText="↻";dl.classList.add("dl-spin");window._activeDlBtn=dl;fetch("/api/download",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Array.of(t))});};r.appendChild(dl);}else{const lk=document.createElement("button");lk.className="ctrl-btn";lk.style.cssText="padding:4px;color:"+(t.liked?"#ff5c77":"#7f9488");lk.innerText="♥";lk.onclick=(e)=>toggleRowLike(e,encodeURIComponent(t.path));r.appendChild(lk);}const pl=document.createElement("button");pl.className="icon-btn";pl.innerText="▶";pl.onclick=(e)=>playIndex(e,i);r.appendChild(pl);c.appendChild(r);});}

function handleItemClick(i) {
  if (mode !== 'search') return playIndex(null, i);
  selected.has(i) ? selected.delete(i) : selected.add(i);
  renderQueue(); if(document.getElementById("q").value.trim()) renderMainSearch(document.getElementById("q").value.trim());
}

async function toggleRowLike(e, encPath) {
  e.stopPropagation();
  const path = decodeURIComponent(encPath);
  await fetch('/api/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: path }) });
  await loadLibrary(false);
  if (curTrack && curTrack.path === path) {
    curTrack.liked = !curTrack.liked;
    document.getElementById('heroLikeBtn').classList.toggle('liked', curTrack.liked);
  }
}

async function toggleHeroLike() {
  if (!curTrack || !curTrack.path) return alert('Download or add the song to Your Library first to Like it!');
  await fetch('/api/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: curTrack.path }) });
  curTrack.liked = !curTrack.liked;
  document.getElementById('heroLikeBtn').classList.toggle('liked', curTrack.liked);
  loadLibrary(mode === 'search');
}

async function playIndex(e, i) {
  if (e) e.stopPropagation();
  curIdx = i;
  const list = getActiveList();
  const t = list.at(i);
  if (!t) return;
  curTrack = t; showPlayer();
  renderedLineIdx = -2;
  document.getElementById('heroTitle').innerText = t.title;
  document.getElementById('heroArtist').innerText = t.artist || t.album;
  document.getElementById('miniTitle').innerText = t.title;
  document.getElementById('kTrackLabel').innerText = t.title;
  document.getElementById('heroLikeBtn').classList.toggle('liked', !!t.liked);
  if (t.thumb) {
    document.getElementById('heroArt').src = t.thumb; document.getElementById('heroArt').style.display = 'block'; document.getElementById('heroNote').style.display = 'none';
    document.getElementById('miniArt').src = t.thumb; document.getElementById('miniArt').style.display = 'block'; document.getElementById('miniNote').style.display = 'none';
    document.getElementById('kineticBg').style.backgroundImage = 'url("' + t.thumb + '")';
  }
  setKineticMessage('FETCHING LYRICS...');
  if (t.path) {
    audio.src = '/api/audio?path=' + encodeURIComponent(t.path);
    audio.play();
    const lrc = await (await fetch('/api/lyrics?path=' + encodeURIComponent(t.path))).json();
    parseLyrics(lrc.lyrics);
  } else {
    audio.src = '/api/stream?url=' + encodeURIComponent(t.url);
    audio.play();
    try { const lrc = await (await fetch('/api/live_lyrics?title=' + encodeURIComponent(t.title) + '&artist=' + encodeURIComponent(t.artist))).json();
    parseLyrics(lrc.lyrics); } catch(e) { setKineticMessage('NO SYNCED LYRICS FOUND'); }
  }
  updatePlayState(true);
}

function setKineticMessage(msg) {
  document.getElementById('kPrev').innerText = '';
  document.getElementById('kNext').innerText = '';
  document.getElementById('kMain').innerHTML = '<span class="k-word lit">' + msg + '</span>';
}

function togglePlay() {
  if (!audio.src) return;
  if (audio.paused) { audio.play(); updatePlayState(true); }
  else { audio.pause(); updatePlayState(false); }
}

function updatePlayState(isPlaying) {
  document.getElementById('playBtn').innerText = isPlaying ? '❚❚' : '▶';
  document.getElementById('w1').classList.toggle('playing', isPlaying);
  document.getElementById('w2').classList.toggle('playing', isPlaying);
  document.getElementById('heroBox').classList.toggle('playing', isPlaying);
}

function prevTrack() { if (curIdx > 0) playIndex(null, curIdx - 1); }
function toggleHelp(){const m=document.getElementById("helpModal");if(m)m.style.display=m.style.display==="flex"?"none":"flex";} function showToast(m){const t=document.getElementById("toast");if(!t)return;t.innerText=m;t.style.opacity="1";clearTimeout(window._tt);window._tt=setTimeout(()=>t.style.opacity="0",1400);} function toggleShuffle(){isShuffle=!isShuffle;const b=document.getElementById("shufBtn");if(b)b.style.color=isShuffle?"#8bc35a":"#b8c9be";showToast("Shuffle: "+(isShuffle?"ON":"OFF"));} function toggleRepeat(){repeatMode=(repeatMode+1)%3;const b=document.getElementById("repBtn");const lbl=["OFF","ALL","ONE"];if(b){b.style.color=repeatMode?"#8bc35a":"#b8c9be";b.innerText=repeatMode===2?"↻1":"↻";}showToast("Repeat: "+lbl.at(repeatMode));} function nextTrack(){const _raw=getActiveList();const list=Array.isArray(_raw)?_raw:[];if(!list.length)return;if(repeatMode===2){audio.currentTime=0;audio.play();return;}if(isShuffle&&list.length>1){let r=curIdx;while(r===curIdx)r=Math.floor(Math.random()*list.length);playIndex(null,r);return;}if(curIdx+1<list.length)playIndex(null,curIdx+1);else if(repeatMode===1)playIndex(null,0);}
function seekAudio(val) { if (audio.duration) audio.currentTime = (val / 100) * audio.duration; }
function fmt(s) { if (!s || isNaN(s)) return '0:00'; const m = Math.floor(s / 60), sec = Math.floor(s % 60); return m + ':' + (sec < 10 ? '0' : '') + sec; }

function onTick() {
  document.getElementById('curTime').innerText = fmt(audio.currentTime);
  document.getElementById('durTime').innerText = fmt(audio.duration);
  if (audio.duration) document.getElementById('seekBar').value = (audio.currentTime / audio.duration) * 100;
  if (!syncedLines.length) return;

  let active = 0;
  for (let i = 0; i < syncedLines.length; i++) {
    if (audio.currentTime >= syncedLines.at(i).time) active = i;
  }

  const curLine = syncedLines.at(active);
  const nextLine = syncedLines.at(active + 1);
  const prevLine = active > 0 ? syncedLines.at(active - 1) : null;

  if (lrcStyle === "line") {
    if (renderedLineIdx !== active) {
      renderedLineIdx = active;
      const pEl = document.getElementById('kPrev'); const nEl = document.getElementById('kNext');
      pEl.style.fontSize = '16px'; nEl.style.fontSize = '16px';
      pEl.innerText = prevLine ? prevLine.text : '';
      nEl.innerText = nextLine ? nextLine.text : '';
      const mainEl = document.getElementById('kMain');
      mainEl.style.fontSize = '30px'; mainEl.innerText = '';
      const sp = document.createElement('span');
      sp.className = 'k-word'; sp.style.animation = 'rollUp 4.2s cubic-bezier(0.22, 1, 0.36, 1) forwards'; pEl.style.animation = 'none'; nEl.style.animation = 'none'; void pEl.offsetWidth; pEl.style.animation = 'sideGlide 4.2s ease-out forwards'; nEl.style.animation = 'sideGlide 4.2s ease-out forwards';
      sp.innerText = curLine.text;
      mainEl.appendChild(sp);
    }
    return;
  }
  document.getElementById('kPrev').style.fontSize = '26px';
  document.getElementById('kNext').style.fontSize = '26px';
  document.getElementById('kMain').style.fontSize = '54px';
  const words = curLine.text.split(' ').filter(Boolean);
  const lineStart = curLine.time;
  const lineEnd = nextLine ? Math.min(nextLine.time, lineStart + 4.0) : (lineStart + 3.0);
  const span = Math.max(0.35, (lineEnd - lineStart) * 0.92);
  const progress = Math.min(0.999, Math.max(0, (tNow - lineStart) / span));

  const wIdx = Math.min(words.length - 1, Math.floor(progress * words.length));
  const burstKey = active + '_' + wIdx;

  if (renderedLineIdx !== burstKey) {
    renderedLineIdx = burstKey;
    const prevWord = wIdx > 0 ? words.at(wIdx - 1) : (prevLine ? prevLine.text.split(' ').filter(Boolean).pop() || '' : '');
    const nextWord = wIdx + 1 < words.length ? words.at(wIdx + 1) : (nextLine ? nextLine.text.split(' ').filter(Boolean).at(0) || '' : '');

    document.getElementById('kPrev').innerText = prevWord;
    document.getElementById('kNext').innerText = nextWord;

    const mainEl = document.getElementById('kMain');
    mainEl.innerText = '';
    const sp = document.createElement('span');
    sp.className = 'k-word';
    sp.style.animation = 'rollUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    sp.innerText = words.at(wIdx);
    mainEl.appendChild(sp);
  }
}

function downloadCurrent() {
  if (!curTrack) return alert('Play a song first to download it!');
  if (curTrack.path) return alert('This song is already saved in Your Library!');
  fetch('/api/download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Array.of(curTrack)) });
}
function downloadSelected() {
  const items = Array.from(selected).map(i => tracks.at(i));
if (!items.length) return alert('Select a track from Search Results first!');
fetch('/api/download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
}
async function loadLibrary(silent) {
libSongs = await (await fetch('/api/library')).json();
document.getElementById('libCnt').innerText = libSongs.length;
document.getElementById('likeCnt').innerText = libSongs.filter(s => s.liked).length;
if (!silent) renderQueue(); if(document.getElementById("q").value.trim()) renderMainSearch(document.getElementById("q").value.trim());
}
function parseLyrics(raw) {
syncedLines = [];
renderedLineIdx = -2;
if (!raw) { setKineticMessage('NO SYNCED LYRICS FOUND'); return; }
raw.split('\n').forEach(line => {
if (line.startsWith('[') && line.includes(']')) {
const end = line.indexOf(']');
const parts = line.slice(1, end).split(':');
if (parts.length === 2 && !isNaN(parts.at(0))) {
syncedLines.push({ time: parseInt(parts.at(0)) * 60 + parseFloat(parts.at(1)), text: line.slice(end + 1).trim() || '•' });
}
}
});
if (!syncedLines.length) setKineticMessage(raw.split('\n').slice(0, 2).join(' ')); else onTick();
}
document.addEventListener("keydown",(e)=>{const tag=(document.activeElement&&document.activeElement.tagName)||"";const typing=tag==="INPUT"||tag==="TEXTAREA";const k=e.key.toLowerCase();if(e.ctrlKey&&e.shiftKey&&k==="o"){e.preventDefault();fetch("/api/open");showToast("Opening Music Folder");return;}if(e.ctrlKey&&!e.shiftKey&&k==="o"){e.preventDefault();addLocalSongs();return;}if(e.ctrlKey&&k==="f"){e.preventDefault();const q=document.getElementById("q");if(q){q.focus();q.select();}return;}if(e.key==="Escape"){const hm=document.getElementById("helpModal");if(hm&&hm.style.display==="flex"){toggleHelp();return;}if(lrcOpen)toggleLyrics();return;}if(typing)return;if(e.code==="Space"){e.preventDefault();togglePlay();}else if(e.key==="ArrowRight"){e.preventDefault();nextTrack();}else if(e.key==="ArrowLeft"){e.preventDefault();prevTrack();}else if(e.key==="ArrowUp"){e.preventDefault();audio.volume=Math.min(1,Math.round((audio.volume+0.1)*10)/10);showToast("Volume: "+Math.round(audio.volume*100)+"%");}else if(e.key==="ArrowDown"){e.preventDefault();audio.volume=Math.max(0,Math.round((audio.volume-0.1)*10)/10);showToast("Volume: "+Math.round(audio.volume*100)+"%");}else if(k==="m"){audio.muted=!audio.muted;showToast(audio.muted?"Muted":"Unmuted ("+Math.round(audio.volume*100)+"%)");}else if(k==="s"){toggleShuffle();}else if(k==="r"){toggleRepeat();}else if(k==="l"){toggleHeroLike();}else if(k==="d"){if(curTrack&&!curTrack.path){fetch("/api/download",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Array.of(curTrack))});showToast("Downloading: "+curTrack.title);}else if(curTrack){showToast("Already in Library");}}});
