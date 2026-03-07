import type { Product } from "@/lib/models/Product";

/**
 * 16 dummy products for the Commonwealth Lab Marketplace.
 * Uses local product images from /public/images/products.
 */
const PRODUCT_IMAGE_NAMES = [
  "WhatsApp Image 2026-03-07 at 4.15.50 PM (1).jpeg",
  "WhatsApp Image 2026-03-07 at 4.15.50 PM.jpeg",
  "WhatsApp Image 2026-03-07 at 4.15.51 PM (1).jpeg",
  "WhatsApp Image 2026-03-07 at 4.15.51 PM (2).jpeg",
  "WhatsApp Image 2026-03-07 at 4.15.51 PM (3).jpeg",
  "WhatsApp Image 2026-03-07 at 4.15.51 PM.jpeg",
] as const;

const PRODUCT_IMAGES = PRODUCT_IMAGE_NAMES.map(
  (name) => `/images/products/${encodeURIComponent(name)}`
);

export const dummyProducts: Product[] = [
  /* ── Traditional Clothing ── */
  {
    id: "tc-001",
    name: "Hand-Embroidered Phulkari Dupatta",
    slug: "phulkari-dupatta",
    price: 89,
    category: "Traditional Clothing",
    description:
      "A vibrant Phulkari dupatta meticulously hand-embroidered by artisans from Punjab. Each piece takes over 200 hours to complete, using traditional silk thread techniques passed down through generations. The geometric floral patterns symbolize prosperity and celebration.",
    images: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[1]],
    featured: true,
  },
  {
    id: "tc-002",
    name: "Sindhi Ajrak Shawl",
    slug: "sindhi-ajrak-shawl",
    price: 65,
    category: "Traditional Clothing",
    description:
      "An authentic hand-block-printed Ajrak shawl from Sindh, featuring centuries-old geometric and floral motifs in deep crimson and indigo. Made using natural dyes and sun-drying techniques, each piece is a wearable work of art.",
    images: [PRODUCT_IMAGES[2], PRODUCT_IMAGES[3]],
    featured: false,
  },
  {
    id: "tc-003",
    name: "Balochi Mirror-Work Dress",
    slug: "balochi-mirror-dress",
    price: 145,
    category: "Traditional Clothing",
    description:
      "A stunning Balochi dress adorned with intricate mirror-work and hand-stitched embroidery. Sourced directly from artisan communities in Balochistan, this piece reflects the rich textile heritage of the region.",
    images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[5]],
    featured: true,
  },
  {
    id: "tc-004",
    name: "Shalwar Kameez — Khadi Cotton",
    slug: "khadi-shalwar-kameez",
    price: 78,
    category: "Traditional Clothing",
    description:
      "A premium hand-woven Khadi cotton shalwar kameez that blends traditional craftsmanship with contemporary comfort. The natural fibres are ethically sourced and hand-spun by rural weavers.",
    images: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[2]],
    featured: false,
  },

  /* ── Handicrafts ── */
  {
    id: "hc-001",
    name: "Blue Pottery Vase — Multan",
    slug: "blue-pottery-vase",
    price: 52,
    category: "Handicrafts",
    description:
      "A hand-painted blue pottery vase from the artisan quarters of Multan. Using a centuries-old technique involving quartz stone, glass, and multani clay, each vase features intricate floral and geometric designs in cobalt blue.",
    images: [PRODUCT_IMAGES[1], PRODUCT_IMAGES[3]],
    featured: true,
  },
  {
    id: "hc-002",
    name: "Carved Walnut Wood Box — Kashmir",
    slug: "walnut-wood-box",
    price: 110,
    category: "Handicrafts",
    description:
      "An exquisite walnut wood jewellery box hand-carved by Kashmiri artisans. The intricate jali (lattice) and chinar leaf motifs are carved from a single piece of sustainably harvested walnut wood.",
    images: [PRODUCT_IMAGES[2], PRODUCT_IMAGES[4]],
    featured: false,
  },
  {
    id: "hc-003",
    name: "Lacquered Wooden Bangles Set",
    slug: "lacquered-bangles",
    price: 28,
    category: "Handicrafts",
    description:
      "A set of six hand-lacquered wooden bangles painted in rich heritage colours. Made from lightweight sheesham wood and finished with eco-friendly lacquer by artisan women cooperatives.",
    images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[5]],
    featured: false,
  },
  {
    id: "hc-004",
    name: "Onyx Marble Chess Set",
    slug: "onyx-chess-set",
    price: 195,
    category: "Handicrafts",
    description:
      "A luxurious hand-carved onyx marble chess set from the quarries of Balochistan. Each piece is individually shaped and polished, showcasing the natural veining of green and white onyx stone.",
    images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[0]],
    featured: true,
  },

  /* ── Cultural Goods ── */
  {
    id: "cg-001",
    name: "Camel-Skin Lamp — Traditional",
    slug: "camel-skin-lamp",
    price: 72,
    category: "Cultural Goods",
    description:
      "A warm-toned camel-skin lamp hand-crafted in Multan. The translucent skin is stretched over a metal frame and painted with traditional floral motifs, casting a beautiful amber glow when lit.",
    images: [PRODUCT_IMAGES[5], PRODUCT_IMAGES[1]],
    featured: true,
  },
  {
    id: "cg-002",
    name: "Peshawari Chappal — Leather",
    slug: "peshawari-chappal",
    price: 55,
    category: "Cultural Goods",
    description:
      "Authentic hand-stitched Peshawari chappals crafted from premium vegetable-tanned leather. Made by third-generation cobblers in Peshawar, these sandals combine heritage design with enduring comfort.",
    images: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[3]],
    featured: false,
  },
  {
    id: "cg-003",
    name: "Rose-Water Attar Collection",
    slug: "rose-attar-collection",
    price: 42,
    category: "Cultural Goods",
    description:
      "A curated set of three traditional attar perfumes distilled from heritage rose gardens. Alcohol-free and vegan, these oil-based fragrances come in hand-blown glass bottles.",
    images: [PRODUCT_IMAGES[1], PRODUCT_IMAGES[4]],
    featured: false,
  },
  {
    id: "cg-004",
    name: "Hand-Woven Kilim Rug",
    slug: "kilim-rug",
    price: 230,
    category: "Cultural Goods",
    description:
      "A flat-woven Kilim rug made by nomadic weavers of northern Pakistan. Each rug is uniquely patterned using natural wool dyes and takes weeks to complete. Perfect as a statement floor piece or wall hanging.",
    images: [PRODUCT_IMAGES[2], PRODUCT_IMAGES[5]],
    featured: true,
  },

  /* ── PSZ Merchandise ── */
  {
    id: "pm-001",
    name: "PSZ Heritage Tote Bag",
    slug: "psz-heritage-tote",
    price: 35,
    category: "PSZ Merchandise",
    description:
      "A premium organic-cotton tote bag featuring the PakSarZameen emblem. Screen-printed with eco-friendly inks. Proceeds directly fund PSZ community programmes.",
    images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[0]],
    featured: false,
  },
  {
    id: "pm-002",
    name: "PSZ Impact Hoodie — Forest Green",
    slug: "psz-impact-hoodie",
    price: 58,
    category: "PSZ Merchandise",
    description:
      "A cosy, ethically produced heavyweight hoodie in PSZ Forest Green. Made from 100 % organic cotton with minimal branding. Every purchase funds educational programmes.",
    images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[1]],
    featured: true,
  },
  {
    id: "pm-003",
    name: "PSZ Enamel Pin Set",
    slug: "psz-enamel-pins",
    price: 18,
    category: "PSZ Merchandise",
    description:
      "A collector's set of three hard-enamel pins featuring the PSZ emblem, the Commonwealth Lab logo, and a 'Community First' badge. Gold-plated finish with butterfly clutch.",
    images: [PRODUCT_IMAGES[5], PRODUCT_IMAGES[2]],
    featured: false,
  },
  {
    id: "pm-004",
    name: "PSZ Artisan Coffee Mug",
    slug: "psz-artisan-mug",
    price: 24,
    category: "PSZ Merchandise",
    description:
      "A hand-glazed ceramic mug stamped with the PSZ emblem. Each mug is kiln-fired by local potters and features a unique glaze variation. Microwave and dishwasher safe.",
    images: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[4]],
    featured: false,
  },
];
