// 78장 타로 카드 마스터 데이터셋 (Major 22장 + Minor 56장)
const TAROT_CARDS = [
  // ================= MAJOR ARCANA (22장) =================
  {
    id: "m00",
    name: "바보 (The Fool)",
    engName: "The Fool",
    arcana: "major",
    number: 0,
    suit: "major",
    roman: "0",
    icon: "🌟",
    color: "#e6c35c",
    keywords: {
      upright: ["새로운 시작", "순수함", "자유", "모험", "잠재력", "열린 가능성"],
      reversed: ["경솔함", "위험한 모험", "준비 부족", "우유부단", "충동적 결정"]
    },
    meaning: {
      upright: "과거의 짐을 내려놓고 미지의 세계로 첫 발을 내딛는 순수한 용기와 무한한 가능성을 상징합니다.",
      reversed: "현실적인 대책 없는 충동적인 행동이나 준비 부족으로 인한 실수를 경고합니다."
    }
  },
  {
    id: "m01",
    name: "마법사 (The Magician)",
    engName: "The Magician",
    arcana: "major",
    number: 1,
    suit: "major",
    roman: "I",
    icon: "✨",
    color: "#e67e22",
    keywords: {
      upright: ["창조력", "숙련된 기술", "자신감", "의지력", "자원의 활용", "실현"],
      reversed: ["재능 낭비", "기만", "속임수", "계획 지연", "자신감 결여"]
    },
    meaning: {
      upright: "원하는 것을 이룰 수 있는 모든 도구와 잠재력이 이미 당신의 손 안에 있습니다.",
      reversed: "잠재력을 엉뚱한 곳에 소모하거나, 남을 속이거나 자신을 과신하고 있지 않은지 돌아보아야 합니다."
    }
  },
  {
    id: "m02",
    name: "여사제 (The High Priestess)",
    engName: "The High Priestess",
    arcana: "major",
    number: 2,
    suit: "major",
    roman: "II",
    icon: "🌙",
    color: "#3498db",
    keywords: {
      upright: ["직관", "통찰력", "내면의 지혜", "비밀", "침묵", "영적 교감"],
      reversed: ["표면적 판단", "내면의 목소리 외면", "비밀의 폭로", "감정 억압"]
    },
    meaning: {
      upright: "보이는 것 이면의 진실을 꿰뚫어 보는 강력한 직관과 내면의 지혜에 귀를 기울이세요.",
      reversed: "자기 자신의 직감을 의심하거나 남의 시선에 휘둘려 본질을 놓치고 있을 수 있습니다."
    }
  },
  {
    id: "m03",
    name: "여황제 (The Empress)",
    engName: "The Empress",
    arcana: "major",
    number: 3,
    suit: "major",
    roman: "III",
    icon: "🌸",
    color: "#2ecc71",
    keywords: {
      upright: ["풍요", "모성애", "결실", "아름다움", "창의적 성장", "자연의 은혜"],
      reversed: ["의존성", "창의성 고갈", "과도한 욕심", "가정/인간관계 불협화음"]
    },
    meaning: {
      upright: "당신이 기울인 노력과 정성이 따뜻한 결실과 사랑, 물질적 풍요로 꽃피어납니다.",
      reversed: "스스로를 충분히 돌보지 못해 지쳐있거나, 타인에게 지나치게 의존하고 있을 수 있습니다."
    }
  },
  {
    id: "m04",
    name: "황제 (The Emperor)",
    engName: "The Emperor",
    arcana: "major",
    number: 4,
    suit: "major",
    roman: "IV",
    icon: "👑",
    color: "#e74c3c",
    keywords: {
      upright: ["권위", "안정", "리더십", "체계와 규율", "단호한 결단", "보호"],
      reversed: ["독재", "융통성 부족", "통제력 상실", "권력 남용", "우유부단"]
    },
    meaning: {
      upright: "확고한 기준과 리더십으로 상황을 장악하고 든든한 기반을 세울 때입니다.",
      reversed: "과도한 고집과 경직된 사고로 주위 사람들과 마찰을 빚거나 반발을 살 수 있습니다."
    }
  },
  {
    id: "m05",
    name: "교황 (The Hierophant)",
    engName: "The Hierophant",
    arcana: "major",
    number: 5,
    suit: "major",
    roman: "V",
    icon: "📜",
    color: "#9b59b6",
    keywords: {
      upright: ["조언과 인도", "신뢰", "전통", "도덕적 기준", "멘토", "가르침"],
      reversed: ["독단적 편견", "구시대적 틀에 갇힘", "잘못된 조언", "반항심"]
    },
    meaning: {
      upright: "신뢰할 수 있는 멘토나 검증된 원칙, 지혜로운 조언에서 돌파구를 찾게 됩니다.",
      reversed: "틀에 박힌 형식주의에 얽매여 새로운 시도를 막고 있지 않은지 점검해야 합니다."
    }
  },
  {
    id: "m06",
    name: "연인 (The Lovers)",
    engName: "The Lovers",
    arcana: "major",
    number: 6,
    suit: "major",
    roman: "VI",
    icon: "💖",
    color: "#fd79a8",
    keywords: {
      upright: ["깊은 사랑", "조화로운 파트너십", "가치관의 일치", "중대한 선택", "결합"],
      reversed: ["불화", "유혹에 흔들림", "소통 부재", "가치관의 충돌", "선택 회피"]
    },
    meaning: {
      upright: "마음이 통하는 진실한 교감과 함께, 인생에서 올바른 방향을 선택할 기회가 왔습니다.",
      reversed: "관계에서의 오해나 내면의 갈등, 단기적인 유혹으로 인해 올바른 판단이 흐려질 수 있습니다."
    }
  },
  {
    id: "m07",
    name: "전차 (The Chariot)",
    engName: "The Chariot",
    arcana: "major",
    number: 7,
    suit: "major",
    roman: "VII",
    icon: "🛡️",
    color: "#0984e3",
    keywords: {
      upright: ["승리", "돌파력", "강한 의지", "목표 달성", "역경 극복", "추진력"],
      reversed: ["통제 불능", "방향성 상실", "조급한 질주", "좌절감", "패배주의"]
    },
    meaning: {
      upright: "상반된 감정과 상황을 강한 집중력과 의지로 통제하며 승리를 향해 전력 질주합니다.",
      reversed: "마음만 앞서 무리하게 달리다 제어력을 잃거나 엉뚱한 방향으로 소모될 수 있습니다."
    }
  },
  {
    id: "m08",
    name: "힘 (Strength)",
    engName: "Strength",
    arcana: "major",
    number: 8,
    suit: "major",
    roman: "VIII",
    icon: "🦁",
    color: "#f39c12",
    keywords: {
      upright: ["부드러운 용기", "인내심", "내면의 힘", "연민", "감정 조절", "신념"],
      reversed: ["자기 불신", "두려움", "통제력 결여", "분노 폭발", "무력감"]
    },
    meaning: {
      upright: "강요와 억압이 아닌, 부드러운 사랑과 포용의 힘으로 거친 난관을 온전히 길들입니다.",
      reversed: "스스로에 대한 의심과 조급함으로 인해 감정적으로 폭발하거나 쉽게 포기할 수 있습니다."
    }
  },
  {
    id: "m09",
    name: "은둔자 (The Hermit)",
    engName: "The Hermit",
    arcana: "major",
    number: 9,
    suit: "major",
    roman: "IX",
    icon: "🏮",
    color: "#6c5ce7",
    keywords: {
      upright: ["성찰", "탐구", "내면의 등불", "홀로 서기", "진리 추구", "신중함"],
      reversed: ["고립", "외로움", "현실 도피", "고집", "소통 단절"]
    },
    meaning: {
      upright: "외부의 소음을 끄고 고요한 내면으로 들어가 진정한 해답의 등불을 밝히는 시간입니다.",
      reversed: "스스로를 지나치게 고립시키거나 세상과의 벽을 쌓아 필요한 도움마저 밀어낼 수 있습니다."
    }
  },
  {
    id: "m10",
    name: "운명의 수레바퀴 (Wheel of Fortune)",
    engName: "Wheel of Fortune",
    arcana: "major",
    number: 10,
    suit: "major",
    roman: "X",
    icon: "☸️",
    color: "#e17055",
    keywords: {
      upright: ["운명의 전환점", "새로운 기회", "행운", "자연스러운 흐름", "필연적 계기"],
      reversed: ["불운", "예상 밖의 지연", "변화에 대한 저항", "악순환"]
    },
    meaning: {
      upright: "거스를 수 없는 큰 운명의 흐름이 당신에게 유리한 새 국면을 열어주고 있습니다.",
      reversed: "변화의 파도에 무리하게 저항하기보다 잠시 숨을 고르며 다음 주기를 기다릴 때입니다."
    }
  },
  {
    id: "m11",
    name: "정의 (Justice)",
    engName: "Justice",
    arcana: "major",
    number: 11,
    suit: "major",
    roman: "XI",
    icon: "⚖️",
    color: "#16a085",
    keywords: {
      upright: ["공정함", "진실", "인과응보", "균형 잡힌 판단", "명확한 결단"],
      reversed: ["불공정", "편견", "책임 회피", "법적 문제", "부정직"]
    },
    meaning: {
      upright: "원인과 결과가 정확히 마주하며, 진실과 공정성에 기반한 명쾌한 해답이 내려집니다.",
      reversed: "감정이나 편견에 치우쳐 잘못된 판단을 내리거나 자신의 책임을 회피할 수 있습니다."
    }
  },
  {
    id: "m12",
    name: "매달린 사람 (The Hanged Man)",
    engName: "The Hanged Man",
    arcana: "major",
    number: 12,
    suit: "major",
    roman: "XII",
    icon: "⏳",
    color: "#00cec9",
    keywords: {
      upright: ["새로운 관점", "자발적 희생", "기다림", "깨달음", "내려놓음"],
      reversed: ["무의미한 희생", "정체", "이기주의", "고집", "시간 낭비"]
    },
    meaning: {
      upright: "잠시 행동을 멈추고 세상을 거꾸로 바라볼 때, 이전엔 보지 못했던 진정한 통찰이 찾아옵니다.",
      reversed: "결실 없는 일에 매달려 헛된 고생만 하거나 변화를 두려워해 제자리걸음하고 있습니다."
    }
  },
  {
    id: "m13",
    name: "죽음 (Death)",
    engName: "Death",
    arcana: "major",
    number: 13,
    suit: "major",
    roman: "XIII",
    icon: "🥀",
    color: "#2d3436",
    keywords: {
      upright: ["극적인 종결", "새로운 탄생", "낡은 것의 탈피", "재생", "근본적 변혁"],
      reversed: ["종결에 대한 공포", "미련", "변화 거부", "더딘 전환"]
    },
    meaning: {
      upright: "낡고 효력을 다한 챕터가 완전히 끝나고, 비로소 새로운 생명이 움틀 수 있는 백지가 펼쳐집니다.",
      reversed: "이미 끝난 과거의 미련이나 집착을 놓지 못해 새로운 기회로 나아가지 못하고 있습니다."
    }
  },
  {
    id: "m14",
    name: "절제 (Temperance)",
    engName: "Temperance",
    arcana: "major",
    number: 14,
    suit: "major",
    roman: "XIV",
    icon: "🏺",
    color: "#74b9ff",
    keywords: {
      upright: ["조화와 균형", "절제", "치유", "중용", "완벽한 조율", "평온"],
      reversed: ["불균형", "과도함", "감정 기복", "조급증", "갈등 심화"]
    },
    meaning: {
      upright: "양극단의 요소를 절묘하게 조화시켜 최상의 평온과 융합을 이루어내는 마법 같은 순간입니다.",
      reversed: "과음, 과식, 감정의 과잉 등 절제를 잃고 치우쳐 몸과 마음에 피로가 쌓일 수 있습니다."
    }
  },
  {
    id: "m15",
    name: "악마 (The Devil)",
    engName: "The Devil",
    arcana: "major",
    number: 15,
    suit: "major",
    roman: "XV",
    icon: "⛓️",
    color: "#b71540",
    keywords: {
      upright: ["유혹", "집착", "물질적 구속", "그림자 자아", "중독", "벗어날 수 있는 사슬"],
      reversed: ["사슬의 해방", "각성", "집착 극복", "자유 회복", "위기 탈출"]
    },
    meaning: {
      upright: "눈앞의 달콤한 유혹이나 불안이 만든 허상에 스스로 사슬을 채우고 있음을 자각해야 합니다.",
      reversed: "오랫동안 당신을 옭아맸던 중독이나 부정적인 패턴, 관계로부터 벗어날 수 있는 탈출구가 열립니다."
    }
  },
  {
    id: "m16",
    name: "탑 (The Tower)",
    engName: "The Tower",
    arcana: "major",
    number: 16,
    suit: "major",
    roman: "XVI",
    icon: "⚡",
    color: "#d63031",
    keywords: {
      upright: ["갑작스러운 붕괴", "진실의 폭로", "충격적 전환", "위기이자 각성", "틀의 파괴"],
      reversed: ["파국 모면", "지연된 위기", "변화 두려움", "서서히 찾아오는 수습"]
    },
    meaning: {
      upright: "허약한 모래성 위에 쌓았던 거짓과 환상이 번개를 맞아 무너지며 진실만이 홀로 남습니다.",
      reversed: "피할 수 없는 변화를 억지로 미루기보다 솔직하게 받아들이는 것이 더 큰 피해를 막습니다."
    }
  },
  {
    id: "m17",
    name: "별 (The Star)",
    engName: "The Star",
    arcana: "major",
    number: 17,
    suit: "major",
    roman: "XVII",
    icon: "🌠",
    color: "#ffeaa7",
    keywords: {
      upright: ["희망", "영감", "낙관주의", "마음의 평화", "축복", "치유와 갱신"],
      reversed: ["절망감", "자신감 상실", "비관적 태도", "기대 실망", "빛의 부재"]
    },
    meaning: {
      upright: "어두운 밤하늘을 뚫고 쏟아지는 찬란한 별빛처럼 가슴 깊은 희망과 영감이 당신을 비춥니다.",
      reversed: "일시적인 어둠에 마음이 가려져 바로 눈앞의 희망과 가능성을 보지 못하고 있습니다."
    }
  },
  {
    id: "m18",
    name: "달 (The Moon)",
    engName: "The Moon",
    arcana: "major",
    number: 18,
    suit: "major",
    roman: "XVIII",
    icon: "🐺",
    color: "#a29bfe",
    keywords: {
      upright: ["무의식", "불안과 혼돈", "환상", "숨겨진 진실", "직관적 감각", "안갯속 길"],
      reversed: ["안개 걷힘", "혼란 극복", "두려움 해소", "진실의 발견"]
    },
    meaning: {
      upright: "보이는 풍경이 실제와 다를 수 있으니, 상상 속 불안에 사로잡히지 말고 직관을 나침반 삼으세요.",
      reversed: "혼란스럽던 감정과 의문들이 하나둘 정리되며 마침내 진실의 윤곽이 드러나기 시작합니다."
    }
  },
  {
    id: "m19",
    name: "태양 (The Sun)",
    engName: "The Sun",
    arcana: "major",
    number: 19,
    suit: "major",
    roman: "XIX",
    icon: "☀️",
    color: "#f1c40f",
    keywords: {
      upright: ["찬란한 성공", "생명력", "기쁨과 환희", "명료함", "축하", "긍정의 에너지"],
      reversed: ["일시적 침체", "과도한 낙관", "체력 소모", "지연된 결실"]
    },
    meaning: {
      upright: "모든 의심과 어둠을 걷어내고 눈부신 영광과 행복, 순수한 활력이 당신의 삶을 가득 채웁니다.",
      reversed: "결과는 긍정적이나 다소 시간이 걸리거나 에너지가 방전될 수 있으니 페이스 조절이 필요합니다."
    }
  },
  {
    id: "m20",
    name: "심판 (Judgement)",
    engName: "Judgement",
    arcana: "major",
    number: 20,
    suit: "major",
    roman: "XX",
    icon: "🎺",
    color: "#fab1a0",
    keywords: {
      upright: ["부활과 재생", "운명의 부름", "명확한 결말", "과거의 청산", "새로운 사명"],
      reversed: ["자책감", "부름 외면", "우유부단", "과거에 대한 후회", "결단 지연"]
    },
    meaning: {
      upright: "영혼을 깨우는 나팔소리처럼, 과거의 공과를 정리하고 새로운 차원의 삶으로 도약할 부름이 옵니다.",
      reversed: "스스로를 엄격하게 단죄하거나 기회가 눈앞에 왔음에도 결정을 주저하고 있습니다."
    }
  },
  {
    id: "m21",
    name: "세계 (The World)",
    engName: "The World",
    arcana: "major",
    number: 21,
    suit: "major",
    roman: "XXI",
    icon: "🌍",
    color: "#55efc4",
    keywords: {
      upright: ["완벽한 완성", "성취", "대단원의 막", "새로운 순환", "통합", "자유"],
      reversed: ["미완성", "지연된 피날레", "마지막 고비", "마무리 부족"]
    },
    meaning: {
      upright: "오랜 여정의 끝에 서서 완벽한 조화와 성공의 결실을 맛보고, 더 큰 세상으로 나아갈 준비를 마칩니다.",
      reversed: "거의 다 도달했으나 마지막 2%의 매듭을 짓지 못해 답답함을 느낄 수 있습니다."
    }
  }
];

// ================= MINOR ARCANA HELPER BUILDER =================
// 4개 수트: Wands(열정/일), Cups(감정/관계), Swords(사고/갈등), Pentacles(물질/현실)
const SUIT_META = {
  wands: {
    name: "완드 (지팡이)",
    element: "불 (Fire)",
    theme: "열정, 직업, 창의력, 의지, 추진력",
    icon: "🪵",
    color: "#e17055"
  },
  cups: {
    name: "컵 (성배)",
    element: "물 (Water)",
    theme: "감정, 사랑, 관계, 직관, 상상력",
    icon: "🏆",
    color: "#0984e3"
  },
  swords: {
    name: "소드 (검)",
    element: "공기 (Air)",
    theme: "지성, 결단, 진실, 갈등, 커뮤니케이션",
    icon: "⚔️",
    color: "#6c5ce7"
  },
  pentacles: {
    name: "펜타클 (금화)",
    element: "흙 (Earth)",
    theme: "물질, 금전, 성과, 건강, 실질적 기반",
    icon: "🪙",
    color: "#00b894"
  }
};

const MINOR_RANKS = [
  { rank: "Ace", num: 1, label: "에이스", up: "새로운 기회와 순수한 잠재력의 시작", rev: "놓친 기회나 실현의 지연" },
  { rank: "Two", num: 2, label: "2", up: "협력, 계획의 수립, 균형과 선택", rev: "불균형, 결정 장애, 이견 충돌" },
  { rank: "Three", num: 3, label: "3", up: "첫 결실, 팀워크, 확장과 성장", rev: "팀워크 불화, 지연, 미흡한 성과" },
  { rank: "Four", num: 4, label: "4", up: "안정, 기반 확립, 휴식과 안전", rev: "정체, 불안정, 폐쇄적 태도" },
  { rank: "Five", num: 5, label: "5", up: "갈등, 도전, 일시적 시련과 경쟁", rev: "갈등 봉합, 화해, 시련 극복" },
  { rank: "Six", num: 6, label: "6", up: "승리, 조화, 상호 도움, 회복", rev: "오만함, 보상 지연, 불공평한 거래" },
  { rank: "Seven", num: 7, label: "7", up: "인내, 방어, 선택과 평가, 결단", rev: "피로 누적, 방심, 그릇된 선택" },
  { rank: "Eight", num: 8, label: "8", up: "빠른 전개, 숙련, 이동, 집중력", rev: "속도 조절 실패, 기술 부족, 정체" },
  { rank: "Nine", num: 9, label: "9", up: "완성을 눈앞에 둔 인내, 수호, 만족", rev: "방어적 태도 과잉, 번아웃, 불안" },
  { rank: "Ten", num: 10, label: "10", up: "사이클의 정점, 책임 완수, 완성", rev: "과도한 부담, 붕괴, 새로운 국면 전환" },
  { rank: "Page", num: 11, label: "시종 (Page)", up: "새 소식, 호기심, 배움의 열정", rev: "미성숙함, 나쁜 소식, 산만함" },
  { rank: "Knight", num: 12, label: "기사 (Knight)", up: "용기 있는 행동, 저돌적 추진력, 모험", rev: "충동적 폭주, 조급함, 좌절" },
  { rank: "Queen", num: 13, label: "여왕 (Queen)", up: "성숙한 포용력, 직관, 내면의 풍요", rev: "감정적 편협함, 질투, 변덕" },
  { rank: "King", num: 14, label: "왕 (King)", up: "최고의 통솔력, 지혜, 안정적 성취", rev: "독선, 오만, 통제력 남용" }
];

// 56장 마이너 카드 디테일 자동 조합 및 특화 키워드 주입
(function buildMinorArcana() {
  const suits = ["wands", "cups", "swords", "pentacles"];
  
  suits.forEach(suitKey => {
    const meta = SUIT_META[suitKey];
    MINOR_RANKS.forEach(r => {
      const cardId = `${suitKey[0]}_${r.rank.toLowerCase()}`;
      const fullName = `${meta.name.split(" ")[0]} ${r.label} (${r.rank} of ${suitKey.charAt(0).toUpperCase() + suitKey.slice(1)})`;
      const engName = `${r.rank} of ${suitKey.charAt(0).toUpperCase() + suitKey.slice(1)}`;
      
      let specificUpright = [];
      let specificReversed = [];
      let detailedMeaningUp = "";
      let detailedMeaningRev = "";

      // 수트별 구체적 해석 매핑
      if (suitKey === "wands") {
        specificUpright = [r.up, "열정적 영감", "새로운 프로젝트 추진", "에너지 상승"];
        specificReversed = [r.rev, "에너지 고갈", "동기부여 결여", "무리한 일정"];
        detailedMeaningUp = `당신의 열정과 창의력이 ${r.label}의 에너지와 결합하여 행동력과 주도권을 가져다줍니다.`;
        detailedMeaningRev = `의욕만 앞서거나 체력과 집중력이 소진될 수 있으니 속도와 방향을 재점검해야 합니다.`;
      } else if (suitKey === "cups") {
        specificUpright = [r.up, "풍부한 감정 교류", "마음의 평온", "관계의 발전"];
        specificReversed = [r.rev, "감정적 불안정", "오해와 서운함", "마음의 문 닫힘"];
        detailedMeaningUp = `따뜻한 정서적 교감과 사랑, 내면의 직관이 ${r.label}의 단계에서 깊은 만족을 선사합니다.`;
        detailedMeaningRev = `감정에 지나치게 휩쓸려 냉정한 판단을 놓치거나 대인관계에서 서운함이 생길 수 있습니다.`;
      } else if (suitKey === "swords") {
        specificUpright = [r.up, "명쾌한 이성적 판단", "진실 규명", "문제 해결의 돌파구"];
        specificReversed = [r.rev, "스트레스와 불안", "과도한 비판", "생각의 덫"];
        detailedMeaningUp = `냉철한 지성과 정직한 시선으로 ${r.label}의 상황을 분석하여 혼란을 종식시킵니다.`;
        detailedMeaningRev = `지나친 걱정이나 말실수, 흑백논리로 인해 스스로에게 상처를 입힐 수 있으니 주의하세요.`;
      } else if (suitKey === "pentacles") {
        specificUpright = [r.up, "실질적 재정 성과", "신뢰의 축적", "현실적 안정성"];
        specificReversed = [r.rev, "금전적 손실 주의", "현실성 부족", "물질적 욕심 경계"];
        detailedMeaningUp = `꾸준한 성실함과 구체적인 노력이 ${r.label}의 형태로 가시적인 성과와 안정을 가져옵니다.`;
        detailedMeaningRev = `지출 관리나 실무적인 디테일에서 누수가 발생할 수 있으니 꼼꼼한 점검이 필요합니다.`;
      }

      TAROT_CARDS.push({
        id: cardId,
        name: fullName,
        engName: engName,
        arcana: "minor",
        number: r.num,
        suit: suitKey,
        roman: r.rank === "Ace" ? "A" : (r.num <= 10 ? String(r.num) : r.rank.substring(0, 1)),
        icon: meta.icon,
        color: meta.color,
        keywords: {
          upright: specificUpright,
          reversed: specificReversed
        },
        meaning: {
          upright: detailedMeaningUp,
          reversed: detailedMeaningRev
        }
      });
    });
  });
})();

// 콘솔 및 디버깅용 확인 (총 78장)
console.log(`[Tarot Master Data] Total cards loaded: ${TAROT_CARDS.length}`);
