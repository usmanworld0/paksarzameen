export type DogLocationOption = {
  key: string;
  city: string;
  area: string;
  province: string;
  label: string;
  tehsil: string;
  hotspotType: string;
  riskLevel: "High" | "Medium" | "Low";
  estimatedDogPopulation: number;
  operationalRadiusM: number;
  latitude: number;
  longitude: number;
  notes: string;
};

export type DogLocationLike = {
  locationKey?: string | null;
  city?: string | null;
  area?: string | null;
  locationLabel?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export const DOG_LOCATION_OPTIONS: DogLocationOption[] = [
  {
    key: "shahi-bazaar-old-city",
    city: "Bahawalpur City",
    area: "Shahi Bazaar / Old City",
    province: "Punjab",
    label: "Shahi Bazaar / Old City, Bahawalpur City",
    tehsil: "Bahawalpur City",
    hotspotType: "Market / Bazaar",
    riskLevel: "High",
    estimatedDogPopulation: 450,
    operationalRadiusM: 849,
    longitude: 71.679,
    latitude: 29.3954,
    notes: "Dense food-waste lanes with high human-dog interaction.",
  },
  {
    key: "farid-gate",
    city: "Bahawalpur City",
    area: "Farid Gate",
    province: "Punjab",
    label: "Farid Gate, Bahawalpur City",
    tehsil: "Bahawalpur City",
    hotspotType: "Market / Bazaar",
    riskLevel: "High",
    estimatedDogPopulation: 320,
    operationalRadiusM: 716,
    longitude: 71.6833,
    latitude: 29.3957,
    notes: "Historic gate area with meat and produce vendors.",
  },
  {
    key: "bvh-bite-cluster",
    city: "Bahawalpur City",
    area: "BVH Bite Cluster",
    province: "Punjab",
    label: "BVH Bite Cluster, Bahawalpur City",
    tehsil: "Bahawalpur City",
    hotspotType: "Hospital Bite Cluster",
    riskLevel: "High",
    estimatedDogPopulation: 200,
    operationalRadiusM: 566,
    longitude: 71.681,
    latitude: 29.3903,
    notes: "Division ARV catchment with bite-cluster relevance.",
  },
  {
    key: "dc-chowk",
    city: "Bahawalpur City",
    area: "DC Chowk",
    province: "Punjab",
    label: "DC Chowk, Bahawalpur City",
    tehsil: "Bahawalpur City",
    hotspotType: "Residential",
    riskLevel: "Medium",
    estimatedDogPopulation: 150,
    operationalRadiusM: 490,
    longitude: 71.69,
    latitude: 29.393,
    notes: "Mixed commercial-residential zone.",
  },
  {
    key: "milad-chowk-eidgah",
    city: "Bahawalpur City",
    area: "Milad Chowk / Eidgah",
    province: "Punjab",
    label: "Milad Chowk / Eidgah, Bahawalpur City",
    tehsil: "Bahawalpur City",
    hotspotType: "Residential",
    riskLevel: "Medium",
    estimatedDogPopulation: 180,
    operationalRadiusM: 537,
    longitude: 71.6683,
    latitude: 29.3924,
    notes: "Eidgah ground gathers packs at night.",
  },
  {
    key: "model-town",
    city: "Bahawalpur City",
    area: "Model Town",
    province: "Punjab",
    label: "Model Town, Bahawalpur City",
    tehsil: "Bahawalpur City",
    hotspotType: "Residential",
    riskLevel: "Medium",
    estimatedDogPopulation: 140,
    operationalRadiusM: 473,
    longitude: 71.6584,
    latitude: 29.3918,
    notes: "Back-street garbage points.",
  },
  {
    key: "satellite-town",
    city: "Bahawalpur City",
    area: "Satellite Town",
    province: "Punjab",
    label: "Satellite Town, Bahawalpur City",
    tehsil: "Bahawalpur City",
    hotspotType: "Residential",
    riskLevel: "Medium",
    estimatedDogPopulation: 170,
    operationalRadiusM: 522,
    longitude: 71.7133,
    latitude: 29.3897,
    notes: "Walled compound interstices.",
  },
  {
    key: "cantt-periphery",
    city: "Bahawalpur Saddar",
    area: "Cantt Periphery",
    province: "Punjab",
    label: "Cantt Periphery, Bahawalpur Saddar",
    tehsil: "Bahawalpur Saddar",
    hotspotType: "Peri-Urban",
    riskLevel: "Medium",
    estimatedDogPopulation: 250,
    operationalRadiusM: 632,
    longitude: 71.6812,
    latitude: 29.3722,
    notes: "Boundary wall corridor territory.",
  },
  {
    key: "iub-campus-edge",
    city: "Bahawalpur Saddar",
    area: "IUB Campus Edge",
    province: "Punjab",
    label: "IUB Campus Edge, Bahawalpur Saddar",
    tehsil: "Bahawalpur Saddar",
    hotspotType: "Institutional",
    riskLevel: "Medium",
    estimatedDogPopulation: 280,
    operationalRadiusM: 669,
    longitude: 71.7652,
    latitude: 29.3788,
    notes: "Campus canteen waste and student bite reports.",
  },
  {
    key: "yazman-road-peri-urban-strip",
    city: "Bahawalpur Saddar",
    area: "Yazman Road Peri-Urban Strip",
    province: "Punjab",
    label: "Yazman Road Peri-Urban Strip, Bahawalpur Saddar",
    tehsil: "Bahawalpur Saddar",
    hotspotType: "Peri-Urban",
    riskLevel: "High",
    estimatedDogPopulation: 400,
    operationalRadiusM: 800,
    longitude: 71.703,
    latitude: 29.3295,
    notes: "Cholistan fringe with livestock-feral overlap.",
  },
  {
    key: "dha-sector-a-cluster",
    city: "Bahawalpur Saddar",
    area: "DHA Sector A Cluster",
    province: "Punjab",
    label: "DHA Sector A Cluster, Bahawalpur Saddar",
    tehsil: "Bahawalpur Saddar",
    hotspotType: "Residential",
    riskLevel: "High",
    estimatedDogPopulation: 430,
    operationalRadiusM: 829,
    longitude: 71.6757,
    latitude: 29.327,
    notes: "Parks, plots, garbage points, and entrance cluster.",
  },
  {
    key: "ahmedpur-east-town",
    city: "Ahmedpur East",
    area: "Ahmedpur East Town",
    province: "Punjab",
    label: "Ahmedpur East Town, Ahmedpur East",
    tehsil: "Ahmedpur East",
    hotspotType: "Market / Bazaar",
    riskLevel: "High",
    estimatedDogPopulation: 550,
    operationalRadiusM: 938,
    longitude: 71.2518,
    latitude: 29.1459,
    notes: "Dense market core around tehsil HQ.",
  },
  {
    key: "dera-nawab-sahib",
    city: "Ahmedpur East",
    area: "Dera Nawab Sahib",
    province: "Punjab",
    label: "Dera Nawab Sahib, Ahmedpur East",
    tehsil: "Ahmedpur East",
    hotspotType: "Peri-Urban",
    riskLevel: "High",
    estimatedDogPopulation: 420,
    operationalRadiusM: 820,
    longitude: 71.2729,
    latitude: 29.1024,
    notes: "Rural fringe with livestock-associated dogs.",
  },
  {
    key: "uch-sharif",
    city: "Ahmedpur East",
    area: "Uch Sharif",
    province: "Punjab",
    label: "Uch Sharif, Ahmedpur East",
    tehsil: "Ahmedpur East",
    hotspotType: "Market / Bazaar",
    riskLevel: "High",
    estimatedDogPopulation: 340,
    operationalRadiusM: 738,
    longitude: 71.0658,
    latitude: 29.2362,
    notes: "Shrine pilgrimage town with food-waste hotspots.",
  },
  {
    key: "yazman-town",
    city: "Yazman",
    area: "Yazman Town",
    province: "Punjab",
    label: "Yazman Town, Yazman",
    tehsil: "Yazman",
    hotspotType: "Market / Bazaar",
    riskLevel: "High",
    estimatedDogPopulation: 480,
    operationalRadiusM: 876,
    longitude: 71.7498,
    latitude: 29.1216,
    notes: "Tehsil HQ and Cholistan gateway.",
  },
  {
    key: "khairpur-tamewali",
    city: "Khairpur Tamewali",
    area: "Khairpur Tamewali",
    province: "Punjab",
    label: "Khairpur Tamewali, Khairpur Tamewali",
    tehsil: "Khairpur Tamewali",
    hotspotType: "Market / Bazaar",
    riskLevel: "Medium",
    estimatedDogPopulation: 280,
    operationalRadiusM: 669,
    longitude: 72.2388,
    latitude: 29.5819,
    notes: "Tehsil HQ hotspot.",
  },
];

function normalizedText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function getDogLocationOptionByKey(key: string | null | undefined) {
  const normalizedKey = normalizedText(key);
  if (!normalizedKey) return null;
  return DOG_LOCATION_OPTIONS.find((option) => option.key === normalizedKey) ?? null;
}

export function findDogLocationOption(location: DogLocationLike) {
  const byKey = getDogLocationOptionByKey(location.locationKey);
  if (byKey) return byKey;

  const city = normalizedText(location.city);
  const area = normalizedText(location.area);
  const label = normalizedText(location.locationLabel);

  const byCityArea = DOG_LOCATION_OPTIONS.find(
    (option) => normalizedText(option.city) === city && normalizedText(option.area) === area,
  );
  if (byCityArea) return byCityArea;

  const byLabel = DOG_LOCATION_OPTIONS.find((option) => normalizedText(option.label) === label);
  if (byLabel) return byLabel;

  const latitude = typeof location.latitude === "number" ? location.latitude : null;
  const longitude = typeof location.longitude === "number" ? location.longitude : null;

  if (latitude === null || longitude === null || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  let closest: DogLocationOption | null = null;
  let smallestDistance = Number.POSITIVE_INFINITY;

  for (const option of DOG_LOCATION_OPTIONS) {
    const distance = Math.hypot(option.latitude - latitude, option.longitude - longitude);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closest = option;
    }
  }

  // Avoid force-mapping old out-of-region coordinates to a random Bahawalpur hotspot.
  return smallestDistance <= 0.25 ? closest : null;
}

export function groupDogLocationOptionsByCity() {
  const groups = new Map<string, DogLocationOption[]>();

  for (const option of DOG_LOCATION_OPTIONS) {
    const current = groups.get(option.city) ?? [];
    current.push(option);
    groups.set(option.city, current);
  }

  return Array.from(groups.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([city, options]) => ({
      city,
      options: options.sort((left, right) => left.area.localeCompare(right.area)),
    }));
}

export function createDogLocationEmbedUrl(location: Pick<DogLocationOption, "latitude" | "longitude" | "operationalRadiusM">) {
  const padding = Math.max(location.operationalRadiusM, 400) * 1.6;
  const latitudeDelta = padding / 111_320;
  const longitudeDelta = padding / (111_320 * Math.max(Math.cos((location.latitude * Math.PI) / 180), 0.2));

  const left = location.longitude - longitudeDelta;
  const right = location.longitude + longitudeDelta;
  const bottom = location.latitude - latitudeDelta;
  const top = location.latitude + latitudeDelta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`;
}

export function createDogLocationExternalMapUrl(location: Pick<DogLocationOption, "latitude" | "longitude">) {
  return `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=14/${location.latitude}/${location.longitude}`;
}
