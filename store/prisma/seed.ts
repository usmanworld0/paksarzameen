import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const STORE_REGIONS = [
  {
    code: "PAK",
    name: "Pakistan",
    currency: "PKR",
    locale: "en-PK",
    countryCodes: ["PK"],
    active: true,
    isDefault: true,
  },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    countryCodes: ["US"],
    active: false,
    isDefault: false,
  },
  {
    code: "UK",
    name: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    countryCodes: ["GB", "UK"],
    active: false,
    isDefault: false,
  },
] as const;

const COUPONS = [
  {
    name: "Welcome Offer",
    code: "WELCOME10",
    description: "10% off your first Commonwealth Lab order.",
    discountPercent: 10,
    minSubtotal: 5000,
    active: true,
  },
  {
    name: "Artisan Collection",
    code: "ARTISAN15",
    description: "15% off artisan collections above PKR 12,000.",
    discountPercent: 15,
    minSubtotal: 12000,
    active: true,
  },
] as const;

async function main() {
  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || "abdullahtanseer@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "CommonWe@lth!";

  await prisma.admin.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {
      password: await hash(adminPassword, 12),
      name: "Admin",
      role: "admin",
    },
    create: {
      email: adminEmail.toLowerCase(),
      password: await hash(adminPassword, 12),
      name: "Admin",
      role: "admin",
    },
  });
  console.log(`Admin user upserted: ${adminEmail.toLowerCase()}`);

  for (const region of STORE_REGIONS) {
    await prisma.storeRegion.upsert({
      where: { code: region.code },
      update: {
        name: region.name,
        currency: region.currency,
        locale: region.locale,
        countryCodes: region.countryCodes,
      },
      create: region,
    });
  }

  await prisma.storeRegion.updateMany({
    where: { code: { not: "PAK" }, isDefault: true },
    data: { isDefault: false },
  });
  console.log("Store regions seeded");

  for (const coupon of COUPONS) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon,
    });
  }
  console.log("Coupons seeded");

  // Seed categories
  const categories = [
    {
      name: "Traditional Clothing",
      slug: "traditional-clothing",
      description:
        "Handcrafted traditional garments from across Pakistan, featuring embroidery and regional styles.",
      customizable: true,
    },
    {
      name: "Handicrafts",
      slug: "handicrafts",
      description:
        "Artisanal handicrafts showcasing centuries-old techniques passed down through generations.",
      customizable: false,
    },
    {
      name: "Cultural Goods",
      slug: "cultural-goods",
      description:
        "Authentic cultural products including pottery, woodwork, and metalwork.",
      customizable: false,
    },
    {
      name: "Jewellery",
      slug: "jewellery",
      description:
        "Exquisite handmade jewellery featuring semi-precious gemstones and traditional Pakistani designs.",
      customizable: true,
    },
    {
      name: "Home & Living",
      slug: "home-living",
      description:
        "Artisan-made home decor and furnishings reflecting Pakistan's rich aesthetic heritage.",
      customizable: false,
    },
    {
      name: "PSZ Merchandise",
      slug: "psz-merchandise",
      description:
        "Official PakSarZameen merchandise. Every purchase supports our grassroots programs.",
      customizable: false,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Categories seeded");

  // Seed artists
  const artists = [
    {
      name: "Fatima Bibi",
      slug: "fatima-bibi",
      bio: "A master embroiderer from Bahawalpur with over 20 years of experience in Sindhi and Punjabi needlework.",
      location: "Bahawalpur, Punjab",
    },
    {
      name: "Ahmed Raza",
      slug: "ahmed-raza",
      bio: "Third-generation potter specialising in Multan's iconic blue pottery tradition.",
      location: "Multan, Punjab",
    },
    {
      name: "Zainab Khatoon",
      slug: "zainab-khatoon",
      bio: "Artisan jeweller known for combining traditional Balochi metalwork with contemporary designs.",
      location: "Quetta, Balochistan",
    },
    {
      name: "Muhammad Iqbal",
      slug: "muhammad-iqbal",
      bio: "Woodcarver and furniture maker preserving the Swat Valley's carved walnut tradition.",
      location: "Swat, KPK",
    },
  ];

  for (const artist of artists) {
    await prisma.artist.upsert({
      where: { slug: artist.slug },
      update: {},
      create: artist,
    });
  }
  console.log("Artists seeded");

  // Seed customization options for customizable categories
  const clothingCat = await prisma.category.findUnique({
    where: { slug: "traditional-clothing" },
  });
  const jewelleryCat = await prisma.category.findUnique({
    where: { slug: "jewellery" },
  });

  if (clothingCat) {
    await prisma.customizationOption.createMany({
      data: [
        {
          categoryId: clothingCat.id,
          name: "Size",
          type: "size",
          options: ["XS", "S", "M", "L", "XL", "XXL"],
          required: true,
        },
        {
          categoryId: clothingCat.id,
          name: "Custom Text Embroidery",
          type: "text",
          required: false,
        },
        {
          categoryId: clothingCat.id,
          name: "Thread Colour",
          type: "color",
          options: ["Gold", "Silver", "Maroon", "Green", "Blue"],
          required: false,
        },
      ],
      skipDuplicates: true,
    });
  }

  if (jewelleryCat) {
    await prisma.customizationOption.createMany({
      data: [
        {
          categoryId: jewelleryCat.id,
          name: "Ring Size",
          type: "select",
          options: ["5", "6", "7", "8", "9", "10"],
          required: false,
        },
        {
          categoryId: jewelleryCat.id,
          name: "Engraving Text",
          type: "text",
          required: false,
        },
      ],
      skipDuplicates: true,
    });
  }
  console.log("Customization options seeded");

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
