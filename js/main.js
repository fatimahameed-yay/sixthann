(() => {
  "use strict";

  const M = window.MAG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem("mag:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("mag:" + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------------------------------------------------
     1. Fill in names / issue details from config.js
     --------------------------------------------------------- */
  const start = new Date(M.together + "T00:00:00");
  const cfg = Object.assign({}, M, {
    togetherPretty: isNaN(start) ? "" : start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  });
  $$("[data-cfg]").forEach((el) => { const v = cfg[el.dataset.cfg]; if (v != null) el.textContent = v; });
  $$("[data-name]").forEach((el) => { el.textContent = el.dataset.name === "a" ? M.nameA : M.nameB; });
  $$("[data-initial]").forEach((el) => { el.textContent = (el.dataset.initial === "a" ? M.nameA : M.nameB).trim().charAt(0).toUpperCase(); });
  $$("[data-song]").forEach((el) => { el.textContent = (M.song && M.song[el.dataset.song]) || ""; });
  document.title = `${M.title} · ${M.edition}`;

  /* ---------------------------------------------------------
     2. Image slots — images/imageN.(png|jpg|…) or the mockup
     --------------------------------------------------------- */
  const camIcon = '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  $$(".ph[data-img]").forEach((fig) => {
    const n = fig.dataset.img;
    const wrap = document.createElement("div");
    wrap.className = "ph-img";
    const img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.draggable = false;
    const label = document.createElement("span");
    label.className = "ph-label";
    label.innerHTML = `${camIcon}image${n}.png`;
    wrap.append(img, label);
    fig.prepend(wrap);

    // exact filename from config.js first, then guess common extensions
    const tries = [];
    if (M.images && M.images[n]) tries.push(`images/${M.images[n]}`);
    (M.imageExts || []).forEach((ext) => tries.push(`images/image${n}.${ext}`));
    let i = 0;
    const next = () => {
      if (i < tries.length) {
        img.src = tries[i++];
      } else {
        img.onerror = null;
        fig.classList.add("is-mock");
        img.src = M.mockup;
      }
    };
    img.onerror = next;
    next();
  });

  /* ---------------------------------------------------------
     3. Folios (page numbers)
     --------------------------------------------------------- */
  const pages = $$("#book > .page");
  const total = pages.length;
  pages.forEach((p, i) => {
    const pg = $(".pg", p);
    if (pg.hasAttribute("data-nofolio")) return;
    const num = `<span>${String(i).padStart(2, "0")}</span>`;
    const name = `<span>${esc(M.title)} · ${esc(M.issue)}</span>`;
    const f = document.createElement("div");
    f.className = "folio";
    f.innerHTML = i % 2 ? num + name : name + num;
    pg.append(f);
  });

  // Elements that need normal clicks/typing must not start a page drag
  // (and hovering or tapping them must not fold a page corner either)
  let downInNoFlip = false;
  const dragging = () => { const s = window.__flipbook && window.__flipbook.getState(); return s === "user_fold" || s === "flipping"; };
  const noFlip = (el) => {
    ["mousedown", "touchstart"].forEach((ev) => el.addEventListener(ev, (e) => { downInNoFlip = true; e.stopPropagation(); }, { passive: true }));
    ["mousemove", "touchmove"].forEach((ev) => el.addEventListener(ev, (e) => { if (!dragging()) e.stopPropagation(); }, { passive: true }));
  };
  ["mouseup", "touchend"].forEach((ev) => window.addEventListener(ev, (e) => {
    if (downInNoFlip) { downInNoFlip = false; e.stopImmediatePropagation(); }
  }, true));
  $$(".no-flip").forEach(noFlip);

  const burst = (host, x, y, count = 14) => {
    for (let k = 0; k < count; k++) {
      const h = document.createElement("span");
      h.className = "burst";
      h.textContent = "♥︎";
      h.style.left = x + "%";
      h.style.top = y + "%";
      h.style.setProperty("--dx", (Math.random() * 16 - 8) + "em");
      h.style.setProperty("--dy", (-Math.random() * 12 - 2) + "em");
      h.style.setProperty("--rot", (Math.random() * 80 - 40) + "deg");
      h.style.animationDelay = (Math.random() * .25) + "s";
      host.append(h);
      setTimeout(() => h.remove(), 2000);
    }
  };

  /* ---------------------------------------------------------
     4. By the Numbers — live counters
     --------------------------------------------------------- */
  const tick = () => {
    if (isNaN(start)) return;
    const ms = Math.max(0, Date.now() - start.getTime());
    const days = Math.floor(ms / 864e5);
    const hours = Math.floor(ms / 36e5);
    const mins = Math.floor(ms / 6e4);
    $("#nuDays").textContent = days.toLocaleString("en-US");
    $("#nuHours").textContent = hours.toLocaleString("en-US");
    $("#nuLive").textContent = `${mins.toLocaleString("en-US")} minutes of loving you`;
  };
  tick();
  setInterval(tick, 30000);

  /* ---------------------------------------------------------
     6. Bucket list
     --------------------------------------------------------- */
  (() => {
    const list = $("#bucketList");
    const done = store.get("bucket", []);
    const count = () => {
      const n = $$("input:checked", list).length;
      $("#bucketCount").textContent = `${n} of ${M.bucket.length} done · ${n === M.bucket.length ? "time for a new list!" : "so many adventures left ♥︎"}`;
    };
    M.bucket.forEach((t, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<label><input type="checkbox"${done.includes(i) ? " checked" : ""}><span>${esc(t)}</span></label>`;
      list.append(li);
    });
    list.addEventListener("change", () => {
      store.set("bucket", $$("input", list).map((el, i) => (el.checked ? i : -1)).filter((i) => i >= 0));
      count();
    });
    count();
  })();

  /* ---------------------------------------------------------
     7. Love coupons
     --------------------------------------------------------- */
  (() => {
    const grid = $("#coupons");
    const red = store.get("coupons", {});
    M.coupons.forEach((c, i) => {
      const b = document.createElement("button");
      b.className = "coupon" + (red[i] ? " redeemed" : "");
      b.innerHTML = `<span class="cp-good">Good for one</span><span class="cp-t">${esc(c.t)}</span><span class="cp-s">${esc(c.s)}</span><span class="cp-stamp">Redeemed<small>${red[i] || ""}</small></span>`;
      b.addEventListener("click", () => {
        if (red[i]) { delete red[i]; b.classList.remove("redeemed"); }
        else {
          red[i] = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          $("small", b).textContent = red[i];
          b.classList.add("redeemed");
        }
        store.set("coupons", red);
      });
      grid.append(b);
    });
  })();

  /* ---------------------------------------------------------
     8. The record: plays audio/cuppycake.mp3 if you add one,
        otherwise the official YouTube upload in a small player
     --------------------------------------------------------- */
  (() => {
    const vinyl = $("#vinyl"), tap = $("#muTap"), np = $("#np");
    const song = M.song || {};
    let mode = null, audio = null, yt = null, playing = false;
    const setPlaying = (on) => {
      playing = on;
      vinyl.classList.toggle("playing", on);
      tap.textContent = on ? `now playing: ${song.title} ♡` : "tap the record to play our song";
    };
    const loadYT = () => new Promise((res) => {
      if (window.YT && window.YT.Player) return res();
      const before = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (before) before(); res(); };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        document.head.append(s);
      }
    });
    const playYT = async () => {
      np.hidden = false;
      if (yt && yt.playVideo) { yt.playVideo(); return; }
      await loadYT();
      yt = new YT.Player("ytFrame", {
        width: 216, height: 200, videoId: song.youtubeId,
        playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: (e) => e.target.playVideo(),
          onStateChange: (e) => { if (e.data === 1) setPlaying(true); else if (e.data === 2 || e.data === 0) setPlaying(false); }
        }
      });
    };
    const playFile = () => {
      if (!audio) {
        audio = new Audio(song.file);
        audio.addEventListener("ended", () => setPlaying(false));
      }
      return audio.play().then(() => { mode = "file"; setPlaying(true); });
    };
    vinyl.addEventListener("click", () => {
      if (playing) {
        if (mode === "file") audio.pause(); else if (yt && yt.pauseVideo) yt.pauseVideo();
        setPlaying(false);
        return;
      }
      if (mode === "file") { playFile().catch(() => {}); return; }
      if (mode === "yt") { playYT(); return; }
      playFile().catch(() => { audio = null; mode = "yt"; if (song.youtubeId) playYT(); });
    });
    $("#npClose").addEventListener("click", () => {
      if (yt && yt.stopVideo) yt.stopVideo();
      np.hidden = true;
      setPlaying(false);
    });
  })();


  /* ---------------------------------------------------------
     9. Who's more likely to…
     --------------------------------------------------------- */
  (() => {
    const S = { i: 0, a: 0, b: 0, order: [] };
    const prompt = $("#ltPrompt"), card = $(".lt-card"), choices = $(".lt-choices"), result = $("#ltResult"), prog = $("#ltProgress");
    const show = () => {
      if (S.i < S.order.length) {
        prog.textContent = `Card ${S.i + 1} of ${S.order.length}`;
        prompt.classList.add("swap");
        setTimeout(() => { prompt.textContent = S.order[S.i]; prompt.classList.remove("swap"); }, 180);
        return;
      }
      prog.textContent = "The results are in";
      card.hidden = true; choices.hidden = true; result.hidden = false;
      const max = Math.max(S.a, S.b, 1);
      $("#ltScoreA").textContent = S.a; $("#ltScoreB").textContent = S.b;
      $("#ltBarA").style.width = "0"; $("#ltBarB").style.width = "0";
      requestAnimationFrame(() => setTimeout(() => {
        $("#ltBarA").style.width = (S.a / max * 100) + "%";
        $("#ltBarB").style.width = (S.b / max * 100) + "%";
      }, 50));
      const diff = Math.abs(S.a - S.b);
      $("#ltVerdict").textContent = diff === 0 ? "A perfect tie. Made for each other."
        : diff <= 2 ? `Neck and neck, but ${S.a > S.b ? M.nameA : M.nameB} takes the crown.`
        : `${S.a > S.b ? M.nameA : M.nameB}, this one's all you. No further questions.`;
    };
    const begin = () => {
      Object.assign(S, { i: 0, a: 0, b: 0, order: shuffle(M.likely.slice()) });
      card.hidden = false; choices.hidden = false; result.hidden = true;
      show();
    };
    $$("[data-pick]").forEach((b) => b.addEventListener("click", () => {
      if (S.i >= S.order.length) return;
      S[b.dataset.pick]++; S.i++; show();
    }));
    $("#ltAgain").addEventListener("click", begin);
    begin();
  })();

  /* ---------------------------------------------------------
     10. Love-opoly
     --------------------------------------------------------- */
  (() => {
    const board = $("#board");
    const coords = [];
    for (let c = 5; c >= 1; c--) coords.push([7, c, "b"]);
    for (let r = 6; r >= 1; r--) coords.push([r, 1, "l"]);
    for (let c = 2; c <= 5; c++) coords.push([1, c, "t"]);
    for (let r = 2; r <= 6; r++) coords.push([r, 5, "r"]);
    const corners = [0, 4, 10, 14];
    const bands = ["#8C2E3E", "#867B18", "#8fbfba", "#e2bb55"];
    const tiles = coords.map(([r, c, side], i) => {
      const t = document.createElement("div");
      const isCorner = corners.includes(i);
      t.className = "tile " + (isCorner ? "corner" : "side-" + side);
      t.style.gridRow = r;
      t.style.gridColumn = c;
      t.style.setProperty("--band", bands[i % bands.length]);
      t.innerHTML = `<span>${esc((M.board[i] && M.board[i].t) || "")}</span>`;
      board.append(t);
      return t;
    });
    const token = $("#token");
    token.textContent = "♥︎";
    let pos = store.get("boardPos", 0);
    const place = (i) => {
      const [r, c] = coords[i];
      token.style.left = ((c - .5) / 5 * 100) + "%";
      token.style.top = ((r - .5) / 7 * 100) + "%";
    };
    place(pos);

    const die = $("#die");
    const pips = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
    const face = (n) => $$("i", die).forEach((el, k) => { el.style.visibility = pips[n].includes(k + 1) ? "visible" : "hidden"; });
    face(1);
    const msg = $("#bdMsg");
    let busy = false;
    die.addEventListener("click", () => {
      if (busy) return;
      busy = true;
      die.classList.add("rolling");
      let spins = 0;
      const roll = 1 + Math.floor(Math.random() * 6);
      const spin = setInterval(() => {
        face(1 + Math.floor(Math.random() * 6));
        if (++spins > 9) {
          clearInterval(spin);
          face(roll);
          die.classList.remove("rolling");
          let steps = 0, passedGo = false;
          const walk = setInterval(() => {
            pos = (pos + 1) % coords.length;
            if (pos === 0) passedGo = true;
            place(pos);
            if (++steps >= roll) {
              clearInterval(walk);
              const sq = M.board[pos] || { t: "", p: "" };
              tiles[pos].classList.remove("land");
              void tiles[pos].offsetWidth;
              tiles[pos].classList.add("land");
              msg.innerHTML = `<b>You rolled ${roll} · ${esc(sq.t)}</b>${esc(sq.p)}${passedGo && pos !== 0 ? " <i>(+1 kiss for passing START)</i>" : ""}`;
              store.set("boardPos", pos);
              busy = false;
            }
          }, 260);
        }
      }, 70);
    });
  })();

  /* ---------------------------------------------------------
     11. Crossword — auto layout from config words
     --------------------------------------------------------- */
  (() => {
    const words = M.crossword
      .map((w) => ({ ans: String(w.answer).toUpperCase().replace(/[^A-Z]/g, ""), clue: w.clue }))
      .filter((w) => w.ans.length > 1)
      .sort((a, b) => b.ans.length - a.ans.length);
    if (!words.length) return;

    const K = (r, c) => r + "," + c;

    // One layout attempt for a given word order. Returns placed words + bounds.
    const attempt = (order) => {
      const cells = new Map();
      const at = (r, c) => cells.get(K(r, c));
      const placed = [];
      const fits = (w, r, c, dir) => {
        const dr = dir === "down" ? 1 : 0, dc = dir === "across" ? 1 : 0;
        if (at(r - dr, c - dc) || at(r + dr * w.length, c + dc * w.length)) return -1;
        let inter = 0;
        for (let i = 0; i < w.length; i++) {
          const rr = r + dr * i, cc = c + dc * i, cell = at(rr, cc);
          if (cell) {
            if (cell.ch !== w[i] || cell.dirs.has(dir)) return -1;
            inter++;
          } else if (at(rr + dc, cc + dr) || at(rr - dc, cc - dr)) return -1;
        }
        return inter;
      };
      const put = (w, r, c, dir) => {
        const dr = dir === "down" ? 1 : 0, dc = dir === "across" ? 1 : 0;
        for (let i = 0; i < w.ans.length; i++) {
          const k = K(r + dr * i, c + dc * i);
          const cell = cells.get(k) || { ch: w.ans[i], dirs: new Set() };
          cell.dirs.add(dir);
          cells.set(k, cell);
        }
        placed.push({ ...w, r, c, dir });
      };
      const boundsWith = (r, c, dir, len) => {
        let minR = r, maxR = dir === "down" ? r + len - 1 : r, minC = c, maxC = dir === "across" ? c + len - 1 : c;
        for (const k of cells.keys()) {
          const [y, x] = k.split(",").map(Number);
          if (y < minR) minR = y; if (y > maxR) maxR = y; if (x < minC) minC = x; if (x > maxC) maxC = x;
        }
        return { minR, maxR, minC, maxC };
      };

      put(order[0], 0, 0, "across");
      let pending = order.slice(1);
      for (let pass = 0; pass < 3 && pending.length; pass++) {
        const left = [];
        for (const w of pending) {
          let best = null;
          for (const [k, cell] of cells) {
            const [r0, c0] = k.split(",").map(Number);
            for (let i = 0; i < w.ans.length; i++) {
              if (w.ans[i] !== cell.ch) continue;
              for (const dir of ["across", "down"]) {
                if (cell.dirs.has(dir)) continue;
                const r = dir === "down" ? r0 - i : r0, c = dir === "across" ? c0 - i : c0;
                const inter = fits(w.ans, r, c, dir);
                if (inter < 1) continue;
                const b = boundsWith(r, c, dir, w.ans.length);
                const h = b.maxR - b.minR + 1, wd = b.maxC - b.minC + 1;
                const score = inter * 60 - h * wd - Math.abs(wd / h - 1.45) * 25;
                if (!best || score > best.score) best = { r, c, dir, score };
              }
            }
          }
          if (best) put(w, best.r, best.c, best.dir); else left.push(w);
        }
        pending = left;
      }
      const b = boundsWith(0, 0, "across", 1);
      const rows = b.maxR - b.minR + 1, cols = b.maxC - b.minC + 1;
      placed.forEach((p) => { p.r -= b.minR; p.c -= b.minC; });
      return { placed, pending, rows, cols, cost: rows * cols + Math.abs(cols / rows - 1.45) * 30 };
    };

    // Try many word orders (seeded, so the grid is identical on every visit) and keep the best.
    let seed = 20260406;
    const rand = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    let layout = attempt(words);
    for (let n = 0; n < 160; n++) {
      const order = words.slice();
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      const L = attempt(order);
      if (L.placed.length > layout.placed.length || (L.placed.length === layout.placed.length && L.cost < layout.cost)) layout = L;
    }
    const { placed, rows, cols } = layout;
    if (layout.pending.length) console.warn("Crossword: couldn't fit", layout.pending.map((w) => w.ans).join(", "));
    placed.sort((x, y) => x.r - y.r || x.c - y.c);

    // numbering
    const nums = new Map();
    let n = 0;
    placed.forEach((p) => {
      const k = K(p.r, p.c);
      if (!nums.has(k)) nums.set(k, ++n);
      p.num = nums.get(k);
      p.keys = [...p.ans].map((_, i) => K(p.r + (p.dir === "down" ? i : 0), p.c + (p.dir === "across" ? i : 0)));
    });

    const grid = $("#cwGrid");
    grid.style.setProperty("--cols", cols);
    grid.style.setProperty("--cell", `min(calc(84cqw / ${cols}), calc(43cqh / ${rows}))`);
    const solution = new Map();
    placed.forEach((p) => p.keys.forEach((k, i) => solution.set(k, p.ans[i])));
    const inputs = new Map();
    const cellEls = new Map();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const k = K(r, c);
        const d = document.createElement("div");
        if (solution.has(k)) {
          d.className = "cw-cell";
          d.innerHTML = (nums.has(k) ? `<span class="cw-num">${nums.get(k)}</span>` : "") +
            `<input maxlength="1" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="row ${r + 1} column ${c + 1}">`;
          const inp = $("input", d);
          inp.dataset.k = k;
          inputs.set(k, inp);
          cellEls.set(k, d);
        }
        grid.append(d);
      }
    }

    // clues
    const across = $("#cwAcross"), down = $("#cwDown");
    placed.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `<b>${p.num}</b>${esc(p.clue)}`;
      li.addEventListener("click", () => { dir = p.dir; inputs.get(p.keys[0]).focus(); });
      p.li = li;
      (p.dir === "across" ? across : down).append(li);
    });

    let dir = "across";
    let current = null;
    const wordAt = (k, d) => placed.find((p) => p.dir === d && p.keys.includes(k));
    const highlight = () => {
      cellEls.forEach((el) => el.classList.remove("hl", "cur"));
      if (!current) return;
      const w = wordAt(current, dir);
      if (w) w.keys.forEach((k) => cellEls.get(k).classList.add("hl"));
      cellEls.get(current).classList.add("cur");
    };
    const markDone = () => placed.forEach((p) => p.li.classList.toggle("done", p.keys.every((k) => inputs.get(k).value === solution.get(k))));
    const move = (k, step) => {
      const w = wordAt(k, dir);
      if (!w) return;
      const idx = w.keys.indexOf(k) + step;
      if (idx >= 0 && idx < w.keys.length) inputs.get(w.keys[idx]).focus();
    };

    inputs.forEach((inp, k) => {
      inp.addEventListener("focus", () => {
        if (!wordAt(k, dir)) dir = dir === "across" ? "down" : "across";
        current = k; highlight();
      });
      inp.addEventListener("blur", () => setTimeout(() => {
        if (!document.activeElement || !document.activeElement.closest("#cwGrid")) { current = null; highlight(); }
      }, 0));
      inp.addEventListener("mousedown", () => {
        if (document.activeElement === inp && wordAt(k, "across") && wordAt(k, "down")) {
          dir = dir === "across" ? "down" : "across";
          highlight();
        }
      });
      inp.addEventListener("input", () => {
        const v = inp.value.toUpperCase().replace(/[^A-Z]/g, "");
        inp.value = v.slice(-1);
        cellEls.get(k).classList.remove("bad", "ok", "rev");
        markDone();
        if (inp.value) move(k, 1);
        if ([...inputs].every(([kk, el]) => el.value === solution.get(kk))) win();
      });
      inp.addEventListener("keydown", (e) => {
        e.stopPropagation();
        const [r, c] = k.split(",").map(Number);
        const go = (rr, cc) => { const t = inputs.get(K(rr, cc)); if (t) { t.focus(); return true; } return false; };
        if (e.key === "Backspace" && !inp.value) { e.preventDefault(); move(k, -1); const w = wordAt(k, dir); if (w) { const i = w.keys.indexOf(k); if (i > 0) inputs.get(w.keys[i - 1]).value = ""; } }
        else if (e.key === "ArrowRight") { e.preventDefault(); dir = "across"; go(r, c + 1) || highlight(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); dir = "across"; go(r, c - 1) || highlight(); }
        else if (e.key === "ArrowDown") { e.preventDefault(); dir = "down"; go(r + 1, c) || highlight(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); dir = "down"; go(r - 1, c) || highlight(); }
      });
    });

    const msgEl = $("#cwMsg");
    const win = () => {
      msgEl.textContent = "Perfect score. You know us by heart.";
      burst($(".p-cross .pg"), 50, 45, 22);
    };
    $$("[data-cw]").forEach((btn) => btn.addEventListener("click", () => {
      const act = btn.dataset.cw;
      if (act === "check") {
        let wrong = 0, empty = 0;
        inputs.forEach((inp, k) => {
          const el = cellEls.get(k);
          el.classList.remove("bad", "ok");
          if (!inp.value) { empty++; return; }
          if (inp.value === solution.get(k)) el.classList.add("ok"); else { el.classList.add("bad"); wrong++; }
        });
        if (!wrong && !empty) win();
        else msgEl.textContent = wrong ? `${wrong} letter${wrong > 1 ? "s" : ""} off. Try again, my love.` : "So far so good. Keep going!";
      } else if (act === "reveal") {
        inputs.forEach((inp, k) => { inp.value = solution.get(k); cellEls.get(k).classList.remove("bad", "ok"); cellEls.get(k).classList.add("rev"); });
        msgEl.textContent = "Revealed. We'll pretend you knew them all.";
      } else {
        inputs.forEach((inp, k) => { inp.value = ""; cellEls.get(k).classList.remove("bad", "ok", "rev"); });
        msgEl.textContent = "";
      }
      markDone();
    }));
  })();

  /* ---------------------------------------------------------
     12. The flipbook
     --------------------------------------------------------- */
  const stage = $(".stage");
  const frame = $("#frame");
  const shift = $("#shift");
  const bookEl = $("#book");
  const MINW = 380; // below 2×MINW the magazine shows one page at a time

  // Spreads use 3:4 pages. On phones (one page at a time) the page gets taller
  // to fill the screen, so the type can be bigger.
  const space = () => {
    const small = window.innerWidth < 640;
    return { W: window.innerWidth - (small ? 12 : 56), H: stage.clientHeight - (small ? 8 : 36) };
  };
  const geometry = () => {
    const { W, H } = space();
    const land = Math.min(W, H * 1.5);
    if (land >= MINW * 2) return { mode: "land", ratio: 0.75 };
    return { mode: "port", ratio: Math.min(0.75, Math.max(0.56, W / H)) };
  };
  const G = geometry();
  const fit = () => {
    const a = document.activeElement;
    if (a && a.matches && a.matches("#book input")) return; // don't resize while the phone keyboard is up
    const { W, H } = space();
    const w = G.mode === "land" ? Math.min(W, H * 1.5) : Math.min(W, H * G.ratio);
    frame.style.width = Math.floor(w) + "px";
  };
  fit();
  let lastW = window.innerWidth;
  window.addEventListener("resize", () => {
    // rotating the phone or resizing across the breakpoint rebuilds the book
    const g = geometry();
    const widthChanged = Math.abs(window.innerWidth - lastW) > 40;
    if (g.mode !== G.mode || (widthChanged && g.mode === "port" && Math.abs(g.ratio - G.ratio) > 0.03)) {
      try { sessionStorage.setItem("mag:page", String(pf.getCurrentPageIndex())); sessionStorage.setItem("mag:open", "1"); } catch (e) { /* ignore */ }
      location.reload();
      return;
    }
    lastW = window.innerWidth;
    fit();
  }); // registered before PageFlip's own resize handler on purpose

  const pf = new St.PageFlip(bookEl, {
    width: 600,
    height: Math.round(600 / G.ratio),
    size: "stretch",
    minWidth: MINW,
    maxWidth: 2000,
    minHeight: 200,
    maxHeight: 2700,
    showCover: true,
    usePortrait: true,
    autoSize: true,
    drawShadow: true,
    maxShadowOpacity: 0.6,
    flippingTime: 1100,
    showPageCorners: true,
    disableFlipByClick: true,
    mobileScrollSupport: false,
    swipeDistance: 25
  });
  pf.loadFromHTML(pages);
  window.__flipbook = pf; // handy for debugging in the browser console
  bookEl.style.minWidth = "0";
  bookEl.style.minHeight = "0";

  const label = $("#pageLabel"), bar = $("#progressBar"), prev = $("#prevBtn"), next = $("#nextBtn");
  const landscape = () => pf.getOrientation() === "landscape";

  const setShift = (i) => {
    let s = 0;
    if (landscape()) {
      const pw = pf.getRender().getRect().pageWidth;
      if (i === 0) s = -pw / 2;
      else if (i === total - 1) s = pw / 2;
    }
    shift.style.transform = `translateX(${s}px)`;
    frame.classList.toggle("at-cover", s < 0);
    frame.classList.toggle("at-back", s > 0);
  };

  const update = () => {
    const i = pf.getCurrentPageIndex();
    let txt;
    if (i === 0) txt = "Cover";
    else if (i === total - 1) txt = "Back cover";
    else if (landscape()) { const l = i % 2 ? i : i - 1; txt = `Pages ${l}–${l + 1}`; }
    else txt = `Page ${i}`;
    label.textContent = txt;
    bar.style.width = (i / (total - 1) * 100) + "%";
    prev.disabled = i === 0;
    next.disabled = i >= total - 1;
    setShift(i);
  };

  /* page-turn sound (synthesised paper rustle — no audio files needed) */
  let actx = null;
  let muted = store.get("muted", false);
  const soundBtn = $("#soundBtn");
  soundBtn.classList.toggle("muted", muted);
  const unlockAudio = () => {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
    } catch (e) { actx = null; }
  };
  const rustle = () => {
    if (muted) return;
    unlockAudio();
    if (!actx) return;
    try {
      const dur = 0.6, sr = actx.sampleRate, buf = actx.createBuffer(1, Math.floor(sr * dur), sr), d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < d.length; i++) {
        const t = i / d.length;
        const env = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.1)), 1.8) * (0.55 + 0.45 * Math.random());
        last = last * 0.55 + (Math.random() * 2 - 1) * 0.45; // slightly brown noise = papery
        d[i] = last * env;
      }
      const src = actx.createBufferSource();
      src.buffer = buf;
      const bp = actx.createBiquadFilter();
      bp.type = "bandpass"; bp.Q.value = 0.8;
      bp.frequency.setValueAtTime(700, actx.currentTime);
      bp.frequency.exponentialRampToValueAtTime(3200, actx.currentTime + dur * 0.75);
      const hp = actx.createBiquadFilter();
      hp.type = "highpass"; hp.frequency.value = 250;
      const g = actx.createGain();
      g.gain.value = 0.5;
      src.connect(bp).connect(hp).connect(g).connect(actx.destination);
      src.start();
    } catch (e) { /* ignore */ }
  };
  soundBtn.addEventListener("click", () => {
    muted = !muted;
    store.set("muted", muted);
    soundBtn.classList.toggle("muted", muted);
    if (!muted) { unlockAudio(); rustle(); }
  });

  const hint = $("#hint");
  let hinted = false;
  const hideHint = () => { if (!hinted) { hinted = true; hint.classList.add("hide"); } };

  pf.on("flip", () => { update(); hideHint(); });
  pf.on("changeOrientation", update);
  // Some GPUs keep a stale, blank layer for the page that was drawn as the
  // back of the hard cover. After every turn, nudge the visible pages so the
  // browser re-draws them from scratch.
  const repaint = () => {
    requestAnimationFrame(() => {
      $$("#book .page").forEach((el) => {
        if (el.style.display === "none") return;
        el.style.backfaceVisibility = "visible";
        el.style.webkitBackfaceVisibility = "visible";
        el.style.willChange = "transform";
        el.style.opacity = "0.999";
        requestAnimationFrame(() => { el.style.willChange = ""; el.style.opacity = ""; });
      });
    });
  };
  pf.on("flip", repaint);
  window.addEventListener("resize", () => setTimeout(repaint, 120));
  pf.on("changeState", (e) => {
    if (e.data === "flipping") {
      rustle();
      const i = pf.getCurrentPageIndex();
      if (landscape() && (i === 0 || i === total - 1)) {
        shift.style.transform = "translateX(0px)";
        frame.classList.remove("at-cover", "at-back");
      }
    } else if (e.data === "read") {
      update();
      repaint();
    }
  });
  update();

  prev.addEventListener("click", () => pf.flipPrev());
  next.addEventListener("click", () => pf.flipNext());
  $("#contentsBtn").addEventListener("click", () => pf.flip(2));
  $$("[data-goto]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); pf.flip(+a.dataset.goto); }));

  document.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("input, textarea")) return;
    if (!$("#intro").classList.contains("gone")) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openIssue(); }
      return;
    }
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); pf.flipNext(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); pf.flipPrev(); }
    else if (e.key === "Home") pf.flip(0);
    else if (e.key === "End") pf.flip(total - 1);
  });

  $("#fsBtn").addEventListener("click", () => {
    try {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    } catch (e) { /* unsupported */ }
  });

  /* ---------------------------------------------------------
     13. Intro
     --------------------------------------------------------- */
  const openIssue = () => {
    const intro = $("#intro");
    if (intro.classList.contains("gone")) return;
    unlockAudio();
    intro.classList.add("gone");
    frame.classList.add("ready");
    setTimeout(hideHint, 9000);
  };
  $("#openBtn").addEventListener("click", openIssue);

  if (matchMedia("(pointer: coarse)").matches) hint.textContent = "swipe or tap the arrows to turn the page";

  // After a rotation reload, jump straight back to the same page
  try {
    const saved = sessionStorage.getItem("mag:page");
    if (sessionStorage.getItem("mag:open") === "1") {
      sessionStorage.removeItem("mag:open");
      sessionStorage.removeItem("mag:page");
      $("#intro").style.transition = "none";
      openIssue();
      if (saved && +saved > 0) pf.turnToPage(Math.min(+saved, total - 1));
      update();
    }
  } catch (e) { /* ignore */ }
})();
