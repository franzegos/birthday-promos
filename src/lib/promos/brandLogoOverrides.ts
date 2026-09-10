type BrandLogoRule = {
  pattern: RegExp;
  logos: string[];
};

const WIKI = "https://upload.wikimedia.org/wikipedia/commons";

const BRAND_LOGO_RULES: BrandLogoRule[] = [
  {
    pattern: /\bsm\b|smsupermalls|sm malls/i,
    logos: [
      `${WIKI}/thumb/9/9e/SM_Supermalls_Logo.svg/512px-SM_Supermalls_Logo.svg.png`,
      "https://www.smsupermalls.com/favicon.ico",
    ],
  },
  {
    pattern: /\bbdo\b/i,
    logos: [
      `${WIKI}/thumb/f/f3/BDO_Unibank_%28logo%29.svg/512px-BDO_Unibank_%28logo%29.svg.png`,
      "https://www.bdo.com.ph/apple-touch-icon.png",
    ],
  },
  {
    pattern: /\brcbc\b/i,
    logos: [
      `${WIKI}/thumb/8/8a/RCBC_logo.svg/512px-RCBC_logo.svg.png`,
      "https://www.rcbc.com/apple-touch-icon.png",
    ],
  },
  {
    pattern: /metrobank/i,
    logos: [
      `${WIKI}/thumb/4/4e/Metrobank_logo.svg/512px-Metrobank_logo.svg.png`,
      "https://www.metrobank.com.ph/apple-touch-icon.png",
    ],
  },
  {
    pattern: /vikings|tong yang|niu by|the alley/i,
    logos: [
      "https://www.vikings.ph/apple-touch-icon.png",
      "https://www.vikings.ph/favicon.ico",
    ],
  },
  {
    pattern: /starbucks/i,
    logos: [
      `${WIKI}/thumb/5/5f/Starbucks_Corporation_Logo_2011.svg/512px-Starbucks_Corporation_Logo_2011.svg.png`,
      "https://www.starbucks.ph/apple-touch-icon.png",
    ],
  },
  {
    pattern: /krispy kreme/i,
    logos: [
      `${WIKI}/thumb/7/7a/Krispy_Kreme_logo.svg/512px-Krispy_Kreme_logo.svg.png`,
      "https://www.krispykreme.com.ph/apple-touch-icon.png",
    ],
  },
  {
    pattern: /shakey/i,
    logos: [
      `${WIKI}/thumb/4/4d/Shakey%27s_Pizza_logo.svg/512px-Shakey%27s_Pizza_logo.svg.png`,
      "https://www.shakeyspizza.ph/apple-touch-icon.png",
    ],
  },
  {
    pattern: /uniqlo/i,
    logos: [
      `${WIKI}/thumb/9/92/UNIQLO_logo.svg/512px-UNIQLO_logo.svg.png`,
      "https://www.uniqlo.com/favicon.ico",
    ],
  },
  {
    pattern: /shopee/i,
    logos: [
      `${WIKI}/thumb/0/0e/Shopee_logo.svg/512px-Shopee_logo.svg.png`,
      "https://shopee.ph/favicon.ico",
    ],
  },
  {
    pattern: /goldilocks/i,
    logos: [
      "https://www.goldilocks.com.ph/apple-touch-icon.png",
      "https://www.goldilocks.com.ph/favicon.ico",
    ],
  },
  {
    pattern: /landers/i,
    logos: [
      "https://www.landers.ph/apple-touch-icon.png",
      "https://www.landers.ph/favicon.ico",
    ],
  },
  {
    pattern: /enchanted kingdom/i,
    logos: [
      "https://www.enchantedkingdom.ph/apple-touch-icon.png",
      "https://www.enchantedkingdom.ph/favicon.ico",
    ],
  },
  {
    pattern: /watsons/i,
    logos: [
      "https://www.watsons.com.ph/apple-touch-icon.png",
      "https://www.watsons.com.ph/favicon.ico",
    ],
  },
  {
    pattern: /muji/i,
    logos: [
      `${WIKI}/thumb/6/60/MUJI_logo.svg/512px-MUJI_logo.svg.png`,
      "https://www.muji.com/favicon.ico",
    ],
  },
  {
    pattern: /asics/i,
    logos: [
      `${WIKI}/thumb/b/bd/ASICS_Logo.svg/512px-ASICS_Logo.svg.png`,
      "https://www.asics.com/favicon.ico",
    ],
  },
  {
    pattern: /dunkin/i,
    logos: [
      `${WIKI}/thumb/9/98/Dunkin%27_Donuts_logo.svg/512px-Dunkin%27_Donuts_logo.svg.png`,
    ],
  },
  {
    pattern: /petron/i,
    logos: [`${WIKI}/thumb/3/3e/Petron_logo.svg/512px-Petron_logo.svg.png`],
  },
  {
    pattern: /zus coffee/i,
    logos: ["https://zuscoffee.com/apple-touch-icon.png"],
  },
  {
    pattern: /manila hotel|red jade/i,
    logos: ["https://www.manilahotel.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /okada/i,
    logos: ["https://okadamanila.com/apple-touch-icon.png"],
  },
  {
    pattern: /dusit/i,
    logos: ["https://www.dusit.com/favicon.ico"],
  },
  {
    pattern: /samgyupsalamat/i,
    logos: ["https://www.samgyupsalamat.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /yakimix/i,
    logos: ["https://www.yakimix.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /ramen nagi/i,
    logos: ["https://www.ramennagi.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /conti/i,
    logos: ["https://www.contis.ph/apple-touch-icon.png"],
  },
  {
    pattern: /wildflour/i,
    logos: ["https://wildflour.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /healthy options/i,
    logos: ["https://shop.healthyoptions.com.ph/favicon.ico"],
  },
  {
    pattern: /solane/i,
    logos: ["https://solane.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /flawless/i,
    logos: ["https://www.flawless.ph/apple-touch-icon.png"],
  },
  {
    pattern: /lay\s?bare/i,
    logos: ["https://www.laybare.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /dermcare/i,
    logos: ["https://www.dermcare.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /cabalen/i,
    logos: ["https://www.cabalen.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /dads world/i,
    logos: ["https://www.dadsmanila.com/apple-touch-icon.png"],
  },
  {
    pattern: /italianni/i,
    logos: [
      "https://www.italiannis.com/apple-touch-icon.png",
      "https://logo.clearbit.com/italiannis.com?size=256",
    ],
  },
  {
    pattern: /lan hot pot/i,
    logos: [
      "https://logo.clearbit.com/lanhotpot.ph?size=256",
      "https://www.google.com/s2/favicons?domain=lanhotpot.ph&sz=256",
    ],
  },
  {
    pattern: /sitio verde/i,
    logos: [
      "https://logo.clearbit.com/sitioverdebuffet.com?size=256",
      "https://www.google.com/s2/favicons?domain=facebook.com&sz=256",
    ],
  },
  {
    pattern: /pancake house/i,
    logos: [
      `${WIKI}/thumb/8/8d/Pancake_House_logo.svg/512px-Pancake_House_logo.svg.png`,
      "https://www.pancakehouse.com.ph/apple-touch-icon.png",
    ],
  },
  {
    pattern: /the mind museum/i,
    logos: ["https://www.themindmuseum.org/apple-touch-icon.png"],
  },
  {
    pattern: /dessert museum/i,
    logos: ["https://www.thedessertmuseum.com/apple-touch-icon.png"],
  },
  {
    pattern: /timezone/i,
    logos: ["https://www.timezonegames.com/apple-touch-icon.png"],
  },
  {
    pattern: /dookki/i,
    logos: ["https://www.dookki.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /seattle.*best/i,
    logos: [
      `${WIKI}/thumb/1/1f/Seattle%27s_Best_Coffee_logo.svg/512px-Seattle%27s_Best_Coffee_logo.svg.png`,
    ],
  },
  {
    pattern: /aldo/i,
    logos: ["https://aldoshoes.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /malagos/i,
    logos: ["https://www.malagos.com/apple-touch-icon.png"],
  },
  {
    pattern: /yoshimeatsu/i,
    logos: ["https://logo.clearbit.com/yoshimeatsu.com?size=256"],
  },
  {
    pattern: /sambo kojin/i,
    logos: ["https://www.sambokojin.com/apple-touch-icon.png"],
  },
  {
    pattern: /buffet 101/i,
    logos: ["https://logo.clearbit.com/buffet101.com.ph?size=256"],
  },
  {
    pattern: /ramen kuroda/i,
    logos: ["https://www.ramenkuroda.com/apple-touch-icon.png"],
  },
  {
    pattern: /yabu/i,
    logos: ["https://www.yabu.ph/apple-touch-icon.png"],
  },
  {
    pattern: /dohtonbori/i,
    logos: ["https://www.dohtonbori.ph/apple-touch-icon.png"],
  },
  {
    pattern: /peri-?peri/i,
    logos: ["https://www.myperiperi.com/apple-touch-icon.png"],
  },
  {
    pattern: /feast and fire/i,
    logos: ["https://feastandfire.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /blake/i,
    logos: ["https://blakes.ph/apple-touch-icon.png"],
  },
  {
    pattern: /lakawon/i,
    logos: ["https://lakawon.ph/apple-touch-icon.png"],
  },
  {
    pattern: /nustar/i,
    logos: ["https://nustar.ph/apple-touch-icon.png"],
  },
  {
    pattern: /rustan/i,
    logos: ["https://rustans.com/apple-touch-icon.png"],
  },
  {
    pattern: /sonya/i,
    logos: ["https://sonyasgarden.com/apple-touch-icon.png"],
  },
  {
    pattern: /true value/i,
    logos: ["https://www.truevalue.com.ph/apple-touch-icon.png"],
  },
  {
    pattern: /avocadoria/i,
    logos: ["https://logo.clearbit.com/avocadoria.ph?size=256"],
  },
];

export function getBrandLogoOverrides(
  brand: string,
  officialSourceUrl: string | null = null,
): string[] {
  const haystack = `${brand} ${officialSourceUrl ?? ""}`;
  const matches = BRAND_LOGO_RULES.filter((rule) =>
    rule.pattern.test(haystack),
  );
  return [...new Set(matches.flatMap((rule) => rule.logos))];
}
