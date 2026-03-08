import type { Product } from "@/lib/models/Product";

/**
 * 16 dummy products for the Commonwealth Lab Marketplace.
 * Uses local product images from /public/images/products.
 */
const PRODUCT_IMAGE_NAMES = [
  "Commisioned_Art.jpeg",
  "Crockery.jpeg",
  "Gemstones.png",
  "Jewellery.png",
  "Lamps.jpeg",
  "Leather.jpeg",
  "Musical_Instrunments.jpeg",
  "Textiles.jpeg",
] as const;

const PRODUCT_IMAGES = PRODUCT_IMAGE_NAMES.map(
  (name) => `/images/products/${encodeURIComponent(name)}`
);

export const dummyProducts: Product[] = [
  /* ── Textiles ── */
  {
    id: "tx-001",
    name: "Hand-Embroidered Phulkari Dupatta",
    slug: "phulkari-dupatta",
    price: 89,
    category: "Textiles",
    description:
      "A vibrant Phulkari dupatta meticulously hand-embroidered by artisans from Punjab. Each piece takes over 200 hours to complete, using traditional silk thread techniques passed down through generations.",
    details:
      "The geometric floral patterns symbolize prosperity and celebration. Hand-embroidered using traditional silk thread methods with intricate cross-stitch techniques. Each embroidered motif tells a story of Punjabi heritage and cultural pride.",
    application:
      "Versatile piece perfect for special occasions, cultural events, or as a luxurious everyday accessory. Drape over shoulders or wear as a traditional dupatta. Can be worn over traditional outfits or contemporary dresses for a cultural touch.",
    ingredients: [
      "100% authentic silk thread",
      "Hand-embroidered stitching",
      "Natural color pigments",
      "Cotton base fabric",
      "Traditional cross-stitch technique"
    ],
    heritage:
      "Phulkari is a traditional form of embroidery from the Punjab region, dating back centuries. 'Phul' means flower and 'Kari' means work, representing the floral embroidery patterns that are part of Punjabi cultural identity.",
    images: [PRODUCT_IMAGES[7], PRODUCT_IMAGES[7]],
    featured: true,
  },
  {
    id: "tx-002",
    name: "Sindhi Ajrak Shawl",
    slug: "sindhi-ajrak-shawl",
    price: 65,
    category: "Textiles",
    description:
      "An authentic hand-block-printed Ajrak shawl from Sindh, featuring centuries-old geometric and floral motifs in deep crimson and indigo.",
    details:
      "Made using natural dyes and sun-drying techniques, each piece is a wearable work of art. The resist-dyeing process creates unique patterns that cannot be replicated exactly, making each shawl one-of-a-kind.",
    application:
      "Perfect for draping over traditional garments or pairing with modern outfits for an ethnic aesthetic. Ideal for cooler evenings or as a statement piece at formal gatherings.",
    ingredients: [
      "Natural indigo dye",
      "Natural madder red dye",
      "Natural cotton base",
      "Traditional wax-resist blocks",
      "Hand-block printing technique"
    ],
    heritage:
      "Ajrak is an ancient art form from Sindh, with roots tracing back thousands of years. The word 'Ajrakh' is derived from Persian 'Abrakh' meaning 'cloud patterns.' It represents Sindhi culture and identity.",
    images: [PRODUCT_IMAGES[7], PRODUCT_IMAGES[7]],
    featured: false,
  },
  {
    id: "tx-003",
    name: "Balochi Mirror-Work Dress",
    slug: "balochi-mirror-dress",
    price: 145,
    category: "Textiles",
    description:
      "A stunning Balochi dress adorned with intricate mirror-work and hand-stitched embroidery. Sourced directly from artisan communities in Balochistan.",
    details:
      "This piece reflects the rich textile heritage of the region with hand-stitched mirror pieces and colorful embroidery. Each mirror is individually attached to create a shimmering effect. The dress showcases traditional Balochi design principles.",
    application:
      "Wear as a statement traditional dress for cultural events, weddings, or celebrations. Can be styled with traditional footwear and jewelry for an authentic look.",
    ingredients: [
      "Hand-attached mirror pieces",
      "Embroidered silk thread",
      "Natural cotton fabric",
      "Glass mirrors",
      "Hand-stitching throughout"
    ],
    heritage:
      "Balochi embroidery and mirror-work represents the nomadic heritage of Balochistan. The tradition dates back centuries and is passed down through generations of artisan families.",
    images: [PRODUCT_IMAGES[7], PRODUCT_IMAGES[7]],
    featured: false,
  },
  {
    id: "tx-004",
    name: "Shalwar Kameez — Khadi Cotton",
    slug: "khadi-shalwar-kameez",
    price: 78,
    category: "Textiles",
    description:
      "A premium hand-woven Khadi cotton shalwar kameez that blends traditional craftsmanship with contemporary comfort.",
    details:
      "The natural fibres are ethically sourced and hand-spun by rural weavers. Khadi is known for its durability, breathability, and natural appeal. Perfect for climate-conscious conscious consumers.",
    application:
      "Ideal for everyday wear, casual gatherings, or traditional occasions. The comfortable fit is perfect for both relaxation and formal settings when styled appropriately.",
    ingredients: [
      "100% hand-spun Khadi cotton",
      "Natural cotton fibers",
      "Hand-woven technique",
      "Ethically sourced materials",
      "Traditional weaving methods"
    ],
    heritage:
      "Khadi is a hand-spun and hand-woven cloth. The khadi movement was championed by Mahatma Gandhi as part of India's independence struggle and continues to represent ethical, sustainable fashion.",
    images: [PRODUCT_IMAGES[7], PRODUCT_IMAGES[7]],
    featured: false,
  },

  /* ── Crockery ── */
  {
    id: "cr-001",
    name: "Blue Pottery Vase — Multan",
    slug: "blue-pottery-vase",
    price: 52,
    category: "Crockery",
    description:
      "A hand-painted blue pottery vase from the artisan quarters of Multan. Using a centuries-old technique involving quartz stone, glass, and multani clay.",
    details:
      "Each vase features intricate floral and geometric designs in cobalt blue. The unique glaze creates a jewel-like finish that catches light beautifully. No two pieces are identical.",
    application:
      "Perfect for displaying fresh or dried flowers, as a decorative centerpiece on shelves or tables, or as a collectible art piece. Works well in both traditional and contemporary interiors.",
    ingredients: [
      "Multani clay",
      "Quartz stone powder",
      "Glass fragments",
      "Natural cobalt blue pigment",
      "Hand-painted ceramic glaze"
    ],
    heritage:
      "Blue pottery from Multan is renowned worldwide. The craft dates back to the Mughal era and represents the artistic excellence of the Multan artisan community.",
    images: [PRODUCT_IMAGES[1], PRODUCT_IMAGES[1]],
    featured: true,
  },
  {
    id: "cr-002",
    name: "PSZ Artisan Coffee Mug",
    slug: "psz-artisan-mug",
    price: 24,
    category: "Crockery",
    description:
      "A hand-glazed ceramic mug stamped with the PSZ emblem. Each mug is kiln-fired by local potters and features a unique glaze variation.",
    details:
      "Microwave and dishwasher safe, making it practical for everyday use while maintaining artisan quality. The hand-glazed finish ensures every mug has unique character and charm.",
    application:
      "Perfect for your morning coffee or tea. Makes an excellent gift for PSZ supporters. Use daily to support local artisans and community initiatives.",
    ingredients: [
      "Ceramic stoneware clay",
      "Food-safe ceramic glaze",
      "Hand-applied PSZ stamp",
      "High-fire kiln treatment",
      "Eco-friendly materials"
    ],
    heritage:
      "Supporting local potters and ceramic artisans who have preserved traditional kiln-firing techniques across generations.",
    images: [PRODUCT_IMAGES[1], PRODUCT_IMAGES[1]],
    featured: false,
  },

  /* ── Commissioned Art ── */
  {
    id: "ca-001",
    name: "Carved Walnut Wood Box — Kashmir",
    slug: "walnut-wood-box",
    price: 110,
    category: "Commissioned Art",
    description:
      "An exquisite walnut wood jewellery box hand-carved by Kashmiri artisans. The intricate jali (lattice) and chinar leaf motifs are carved from a single piece of sustainably harvested walnut wood.",
    details:
      "Each carving demonstrates exceptional skill and patience. The jali work (lattice carving) is a hallmark of Kashmir's artistic tradition. The natural wood grain adds to its beauty.",
    application:
      "Ideal for storing jewelry, precious items, or as a decorative box. The elegant design makes it suitable for display on dressers, tables, or shelves.",
    ingredients: [
      "Sustainably harvested walnut wood",
      "Hand-carved jali patterns",
      "Natural wood finish",
      "Traditional carving tools",
      "No chemical treatments"
    ],
    heritage:
      "Kashmiri woodcarving is an ancient art form renowned for its intricate lattice (jali) work and floral motifs. The tradition represents centuries of artistic excellence.",
    images: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[0]],
    featured: false,
  },
  {
    id: "ca-002",
    name: "Onyx Marble Chess Set",
    slug: "onyx-chess-set",
    price: 195,
    category: "Commissioned Art",
    description:
      "A luxurious hand-carved onyx marble chess set from the quarries of Balochistan. Each piece is individually shaped and polished.",
    details:
      "Showcasing the natural veining of green and white onyx stone. The weight and balance of each piece is carefully calibrated for proper gameplay. A true collector's item.",
    application:
      "Display as a luxurious home decoration or use for actual gameplay. Perfect for chess enthusiasts, collectors, and those appreciating fine craftsmanship.",
    ingredients: [
      "Natural onyx marble (green and white)",
      "Hand-carved pieces",
      "Hand-polished finish",
      "Sustainably quarried stone",
      "Traditional carving techniques"
    ],
    heritage:
      "Balochistan's marble quarries produce some of the world's finest onyx. The art of stone carving in this region represents centuries of expertise.",
    images: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[0]],
    featured: true,
  },

  /* ── Jewellery ── */
  {
    id: "je-001",
    name: "Lacquered Wooden Bangles Set",
    slug: "lacquered-bangles",
    price: 28,
    category: "Jewellery",
    description:
      "A set of six hand-lacquered wooden bangles painted in rich heritage colours. Made from lightweight sheesham wood and finished with eco-friendly lacquer.",
    details:
      "Handcrafted by artisan women cooperatives using traditional techniques. Each bangle is individually painted and lacquered for durability. The lightweight design makes them comfortable for all-day wear.",
    application:
      "Perfect for adding color and cultural flair to any outfit. Mix and match colors for a personalized look. Suitable for everyday wear or special occasions.",
    ingredients: [
      "Sustainably harvested sheesham wood",
      "Eco-friendly natural lacquer",
      "Hand-applied paint pigments",
      "Protective finish coating",
      "Made by artisan women"
    ],
    heritage:
      "Wooden bangle making is a traditional craft passed down through generations. Supporting these artisan women helps preserve cultural heritage and empower communities.",
    images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[3]],
    featured: true,
  },
  {
    id: "je-002",
    name: "PSZ Enamel Pin Set",
    slug: "psz-enamel-pins",
    price: 18,
    category: "Jewellery",
    description:
      "A collector's set of three hard-enamel pins featuring the PSZ emblem, the Commonwealth Lab logo, and a 'Community First' badge.",
    details:
      "Gold-plated finish with butterfly clutch. Each pin is meticulously crafted using traditional enamel techniques. Perfect for collectors and PSZ enthusiasts.",
    application:
      "Pin to jackets, bags, hats, or lapels. Collect all series. Perfect gift for supporters of ethical commerce and artisan support.",
    ingredients: [
      "Hard-enamel construction",
      "Gold-plated metal base",
      "Butterfly clutch backing",
      "Individual presentation packaging",
      "Premium quality materials"
    ],
    heritage:
      "Supporting PSZ's mission to empower artisans and preserve cultural traditions through ethical commerce.",
    images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[3]],
    featured: false,
  },

  /* ── Lamps ── */
  {
    id: "lm-001",
    name: "Camel-Skin Lamp — Traditional",
    slug: "camel-skin-lamp",
    price: 72,
    category: "Lamps",
    description:
      "A warm-toned camel-skin lamp hand-crafted in Multan. The translucent skin is stretched over a metal frame and painted with traditional floral motifs.",
    details:
      "Casting a beautiful amber glow when lit, the hand-painted designs become illuminated, creating an ambiance of warmth and cultural richness. Each lamp is unique.",
    application:
      "Perfect for creating ambient lighting in living rooms, bedrooms, or meditation spaces. The soft glow creates a luxurious, relaxing atmosphere.",
    ingredients: [
      "Natural camel skin (ethically sourced)",
      "Metal frame structure",
      "Hand-painted floral designs",
      "Traditional pigments",
      "Professional electrical fitting"
    ],
    heritage:
      "Traditional camel-skin lamps represent an ancient craft from Multan. The technique creates beautiful silhouettes when illuminated.",
    images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[4]],
    featured: true,
  },

  /* ── Leather ── */
  {
    id: "le-001",
    name: "Peshawari Chappal — Leather",
    slug: "peshawari-chappal",
    price: 55,
    category: "Leather",
    description:
      "Authentic hand-stitched Peshawari chappals crafted from premium vegetable-tanned leather. Made by third-generation cobblers in Peshawar.",
    details:
      "These sandals combine heritage design with enduring comfort. The vegetable-tanned leather improves with age, developing a unique patina. Traditional hand-stitching ensures durability.",
    application:
      "Ideal for casual wear, around the home, or cultural occasions. The ergonomic design supports natural foot positioning. Perfect for warm climates.",
    ingredients: [
      "Premium vegetable-tanned leather",
      "Traditional hand-stitching",
      "Natural leather conditioning",
      "Authentic Peshawari design",
      "No synthetic materials"
    ],
    heritage:
      "Peshawari chappals are iconic footwear from Peshawar with a heritage spanning centuries. Made by families of cobblers who have perfected the craft.",
    images: [PRODUCT_IMAGES[5], PRODUCT_IMAGES[5]],
    featured: true,
  },

  /* ── Gemstones ── */
  {
    id: "gs-001",
    name: "Rose-Water Attar Collection",
    slug: "rose-attar-collection",
    price: 42,
    category: "Gemstones",
    description:
      "A curated set of three traditional attar perfumes distilled from heritage rose gardens. Alcohol-free and vegan.",
    details:
      "These oil-based fragrances come in hand-blown glass bottles. Each attar is crafted using traditional distillation methods that preserve the delicate floral essence.",
    application:
      "Apply a small amount to pulse points for long-lasting fragrance. The concentrated formula means a little goes a long way. Perfect as a personal indulgence or luxurious gift.",
    ingredients: [
      "Pure rose oil from heritage gardens",
      "Traditional distillation process",
      "100% alcohol-free formula",
      "Vegan and cruelty-free",
      "Hand-blown glass bottles"
    ],
    heritage:
      "Rose water and attar production is an ancient tradition in South Asia. The distillation techniques have been refined over centuries.",
    images: [PRODUCT_IMAGES[2], PRODUCT_IMAGES[2]],
    featured: true,
  },

  /* ── Musical Instruments ── */
  {
    id: "mi-001",
    name: "Hand-Woven Kilim Rug",
    slug: "kilim-rug",
    price: 230,
    category: "Musical Instruments",
    description:
      "A flat-woven Kilim rug made by nomadic weavers of northern Pakistan. Each rug is uniquely patterned using natural wool dyes.",
    details:
      "Takes weeks to complete. Perfect as a statement floor piece or wall hanging. The natural wool develops character with age and use.",
    application:
      "Display on floors in living spaces, bedrooms, or over sofas. Use as wall art or tapestry. Perfect for adding warmth and cultural authenticity to interiors.",
    ingredients: [
      "100% natural wool",
      "Natural dye colors",
      "Hand-woven flat technique",
      "Traditional nomadic patterns",
      "Sustainably sourced fibers"
    ],
    heritage:
      "Kilim weaving is an ancient nomadic tradition. These rugs represent the cultural identity and artistic expressions of nomadic communities.",
    images: [PRODUCT_IMAGES[6], PRODUCT_IMAGES[6]],
    featured: true,
  },
  {
    id: "mi-002",
    name: "PSZ Heritage Tote Bag",
    slug: "psz-heritage-tote",
    price: 35,
    category: "Musical Instruments",
    description:
      "A premium organic-cotton tote bag featuring the PakSarZameen emblem. Screen-printed with eco-friendly inks.",
    details:
      "Proceeds directly fund PSZ community programmes. Made using sustainable practices with durable seaming for long-lasting use.",
    application:
      "Perfect everyday tote for shopping, travel, or carrying daily essentials. Show your support while carrying a quality, eco-friendly bag.",
    ingredients: [
      "100% organic cotton",
      "Eco-friendly screen printing",
      "Reinforced stitching",
      "Sustainable production",
      "Fair-trade practices"
    ],
    heritage:
      "Every purchase supports PSZ's mission to empower artisans and preserve cultural heritage through ethical commerce.",
    images: [PRODUCT_IMAGES[6], PRODUCT_IMAGES[6]],
    featured: false,
  },
  {
    id: "mi-003",
    name: "PSZ Impact Hoodie — Forest Green",
    slug: "psz-impact-hoodie",
    price: 58,
    category: "Musical Instruments",
    description:
      "A cosy, ethically produced heavyweight hoodie in PSZ Forest Green. Made from 100% organic cotton with minimal branding.",
    details:
      "Every purchase funds educational programmes in underserved communities. Premium quality ensures long-lasting comfort and durability.",
    application:
      "Perfect for everyday casual wear, layering in cool weather, or showing support for PSZ initiatives. Classic design works with any wardrobe.",
    ingredients: [
      "100% organic cotton",
      "Heavyweight fabric (12 oz)",
      "Ethical manufacturing",
      "PSZ Forest Green color",
      "Minimal logo branding"
    ],
    heritage:
      "Supporting PSZ's educational initiatives and commitment to community empowerment through every purchase.",
    images: [PRODUCT_IMAGES[6], PRODUCT_IMAGES[6]],
    featured: false,
  },
];
