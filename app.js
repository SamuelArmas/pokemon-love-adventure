/**
 * POKÉMON LOVE ADVENTURE — MOTOR INTERACTIVO + AUDIO 8-BIT + EDITOR INTEGRADO
 */

(function () {
  "use strict";

  const STORAGE_KEY = "pokemon_love_adventure_luis_fer_v1";
  const STATE_KEY = "pokemon_love_adventure_progress_v2";

  // -------------------------------------------------------------------------
  // 1. ESTADO Y PERSISTENCIA
  // -------------------------------------------------------------------------
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.warn("No se pudo leer localStorage:", err);
    }
    return deepClone(window.DEFAULT_ADVENTURE_DATA);
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      alert(
        "Las fotos son muy pesadas para guardar en el navegador. Intenta usar imágenes más ligeras o exporta data.js."
      );
    }
  }

  function getDefaultProgress() {
    return {
      unlockedClues: [],
      missionRevealed: false,
      objectivesDone: { "obj-1": true },
      claimedItems: {},
      selectedPokemonId: 54
    };
  }

  function loadProgress() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("reset")) {
        localStorage.removeItem(STATE_KEY);
        localStorage.removeItem("pokemon_love_adventure_progress_v1");
        params.delete("reset");
        const cleanQuery = params.toString();
        const cleanUrl =
          window.location.pathname + (cleanQuery ? `?${cleanQuery}` : "") + window.location.hash;
        window.history.replaceState({}, "", cleanUrl);
        return getDefaultProgress();
      }
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      /* ignore */
    }
    return getDefaultProgress();
  }

  function saveProgress(prog) {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(prog));
    } catch (err) {
      /* ignore */
    }
  }

  let data = loadData();
  let progress = loadProgress();
  let activeDetailMemoryId = null;

  // -------------------------------------------------------------------------
  // 2. SINTETIZADOR RETRO 8-BIT (WEB AUDIO API — SIN ARCHIVOS EXTERNOS)
  // -------------------------------------------------------------------------
  let audioCtx = null;
  let bgmInterval = null;
  let isBgmPlaying = false;

  function ensureAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, duration, type = "square", volume = 0.055, delay = 0) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function sfxClick() {
    playTone(660, 0.07, "square", 0.045, 0);
    playTone(880, 0.08, "square", 0.04, 0.055);
  }

  function sfxFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => playTone(n, 0.16, "square", 0.05, i * 0.1));
  }

  function sfxPokeball() {
    playTone(392, 0.09, "triangle", 0.07, 0);
    playTone(523.25, 0.09, "triangle", 0.07, 0.18);
    playTone(659.25, 0.12, "square", 0.05, 0.36);
    playTone(783.99, 0.25, "square", 0.055, 0.5);
  }

  function sfxPokeCry(id) {
    const base = 320 + ((id * 37) % 320);
    playTone(base, 0.08, "square", 0.045, 0);
    playTone(base * 1.28, 0.09, "triangle", 0.05, 0.07);
    playTone(base * 1.12, 0.11, "square", 0.04, 0.15);
  }

  // Dulce melodía estilo pueblo Pokémon en 8-bit (bucle relajante)
  const BGM_MELODY = [
    523.25, 659.25, 783.99, 659.25,
    587.33, 698.46, 880.0, 698.46,
    659.25, 783.99, 1046.5, 987.77,
    880.0, 783.99, 659.25, 587.33
  ];
  let bgmStep = 0;

  function setBgm(shouldPlay) {
    isBgmPlaying = shouldPlay;
    const hudBtn = document.getElementById("bgmToggleBtn");
    const radioBtn = document.getElementById("radioPlayBtn");
    const radioEq = document.getElementById("radioEq");

    if (shouldPlay) {
      ensureAudio();
      if (!bgmInterval) {
        bgmInterval = setInterval(() => {
          const note = BGM_MELODY[bgmStep % BGM_MELODY.length];
          playTone(note, 0.26, "triangle", 0.045, 0);
          if (bgmStep % 2 === 0) {
            playTone(note / 2, 0.32, "sine", 0.035, 0);
          }
          bgmStep++;
        }, 320);
      }
      hudBtn.textContent = "♪ 8-BIT: ON";
      hudBtn.classList.add("is-active");
      hudBtn.setAttribute("aria-pressed", "true");
      radioBtn.textContent = "⏸ Pausar 8-bit";
      radioEq.classList.add("is-playing");
    } else {
      if (bgmInterval) {
        clearInterval(bgmInterval);
        bgmInterval = null;
      }
      hudBtn.textContent = "♪ 8-BIT: OFF";
      hudBtn.classList.remove("is-active");
      hudBtn.setAttribute("aria-pressed", "false");
      radioBtn.textContent = "▶ Reproducir 8-bit";
      radioEq.classList.remove("is-playing");
    }
  }

  // -------------------------------------------------------------------------
  // 3. CONFETI PIXELADO CELEBRATORIO
  // -------------------------------------------------------------------------
  function launchPixelConfetti(count = 42) {
    const layer = document.getElementById("confettiLayer");
    const colors = ["#d9383a", "#ffd95e", "#4da843", "#4b9ae0", "#ffffff", "#ff77a8"];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "px-confetti";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = `${-10 - Math.random() * 18}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
      piece.style.animationDelay = `${Math.random() * 0.45}s`;
      layer.appendChild(piece);
      setTimeout(() => piece.remove(), 3400);
    }
  }

  // -------------------------------------------------------------------------
  // 4. RENDERIZADO DE TODAS LAS SECCIONES
  // -------------------------------------------------------------------------
  function renderAll() {
    renderHeroAndIntro();
    renderTeam();
    renderMission();
    renderPokedex();
    renderLetter();
    renderPlaylist();
    renderInventory();
    renderFinale();
  }

  function renderHeroAndIntro() {
    const m = data.meta;
    document.title = `Pokémon Love Adventure — ${m.trainerName} · ${m.years} Años Juntos`;
    document.getElementById("introEdition").textContent = m.editionLabel;
    document.getElementById("introTitle").textContent = m.heroTitle;
    document.getElementById("introSubtitle").textContent = `${m.heroSubtitle} · EDICIÓN ${m.trainerName.toUpperCase()}`;
    document.getElementById("introDialogueText").textContent = m.welcomeDialogue;

    document.getElementById("hudTrainer").textContent = `${m.trainerName.toUpperCase()} · LV.0${m.years}`;
    document.getElementById("heroEditionChip").textContent = m.editionLabel;
    document.getElementById("heroHeading").textContent = m.heroTitle;
    document.getElementById("heroLead").textContent = `${m.heroTagline} ¡Felices ${m.years} años juntos, ${m.trainerName}!`;
    document.getElementById("cardTrainerName").textContent =
      m.cardTrainerName || window.DEFAULT_ADVENTURE_DATA.meta.cardTrainerName;
    document.getElementById("cardPartnerName").textContent = m.partnerTitle;
    document.getElementById("cardPlayTime").textContent = `${m.years} Años Juntos`;
  }

  function renderTeam() {
    const grid = document.getElementById("teamGrid");
    grid.innerHTML = "";

    const selected =
      data.team.find((p) => p.id === progress.selectedPokemonId) || data.team[0];

    data.team.forEach((poke) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `poke-card${poke.id === selected.id ? " is-selected" : ""}`;
      btn.innerHTML = `
        <div class="poke-sprite-pad">
          <img class="pixel-sprite" src="${poke.sprite}" alt="${poke.name}" />
        </div>
        <div class="poke-info">
          <div class="poke-top-row">
            <span class="poke-name">${poke.name}</span>
            <span class="poke-lv">Lv.0${poke.level}</span>
          </div>
          <span class="poke-type-badge ${poke.typeClass}">${poke.type}</span>
          <div class="hp-bar-wrap">
            <span class="hp-label">AMOR</span>
            <div class="hp-track"><div class="hp-fill" style="width:${poke.hp}%"></div></div>
          </div>
          <div class="poke-role">${poke.dex} · ${poke.role}</div>
        </div>
      `;
      btn.addEventListener("click", () => {
        progress.selectedPokemonId = poke.id;
        saveProgress(progress);
        sfxPokeCry(poke.id);
        renderTeam();
      });
      grid.appendChild(btn);
    });

    document.getElementById("teamTalkSprite").src = selected.sprite;
    document.getElementById("teamTalkSprite").alt = selected.name;
    document.getElementById("teamTalkSpeaker").textContent = `${selected.name.toUpperCase()} (${selected.dex}) DICE:`;
    document.getElementById("teamTalkText").innerHTML = `${escapeHtml(selected.quote)} <span class="dialogue-arrow">▼</span>`;
  }

  function renderMission() {
    const ms = data.mission;
    document.getElementById("missionCodeBadge").textContent = `${ms.code} · ${ms.badge.toUpperCase()}`;
    document.getElementById("missionBadgeText").textContent = `${ms.code} · ${ms.badge}`;
    document.getElementById("missionQuestTitle").textContent = ms.title;
    document.getElementById("missionDestination").textContent = ms.destination;
    document.getElementById("missionSummary").textContent = ms.summary;
    document.getElementById("missionDateVal").textContent = ms.dateDisplay;
    document.getElementById("missionTimeVal").textContent = ms.timeDisplay;
    document.getElementById("missionObjectiveText").textContent = `Objetivo: ${ms.objectiveText}`;
    document.getElementById("missionRewardTitle").textContent = ms.rewardTitle;
    document.getElementById("missionRewardText").textContent = ms.rewardText;

    // Clues
    const cluesGrid = document.getElementById("cluesGrid");
    cluesGrid.innerHTML = "";
    const unlockedSet = new Set(progress.unlockedClues || []);

    ms.clues.forEach((clue) => {
      const isOpen = unlockedSet.has(clue.id) || progress.missionRevealed;
      const card = document.createElement("button");
      card.type = "button";
      card.className = `clue-card${isOpen ? " is-unlocked" : ""}`;
      card.innerHTML = `
        <div class="clue-card-title">
          <span>${clue.icon} ${escapeHtml(clue.label)}</span>
          <span>${isOpen ? "✓" : "?"}</span>
        </div>
        <p class="clue-card-body">
          ${isOpen ? escapeHtml(clue.text) : "Toca para descifrar esta pista secreta de Psyduck..."}
        </p>
      `;
      card.addEventListener("click", () => {
        if (!unlockedSet.has(clue.id)) {
          unlockedSet.add(clue.id);
          progress.unlockedClues = Array.from(unlockedSet);
          if (progress.unlockedClues.length >= ms.clues.length) {
            progress.missionRevealed = true;
            sfxFanfare();
            launchPixelConfetti(36);
          } else {
            sfxClick();
          }
          saveProgress(progress);
          renderMission();
        }
      });
      cluesGrid.appendChild(card);
    });

    const unlockedCount = progress.missionRevealed ? ms.clues.length : unlockedSet.size;
    document.getElementById("clueProgressBadge").textContent = `PISTAS: ${unlockedCount} / ${ms.clues.length}`;

    const revealCard = document.getElementById("missionRevealCard");
    if (progress.missionRevealed || unlockedCount >= ms.clues.length) {
      revealCard.classList.remove("is-locked");
    } else {
      revealCard.classList.add("is-locked");
    }

    // Objectives checklist
    const objList = document.getElementById("objectivesList");
    objList.innerHTML = "";
    let doneCount = 0;

    ms.objectives.forEach((obj) => {
      const isDone =
        progress.objectivesDone && typeof progress.objectivesDone[obj.id] === "boolean"
          ? progress.objectivesDone[obj.id]
          : !!obj.done;
      if (isDone) doneCount++;

      const li = document.createElement("li");
      li.className = `objective-item${isDone ? " is-done" : ""}`;
      li.setAttribute("role", "checkbox");
      li.setAttribute("aria-checked", String(isDone));
      li.tabIndex = 0;
      li.innerHTML = `
        <span class="objective-check">${isDone ? "✓" : ""}</span>
        <span class="objective-label">${escapeHtml(obj.text)}</span>
      `;
      const toggle = () => {
        progress.objectivesDone = progress.objectivesDone || {};
        progress.objectivesDone[obj.id] = !isDone;
        saveProgress(progress);
        sfxClick();
        renderMission();
      };
      li.addEventListener("click", toggle);
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
      objList.appendChild(li);
    });

    document.getElementById("objectivesCounter").textContent = `${doneCount}/${ms.objectives.length} COMPLETADOS`;
  }

  function updateCountdown() {
    const target = new Date(data.mission.isoDateTime).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById("cdDays").textContent = String(days).padStart(2, "0");
    document.getElementById("cdHours").textContent = String(hours).padStart(2, "0");
    document.getElementById("cdMins").textContent = String(mins).padStart(2, "0");
    document.getElementById("cdSecs").textContent = String(secs).padStart(2, "0");
  }

  function renderPokedex() {
    const grid = document.getElementById("memoryGrid");
    grid.innerHTML = "";

    data.memories.forEach((mem) => {
      const card = document.createElement("article");
      card.className = "memory-card";
      card.tabIndex = 0;
      const spriteSrc = `assets/sprites/${mem.pokemonId || 54}.png`;

      const photoMarkup = mem.photo
        ? `<img class="memory-real-photo" src="${mem.photo}" alt="${escapeHtml(mem.title)}" />`
        : `<div class="memory-placeholder">
             <img class="pixel-sprite" src="${spriteSrc}" alt="${escapeHtml(mem.pokemonName)}" />
             <span class="memory-placeholder-cta">📷 Toca para ver o subir foto</span>
           </div>`;

      card.innerHTML = `
        <div class="memory-card-head">
          <span class="memory-no">${escapeHtml(mem.entryNo)}</span>
          <span class="memory-cat">${escapeHtml(mem.category)}</span>
        </div>
        <div class="memory-photo-frame">
          ${photoMarkup}
          <span class="memory-poke-stamp" title="Compañero: ${escapeHtml(mem.pokemonName)}">
            <img class="pixel-sprite" src="${spriteSrc}" alt="${escapeHtml(mem.pokemonName)}" />
          </span>
        </div>
        <h3 class="memory-title">${escapeHtml(mem.title)}</h3>
        <p class="memory-desc">${escapeHtml(mem.description)}</p>
        <div class="memory-foot">
          <span>${escapeHtml(mem.date)}</span>
          <span>VER ▶</span>
        </div>
      `;

      const openDetail = () => {
        sfxClick();
        openMemoryDetail(mem.id);
      };
      card.addEventListener("click", openDetail);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetail();
        }
      });
      grid.appendChild(card);
    });
  }

  function openMemoryDetail(memId) {
    const mem = data.memories.find((m) => m.id === memId);
    if (!mem) return;
    activeDetailMemoryId = mem.id;

    document.getElementById("memoryModalTitle").textContent = `${mem.entryNo} · ${mem.title.toUpperCase()}`;
    document.getElementById("memoryModalMeta").textContent = `${mem.category} · ${mem.date} · ${mem.pokemonName}`;
    document.getElementById("memoryModalDesc").textContent = mem.description;

    const photoBox = document.getElementById("memoryModalPhotoBox");
    if (mem.photo) {
      photoBox.innerHTML = `<img class="detail-real" src="${mem.photo}" alt="${escapeHtml(mem.title)}" />`;
    } else {
      photoBox.innerHTML = `
        <div class="memory-placeholder">
          <img class="pixel-sprite" src="assets/sprites/${mem.pokemonId || 54}.png" alt="${escapeHtml(mem.pokemonName)}" style="width:96px;height:96px;" />
          <span class="memory-placeholder-cta">Aún no hay foto en esta entrada — usa el botón azul para agregar una</span>
        </div>
      `;
    }
    document.getElementById("memoryModal").classList.add("is-open");
  }

  function renderLetter() {
    const l = data.letter;
    document.getElementById("envelopeToText").textContent = l.recipient;
    document.getElementById("letterGreeting").textContent = l.greeting;
    document.getElementById("letterDateLabel").textContent = l.dateLabel;
    document.getElementById("letterBody").textContent = l.body;
    document.getElementById("letterSignature").textContent = l.signature;
  }

  function renderPlaylist() {
    const grid = document.getElementById("trackGrid");
    grid.innerHTML = "";

    data.playlist.forEach((track, idx) => {
      const card = document.createElement("article");
      card.className = "track-card";
      const safeUrl = track.url && /^https?:\/\//i.test(track.url) ? track.url : "https://open.spotify.com/";
      card.innerHTML = `
        <span class="track-cat">0${idx + 1} · ${escapeHtml(track.category)}</span>
        <h3 class="track-title">${escapeHtml(track.title)}</h3>
        <div class="track-artist">♪ ${escapeHtml(track.artist)}</div>
        <p class="track-note">${escapeHtml(track.note)}</p>
        <div class="track-actions">
          <span class="track-dur">⏱ ${escapeHtml(track.duration || "03:30")}</span>
          <a class="px-btn px-btn--forest px-btn--sm" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
            ▶ Escuchar en ${escapeHtml(track.platform || "Spotify")}
          </a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderInventory() {
    const grid = document.getElementById("bagGrid");
    grid.innerHTML = "";

    data.inventory.forEach((item) => {
      const isClaimed = !!(progress.claimedItems && progress.claimedItems[item.id]);
      const card = document.createElement("article");
      card.className = `bag-item-card${isClaimed ? " is-claimed" : ""}`;
      card.innerHTML = `
        <div class="bag-icon-box">
          <img class="pixel-sprite" src="${item.icon}" alt="${escapeHtml(item.name)}" />
        </div>
        <div class="bag-item-body">
          <div class="bag-item-top">
            <span class="bag-item-name">${escapeHtml(item.name)}</span>
            <span class="bag-item-qty">${escapeHtml(item.qty)}</span>
          </div>
          <p class="bag-item-desc">${escapeHtml(item.description)}</p>
          <button class="px-btn ${isClaimed ? "px-btn--forest" : "px-btn--sky"} px-btn--sm" type="button">
            ${isClaimed ? "✓ Vale activado (ver)" : "★ Usar objeto"}
          </button>
        </div>
      `;

      card.querySelector("button").addEventListener("click", () => {
        progress.claimedItems = progress.claimedItems || {};
        progress.claimedItems[item.id] = true;
        saveProgress(progress);
        sfxFanfare();
        launchPixelConfetti(22);
        document.getElementById("bagFeedback").innerHTML = `${escapeHtml(item.redeemMessage)} <span class="dialogue-arrow">▼</span>`;
        renderInventory();
      });

      grid.appendChild(card);
    });
  }

  function renderFinale() {
    const f = data.finale;
    document.getElementById("finaleBadge").textContent = f.badge;
    document.getElementById("finaleHeading").textContent = f.title;
    document.getElementById("finaleText").textContent = f.text;
    document.getElementById("continuePlayingBtn").textContent = f.ctaLabel;
  }

  // -------------------------------------------------------------------------
  // 5. EDITOR VISUAL INTEGRADO (FOTOS, CARTA, PLAYLIST, MISIÓN, EXPORTAR)
  // -------------------------------------------------------------------------
  function buildEditorUI(initialTab = "tabPhotos") {
    // Tab 1: Photos & Pokédex
    const tabPhotos = document.getElementById("tabPhotos");
    tabPhotos.innerHTML = "";
    data.memories.forEach((mem, idx) => {
      const block = document.createElement("div");
      block.className = "editor-card-block";
      block.innerHTML = `
        <div class="editor-photo-row">
          <img id="edThumb_${idx}" class="editor-thumb" src="${mem.photo || `assets/sprites/${mem.pokemonId || 54}.png`}" alt="Miniatura" />
          <div style="flex:1; min-width: 180px;">
            <strong style="font-family:var(--font-pixel); font-size:0.62rem;">${escapeHtml(mem.entryNo)} · Recuerdo ${idx + 1}</strong>
            <div style="margin-top:0.4rem; display:flex; gap:0.45rem; flex-wrap:wrap;">
              <label class="px-btn px-btn--sky px-btn--sm" style="cursor:pointer;">
                📷 Subir foto
                <input type="file" accept="image/*" data-mem-upload="${idx}" hidden />
              </label>
              <button type="button" class="px-btn px-btn--cream px-btn--sm" data-mem-clear="${idx}">Quitar foto</button>
            </div>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Título del recuerdo</label>
          <input class="field-input" type="text" data-mem-title="${idx}" value="${escapeAttr(mem.title)}" />
        </div>
        <div class="field-group" style="margin-bottom:0;">
          <label class="field-label">Descripción / Historia</label>
          <textarea class="field-textarea" style="min-height:70px;" data-mem-desc="${idx}">${escapeHtml(mem.description)}</textarea>
        </div>
      `;
      tabPhotos.appendChild(block);
    });

    tabPhotos.querySelectorAll("[data-mem-upload]").forEach((input) => {
      input.addEventListener("change", (e) => {
        const idx = Number(input.getAttribute("data-mem-upload"));
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        compressImageToDataUrl(file, 900, 0.82, (dataUrl) => {
          data.memories[idx].photo = dataUrl;
          document.getElementById(`edThumb_${idx}`).src = dataUrl;
        });
      });
    });

    tabPhotos.querySelectorAll("[data-mem-clear]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-mem-clear"));
        data.memories[idx].photo = "";
        document.getElementById(`edThumb_${idx}`).src = `assets/sprites/${data.memories[idx].pokemonId || 54}.png`;
      });
    });

    // Tab 2: Letter
    const tabLetter = document.getElementById("tabLetter");
    tabLetter.innerHTML = `
      <div class="field-group">
        <label class="field-label">Encabezado / Saludo</label>
        <input id="edLetterGreeting" class="field-input" type="text" value="${escapeAttr(data.letter.greeting)}" />
      </div>
      <div class="field-group">
        <label class="field-label">Para (en el sobre)</label>
        <input id="edLetterRecipient" class="field-input" type="text" value="${escapeAttr(data.letter.recipient)}" />
      </div>
      <div class="field-group">
        <label class="field-label">Texto de tu carta de 3 años</label>
        <textarea id="edLetterBody" class="field-textarea" style="min-height:210px;">${escapeHtml(data.letter.body)}</textarea>
      </div>
      <div class="field-group">
        <label class="field-label">Firma</label>
        <textarea id="edLetterSignature" class="field-textarea" style="min-height:66px;">${escapeHtml(data.letter.signature)}</textarea>
      </div>
    `;

    // Tab 3: Playlist
    const tabPlaylist = document.getElementById("tabPlaylist");
    tabPlaylist.innerHTML = "";
    data.playlist.forEach((tr, idx) => {
      const block = document.createElement("div");
      block.className = "editor-card-block";
      block.innerHTML = `
        <strong style="font-family:var(--font-pixel); font-size:0.6rem; display:block; margin-bottom:0.55rem;">
          PISTA 0${idx + 1} · ${escapeHtml(tr.category)}
        </strong>
        <div class="field-group">
          <label class="field-label">Nombre de la canción</label>
          <input class="field-input" type="text" data-tr-title="${idx}" value="${escapeAttr(tr.title)}" />
        </div>
        <div class="field-group">
          <label class="field-label">Artista</label>
          <input class="field-input" type="text" data-tr-artist="${idx}" value="${escapeAttr(tr.artist)}" />
        </div>
        <div class="field-group">
          <label class="field-label">Enlace de Spotify o YouTube</label>
          <input class="field-input" type="url" data-tr-url="${idx}" value="${escapeAttr(tr.url)}" />
        </div>
        <div class="field-group" style="margin-bottom:0;">
          <label class="field-label">Nota romántica</label>
          <input class="field-input" type="text" data-tr-note="${idx}" value="${escapeAttr(tr.note)}" />
        </div>
      `;
      tabPlaylist.appendChild(block);
    });

    // Tab 4: General & Mission
    const tabGeneral = document.getElementById("tabGeneral");
    tabGeneral.innerHTML = `
      <div class="field-group">
        <label class="field-label">Nombre del entrenador (novio)</label>
        <input id="edTrainerName" class="field-input" type="text" value="${escapeAttr(data.meta.trainerName)}" />
      </div>
      <div class="field-group">
        <label class="field-label">Entrenador en la Trainer Card</label>
        <input id="edCardTrainerName" class="field-input" type="text" value="${escapeAttr(data.meta.cardTrainerName || window.DEFAULT_ADVENTURE_DATA.meta.cardTrainerName)}" />
      </div>
      <div class="field-group">
        <label class="field-label">Nombre / Firma de su entrenadora</label>
        <input id="edPartnerTitle" class="field-input" type="text" value="${escapeAttr(data.meta.partnerTitle)}" />
      </div>
      <div class="field-group">
        <label class="field-label">Destino de la misión</label>
        <input id="edMissionDest" class="field-input" type="text" value="${escapeAttr(data.mission.destination)}" />
      </div>
      <div class="field-group">
        <label class="field-label">Fecha mostrada</label>
        <input id="edMissionDate" class="field-input" type="text" value="${escapeAttr(data.mission.dateDisplay)}" />
      </div>
      <div class="field-group">
        <label class="field-label">Hora de inicio</label>
        <input id="edMissionTime" class="field-input" type="text" value="${escapeAttr(data.mission.timeDisplay)}" />
      </div>
    `;

    activateEditorTab(initialTab);
    document.getElementById("editorModal").classList.add("is-open");
  }

  function activateEditorTab(tabId) {
    document.querySelectorAll(".editor-tab").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.tab === tabId);
    });
    document.querySelectorAll(".editor-pane").forEach((p) => {
      p.classList.toggle("is-active", p.id === tabId);
    });
  }

  function commitEditorChanges() {
    data.memories.forEach((mem, idx) => {
      const t = document.querySelector(`[data-mem-title="${idx}"]`);
      const d = document.querySelector(`[data-mem-desc="${idx}"]`);
      if (t) mem.title = t.value.trim() || mem.title;
      if (d) mem.description = d.value.trim() || mem.description;
    });

    data.letter.greeting = document.getElementById("edLetterGreeting").value;
    data.letter.recipient = document.getElementById("edLetterRecipient").value;
    data.letter.body = document.getElementById("edLetterBody").value;
    data.letter.signature = document.getElementById("edLetterSignature").value;

    data.playlist.forEach((tr, idx) => {
      const t = document.querySelector(`[data-tr-title="${idx}"]`);
      const a = document.querySelector(`[data-tr-artist="${idx}"]`);
      const u = document.querySelector(`[data-tr-url="${idx}"]`);
      const n = document.querySelector(`[data-tr-note="${idx}"]`);
      if (t) tr.title = t.value;
      if (a) tr.artist = a.value;
      if (u) tr.url = u.value;
      if (n) tr.note = n.value;
      if (u && /youtu/i.test(u.value)) tr.platform = "YouTube";
      else if (u && /spotify/i.test(u.value)) tr.platform = "Spotify";
    });

    data.meta.trainerName = document.getElementById("edTrainerName").value.trim() || "Luis Fer";
    data.meta.cardTrainerName = document.getElementById("edCardTrainerName").value.trim() || "Papatin";
    data.meta.partnerTitle = document.getElementById("edPartnerTitle").value.trim() || "Tu entrenadora favorita";
    data.mission.destination = document.getElementById("edMissionDest").value.trim() || data.mission.destination;
    data.mission.dateDisplay = document.getElementById("edMissionDate").value.trim() || data.mission.dateDisplay;
    data.mission.timeDisplay = document.getElementById("edMissionTime").value.trim() || data.mission.timeDisplay;

    saveData(data);
    renderAll();
    sfxFanfare();
    document.getElementById("editorModal").classList.remove("is-open");
  }

  function exportUpdatedDataJs() {
    commitEditorChanges();
    const content = `// Archivo personalizado generado desde Pokémon Love Adventure\nwindow.DEFAULT_ADVENTURE_DATA = ${JSON.stringify(data, null, 2)};\n`;
    const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function compressImageToDataUrl(file, maxWidth, quality, cb) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        cb(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // -------------------------------------------------------------------------
  // 6. UTILIDADES
  // -------------------------------------------------------------------------
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  // -------------------------------------------------------------------------
  // 7. EVENTOS E INICIALIZACIÓN
  // -------------------------------------------------------------------------
  function bindEvents() {
    const introOverlay = document.getElementById("introOverlay");
    const introPokeball = document.getElementById("introPokeball");

    function startExperience(withMusic) {
      introPokeball.classList.add("is-shaking");
      sfxPokeball();
      launchPixelConfetti(28);
      if (withMusic) setBgm(true);
      setTimeout(() => {
        introOverlay.classList.add("is-hidden");
        introPokeball.classList.remove("is-shaking");
      }, 650);
    }

    introPokeball.addEventListener("click", () => startExperience(false));
    document.getElementById("startAdventureBtn").addEventListener("click", () => startExperience(false));
    document.getElementById("startMusicIntroBtn").addEventListener("click", () => startExperience(true));

    document.getElementById("replayIntroBtn").addEventListener("click", () => {
      sfxClick();
      introOverlay.classList.remove("is-hidden");
    });

    document.getElementById("bgmToggleBtn").addEventListener("click", () => setBgm(!isBgmPlaying));
    document.getElementById("radioPlayBtn").addEventListener("click", () => setBgm(!isBgmPlaying));

    // Mission direct reveal buttons
    function revealMissionNow() {
      progress.missionRevealed = true;
      progress.unlockedClues = data.mission.clues.map((c) => c.id);
      saveProgress(progress);
      sfxFanfare();
      launchPixelConfetti(40);
      renderMission();
    }

    document.getElementById("revealMissionQuickBtn").addEventListener("click", revealMissionNow);
    document.getElementById("unlockCurtainBtn").addEventListener("click", revealMissionNow);

    // Interactive Letter Envelope
    const envelopeClosed = document.getElementById("envelopeClosed");
    const letterSheet = document.getElementById("letterSheet");
    function openLetter() {
      sfxFanfare();
      envelopeClosed.style.display = "none";
      envelopeClosed.setAttribute("aria-expanded", "true");
      letterSheet.classList.add("is-open");
    }
    envelopeClosed.addEventListener("click", openLetter);
    envelopeClosed.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLetter();
      }
    });
    document.getElementById("closeLetterBtn").addEventListener("click", () => {
      sfxClick();
      letterSheet.classList.remove("is-open");
      envelopeClosed.style.display = "block";
      envelopeClosed.setAttribute("aria-expanded", "false");
    });

    // Finale button
    document.getElementById("continuePlayingBtn").addEventListener("click", () => {
      sfxFanfare();
      launchPixelConfetti(60);
      const toast = document.getElementById("finaleSavedToast");
      toast.textContent = data.finale.savedMessage;
      toast.classList.add("is-visible");
    });

    // Memory Detail Modal
    const memoryModal = document.getElementById("memoryModal");
    document.getElementById("closeMemoryModal").addEventListener("click", () => {
      memoryModal.classList.remove("is-open");
    });
    memoryModal.addEventListener("click", (e) => {
      if (e.target === memoryModal) memoryModal.classList.remove("is-open");
    });
    document.getElementById("memoryModalFileInput").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file || !activeDetailMemoryId) return;
      const mem = data.memories.find((m) => m.id === activeDetailMemoryId);
      if (!mem) return;
      compressImageToDataUrl(file, 960, 0.84, (dataUrl) => {
        mem.photo = dataUrl;
        saveData(data);
        renderPokedex();
        openMemoryDetail(mem.id);
        sfxFanfare();
      });
    });

    // Editor Modal
    const editorModal = document.getElementById("editorModal");
    document.getElementById("openEditorBtn").addEventListener("click", () => {
      sfxClick();
      buildEditorUI("tabPhotos");
    });
    document.getElementById("quickAddPhotosBtn").addEventListener("click", () => {
      sfxClick();
      buildEditorUI("tabPhotos");
    });
    document.getElementById("closeEditorModal").addEventListener("click", () => {
      editorModal.classList.remove("is-open");
    });
    editorModal.addEventListener("click", (e) => {
      if (e.target === editorModal) editorModal.classList.remove("is-open");
    });
    document.querySelectorAll(".editor-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        sfxClick();
        activateEditorTab(btn.dataset.tab);
      });
    });
    document.getElementById("saveEditorBtn").addEventListener("click", commitEditorChanges);
    document.getElementById("exportDataJsBtn").addEventListener("click", exportUpdatedDataJs);
    function resetAdventureProgress() {
      localStorage.removeItem(STATE_KEY);
      localStorage.removeItem("pokemon_love_adventure_progress_v1");
      progress = getDefaultProgress();
      letterSheet.classList.remove("is-open");
      envelopeClosed.style.display = "block";
      envelopeClosed.setAttribute("aria-expanded", "false");
      document.getElementById("bagFeedback").innerHTML =
        'Selecciona cualquier objeto de tu mochila para ver tu vale especial de aniversario. <span class="dialogue-arrow" aria-hidden="true">▼</span>';
      document.getElementById("finaleSavedToast").classList.remove("is-visible");
      renderAll();
    }

    document.getElementById("resetProgressBtn").addEventListener("click", () => {
      if (confirm("¿Reiniciar pistas, misión secreta, carta y vales como al inicio? (Tus fotos y textos guardados se conservan)")) {
        resetAdventureProgress();
        editorModal.classList.remove("is-open");
        introOverlay.classList.remove("is-hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
    document.getElementById("resetDataBtn").addEventListener("click", () => {
      if (confirm("¿Seguro que quieres restaurar los textos, recuerdos y progreso originales?")) {
        localStorage.removeItem(STORAGE_KEY);
        data = deepClone(window.DEFAULT_ADVENTURE_DATA);
        resetAdventureProgress();
        buildEditorUI("tabPhotos");
      }
    });

    // Highlight active section in top game menu on scroll
    const navLinks = Array.from(document.querySelectorAll(".game-nav-link"));
    const sections = navLinks
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === `#${entry.target.id}`
              );
            });
          }
        });
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    sections.forEach((sec) => observer.observe(sec));
  }

  // Boot
  renderAll();
  bindEvents();
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
