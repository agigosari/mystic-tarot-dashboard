/**
 * ============================================================
 * MYSTIC TAROT ORACLE - Core Engine & Gemini AI Integration
 * ============================================================
 */

(function () {
  "use strict";

  // ================= STATE =================
  const STATE = {
    period: "today", // 'today' | 'week' | 'month' | 'quarter'
    question: "",
    deck: [],
    selectedCards: [], // Max 3 cards: [{ card, isReversed, slotIndex }]
    secretCard: null, // Bottom of the deck (Shadow card)
    soundEnabled: true,
    apiKey: localStorage.getItem("mystic_tarot_gemini_key") || "",
    model: localStorage.getItem("mystic_tarot_gemini_model") || "gemini-2.5-flash",
    currentStep: "intro", // 'intro' | 'spread' | 'reading'
    audioCtx: null
  };

  const PERIOD_NAMES = {
    today: "☀️ 오늘 하루 운세",
    week: "🌙 금주 운세",
    month: "✨ 이번달 운세",
    quarter: "🌌 3개월 운세"
  };

  const SLOT_ROLES = [
    { title: "과거 & 현재 상황", focus: "현재 마주한 환경, 배경, 질문의 본질적 기운" },
    { title: "도전 과제 & 행동 조언", focus: "주의해야 할 장애물, 취해야 할 지혜로운 태도와 행동" },
    { title: "미래 흐름 & 최종 결실", focus: "앞으로 펼쳐질 운의 방향, 최종적인 결실과 희망" }
  ];

  // ================= DOM ELEMENTS =================
  const DOM = {
    // Steps
    stepIntro: document.getElementById("stepIntro"),
    stepSpread: document.getElementById("stepSpread"),
    stepReading: document.getElementById("stepReading"),

    // Intro elements
    periodBtns: document.querySelectorAll(".period-btn"),
    questionInput: document.getElementById("userQuestionInput"),
    charCounter: document.getElementById("charCounter"),
    presetChips: document.querySelectorAll(".preset-chip"),
    startSpreadBtn: document.getElementById("startSpreadBtn"),

    // Spread elements
    currentPeriodBadge: document.getElementById("currentPeriodBadge"),
    spreadQuestionTitle: document.getElementById("spreadQuestionTitle"),
    reshuffleBtn: document.getElementById("reshuffleBtn"),
    backToIntroBtn: document.getElementById("backToIntroBtn"),
    tarotCardsContainer: document.getElementById("tarotCardsContainer"),
    selectedCountText: document.getElementById("selectedCountText"),
    openReadingBtn: document.getElementById("openReadingBtn"),
    slots: [
      document.getElementById("slot-0"),
      document.getElementById("slot-1"),
      document.getElementById("slot-2")
    ],

    // Secret Card elements
    peekSecretCardBtn: document.getElementById("peekSecretCardBtn"),
    peekBtnText: document.getElementById("peekBtnText"),
    inlineSecretPeekBox: document.getElementById("inlineSecretPeekBox"),
    secretCardShowcase: document.getElementById("secretCardShowcase"),

    // Reading elements
    readingPeriodBadge: document.getElementById("readingPeriodBadge"),
    readingEngineBadge: document.getElementById("readingEngineBadge"),
    readingQuestionDisplay: document.getElementById("readingQuestionDisplay"),
    readingTimestamp: document.getElementById("readingTimestamp"),
    cardsShowcaseGrid: document.getElementById("cardsShowcaseGrid"),
    readingLoadingIndicator: document.getElementById("readingLoadingIndicator"),
    readingContentContainer: document.getElementById("readingContentContainer"),
    luckyInsightsBox: document.getElementById("luckyInsightsBox"),
    luckyKeyword: document.getElementById("luckyKeyword"),
    luckyColor: document.getElementById("luckyColor"),
    luckyNumber: document.getElementById("luckyNumber"),
    luckyMantra: document.getElementById("luckyMantra"),
    newReadingBtn: document.getElementById("newReadingBtn"),
    shareReadingBtn: document.getElementById("shareReadingBtn"),
    copyResultBtn: document.getElementById("copyResultBtn"),

    // Audio & Modal
    soundToggleBtn: document.getElementById("soundToggleBtn"),
    apiKeyModalBtn: document.getElementById("apiKeyModalBtn"),
    apiKeyBadge: document.getElementById("apiKeyBadge"),
    apiKeyModal: document.getElementById("apiKeyModal"),
    closeApiKeyModalBtn: document.getElementById("closeApiKeyModalBtn"),
    geminiApiKeyInput: document.getElementById("geminiApiKeyInput"),
    geminiModelSelect: document.getElementById("geminiModelSelect"),
    toggleApiKeyVisibility: document.getElementById("toggleApiKeyVisibility"),
    saveApiKeyBtn: document.getElementById("saveApiKeyBtn"),
    clearApiKeyBtn: document.getElementById("clearApiKeyBtn"),

    // Toast
    toast: document.getElementById("toastNotification"),
    toastMsg: document.getElementById("toastMsg"),

    // Canvas
    starCanvas: document.getElementById("starCanvas")
  };

  // ================= AUDIO SYNTHESIZER (Web Audio API) =================
  class SoundManager {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }

    playCardSelect() {
      if (!STATE.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    }

    playShuffle() {
      if (!STATE.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // 노이즈 버퍼와 필터로 카드 섞이는 솨라락 소리 시뮬레이션
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    }

    playChime() {
      if (!STATE.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (아르페지오 신비로운 화음)

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.2);
      });
    }

    playFlip() {
      if (!STATE.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.2);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    }
  }

  const sound = new SoundManager();

  // ================= CANVAS STAR BACKGROUND =================
  function initStarCanvas() {
    const canvas = DOM.starCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let stars = [];
    const numStars = 130;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
          dx: (Math.random() - 0.5) * 0.15,
          dy: (Math.random() - 0.5) * 0.15
        });
      }
    }

    window.addEventListener("resize", resize);
    resize();

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let s of stars) {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0.1) s.speed = -s.speed;

        s.x += s.dx;
        s.y += s.dy;

        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 208, 97, ${Math.abs(s.alpha)})`;
        ctx.shadowBlur = s.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = "#f5d061";
        ctx.fill();
      }

      requestAnimationFrame(render);
    }

    render();
  }

  // ================= NOTIFICATION TOAST =================
  function showToast(message) {
    DOM.toastMsg.textContent = message;
    DOM.toast.classList.remove("hidden");
    setTimeout(() => {
      DOM.toast.classList.add("hidden");
    }, 3200);
  }

  // ================= API KEY & BADGE MANAGEMENT =================
  function updateApiKeyStatus() {
    if (STATE.apiKey && STATE.apiKey.trim().length > 15) {
      DOM.apiKeyBadge.classList.add("active");
      DOM.apiKeyBadge.title = "Gemini API 활성화됨";
      DOM.readingEngineBadge.innerHTML = `<i class="fa-solid fa-microchip"></i> Gemini AI (${STATE.model})`;
    } else {
      DOM.apiKeyBadge.classList.remove("active");
      DOM.apiKeyBadge.title = "내장 오라클 엔진 활성화됨";
      DOM.readingEngineBadge.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> 내장 미스틱 오라클 엔진`;
    }
  }

  // ================= INITIALIZATION & EVENT LISTENERS =================
  function init() {
    initStarCanvas();

    // 1. 기간 선택 버튼 클릭 이벤트
    DOM.periodBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        DOM.periodBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        STATE.period = btn.dataset.period;
        sound.playCardSelect();
      });
    });

    // 2. 질문 입력 글자수 카운터
    DOM.questionInput.addEventListener("input", () => {
      const len = DOM.questionInput.value.length;
      DOM.charCounter.textContent = `${len} / 200`;
    });

    // 3. 추천 질문 프리셋 칩 클릭
    DOM.presetChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        DOM.questionInput.value = chip.textContent;
        DOM.charCounter.textContent = `${chip.textContent.length} / 200`;
        sound.playCardSelect();
      });
    });

    // 4. 카드 셔플 및 펼치기 시작 버튼
    DOM.startSpreadBtn.addEventListener("click", startSpreadPhase);

    // 5. 스프레드 화면 상단 버튼들
    DOM.reshuffleBtn.addEventListener("click", () => {
      resetSelection();
      buildSpreadDeck();
      sound.playShuffle();
      showToast("78장의 카드를 정성스레 다시 섞었습니다.");
    });

    DOM.backToIntroBtn.addEventListener("click", () => {
      goToStep("intro");
    });

    // 6. 리딩 시작 버튼
    DOM.openReadingBtn.addEventListener("click", startReadingPhase);

    // 6-1. 스프레드 뷰 시크릿 카드 엿보기 토글 버튼
    if (DOM.peekSecretCardBtn) {
      DOM.peekSecretCardBtn.addEventListener("click", toggleSecretCardPeek);
    }

    // 7. 다시 점치기 & 공유 버튼
    DOM.newReadingBtn.addEventListener("click", () => {
      resetSelection();
      goToStep("intro");
    });

    DOM.shareReadingBtn.addEventListener("click", () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast("현재 타로 사이트 링크가 복사되었습니다!");
        });
      } else {
        showToast("공유 링크: " + window.location.href);
      }
    });

    DOM.copyResultBtn.addEventListener("click", copyReadingResult);

    // 8. 오디오 토글 버튼
    DOM.soundToggleBtn.addEventListener("click", () => {
      STATE.soundEnabled = !STATE.soundEnabled;
      const icon = DOM.soundToggleBtn.querySelector("i");
      if (STATE.soundEnabled) {
        icon.className = "fa-solid fa-volume-high";
        showToast("신비로운 사운드 효과가 켜졌습니다.");
        sound.playCardSelect();
      } else {
        icon.className = "fa-solid fa-volume-xmark";
        showToast("사운드 효과가 꺼졌습니다.");
      }
    });

    // 9. API 키 모달 관련
    DOM.apiKeyModalBtn.addEventListener("click", () => {
      DOM.geminiApiKeyInput.value = STATE.apiKey;
      DOM.geminiModelSelect.value = STATE.model;
      DOM.apiKeyModal.classList.remove("hidden");
    });

    DOM.closeApiKeyModalBtn.addEventListener("click", () => {
      DOM.apiKeyModal.classList.add("hidden");
    });

    DOM.toggleApiKeyVisibility.addEventListener("click", () => {
      const type = DOM.geminiApiKeyInput.type === "password" ? "text" : "password";
      DOM.geminiApiKeyInput.type = type;
      const icon = DOM.toggleApiKeyVisibility.querySelector("i");
      icon.className = type === "password" ? "fa-regular fa-eye" : "fa-regular fa-eye-slash";
    });

    DOM.saveApiKeyBtn.addEventListener("click", () => {
      const key = DOM.geminiApiKeyInput.value.trim();
      const model = DOM.geminiModelSelect.value;
      STATE.apiKey = key;
      STATE.model = model;
      localStorage.setItem("mystic_tarot_gemini_key", key);
      localStorage.setItem("mystic_tarot_gemini_model", model);
      updateApiKeyStatus();
      DOM.apiKeyModal.classList.add("hidden");
      showToast(key ? "Gemini API Key가 안전하게 저장되었습니다!" : "API 키가 비워졌습니다. 내장 엔진으로 동작합니다.");
    });

    DOM.clearApiKeyBtn.addEventListener("click", () => {
      DOM.geminiApiKeyInput.value = "";
      STATE.apiKey = "";
      localStorage.removeItem("mystic_tarot_gemini_key");
      updateApiKeyStatus();
      DOM.apiKeyModal.classList.add("hidden");
      showToast("API Key가 삭제되었습니다. 내장 오라클 엔진으로 전환됩니다.");
    });

    // URL 파라미터로 공유 질문/기간 지원
    checkUrlParams();
    updateApiKeyStatus();
  }

  function checkUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      const p = params.get("p");
      if (p && PERIOD_NAMES[p]) {
        STATE.period = p;
        DOM.periodBtns.forEach((btn) => {
          btn.classList.toggle("active", btn.dataset.period === p);
        });
      }
      if (q) {
        DOM.questionInput.value = decodeURIComponent(q);
        DOM.charCounter.textContent = `${DOM.questionInput.value.length} / 200`;
      }
    } catch (e) {
      console.warn("URL parameter parse error", e);
    }
  }

  // ================= STEP SWITCHER =================
  function goToStep(step) {
    STATE.currentStep = step;
    DOM.stepIntro.classList.remove("active-step-panel");
    DOM.stepIntro.classList.add("hidden-panel");
    DOM.stepSpread.classList.remove("active-step-panel");
    DOM.stepSpread.classList.add("hidden-panel");
    DOM.stepReading.classList.remove("active-step-panel");
    DOM.stepReading.classList.add("hidden-panel");

    if (step === "intro") {
      DOM.stepIntro.classList.remove("hidden-panel");
      DOM.stepIntro.classList.add("active-step-panel");
    } else if (step === "spread") {
      DOM.stepSpread.classList.remove("hidden-panel");
      DOM.stepSpread.classList.add("active-step-panel");
    } else if (step === "reading") {
      DOM.stepReading.classList.remove("hidden-panel");
      DOM.stepReading.classList.add("active-step-panel");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ================= STEP 2: SPREAD PHASE =================
  function startSpreadPhase() {
    let question = DOM.questionInput.value.trim();
    if (!question) {
      question = `${PERIOD_NAMES[STATE.period]}의 전반적인 운의 흐름과 조언`;
      DOM.questionInput.value = question;
    }
    STATE.question = question;

    // 헤더 정보 세팅
    DOM.currentPeriodBadge.textContent = PERIOD_NAMES[STATE.period];
    DOM.spreadQuestionTitle.textContent = `"${STATE.question}"`;

    resetSelection();
    buildSpreadDeck();
    goToStep("spread");
    sound.playShuffle();
  }

  function resetSelection() {
    STATE.selectedCards = [];
    DOM.selectedCountText.textContent = "0";
    DOM.openReadingBtn.disabled = true;

    // 슬롯 초기화
    DOM.slots.forEach((slot, idx) => {
      slot.classList.remove("filled");
      const holder = slot.querySelector(".slot-card-holder");
      holder.className = "slot-card-holder empty";
      holder.innerHTML = `
        <div class="empty-placeholder">
          <i class="fa-regular fa-clone"></i>
          <span>${idx === 0 ? "첫" : idx === 1 ? "두" : "세"} 번째 카드를 선택하세요</span>
        </div>
      `;
    });

    // 덱 카드 선택 효과 해제
    const cards = DOM.tarotCardsContainer.querySelectorAll(".tarot-deck-card");
    cards.forEach((c) => c.classList.remove("selected"));
  }

  // 78장 덱 셔플 및 파노라마 렌더링
  function buildSpreadDeck() {
    // Fisher-Yates 셔플
    const deck = [...TAROT_CARDS];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    STATE.deck = deck;

    // 스프레드 맨 아래에 숨겨진 시크릿 카드 (The Shadow Card / Bottom of Deck) 지정
    const bottomCard = deck[deck.length - 1];
    STATE.secretCard = {
      card: bottomCard,
      isReversed: Math.random() < 0.28,
      deckIndex: deck.length - 1
    };

    // 인라인 엿보기 상자 닫기 초기화
    if (DOM.inlineSecretPeekBox) {
      DOM.inlineSecretPeekBox.classList.add("hidden");
      DOM.inlineSecretPeekBox.innerHTML = "";
    }
    if (DOM.peekBtnText) {
      DOM.peekBtnText.textContent = "시크릿 카드 확인하기";
    }

    DOM.tarotCardsContainer.innerHTML = "";

    deck.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.className = "tarot-deck-card";
      cardEl.dataset.index = index;
      cardEl.dataset.id = card.id;

      cardEl.innerHTML = `
        <div class="card-back-design">
          <div class="card-back-pattern">
            <span class="sigil-center">✨</span>
            <span class="sigil-sub">ARCANA</span>
          </div>
          <span class="card-index-tag">#${index + 1}</span>
        </div>
      `;

      cardEl.addEventListener("click", () => handleCardClick(card, index, cardEl));
      DOM.tarotCardsContainer.appendChild(cardEl);
    });

    // 스크롤 중앙으로 살짝 이동
    setTimeout(() => {
      DOM.tarotCardsContainer.scrollLeft = 0;
    }, 100);
  }

  // 시크릿 카드 엿보기 토글 핸들러
  function toggleSecretCardPeek() {
    if (!STATE.secretCard) return;

    const isHidden = DOM.inlineSecretPeekBox.classList.contains("hidden");
    if (isHidden) {
      renderInlineSecretCard();
      DOM.inlineSecretPeekBox.classList.remove("hidden");
      DOM.peekBtnText.textContent = "시크릿 카드 닫기";
      sound.playFlip();
    } else {
      DOM.inlineSecretPeekBox.classList.add("hidden");
      DOM.peekBtnText.textContent = "시크릿 카드 확인하기";
      sound.playCardSelect();
    }
  }

  function renderInlineSecretCard() {
    const s = STATE.secretCard;
    const card = s.card;
    const isRev = s.isReversed;
    const dirText = isRev ? "역방향 (Reversed)" : "정방향 (Upright)";
    const kws = isRev ? card.keywords.reversed.slice(0, 3).join(", ") : card.keywords.upright.slice(0, 3).join(", ");
    const meaning = isRev ? card.meaning.reversed : card.meaning.upright;

    DOM.inlineSecretPeekBox.innerHTML = `
      <div class="inline-secret-card-display">
        <div class="mini-revealed-card">
          <div style="font-size: 2.2rem; margin-bottom: 4px; ${isRev ? 'transform: rotate(180deg);' : ''}">${card.icon}</div>
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--gold-light);">${card.name.split('(')[0]}</div>
          <div style="font-size: 0.62rem; color: ${isRev ? '#ff7675' : '#2ecc71'};">${dirText}</div>
        </div>
        <div class="inline-secret-details">
          <h5><i class="fa-solid fa-sparkles"></i> ${card.name} (${dirText})</h5>
          <div class="secret-kws">숨겨진 무의식의 키워드: ${kws}</div>
          <p class="secret-exp">${meaning}</p>
        </div>
      </div>
    `;
  }

  function handleCardClick(card, index, cardEl) {
    if (STATE.selectedCards.length >= 3) {
      showToast("이미 3장의 카드를 모두 선택하셨습니다.");
      return;
    }

    if (cardEl.classList.contains("selected")) return;

    // 정방향 / 역방향 랜덤 결정 (약 75% 정방향, 25% 역방향)
    const isReversed = Math.random() < 0.28;
    const slotIdx = STATE.selectedCards.length;

    const selectedEntry = { card, isReversed, slotIndex: slotIdx, deckIndex: index };
    STATE.selectedCards.push(selectedEntry);

    cardEl.classList.add("selected");
    sound.playCardSelect();

    // 슬롯 채우기
    fillSlot(slotIdx, selectedEntry);

    // 카운터 갱신
    DOM.selectedCountText.textContent = STATE.selectedCards.length;

    if (STATE.selectedCards.length === 3) {
      DOM.openReadingBtn.disabled = false;
      sound.playChime();
      showToast("운명의 3장이 모두 선택되었습니다! 아래 '해석 열기'를 눌러주세요.");
    }
  }

  function fillSlot(slotIdx, entry) {
    const slot = DOM.slots[slotIdx];
    slot.classList.add("filled");

    const holder = slot.querySelector(".slot-card-holder");
    holder.className = "slot-card-holder";
    holder.innerHTML = `
      <div class="slot-placed-card">
        <button type="button" class="remove-btn" title="선택 취소" aria-label="선택 취소">&times;</button>
        <div class="placed-pattern">${entry.card.icon}</div>
        <div class="placed-name">${entry.card.name.split("(")[0]}</div>
        <div class="placed-dir">${entry.isReversed ? "역방향 (Reversed)" : "정방향 (Upright)"}</div>
      </div>
    `;

    // 제거 버튼
    const removeBtn = holder.querySelector(".remove-btn");
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeCardFromSelection(slotIdx);
    });
  }

  function removeCardFromSelection(slotIdx) {
    const removed = STATE.selectedCards.find((c) => c.slotIndex === slotIdx);
    if (!removed) return;

    // 덱 카드 복구
    const deckCardEl = DOM.tarotCardsContainer.querySelector(`[data-index="${removed.deckIndex}"]`);
    if (deckCardEl) deckCardEl.classList.remove("selected");

    // 배열 재정렬
    STATE.selectedCards = STATE.selectedCards.filter((c) => c.slotIndex !== slotIdx);

    // 슬롯 다시 비우고 재배치
    const reordered = [...STATE.selectedCards];
    resetSelection();

    reordered.forEach((entry, idx) => {
      entry.slotIndex = idx;
      STATE.selectedCards.push(entry);
      fillSlot(idx, entry);
      const cEl = DOM.tarotCardsContainer.querySelector(`[data-index="${entry.deckIndex}"]`);
      if (cEl) cEl.classList.add("selected");
    });

    DOM.selectedCountText.textContent = STATE.selectedCards.length;
    DOM.openReadingBtn.disabled = STATE.selectedCards.length !== 3;
    sound.playCardSelect();
  }

  // ================= STEP 3: READING PHASE =================
  async function startReadingPhase() {
    if (STATE.selectedCards.length !== 3) return;

    // 헤더 메타정보 세팅
    DOM.readingPeriodBadge.textContent = PERIOD_NAMES[STATE.period];
    DOM.readingQuestionDisplay.textContent = `"${STATE.question}"`;

    const now = new Date();
    const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
    DOM.readingTimestamp.textContent = `${dateStr} · ${PERIOD_NAMES[STATE.period]}`;

    goToStep("reading");
    sound.playChime();

    // 3장 메인 카드 쇼케이스 렌더링
    renderShowcaseCards();

    // 시크릿 섀도 카드 쇼케이스 렌더링
    renderSecretShowcase();

    // AI 리딩 로딩 활성화
    DOM.readingLoadingIndicator.classList.remove("hidden");
    DOM.readingContentContainer.classList.add("hidden");
    DOM.luckyInsightsBox.classList.add("hidden");

    // 3장의 메인 카드를 순서대로 0.6초 간격으로 오픈
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 650));
      const flipCard = document.getElementById(`flipCard-${i}`);
      if (flipCard) {
        flipCard.classList.add("revealed");
        sound.playFlip();
      }
    }

    // 이어서 덱 맨 아래 숨겨진 4번째 시크릿 카드 오픈!
    await new Promise((r) => setTimeout(r, 800));
    const secretFlip = document.getElementById("secretFlipCard");
    if (secretFlip) {
      secretFlip.classList.add("revealed");
      sound.playFlip();
      sound.playChime();
    }

    // Gemini API 호출 또는 내장 오라클 엔진 호출
    await generateInterpretation();
  }

  function renderShowcaseCards() {
    DOM.cardsShowcaseGrid.innerHTML = "";

    STATE.selectedCards.forEach((entry, idx) => {
      const card = entry.card;
      const role = SLOT_ROLES[idx];
      const isRev = entry.isReversed;
      const dirText = isRev ? "역방향 (Reversed)" : "정방향 (Upright)";
      const dirClass = isRev ? "reversed" : "upright";
      const keywords = isRev ? card.keywords.reversed.slice(0, 3).join(", ") : card.keywords.upright.slice(0, 3).join(", ");
      const meaningSnippet = isRev ? card.meaning.reversed : card.meaning.upright;

      const itemEl = document.createElement("div");
      itemEl.className = "showcase-card-item";

      itemEl.innerHTML = `
        <div class="showcase-card-pos">CARD ${idx + 1}</div>
        <div class="showcase-card-pos-name">${role.title}</div>

        <div class="flip-card" id="flipCard-${idx}">
          <div class="flip-card-inner">
            <!-- 뒷면 -->
            <div class="flip-card-front card-back-design">
              <div class="card-back-pattern">
                <span class="sigil-center">✨</span>
                <span class="sigil-sub">TAROT ARCANUM</span>
              </div>
            </div>

            <!-- 앞면 -->
            <div class="flip-card-back ${isRev ? "is-reversed" : ""}">
              <div class="card-top-meta">
                <span class="arcana-num">${card.roman}</span>
                <span class="direction-badge ${dirClass}">${dirText}</span>
              </div>
              
              <div class="card-center-art">
                <div class="card-symbol-center">${card.icon}</div>
              </div>

              <div class="card-bottom-info">
                <div class="card-korean-name">${card.name.split("(")[0]}</div>
                <div class="card-eng-name">${card.engName}</div>
                <div class="card-keywords-summary">${keywords}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="showcase-card-analysis">
          <div class="analysis-keyphrase">"${keywords.split(",")[0]}"</div>
          <p class="analysis-text">${meaningSnippet}</p>
        </div>
      `;

      DOM.cardsShowcaseGrid.appendChild(itemEl);
    });
  }

  // 시크릿 카드 (The Shadow Card) 단독 쇼케이스 렌더링
  function renderSecretShowcase() {
    if (!DOM.secretCardShowcase || !STATE.secretCard) return;

    const s = STATE.secretCard;
    const card = s.card;
    const isRev = s.isReversed;
    const dirText = isRev ? "역방향 (Reversed)" : "정방향 (Upright)";
    const dirClass = isRev ? "reversed" : "upright";
    const keywords = isRev ? card.keywords.reversed.slice(0, 3).join(", ") : card.keywords.upright.slice(0, 3).join(", ");
    const meaningSnippet = isRev ? card.meaning.reversed : card.meaning.upright;

    DOM.secretCardShowcase.innerHTML = `
      <div class="secret-showcase-header">
        <span class="secret-tag"><i class="fa-solid fa-key"></i> 덱 맨 아래의 시크릿 카드 (The Shadow Card)</span>
        <h3 class="secret-showcase-title">무의식이 숨겨둔 비밀의 열쇠 & 기저의 복선</h3>
        <p class="secret-showcase-desc">질문자님의 내면 깊은 곳에서 이 운세를 관통하고 있는 보이지 않는 힘과 숨겨진 해답입니다.</p>
      </div>

      <div class="secret-showcase-content">
        <div class="secret-showcase-card-col">
          <div class="flip-card" id="secretFlipCard">
            <div class="flip-card-inner">
              <!-- 뒷면 -->
              <div class="flip-card-front card-back-design" style="border-color: var(--purple-accent);">
                <div class="card-back-pattern">
                  <span class="sigil-center">🔮</span>
                  <span class="sigil-sub">SECRET SHADOW</span>
                </div>
              </div>

              <!-- 앞면 -->
              <div class="flip-card-back ${isRev ? "is-reversed" : ""}" style="border-color: var(--purple-accent); box-shadow: 0 0 25px var(--purple-glow);">
                <div class="card-top-meta">
                  <span class="arcana-num">${card.roman}</span>
                  <span class="direction-badge ${dirClass}">${dirText}</span>
                </div>
                
                <div class="card-center-art">
                  <div class="card-symbol-center">${card.icon}</div>
                </div>

                <div class="card-bottom-info">
                  <div class="card-korean-name">${card.name.split("(")[0]}</div>
                  <div class="card-eng-name">${card.engName}</div>
                  <div class="card-keywords-summary">${keywords}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="secret-showcase-details-col">
          <span class="secret-sub-badge">무의식 심층의 상징</span>
          <h4 class="secret-card-headline">${card.name} (${dirText})</h4>
          <div class="secret-card-subkws">핵심 숨은 키워드: ${keywords}</div>
          <p class="secret-card-deep-desc">
            ${meaningSnippet}<br><br>
            이 카드는 겉으로 드러난 3장의 흐름 뒤편에서 질문자님의 감정과 무의식이 진정으로 갈망하거나 주의해야 할 '숨은 변수'를 의미합니다.
          </p>
        </div>
      </div>
    `;
  }

  // ================= INTERPRETATION ENGINE (Gemini API / Fallback) =================
  async function generateInterpretation() {
    const card1 = STATE.selectedCards[0];
    const card2 = STATE.selectedCards[1];
    const card3 = STATE.selectedCards[2];
    const secretCard = STATE.secretCard;

    const promptContext = `
[사용자 타로 운세 리딩 의뢰]
- 운세 주기: ${PERIOD_NAMES[STATE.period]}
- 질문자의 주관식 질문: "${STATE.question}"
- 선택된 3장의 타로 카드:
  1번 카드 (과거 및 현재 상황): ${card1.card.name} [${card1.isReversed ? "역방향" : "정방향"}]
  2번 카드 (마주한 도전 과제 및 조언): ${card2.card.name} [${card2.isReversed ? "역방향" : "정방향"}]
  3번 카드 (미래 운세 흐름 및 최종 결과): ${card3.card.name} [${card3.isReversed ? "역방향" : "정방향"}]
- 덱 맨 아래 숨겨져 있던 시크릿 카드 (The Shadow Card / 무의식의 본심과 숨은 열쇠):
  시크릿 카드: ${secretCard.card.name} [${secretCard.isReversed ? "역방향" : "정방향"}]

당신은 30년 경력의 신비롭고 지혜로운 정통 타로 마스터이자 마인드풀니스 카운슬러입니다.
위 질문자의 질문 내용에 깊이 공감하며, 3장의 카드와 맨 아래의 시크릿 카드를 유기적으로 연결하여 상세하고 품격 높은 한국어로 운세를 해석해주세요.

답변 작성 규칙:
1. 마크다운 형식을 사용하여 소제목과 단락을 아름답고 가독성 있게 구성하세요.
2. 질문자의 주관식 질문에 대한 직접적이고 명쾌한 조언을 전달하세요.
3. [1단계: 현재의 맥락과 에너지 흐름] -> [2단계: 돌파해야 할 과제와 행동 조언] -> [3단계: 미래의 가능성과 최종 결실] -> [4단계: 덱 맨 아래 시크릿 카드가 전하는 무의식의 비밀 열쇠와 복선] -> [타로 마스터의 종합 마인드셋 조언] 순으로 깊이 있게 서술하세요.
4. 마지막 줄에 다음 형식으로 행운의 지표 4가지를 정확히 기재해주세요:
LUCKY_DATA: { "keyword": "행운키워드2~3개", "color": "행운의컬러", "number": "행운의숫자1~2개", "mantra": "오늘의한줄조언" }
`.trim();

    let resultMarkdown = "";
    let luckyData = null;

    if (STATE.apiKey && STATE.apiKey.trim().length > 15) {
      try {
        resultMarkdown = await callGeminiApi(promptContext);
      } catch (err) {
        console.error("Gemini API Error, falling back to local oracle:", err);
        showToast("Gemini API 호출 지연으로 고성능 내장 오라클 엔진으로 전환되었습니다.");
        resultMarkdown = generateLocalInterpretation(card1, card2, card3, secretCard);
      }
    } else {
      // 내장 오라클 엔진 호출
      await new Promise((r) => setTimeout(r, 1200)); // 실감나는 연출 대기
      resultMarkdown = generateLocalInterpretation(card1, card2, card3, secretCard);
    }

    // LUCKY_DATA 파싱
    const luckyMatch = resultMarkdown.match(/LUCKY_DATA:\s*(\{.*\})/);
    if (luckyMatch) {
      try {
        luckyData = JSON.parse(luckyMatch[1]);
        resultMarkdown = resultMarkdown.replace(/LUCKY_DATA:[\s\S]*$/, "").trim();
      } catch (e) {
        console.warn("Failed to parse LUCKY_DATA", e);
      }
    }

    if (!luckyData) {
      luckyData = generateDefaultLuckyData(card1, card2, card3, secretCard);
    }

    // 로딩 숨기고 타이핑 효과로 텍스트 출력
    DOM.readingLoadingIndicator.classList.add("hidden");
    DOM.readingContentContainer.classList.remove("hidden");
    DOM.luckyInsightsBox.classList.remove("hidden");

    // 행운 지표 세팅
    DOM.luckyKeyword.textContent = luckyData.keyword || "직관, 용기, 조화";
    DOM.luckyColor.textContent = luckyData.color || "로얄 골드 & 딥 퍼플";
    DOM.luckyNumber.textContent = luckyData.number || "7, 21";
    DOM.luckyMantra.textContent = luckyData.mantra || "내면의 목소리를 믿고 한 걸음 나아가기";

    // 본문 타이핑 이펙트
    await typeWriterEffect(DOM.readingContentContainer, formatMarkdownToHtml(resultMarkdown));
  }

  // ================= GEMINI REST API CALL =================
  async function callGeminiApi(prompt) {
    const model = STATE.model || "gemini-2.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${STATE.apiKey.trim()}`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(`Gemini API Error (${res.status}): ${errJson.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini 응답에 텍스트가 없습니다.");
    return text;
  }

  // ================= BUILT-IN MYSTIC ORACLE ENGINE (FALLBACK) =================
  function generateLocalInterpretation(c1, c2, c3, sc) {
    const q = STATE.question;
    const p = PERIOD_NAMES[STATE.period];

    const c1Name = c1.card.name;
    const c1Dir = c1.isReversed ? "역방향" : "정방향";
    const c1Kw = c1.isReversed ? c1.card.keywords.reversed : c1.card.keywords.upright;
    const c1Meaning = c1.isReversed ? c1.card.meaning.reversed : c1.card.meaning.upright;

    const c2Name = c2.card.name;
    const c2Dir = c2.isReversed ? "역방향" : "정방향";
    const c2Kw = c2.isReversed ? c2.card.keywords.reversed : c2.card.keywords.upright;
    const c2Meaning = c2.isReversed ? c2.card.meaning.reversed : c2.card.meaning.upright;

    const c3Name = c3.card.name;
    const c3Dir = c3.isReversed ? "역방향" : "정방향";
    const c3Kw = c3.isReversed ? c3.card.keywords.reversed : c3.card.keywords.upright;
    const c3Meaning = c3.isReversed ? c3.card.meaning.reversed : c3.card.meaning.upright;

    const scName = sc ? sc.card.name : "시크릿 아르카나";
    const scDir = sc && sc.isReversed ? "역방향" : "정방향";
    const scKw = sc ? (sc.isReversed ? sc.card.keywords.reversed : sc.card.keywords.upright) : ["통찰", "비밀", "기회"];
    const scMeaning = sc ? (sc.isReversed ? sc.card.meaning.reversed : sc.card.meaning.upright) : "내면의 숨은 힘을 상징합니다.";

    return `
### 🌌 [질문 맥락에 대한 영적 공감]
질문자님께서 마음에 품으신 **"${q}"**에 대한 **${p}**의 천구(天球)가 열렸습니다. 
선택하신 3장의 카드와 덱 맨 아래 숨겨져 있던 시크릿 카드는 우연이 아닌 질문자님의 무의식이 우주의 에너지와 공명하여 이끌어낸 필연적인 나침반입니다.

---

### 🔮 1. 현재의 배경과 기운: ${c1Name} (${c1Dir})
> **핵심 키워드**: ${c1Kw.slice(0, 3).join(", ")}

현재 질문자님을 둘러싼 상황은 **${c1Name}** 카드가 강하게 관할하고 있습니다. 
${c1Meaning} 질문자님께서는 현재 상황에서 외부의 평가나 조급함에 흔들리기보다, 지금까지 다져온 본인의 기본기와 진정성을 신뢰해야 하는 지점에 서 계십니다. 상황이 다소 복잡하게 느껴지더라도 이는 새로운 도약을 위한 정돈의 단계입니다.

---

### 🛡️ 2. 마주한 도전 과제와 실천적 조언: ${c2Name} (${c2Dir})
> **핵심 키워드**: ${c2Kw.slice(0, 3).join(", ")}

이번 주기에서 질문자님이 각별히 주의하고 돌파해야 할 핵심 열쇠는 **${c2Name}** 카드가 말해주고 있습니다.
${c2Meaning}
무조건적인 속도전이나 감정적인 대응은 오히려 시야를 흐리게 할 수 있습니다. 지금은 **${c2Kw[0]}**의 지혜를 발휘하여, 우선순위를 명확히 정리하고 신중하게 한 걸음씩 내딛는 태도가 최상의 방패이자 무기가 되어줄 것입니다.

---

### 🌟 3. 미래 운세의 흐름과 최종 결실: ${c3Name} (${c3Dir})
> **핵심 키워드**: ${c3Kw.slice(0, 3).join(", ")}

질문하신 질문의 최종적인 귀결과 향후 펼쳐질 에너지의 모습은 **${c3Name}** 카드가 찬란하게 비추고 있습니다.
${c3Meaning}
앞서 마주한 도전 과제를 슬기롭게 수용한다면, 질문자님이 바라던 목표는 **${c3Kw[0]}**과 **${c3Kw[1]}**의 긍정적인 결실로 구체화될 것입니다. 자신에 대한 의심을 내려놓고 당당하게 미래를 맞이하세요.

---

### 🗝️ 4. [시크릿 섀도 카드] 무의식의 숨은 열쇠: ${scName} (${scDir})
> **핵심 키워드**: ${scKw.slice(0, 3).join(", ")}

스프레드 덱의 맨 밑바닥에 조용히 머물며 이번 운세의 기저를 지탱하고 있던 시크릿 카드는 **${scName}**입니다.
${scMeaning}
겉으로는 질문에 대해 특정 결과를 고민하고 계시지만, 내면 깊은 곳에서는 **${scKw[0]}**에 대한 갈망이나 불안이 함께 작용하고 있음을 보여줍니다. 이 시크릿 카드가 가리키는 무의식의 소리에 솔직해질 때, 비로소 1~3번 카드의 흐름이 완전한 평온과 성공으로 이어질 것입니다.

---

### 🕊️ 타로 마스터의 종합 제언
> *"운명은 정해진 바위가 아니라, 당신의 의지와 지혜로 빚어가는 맑은 강물과 같습니다."*

질문자님의 마음에 깃든 선한 의도와 노력은 이미 우주의 지지를 받고 있습니다. 덱 맨 밑바닥의 시크릿 카드까지 드러난 만큼, 보이지 않던 불안을 해소하고 자신감 넘치는 발걸음을 이어가시길 축원합니다.

LUCKY_DATA: { "keyword": "${c3Kw[0]}, ${scKw[0]}", "color": "${sc && sc.card.color ? '신비로운 톤' : '골드 & 딥 퍼플'}", "number": "${c1.card.number || 7}, ${sc ? (sc.card.number || 12) : 21}", "mantra": "나의 무의식과 직관을 신뢰하며 담대하게 나아가기" }
`.trim();
  }

  function generateDefaultLuckyData(c1, c2, c3, sc) {
    return {
      keyword: `${c3.card.keywords.upright[0]}, ${sc ? sc.card.keywords.upright[0] : c1.card.keywords.upright[0]}`,
      color: "미드나잇 퍼플 & 골드",
      number: `${(c1.card.number % 9) + 1}, ${sc ? ((sc.card.number % 9) + 1) : 7}`,
      mantra: "지나간 걱정을 내려놓고 지금 눈앞의 가능성에 집중하기"
    };
  }

  // ================= TEXT FORMATTING & TYPEWRITER =================
  function formatMarkdownToHtml(md) {
    let html = md
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/---/gim, '<hr style="border:0;border-top:1px solid rgba(255,255,255,0.1);margin:24px 0;">')
      .replace(/\n\n/gim, "</p><p>")
      .replace(/\n/gim, "<br>");

    return `<p>${html}</p>`;
  }

  async function typeWriterEffect(container, htmlContent) {
    container.innerHTML = htmlContent;
    container.style.opacity = "0";
    container.style.transition = "opacity 0.8s ease";

    await new Promise((r) => setTimeout(r, 50));
    container.style.opacity = "1";
  }

  function copyReadingResult() {
    const content = DOM.readingContentContainer.innerText;
    const header = `[미스틱 타로 오라클 - ${PERIOD_NAMES[STATE.period]}]\n질문: ${STATE.question}\n\n`;
    const fullText = header + content;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText).then(() => {
        showToast("해석 전문이 클립보드에 복사되었습니다!");
      });
    } else {
      showToast("복사 기능이 지원되지 않는 환경입니다.");
    }
  }

  // Start app
  document.addEventListener("DOMContentLoaded", init);
})();
