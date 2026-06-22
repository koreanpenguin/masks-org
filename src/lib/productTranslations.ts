import type { Locale } from "@/store/languageStore";
import type { Product } from "@/domain/types";

type ProductI18n = {
  name: string;
  tagline?: string;
  description: string;
  category: string;
  skinType: string[];
  howToUse: string;
};

const howToUseKo =
  "세안 후 마스크를 얼굴에 밀착시켜 15~20분간 사용합니다. 마스크를 제거한 후 남은 에센스를 부드럽게 두드려 흡수시켜 주세요. 물로 헹굴 필요가 없습니다.";

const ko: Record<string, ProductI18n> = {
  "aloe-soothing-mask": {
    name: "알로에 수딩 마스크",
    tagline: "자연의 시원한 포옹",
    description:
      "순수 알로에 베라 추출물을 담은 이 시트 마스크가 붉은기를 진정시키고 자극을 완화하며 시원한 수분을 가득 채워줍니다. 자외선 노출 후나 피부가 지쳤을 때 부드럽게 리셋해주는 마스크예요.",
    category: "시트",
    skinType: ["민감성", "건성", "자극 받은 피부", "모든 피부 타입"],
    howToUse: howToUseKo,
  },
  "pearl-purifying-mask": {
    name: "펄 퓨리파잉 마스크",
    tagline: "진주 빛 발광 마스크",
    description:
      "펄 추출물과 나이아신아마이드가 결합된 이 발광 마스크가 칙칙한 피부를 환하게 밝히고 모공을 최소화해줍니다. 수백 년간 도자기 피부를 위해 사랑받아온 진주 파우더로, 속에서부터 빛나는 글로우를 선사해요.",
    category: "시트",
    skinType: ["칙칙한 피부", "일반", "복합성", "모든 피부 타입"],
    howToUse: howToUseKo,
  },
  "collagen-lifting-mask": {
    name: "콜라겐 리프팅 마스크",
    tagline: "피부에 콜라겐을 가득히",
    description:
      "가수분해 콜라겐 펩타이드가 피부를 눈에 띄게 탄탄하고 풍성하게 만들며 잔주름을 부드럽게 완화해줍니다. 깊은 보습 효과로 피부 탄력을 회복시켜 통통하고 건강한 피부를 선사해요.",
    category: "시트",
    skinType: ["건성", "성숙 피부", "일반", "모든 피부 타입"],
    howToUse: howToUseKo,
  },
  "seaweed-balancing-mask": {
    name: "씨위드 밸런싱 마스크",
    tagline: "바다의 피부 정화 비밀",
    description:
      "깊은 바다에서 수확한 해초 추출물은 미네랄이 풍부하여 피지 분비를 조절하고 모공을 깊이 정화해줍니다. 번들거림을 억제하고 모공을 조여주며 지성과 복합성 피부를 산뜻하게 만들어드려요.",
    category: "시트",
    skinType: ["지성", "복합성", "트러블 피부", "일반"],
    howToUse: howToUseKo,
  },
  "blueberry-revitalizing-mask": {
    name: "블루베리 리바이탈라이징 마스크",
    tagline: "베리 파워풀한 피부 재생",
    description:
      "블루베리 항산화 성분이 활성 산소와 싸우고 산화 스트레스를 줄이며 지친 피부에 생기를 돌려줍니다. 상쾌하고 에너지 넘치는 피부와 건강한 베리 빛 글로우를 선사해드려요.",
    category: "시트",
    skinType: ["칙칙한 피부", "일반", "복합성", "모든 피부 타입"],
    howToUse: howToUseKo,
  },
  "hyaluronic-acid-hydrating-mask": {
    name: "히알루론산 하이드레이팅 마스크",
    tagline: "수분 폭탄 마스크",
    description:
      "트리플 웨이트 히알루론산이 피부 모든 층에 강렬한 수분을 채워 단 한 번 사용으로도 눈에 띄게 탱글하고 부드러운 피부를 만들어줍니다. 건조하고 메마른 피부를 위한 최고의 수분 부스터예요.",
    category: "시트",
    skinType: ["건성", "탈수 피부", "일반", "모든 피부 타입"],
    howToUse: howToUseKo,
  },
  "lemon-glowing-mask": {
    name: "레몬 글로잉 마스크",
    tagline: "피부를 위한 파워풀한 비타민",
    description:
      "레몬 추출물과 비타민 C가 가득한 이 브라이트닝 마스크가 다크스팟을 완화하고 피부 톤을 균일하게 만들어 생기 넘치는 시트러스 글로우를 선사합니다. 천연 AHA가 각질을 부드럽게 케어하는 동시에 항산화 성분이 환경 손상으로부터 피부를 보호해줘요.",
    category: "시트",
    skinType: ["칙칙한 피부", "색소침착 피부", "일반", "복합성"],
    howToUse: howToUseKo,
  },
  "honey-nourishing-mask": {
    name: "허니 너리싱 마스크",
    tagline: "황금빛 꿀 넥타 마스크",
    description:
      "순수 황금빛 꿀이 깊은 영양과 항균 케어를 제공하며 오랜 시간 수분을 잡아줍니다. 풍성하고 포근한 이 마스크가 거칠고 건조한 피부를 꿀처럼 부드럽고 탄력 있는 피부로 탈바꿈시켜드려요.",
    category: "시트",
    skinType: ["건성", "민감성", "칙칙한 피부", "모든 피부 타입"],
    howToUse: howToUseKo,
  },
  "chamomile-calming-mask": {
    name: "카모마일 칼밍 마스크",
    tagline: "지친 피부를 위한 자연의 포옹",
    description:
      "부드러운 카모마일 꽃 추출물이 스트레스 받은 피부를 자연의 진정력으로 감싸안아 붉은기와 염증을 가라앉혀줍니다. 얼굴을 위한 따뜻한 차 한 잔처럼 — 깊이 진정되고 완전히 편안해지는 느낌이에요.",
    category: "시트",
    skinType: ["민감성", "홍조 피부", "건성", "모든 피부 타입"],
    howToUse: howToUseKo,
  },
  "rose-rejuvenating-mask": {
    name: "로즈 리쥬비네이팅 마스크",
    tagline: "피부를 위한 로맨틱한 힐링",
    description:
      "럭셔리한 장미 추출물과 로즈힙 오일이 조화를 이루어 피부를 재생시키고 밝게 가꾸며 꽃잎처럼 부드러운 피부로 만들어줍니다. 이 로맨틱한 보타니컬 마스크가 자연스러운 장밋빛 광채로 피부를 빛나게 해드려요.",
    category: "시트",
    skinType: ["건성", "일반", "칙칙한 피부", "모든 피부 타입"],
    howToUse: howToUseKo,
  },
  "avocado-moisturizing-mask": {
    name: "아보카도 모이스처라이징 마스크",
    tagline: "피부를 위한 슈퍼푸드 트리트먼트",
    description:
      "필수 지방산과 비타민 A, D, E가 풍부한 아보카도 추출물이 목마른 피부에 집중 영양을 공급해줍니다. 이 슈퍼푸드 마스크가 럭셔리한 버터처럼 피부에 스며들어 탄력과 깊은 수분을 회복시켜드려요.",
    category: "시트",
    skinType: ["건성", "성숙 피부", "탈수 피부", "일반"],
    howToUse: howToUseKo,
  },
  "pomegranate-firming-mask": {
    name: "포메그래닛 퍼밍 마스크",
    tagline: "자연의 붉은 보석이 피부에",
    description:
      "석류 추출물은 자연 최강의 퍼밍 항산화제로, 콜라겐 생성을 촉진하고 노화 징후와 싸우는 퓨니칼라긴이 가득합니다. 이 마스크가 눈에 띄게 피부를 탄탄하게 리프팅하고 보석처럼 빛나는 피부를 만들어드려요.",
    category: "시트",
    skinType: ["성숙 피부", "건성", "일반", "모든 피부 타입"],
    howToUse: howToUseKo,
  },
};

export function localizeProduct(product: Product, locale: Locale): Product {
  if (locale === "en") return product;
  const t = ko[product.slug];
  if (!t) return product;
  return {
    ...product,
    name: t.name,
    tagline: t.tagline ?? product.tagline,
    description: t.description,
    category: t.category,
    skinType: t.skinType,
    howToUse: t.howToUse,
  };
}
