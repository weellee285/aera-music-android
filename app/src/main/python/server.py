import os, re, json, threading, ssl, urllib.request, urllib.parse
from flask import Flask, request, jsonify, send_file, Response
import yt_dlp

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "assets"))
MUSIC_DIR = "/storage/emulated/0/Music/AeraMusic"
os.makedirs(MUSIC_DIR, exist_ok=True)
DATA_FILE = os.path.join(MUSIC_DIR, "aera_data.json")
status = {"text": "Ready", "pct": 0}

def load_data():
    if os.path.exists(DATA_FILE):
        try: return json.load(open(DATA_FILE, "r", encoding="utf-8"))
        except Exception: pass
    return {"liked": [], "data_saver": False}

def save_data(d):
    try: json.dump(d, open(DATA_FILE, "w", encoding="utf-8"), indent=2)
    except Exception: pass

def query_lrclib(title, artist=""):
    D = chr(46)
    WK_URL = "https://lrclib" + D + "net/api/search?"
    clean = (title or "").split("(").pop(0).split("[").pop(0).strip()
    if " - " in clean:
        artist, clean = [x.strip() for x in clean.split(" - ", 1)]
    ctx = ssl._create_unverified_context()
    for q in ([f"{artist} {clean}".strip(), clean] if artist else [clean]):
        if not q: continue
        try:
            req = urllib.request.Request(WK_URL + urllib.parse.urlencode({"q": q}), headers={"User-Agent": "AeraMusic/1.0"})
            data = json.loads(urllib.request.urlopen(req, timeout=6, context=ctx).read().decode("utf-8"))
            for item in data:
                if item.get("syncedLyrics"): return item["syncedLyrics"]
            for item in data:
                if item.get("plainLyrics"): return item["plainLyrics"]
        except Exception: continue
    return ""

@app.route("/")
def index(): return send_file(os.path.join(ASSETS_DIR, "ui.html"))

@app.route("/app.js")
def app_js(): return send_file(os.path.join(ASSETS_DIR, "app.js"), mimetype="application/javascript")

@app.route("/api/status")
def api_status(): return jsonify(status)

@app.route("/api/settings", methods=["GET", "POST"])
def api_settings():
    d = load_data()
    if request.method == "POST":
        d["data_saver"] = bool((request.json or {}).get("data_saver", False))
        save_data(d)
    return jsonify({"data_saver": d.get("data_saver", False)})

@app.route("/api/search")
def api_search():
    q = request.args.get("q", "").strip()
    if not q: return jsonify([])
    D = chr(46)
    YT = "https://i" + D + "ytimg" + D + "com/vi/"
    res = []
    try:
        with yt_dlp.YoutubeDL({"quiet": True, "extract_flat": "in_playlist"}) as ydl:
            info = ydl.extract_info(f"ytsearch8:{q}", download=False)
        for e in (info or {}).get("entries", []):
            if not e or not e.get("id"): continue
            vid = e.get("id")
            res.append({"url": vid, "title": e.get("title", ""), "artist": e.get("uploader") or q, "album": q, "thumb": YT + f"{vid}/hqdefault.jpg"})
    except Exception: pass
    return jsonify(res)

@app.route("/api/stream")
def api_stream():
    vid = request.args.get("url", "")
    full = vid if vid.startswith("http") else f"https://youtube.com{vid}"
    with yt_dlp.YoutubeDL({"quiet": True, "format": "bestaudio/best"}) as ydl:
        info = ydl.extract_info(full, download=False)
        stream_url = info.get("url")
    req = urllib.request.Request(stream_url, headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req)
    return Response(resp.read(), mimetype="audio/mp4")

@app.route("/api/live_lyrics")
def api_live_lyrics():
    return jsonify({"lyrics": query_lrclib(request.args.get("title", ""), request.args.get("artist", ""))})

@app.route("/api/library")
def api_library():
    d = load_data()
    liked = set(d.get("liked", []))
    out = []
    for fn in sorted(os.listdir(MUSIC_DIR)):
        if fn.lower().endswith((".mp3", ".m4a", ".webm", ".opus")):
            p = os.path.join(MUSIC_DIR, fn)
            out.append({"path": p, "title": os.path.splitext(fn)[0], "artist": "Saved Track", "album": "Aera Music", "liked": p in liked})
    return jsonify(out)

@app.route("/api/audio")
def api_audio(): return send_file(request.args.get("path", ""))

@app.route("/api/like", methods=["POST"])
def api_like():
    p = (request.json or {}).get("path", "")
    d = load_data()
    lk = set(d.get("liked", []))
    lk.remove(p) if p in lk else lk.add(p)
    d["liked"] = list(lk)
    save_data(d)
    return jsonify({"ok": True})

@app.route("/api/download", methods=["POST"])
def api_download():
    items = request.json or []
    def worker():
        for it in items:
            vid = it.get("url", "")
            full = vid if vid.startswith("http") else f"https://youtube.com{vid}"
            status.update({"text": f"Downloading {it.get('title','track')}...", "pct": 35})
            ydl_opts = {"quiet": True, "format": "bestaudio[ext=m4a]/bestaudio", "outtmpl": os.path.join(MUSIC_DIR, "%(title)s.%(ext)s")}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([full])
            status.update({"text": "Saved to Music/AeraMusic!", "pct": 100})
    threading.Thread(target=worker, daemon=True).start()
    return jsonify({"ok": True})

def start_server():
    threading.Thread(target=lambda: app.run(host="127.0.0.1", port=5000, threaded=True), daemon=True).start()
