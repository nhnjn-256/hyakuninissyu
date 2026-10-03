/* --- SVGフォールバック・アイコン定義 --- */
const FallbackArt = {
  back: `<svg viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#2d3748" rx="8"/>
    <circle cx="50" cy="50" r="34" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-dasharray="6,4"/>
    <path d="M50 26 L56 42 L72 44 L60 56 L64 72 L50 62 L36 72 L40 56 L28 44 L44 42 Z" fill="#d97706"/>
  </svg>`,
  tono: `<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="#eff6ff"/>
    <path d="M38 34 C38 18, 52 14, 58 14 C64 14, 66 22, 62 34 Z" fill="#1e293b"/>
    <circle cx="50" cy="42" r="16" fill="#fde68a"/>
    <path d="M44 43 Q46 45 48 43 M52 43 Q54 45 56 43" stroke="#451a03" stroke-width="2" fill="none"/>
    <path d="M22 84 C24 54, 40 50, 50 50 C60 50, 76 54, 78 84 Z" fill="#1e3a8a"/>
    <polygon points="56,54 60,54 58,74 54,74" fill="#f59e0b"/>
  </svg>`,
  hime: `<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="#fff1f2"/>
    <path d="M28 82 C24 45, 34 22, 50 22 C66 22, 76 45, 72 82 C66 60, 68 45, 50 45 C32 45, 34 60, 28 82 Z" fill="#0f172a"/>
    <circle cx="50" cy="40" r="14" fill="#fef08a"/>
    <path d="M43 40 Q46 42 48 40 M52 40 Q54 42 57 40" stroke="#881337" stroke-width="1.8" fill="none"/>
    <circle cx="50" cy="48" r="2.2" fill="#e11d48"/>
    <path d="M20 86 C26 56, 38 52, 50 52 C62 52, 74 56, 80 86 Z" fill="#e11d48"/>
    <path d="M30 86 C36 65, 42 60, 50 60 C58 60, 64 65, 70 86 Z" fill="#fb7185"/>
    <path d="M42 66 Q50 60 58 66 L55 76 L45 76 Z" fill="#fef08a" stroke="#d97706" stroke-width="1"/>
  </svg>`,
  bozu: `<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="#f1f5f9"/>
    <path d="M22 84 C26 55, 38 52, 50 52 C62 52, 74 55, 78 84 Z" fill="#334155"/>
    <path d="M34 54 L66 84 L54 84 L26 58 Z" fill="#d97706"/>
    <circle cx="50" cy="38" r="18" fill="#fed7aa"/>
    <path d="M42 36 Q45 34 47 36 M53 36 Q55 34 58 36" stroke="#7c2d12" stroke-width="2" fill="none"/>
    <path d="M46 44 Q50 48 54 44" stroke="#7c2d12" stroke-width="1.6" fill="none"/>
    <circle cx="50" cy="70" r="10" fill="none" stroke="#78350f" stroke-width="3" stroke-dasharray="3,3"/>
  </svg>`,
  slotDefault: `<svg viewBox="0 0 60 84">
    <rect width="60" height="84" fill="#faf6ea" rx="4"/>
    <rect x="4" y="4" width="52" height="76" fill="none" stroke="#165b33" stroke-width="2"/>
    <text x="30" y="46" font-size="28" text-anchor="middle" dominant-baseline="middle">🎴</text>
  </svg>`
};

/* --- BGM制御（ローカル・GitHubファイル再生） --- */
const bgmAudio = document.getElementById('audio-bgm');
let isBgmPlaying = false;

function tryResumeAudio() {
  if (isBgmPlaying && bgmAudio && bgmAudio.paused) {
    bgmAudio.volume = 0.25;
    bgmAudio.play().catch(() => {});
  }
}

function toggleBgm(e) {
  if (e) e.stopPropagation();
  const btn = document.getElementById('bgm-toggle-btn');
  if (!bgmAudio) return;

  if (bgmAudio.paused) {
    bgmAudio.volume = 0.25;
    bgmAudio.play().then(() => {
      isBgmPlaying = true;
      btn.innerText = '🎵 BGM: 再生中';
    }).catch(() => {
      btn.innerText = '⚠️ 音源が見つかりません';
    });
  } else {
    bgmAudio.pause();
    isBgmPlaying = false;
    btn.innerText = '🔇 BGM: 停止中';
  }
}

/* --- Web Audio 効果音 --- */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, duration, type = 'sine', gainVal = 0.05) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

const Sound = {
  draw() { playTone(800, 0.06, 'triangle', 0.06); },
  bozu() { playTone(180, 0.35, 'sawtooth', 0.05); },
  attack() {
    playTone(520, 0.12, 'sine', 0.06);
    setTimeout(() => playTone(300, 0.2, 'triangle', 0.07), 60);
  },
  laser() {
    playTone(400, 0.25, 'sawtooth', 0.04);
    setTimeout(() => playTone(900, 0.3, 'sine', 0.05), 100);
  },
  shield() {
    playTone(440, 0.4, 'sine', 0.05);
    setTimeout(() => playTone(660, 0.35, 'sine', 0.04), 80);
  },
  heal() {
    playTone(523.25, 0.2, 'sine', 0.04);
    setTimeout(() => playTone(659.25, 0.2, 'sine', 0.04), 90);
    setTimeout(() => playTone(783.99, 0.3, 'sine', 0.04), 180);
  },
  enemyHit() { playTone(90, 0.3, 'triangle', 0.08); },
  special() {
    playTone(600, 0.15, 'sine', 0.05);
    setTimeout(() => playTone(800, 0.2, 'sine', 0.05), 100);
  }
};

/* --- 敵キャラクター定義 --- */
const enemyTypes = [
  {
    id: 'wolf',
    name: '黒狼 シャドウウルフ',
    maxHp: 400,
    atkMin: 14,
    atkMax: 24,
    skillName: '影牙連撃',
    intro: '俊敏な黒毛の狼が影から飛び出してきた！'
  },
  {
    id: 'fox',
    name: '狡知の妖狐 玉藻の影',
    maxHp: 480,
    atkMin: 18,
    atkMax: 30,
    skillName: '狐火連弾',
    intro: '怪しげな笑みを浮かべた九尾の妖狐が立ちはだかった！',
    healCount: 2
  },
  {
    id: 'behemoth',
    name: '巨獣 アース・ベヒモス',
    maxHp: 650,
    atkMin: 22,
    atkMax: 36,
    skillName: '地響き突進',
    intro: '岩石の甲殻を纏う超巨大魔獣が立ちはだかった！'
  },
  {
    id: 'demon',
    name: '上位魔族 グレーターデーモン',
    maxHp: 540,
    atkMin: 24,
    atkMax: 40,
    skillName: '滅びの黒槍',
    intro: '漆黒の翼を広げた狡猾な高位魔族が降臨した！'
  }
];

/* --- 山札管理（殿66 / 姫21 / 坊主13） --- */
let deckState = { tono: 66, hime: 21, bozu: 13 };

function resetDeck() {
  deckState.tono = 66;
  deckState.hime = 21;
  deckState.bozu = 13;
  addLog(`【山札初期化】百枚の札山（殿66/姫21/坊主13）が新たに整えられた。`, 'log-buff');
}

const tonoPool = [
  { type: '殿', name: '柿本人麻呂', bonus: 0.5, art: FallbackArt.tono, desc: '倍率 +0.5' },
  { type: '殿', name: '猿丸太夫', bonus: 0.5, art: FallbackArt.tono, desc: '倍率 +0.5' },
  { type: '殿', name: '阿倍仲麻呂', bonus: 0.6, art: FallbackArt.tono, desc: '倍率 +0.6' },
  { type: '殿', name: '在原業平', bonus: 0.5, art: FallbackArt.tono, desc: '倍率 +0.5' }
];

const himePool = [
  { type: '姫', name: '持統天皇', bonus: 1.0, art: FallbackArt.hime, desc: '倍率 +1.0' },
  { type: '姫', name: '小野小町', bonus: 1.5, art: FallbackArt.hime, desc: '倍率 +1.5 (特大)' },
  { type: '姫', name: '紫式部', bonus: 1.0, art: FallbackArt.hime, desc: '倍率 +1.0' }
];

const bozuPool = [
  { type: '坊主', name: '喜撰法師', bonus: 0, art: FallbackArt.bozu, desc: '全消滅＋2ターン気絶！' },
  { type: '坊主', name: '僧正遍昭', bonus: 0, art: FallbackArt.bozu, desc: '全消滅＋2ターン気絶！' },
  { type: '坊主', name: '慈円', bonus: 0, art: FallbackArt.bozu, desc: '全消滅＋2ターン気絶！' }
];

function calcSupportValue(baseD, m) {
  const effectiveM = 1.0 + Math.log10(Math.max(1.0, m));
  return Math.round(baseD * effectiveM);
}

/* --- 百人一首 詠唱候補 --- */
const poemPool = [
  {
    id: 'chihaya',
    kami: 'ちはやぶる 神代も聞かず 竜田川',
    shimo: 'からくれないに 水くくるとは',
    type: '攻撃',
    badge: 'badge-atk',
    isOffense: true,
    weight: 10,
    desc: '激しい紅蓮の水流。基礎40ダメ。(倍率消費)',
    action: (mult) => {
      Sound.attack();
      const dmg = Math.round(40 * mult * player.buff);
      boss.hp = Math.max(0, boss.hp - dmg);
      addLog(`<span class="log-poem">「ちはやぶる 神代も聞かず 竜田川 からくれないに…！」</span>`);
      addLog(`紅蓮の奔流！ ${boss.name} に ${dmg} の大打撃！`);
    }
  },
  {
    id: 'sewo',
    kami: '瀬をはやみ 岩にせかるる 滝川の',
    shimo: 'われても末に あはむとぞ思ふ',
    type: '奥義',
    badge: 'badge-atk',
    isOffense: true,
    weight: 8,
    desc: '基礎20。倍率が2倍で乗る高圧貫通砲。(倍率消費)',
    action: (mult) => {
      Sound.laser();
      const effectiveMult = 1.0 + (mult - 1.0) * 2.0;
      const dmg = Math.round(20 * effectiveMult * player.buff);
      boss.hp = Math.max(0, boss.hp - dmg);
      addLog(`<span class="log-poem">「瀬をはやみ 岩にせかるる 滝川の われても末に…！」</span>`);
      addLog(`貫通水流レーザー！ ${dmg} の破滅ダメージ！`);
    }
  },
  {
    id: 'mikanohara',
    kami: 'みかの原 わきて流るる いづみ川',
    shimo: 'いつ見きとてか 恋しかるらむ',
    type: '連繋',
    badge: 'badge-atk',
    isOffense: false,
    weight: 9,
    desc: '基礎25ダメ＋ターン消費なしで坊主めくりドロー！',
    action: (mult) => {
      Sound.attack();
      const dmg = Math.round(25 * mult * player.buff);
      boss.hp = Math.max(0, boss.hp - dmg);
      addLog(`<span class="log-poem">「みかの原 わきて流るる いづみ川 いつ見きとてか…！」</span>`);
      addLog(`湧き出る清流の連撃！ ${boss.name} に ${dmg} ダメージ！`);
      setTimeout(() => {
        addLog(`【連繋効果】泉の言霊により、追加の札をドロー！`, 'log-buff');
        drawBozuCard(false);
      }, 300);
    }
  },
  {
    id: 'akinota',
    kami: '秋の田の かりほの庵の 苫をあらみ',
    shimo: 'わが衣手は 露にぬれつつ',
    type: '防御',
    badge: 'badge-def',
    isOffense: false,
    weight: 10,
    desc: '基礎30の結界防壁。(倍率スタック維持)',
    action: (mult) => {
      Sound.shield();
      const s = calcSupportValue(30, mult);
      player.shield += s;
      addLog(`<span class="log-poem">「秋の田の かりほの庵の 苫をあらみ…！」</span>`);
      addLog(`避難所結界を展開！ 防壁 +${s}`);
    }
  },
  {
    id: 'nagarahe',
    kami: 'ながらへば またこのごろや しのばれむ',
    shimo: '憂しと見し世ぞ 今は恋しき',
    type: '回復',
    badge: 'badge-heal',
    isOffense: false,
    weight: 10,
    desc: '基礎28回復。(倍率スタック維持)',
    action: (mult) => {
      Sound.heal();
      const h = calcSupportValue(28, mult);
      player.hp = Math.min(player.maxHp, player.hp + h);
      addLog(`<span class="log-poem">「ながらへば またこのごろや しのばれむ…！」</span>`);
      addLog(`延命の言霊。HPが ${h} 回復した。`, 'log-heal');
    }
  },
  {
    id: 'tagonoura',
    kami: '田子の浦に うち出でて見れば 白妙の',
    shimo: '富士の高嶺に 雪は降りつつ',
    type: '強化',
    badge: 'badge-buff',
    isOffense: false,
    weight: 10,
    desc: '次の攻撃1.7倍＆基礎15防壁。(※次が攻撃でないと消失！)',
    action: (mult) => {
      Sound.shield();
      player.buff = 1.7;
      const s = calcSupportValue(15, mult);
      player.shield += s;
      addLog(`<span class="log-poem">「田子の浦に うち出でて見れば 白妙の…！」</span>`);
      addLog(`富士の高嶺の神気！ 次の攻撃1.7倍 ＆ 防壁+${s}！`, 'log-buff');
    }
  },
  {
    id: 'amanohara',
    kami: 'あまの原 ふりさけ見れば 春日なる',
    shimo: '三笠の山に 出でし月かも',
    type: '妨害',
    badge: 'badge-spec',
    isOffense: false,
    weight: 9,
    desc: '月光で敵を【2ターン】スタン(成功率40%＋倍率で上昇)。',
    action: (mult) => {
      Sound.special();
      const chance = Math.min(0.95, 0.40 + (mult - 1.0) * 0.15);
      if (Math.random() < chance) {
        boss.isStunned = 2;
        addLog(`<span class="log-poem">「あまの原 ふりさけ見れば 春日なる…！」</span>`);
        addLog(`神聖な月光が敵を完全縛縛！ 敵は【2ターン】行動不能！(確率:${Math.round(chance*100)}%)`, 'log-buff');
      } else {
        addLog(`<span class="log-poem">「あまの原 ふりさけ見れば 春日なる…！」</span>`);
        addLog(`月光が届かず、敵の拘束に失敗した！(確率:${Math.round(chance*100)}%)`);
      }
    }
  },
  {
    id: 'kazewo',
    kami: '風をいたみ 岩うつ波の おのれのみ',
    shimo: 'くだけて物を 思ふころかな',
    type: '反撃',
    badge: 'badge-def',
    isOffense: true,
    weight: 8,
    desc: '反動(30%ダメ)を受け、敵に倍率を乗せてカウンター全反射！',
    action: (mult) => {
      Sound.shield();
      player.isCounter = true;
      player.counterMult = mult;
      addLog(`<span class="log-poem">「風をいたみ 岩うつ波の おのれのみ…！」</span>`);
      addLog(`砕身反射の構え！ 被弾を耐え、${mult.toFixed(1)}倍の威力を跳ね返す！`, 'log-buff');
    }
  },
  {
    id: 'asaborake',
    kami: '朝ぼらけ 宇治の川霧 たえだえに',
    shimo: 'あらはれわたる 瀬々の網代木',
    type: '回避',
    badge: 'badge-spec',
    isOffense: false,
    weight: 3,
    desc: '【超稀少】完全回避＋さらに2ターン敵を濃霧で包み命中率激減！',
    action: (mult) => {
      Sound.special();
      player.isEvade = true;
      boss.mistTurns = 2;
      addLog(`<span class="log-poem">「朝ぼらけ 宇治の川霧 たえだえに…！」</span>`);
      addLog(`濃密な川霧が立ち込める！ 次の攻撃を完全回避＋敵は2ターン視界不良！`, 'log-buff');
    }
  },
  {
    id: 'tsukuba',
    kami: '筑波嶺の 峰より落つる みなの川',
    shimo: '恋ぞつもりて 淵となりぬる',
    type: '呪詛',
    badge: 'badge-spec',
    isOffense: true,
    weight: 8,
    desc: '基礎25ダメ＋2T継続毒(20ダメ)。(倍率消費)',
    action: (mult) => {
      Sound.attack();
      const dmg = Math.round(25 * mult * player.buff);
      boss.hp = Math.max(0, boss.hp - dmg);
      boss.poison += 2;
      addLog(`<span class="log-poem">「筑波嶺の 峰より落つる みなの川…！」</span>`);
      addLog(`積怨の濁流！ ${dmg} ダメージ＋毒付与！`);
    }
  },
  {
    id: 'hisakata',
    kami: 'ひさかたの 光のどけき 春の日に',
    shimo: 'しづ心なく 花の散るらむ',
    type: '連撃',
    badge: 'badge-atk',
    isOffense: true,
    weight: 10,
    desc: '18ダメ×2連撃＋敵の次命中率を50%低下。(倍率消費)',
    action: (mult) => {
      Sound.attack();
      const hitDmg = Math.round(18 * mult * player.buff);
      boss.hp = Math.max(0, boss.hp - hitDmg * 2);
      boss.isBlinded = true;
      addLog(`<span class="log-poem">「ひさかたの 光のどけき 春の日に…！」</span>`);
      addLog(`桜吹雪の二連撃！ 計 ${hitDmg * 2} ダメージ＋敵の目を眩ませた！`);
    }
  }
];

/* --- バトル状態管理 --- */
let player = { maxHp: 100, hp: 100, shield: 0, buff: 1.0, isCounter: false, counterMult: 1.0, isEvade: false, stunnedTurns: 0 };
let boss = { id: '', name: '', maxHp: 0, hp: 0, atkMin: 0, atkMax: 0, skillName: '', isStunned: 0, poison: 0, isBlinded: false, mistTurns: 0, healCount: 0, charging: false, atkBuff: 1.0 };
let bozuStack = 0;
let multiplier = 1.0;
let isGameOver = false;
let currentHand = [];
let currentEnemyIdx = 0;
let turnDrawCount = 0;

function addLog(text, className = '') {
  const box = document.getElementById('log-box');
  const p = document.createElement('div');
  p.className = 'log-entry ' + className;
  p.innerHTML = text;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}

function startNewBattle() {
  isGameOver = false;
  document.getElementById('restart-btn').style.display = 'none';

  player.hp = player.maxHp;
  player.shield = 0;
  player.buff = 1.0;
  player.isCounter = false;
  player.counterMult = 1.0;
  player.isEvade = false;
  player.stunnedTurns = 0;

  bozuStack = 0;
  multiplier = 1.0;
  turnDrawCount = 0;

  resetDeck();
  resetDrawnCardUI();

  const e = enemyTypes[currentEnemyIdx % enemyTypes.length];
  currentEnemyIdx++;

  boss.id = e.id;
  boss.name = e.name;
  boss.maxHp = e.maxHp;
  boss.hp = e.maxHp;
  boss.atkMin = e.atkMin;
  boss.atkMax = e.atkMax;
  boss.skillName = e.skillName;
  boss.isStunned = 0;
  boss.poison = 0;
  boss.isBlinded = false;
  boss.mistTurns = 0;
  boss.healCount = e.healCount || 0;
  boss.charging = false;
  boss.atkBuff = 1.0;

  document.getElementById('boss-name').innerText = boss.name;

  addLog('--------------------------------------------');
  addLog(e.intro, 'log-boss');
  addLog(`【対戦開始】${boss.name} (HP: ${boss.maxHp})`);
  
  updateUI();
  dealHand();
}

function resetDrawnCardUI() {
  const cardEl = document.getElementById('drawn-card');
  cardEl.style.borderColor = '#1e3a29';
  document.getElementById('card-tag').className = 'card-type-tag tag-tono';
  document.getElementById('card-tag').innerText = '山札';
  
  // card-back.png があれば表示、なければSVG
  document.getElementById('card-art-container').innerHTML = `
    <img src="images/card-back.png" alt="山札" onerror="this.outerHTML=FallbackArt.back">
  `;
  document.getElementById('card-name').innerText = '未ドロー';
  document.getElementById('card-bonus').innerText = 'めくって倍率UP';
  document.getElementById('card-bonus').style.color = '#b45309';
}

function dealHand() {
  let pool = [];
  poemPool.forEach(p => {
    for (let i = 0; i < p.weight; i++) pool.push(p);
  });

  let selected = [];
  while (selected.length < 4) {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (!selected.includes(pick)) selected.push(pick);
  }
  currentHand = selected;
  renderHand();
}

function renderHand() {
  const container = document.getElementById('hand-container');
  container.innerHTML = '';
  currentHand.forEach(card => {
    const btn = document.createElement('button');
    btn.className = 'skill-btn';
    btn.onclick = (e) => { e.stopPropagation(); castCard(card); };
    
    // 画像タグ（images/{card.id}.png が存在しない場合はFallbackArt.slotDefaultを表示）
    btn.innerHTML = `
      <div class="skill-img-slot">
        <img src="images/${card.id}.png" alt="${card.id}" onerror="this.outerHTML=FallbackArt.slotDefault">
      </div>
      <div class="skill-content-wrap">
        <div class="skill-top">
          <div class="skill-kami">『${card.kami}』</div>
          <span class="skill-badge ${card.badge}">${card.type}</span>
        </div>
        <div class="skill-shimo">${card.shimo}</div>
        <div class="skill-desc">${card.desc}</div>
      </div>
    `;
    container.appendChild(btn);
  });
}

function updateUI() {
  document.getElementById('player-hp-txt').innerText = `HP: ${player.hp} / ${player.maxHp}`;
  document.getElementById('player-hp-bar').style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;

  let pStatus = [];
  if (player.stunnedTurns > 0) pStatus.push(`気絶中(${player.stunnedTurns}T)`);
  if (player.shield > 0) pStatus.push(`防壁:${player.shield}`);
  if (player.buff > 1.0) pStatus.push(`体幹1.7x`);
  if (player.isCounter) pStatus.push(`反撃構え(${player.counterMult.toFixed(1)}x)`);
  if (player.isEvade) pStatus.push(`霧隠れ`);
  document.getElementById('player-status').innerText = pStatus.join(' | ');

  document.getElementById('boss-hp-txt').innerText = `HP: ${boss.hp} / ${boss.maxHp}`;
  document.getElementById('boss-hp-bar').style.width = `${Math.max(0, (boss.hp / boss.maxHp) * 100)}%`;

  let bStatus = [];
  if (boss.isStunned > 0) bStatus.push(`スタン(${boss.isStunned}T)`);
  if (boss.poison > 0) bStatus.push(`毒(${boss.poison}T)`);
  if (boss.isBlinded) bStatus.push(`命中低下`);
  if (boss.mistTurns > 0) bStatus.push(`濃霧(${boss.mistTurns}T)`);
  if (boss.charging) bStatus.push(`溜め中(次2倍)`);
  if (boss.atkBuff > 1.0) bStatus.push(`攻撃UP`);
  if (boss.healCount > 0) bStatus.push(`反魂術残:${boss.healCount}`);
  document.getElementById('boss-status').innerText = bStatus.join(' | ');

  document.getElementById('stack-count').innerText = bozuStack;
  document.getElementById('multiplier').innerText = `${multiplier.toFixed(1)}x`;

  const totalRemaining = deckState.tono + deckState.hime + deckState.bozu;
  document.getElementById('deck-total').innerText = totalRemaining;
  document.getElementById('deck-tono').innerText = deckState.tono;
  document.getElementById('deck-hime').innerText = deckState.hime;
  document.getElementById('deck-bozu').innerText = deckState.bozu;

  const drawBtn = document.getElementById('draw-btn');
  if (player.stunnedTurns > 0) {
    drawBtn.innerText = `気絶中…行動不能 (残${player.stunnedTurns}ターン)`;
    drawBtn.className = 'card-draw-btn btn-turn-consume';
  } else if (turnDrawCount === 0) {
    drawBtn.innerText = '札をめくる (1枚目:行動フリー)';
    drawBtn.className = 'card-draw-btn';
  } else {
    drawBtn.innerText = 'もう1枚めくる (2枚目:ターン消費)';
    drawBtn.className = 'card-draw-btn btn-turn-consume';
  }
}

function handleManualDraw() {
  if (isGameOver) return;
  if (player.stunnedTurns > 0) {
    addLog(`坊主ショックで気絶中！ 何もできない！`, 'log-bozu');
    return;
  }
  tryResumeAudio();

  turnDrawCount++;
  if (turnDrawCount === 1) {
    drawBozuCard(false, true);
  } else {
    if (player.buff > 1.0) {
      player.buff = 1.0;
      addLog(`【体幹霧散】攻撃を行わずに札を重ねたため、田子の浦の1.7倍バフが消滅した！`);
    }
    addLog(`【強欲の代償】2枚連続で札をめくったため、ターンを消費した！`, 'log-boss');
    drawBozuCard(true, false);
  }
}

function drawBozuCard(willConsumeTurn, isFirstManual = false) {
  if (isGameOver) return;

  const totalRemaining = deckState.tono + deckState.hime + deckState.bozu;
  if (totalRemaining <= 0) {
    resetDeck();
  }

  const currentTotal = deckState.tono + deckState.hime + deckState.bozu;
  const rand = Math.random() * currentTotal;
  let card;

  if (rand < deckState.bozu) {
    deckState.bozu--;
    card = bozuPool[Math.floor(Math.random() * bozuPool.length)];
  } else if (rand < deckState.bozu + deckState.hime) {
    deckState.hime--;
    card = himePool[Math.floor(Math.random() * himePool.length)];
  } else {
    deckState.tono--;
    card = tonoPool[Math.floor(Math.random() * tonoPool.length)];
  }

  const cardEl = document.getElementById('drawn-card');
  cardEl.style.transform = 'scale(1.08)';
  setTimeout(() => { cardEl.style.transform = 'scale(1)'; }, 150);

  const tagEl = document.getElementById('card-tag');
  tagEl.innerText = card.type;
  document.getElementById('card-art-container').innerHTML = card.art;
  document.getElementById('card-name').innerText = card.name;
  const bonusEl = document.getElementById('card-bonus');
  bonusEl.innerText = card.desc;

  if (card.type === '坊主') {
    Sound.bozu();
    cardEl.style.borderColor = '#ef4444';
    tagEl.className = 'card-type-tag tag-bozu';
    bonusEl.style.color = '#ef4444';

    addLog(`【坊主めくり】${card.name}(坊主)！ スタック全消滅＆【2ターン気絶】！`, 'log-bozu');
    bozuStack = 0;
    multiplier = 1.0;
    player.buff = 1.0;
    player.stunnedTurns = 2;
    turnDrawCount = 0;

    resetDeck();
    updateUI();

    // 坊主による気絶時：即座に敵のターンへ移行（詰みバグ防止）
    setTimeout(enemyTurn, 650);
    return;
  } else {
    Sound.draw();
    cardEl.style.borderColor = card.type === '姫' ? '#ec4899' : '#3b82f6';
    tagEl.className = 'card-type-tag ' + (card.type === '姫' ? 'tag-hime' : 'tag-tono');
    bonusEl.style.color = '#b45309';

    bozuStack++;
    multiplier += card.bonus;
    addLog(`【坊主めくり】${card.name}(${card.type})！ 倍率 +${card.bonus} (現在: ${multiplier.toFixed(1)}x / 山札残:${deckState.tono+deckState.hime+deckState.bozu}枚)`);
  }

  updateUI();

  if (willConsumeTurn) {
    turnDrawCount = 0;
    setTimeout(enemyTurn, 650);
  } else if (isFirstManual) {
    addLog(`※1枚目のため行動フリー！ 続けて詠唱するか、もう1枚めくってください。`, 'log-buff');
  }
}

function castCard(card) {
  if (isGameOver) return;
  if (player.stunnedTurns > 0) {
    addLog(`坊主ショックで気絶中！ 詠唱できない！ (残${player.stunnedTurns}T)`, 'log-bozu');
    return;
  }
  tryResumeAudio();

  turnDrawCount = 0;

  if (!card.isOffense && player.buff > 1.0 && card.id !== 'tagonoura') {
    player.buff = 1.0;
    addLog(`【体幹霧散】攻撃を行わなかったため、田子の浦の1.7倍バフが消滅した！`);
  }

  card.action(multiplier);

  if (card.isOffense) {
    bozuStack = 0;
    multiplier = 1.0;
    player.buff = 1.0;
    resetDrawnCardUI();
  }

  updateUI();

  if (boss.hp <= 0) {
    handleVictory();
    return;
  }

  setTimeout(enemyTurn, 650);
}

function handleVictory() {
  Sound.laser();
  addLog(`<strong>${boss.name} を完全に討伐！ 勝利した！</strong>`, 'log-heal');
  isGameOver = true;
  document.getElementById('restart-btn').style.display = 'block';
}

/* --- 敵の行動AI（連続ターン進行バグ修正版） --- */
function enemyTurn() {
  if (isGameOver) return;
  turnDrawCount = 0;

  // 1. 状態異常処理（毒）
  if (boss.poison > 0) {
    boss.hp = Math.max(0, boss.hp - 20);
    boss.poison--;
    addLog(`【状態異常】毒が蝕む！ ${boss.name} に 20 ダメージ！`, 'log-buff');
    updateUI();
    if (boss.hp <= 0) {
      handleVictory();
      return;
    }
  }

  // 2. 敵の行動不能チェック
  if (boss.isStunned > 0) {
    boss.isStunned--;
    addLog(`月光の縛りにより、${boss.name} は動けない！ (敵スタン残: ${boss.isStunned}T)`, 'log-buff');
    finishEnemyTurn();
    return;
  }

  // 3. プレイヤーの完全回避チェック
  if (player.isEvade) {
    addLog(`濃密な川霧に遮られ、${boss.name} の攻撃は虚しく空を切った！`, 'log-buff');
    player.isEvade = false;
    boss.charging = false;
    finishEnemyTurn();
    return;
  }

  // 4. 桜吹雪ブラインドチェック
  if (boss.isBlinded) {
    boss.isBlinded = false;
    if (Math.random() < 0.5) {
      addLog(`桜吹雪で視界を奪われた ${boss.name} の攻撃は外れた！`, 'log-buff');
      boss.charging = false;
      finishEnemyTurn();
      return;
    }
  }

  // 5. 朝ぼらけ濃霧チェック
  if (boss.mistTurns > 0) {
    boss.mistTurns--;
    if (Math.random() < 0.5) {
      addLog(`川霧が深く立ち込め、${boss.name} の攻撃は外れた！ (濃霧残: ${boss.mistTurns}T)`, 'log-buff');
      boss.charging = false;
      finishEnemyTurn();
      return;
    }
  }

  // 6. 敵の固有スキルルーチン
  const randAction = Math.random();

  if (boss.id === 'wolf' && randAction < 0.30 && boss.atkBuff === 1.0) {
    Sound.special();
    boss.atkBuff = 1.4;
    addLog(`【敵スキル】シャドウウルフが『影分身』を展開！ 次攻撃力が1.4倍！`, 'log-boss');
    finishEnemyTurn();
    return;
  }

  if (boss.id === 'fox') {
    if (boss.healCount > 0 && boss.hp <= boss.maxHp * 0.35) {
      Sound.heal();
      const healAmount = Math.round(boss.maxHp * 0.30);
      boss.hp = Math.min(boss.maxHp, boss.hp + healAmount);
      boss.healCount--;
      addLog(`【狡知の奥義】「ふふ……まだ終わらぬぞ！」玉藻の影が『妖狐の反魂術』を詠唱！ HPが ${healAmount} 回復！`, 'log-heal');
      finishEnemyTurn();
      return;
    } else if (randAction < 0.28 && player.shield > 25) {
      Sound.special();
      player.shield = 0;
      addLog(`【敵スキル】玉藻の影が妖しげな風を吹かせた！ プレイヤーの結界防壁が消散した！`, 'log-bozu');
      finishEnemyTurn();
      return;
    }
  }

  if (boss.id === 'behemoth' && !boss.charging && randAction < 0.32) {
    Sound.special();
    boss.charging = true;
    addLog(`【予兆】ベヒモスが前足を高く掲げ、魔力を溜め始めた！ （次ターン超強打撃！）`, 'log-boss');
    finishEnemyTurn();
    return;
  }

  if (boss.id === 'demon' && randAction < 0.28) {
    Sound.attack();
    const pierceDmg = Math.floor(Math.random() * 9) + 16;
    addLog(`【敵スキル】グレーターデーモンの『虚無の波動』！ 結界貫通で ${pierceDmg} の直接打撃！`, 'log-boss');
    player.hp -= pierceDmg;
    if (player.hp <= 0) {
      handleDefeat();
      return;
    }
    finishEnemyTurn();
    return;
  }

  // 7. 基本攻撃
  let baseDmg = Math.floor(Math.random() * (boss.atkMax - boss.atkMin + 1)) + boss.atkMin;
  baseDmg = Math.round(baseDmg * boss.atkBuff);
  boss.atkBuff = 1.0;

  if (boss.charging) {
    baseDmg = Math.round(baseDmg * 1.9);
    boss.charging = false;
    addLog(`【痛恨の一撃】ベヒモスの『大地粉砕』が炸裂！`, 'log-boss');
  }

  // 反撃判定
  if (player.isCounter) {
    Sound.attack();
    const recoilDmg = Math.max(1, Math.round(baseDmg * 0.30));
    const counterDmg = Math.round(baseDmg * player.counterMult);

    player.hp -= recoilDmg;
    addLog(`【反撃発動】くだけて物を思ふころかな！ 反動で ${recoilDmg} ダメージを受けつつ、${player.counterMult.toFixed(1)}倍のカウンター！`, 'log-heal');
    addLog(`激波が跳ね返り、${boss.name} に ${counterDmg} の破滅的カウンター炸裂！`, 'log-heal');

    boss.hp = Math.max(0, boss.hp - counterDmg);
    player.isCounter = false;
    player.counterMult = 1.0;

    updateUI();
    if (boss.hp <= 0) {
      handleVictory();
      return;
    }
    if (player.hp <= 0) {
      handleDefeat('反動の衝撃に耐えきれず、力尽きてしまった……相打ち敗北。');
      return;
    }
    finishEnemyTurn();
    return;
  }

  // 被弾
  Sound.enemyHit();
  addLog(`${boss.name} の『${boss.skillName}』！ ${baseDmg} の打撃！`, 'log-boss');

  let taken = baseDmg;
  if (player.shield > 0) {
    if (player.shield >= taken) {
      player.shield -= taken;
      taken = 0;
      addLog(`結界が打撃を防ぎ切った！`);
    } else {
      taken -= player.shield;
      player.shield = 0;
      addLog(`結界が砕かれ、${taken} ダメージを受けた！`);
    }
  }

  player.hp -= taken;
  if (player.hp <= 0) {
    handleDefeat();
    return;
  }

  finishEnemyTurn();
}

function handleDefeat(msg = '力尽きてしまった……敗北。') {
  player.hp = 0;
  Sound.bozu();
  addLog(`<strong>${msg}</strong>`, 'log-bozu');
  isGameOver = true;
  document.getElementById('restart-btn').style.display = 'block';
  updateUI();
}

// 敵のターン終了時の処理（プレイヤーの気絶チェック）
function finishEnemyTurn() {
  updateUI();
  if (isGameOver) return;

  if (player.stunnedTurns > 0) {
    player.stunnedTurns--;
    if (player.stunnedTurns === 0) {
      addLog(`詩乃は正気を取り戻した！ 次のターンから行動可能！`, 'log-heal');
      updateUI();
      dealHand();
    } else {
      addLog(`詩乃はまだ気絶している……敵の連続攻撃！ (気絶残り: ${player.stunnedTurns}ターン)`, 'log-bozu');
      updateUI();
      // 気絶が続いている間は敵が連続で行動する
      setTimeout(enemyTurn, 1000);
    }
  } else {
    dealHand();
  }
}

// 初期起動
resetDrawnCardUI();
startNewBattle();
