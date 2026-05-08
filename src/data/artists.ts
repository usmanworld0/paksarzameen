import type { Artist } from "@/lib/models/Artist";

/**
 * Dummy artists data for the "Meet the Artists" section.
 * Uses optimized WebP photos from /public/images/optimized/members.
 */
const ARTIST_IMAGES = [
  "/images/optimized/members/1.webp",
  "/images/optimized/members/2.webp",
  "/images/optimized/members/3.webp",
  "/images/optimized/members/4.webp",
  "/images/optimized/members/5.webp",
  "/images/optimized/members/6.webp",
] as const;

export const dummyArtists: Artist[] = [
  {
    id: "artist-001",
    name: "Fatima Khan",
    slug: "fatima-khan",
    region: "Punjab, Pakistan",
    specialty: "Hand-Embroidery & Textiles",
    bio: "Master artisan with 35 years of experience in traditional Phulkari embroidery",
    description:
      "Fatima Khan is a legendary textile artisan from Punjab with over three decades of experience in traditional hand-embroidery. Her Phulkari duppatas are sought after by collectors across South Asia. Each piece represents countless hours of meticulous craftsmanship and a dedication to preserving ancestral textile traditions. She mentors over 50 young artisans in her community, passing down techniques that date back centuries.",
    image: ARTIST_IMAGES[0],
    products: 4,
    featured: true,
  },
  {
    id: "artist-002",
    name: "Rashid Ahmed",
    slug: "rashid-ahmed",
    region: "Multan, Pakistan",
    specialty: "Blue Pottery",
    bio: "Master potter specializing in Multani blue pottery since 1988",
    description:
      "Rashid Ahmed is a third-generation blue pottery master from Multan, continuing a family tradition that spans over 100 years. His workshop is renowned for producing intricate blue pottery pieces using centuries-old glazing techniques. Each vase, plate, and decorative piece is hand-painted with traditional geometric and floral motifs. Rashid sources his materials sustainably and employs 25 artisans from his community.",
    image: ARTIST_IMAGES[1],
    products: 5,
    featured: true,
  },
  {
    id: "artist-003",
    name: "Aisha Sheikh",
    slug: "aisha-sheikh",
    region: "Sindh, Pakistan",
    specialty: "Block Printing & Ajrak",
    bio: "Expert in traditional hand-block printing and natural dye techniques",
    description:
      "Aisha Sheikh is a visionary artist preserving the ancient Ajrak block-printing tradition of Sindh. Her studio in Hyderabad uses only natural dyes and handmade wooden blocks carved by local artisans. Each Ajrak shawl takes weeks to complete, involving multiple rounds of hand-blocking, natural dyeing, and sun-curing. Aisha collaborates with rural communities to source organic cotton and sustainable materials.",
    image: ARTIST_IMAGES[2],
    products: 6,
    featured: true,
  },
  {
    id: "artist-004",
    name: "Ghulam Hassan",
    slug: "ghulam-hassan",
    region: "Kashmir, Pakistan",
    specialty: "Wood Carving & Lacquer Work",
    bio: "Master woodcarver with expertise in traditional Kashmiri papier-mâché and lacquer",
    description:
      "Ghulam Hassan is a renowned Kashmiri wood carver who has dedicated 40 years to preserving traditional wood carving and lacquer techniques. His intricate wooden boxes and chess sets are exhibited in galleries across Pakistan and beyond. Every piece begins with hand-selected walnut wood and involves dozens of carving steps, followed by traditional oil-based lacquering. He trains apprentices in this endangered craft.",
    image: ARTIST_IMAGES[3],
    products: 4,
    featured: true,
  },
  {
    id: "artist-005",
    name: "Zainab Ali",
    slug: "zainab-ali",
    region: "Balochistan, Pakistan",
    specialty: "Mirror-Work & Embroidery",
    bio: "Innovative artisan blending traditional Balochi mirror-work with contemporary design",
    description:
      "Zainab Ali represents a new generation of Balochi artisans who honor traditional techniques while embracing modern aesthetics. Her mirror-work dresses combine intricate hand-stitched mirrors with vibrant embroidery, creating pieces that are both wearable and collectible. Working directly with communities in Balochistan, she ensures fair wages and preserves the distinctive Balochi embroidery heritage.",
    image: ARTIST_IMAGES[4],
    products: 3,
    featured: true,
  },
  {
    id: "artist-006",
    name: "Mohammad Malik",
    slug: "mohammad-malik",
    region: "Peshawar, Pakistan",
    specialty: "Leather Craft & Traditional Chappals",
    bio: "Fifth-generation cobbler preserving Peshawari chappal traditions",
    description:
      "Mohammad Malik comes from a lineage of master cobblers in Peshawar. He creates handcrafted leather chappals using traditional techniques and premium leather. Each pair is individually sized and hand-stitched, taking several days to complete. His workshop is a cultural landmark in the Peshawar bazaar, where young apprentices learn the craft that has supported his family for over 150 years.",
    image: ARTIST_IMAGES[5],
    products: 2,
    featured: false,
  },
];
