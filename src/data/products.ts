import type { Product } from "@/lib/models/Product";

/**
 * 16 dummy products for the Commonwealth Lab Marketplace.
 * Uses Unsplash placeholder images sized to 800×1000 for consistency.
 */
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
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1612196808214-b7e239e5f6dc?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1586165368502-1bad9cc99289?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1505051508008-923feaf90180?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1588514727390-91fd5b3313ab?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1578768079470-fa604cf3551b?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1000&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=1000&fit=crop",
    ],
    featured: false,
  },
];
