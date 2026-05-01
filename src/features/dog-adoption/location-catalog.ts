export type DogLocationOption = {
  key: string;
  city: string;
  area: string;
  province: string;
  label: string;
  latitude: number;
  longitude: number;
  mapX: number;
  mapY: number;
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
    key: "islamabad-f10",
    city: "Islamabad",
    area: "F-10",
    province: "Islamabad Capital Territory",
    label: "Islamabad, F-10",
    latitude: 33.6938,
    longitude: 73.0137,
    mapX: 73,
    mapY: 17,
  },
  {
    key: "islamabad-g11",
    city: "Islamabad",
    area: "G-11",
    province: "Islamabad Capital Territory",
    label: "Islamabad, G-11",
    latitude: 33.7025,
    longitude: 72.9818,
    mapX: 70,
    mapY: 19,
  },
  {
    key: "rawalpindi-saddar",
    city: "Rawalpindi",
    area: "Saddar",
    province: "Punjab",
    label: "Rawalpindi, Saddar",
    latitude: 33.5963,
    longitude: 73.0479,
    mapX: 76,
    mapY: 23,
  },
  {
    key: "rawalpindi-bahria",
    city: "Rawalpindi",
    area: "Bahria Town",
    province: "Punjab",
    label: "Rawalpindi, Bahria Town",
    latitude: 33.5191,
    longitude: 73.1049,
    mapX: 78,
    mapY: 26,
  },
  {
    key: "peshawar-hayatabad",
    city: "Peshawar",
    area: "Hayatabad",
    province: "Khyber Pakhtunkhwa",
    label: "Peshawar, Hayatabad",
    latitude: 33.9977,
    longitude: 71.4628,
    mapX: 60,
    mapY: 14,
  },
  {
    key: "abbottabad-cantt",
    city: "Abbottabad",
    area: "Cantt",
    province: "Khyber Pakhtunkhwa",
    label: "Abbottabad, Cantt",
    latitude: 34.1688,
    longitude: 73.2215,
    mapX: 80,
    mapY: 11,
  },
  {
    key: "lahore-gulberg",
    city: "Lahore",
    area: "Gulberg",
    province: "Punjab",
    label: "Lahore, Gulberg",
    latitude: 31.5204,
    longitude: 74.3587,
    mapX: 78,
    mapY: 36,
  },
  {
    key: "lahore-johar-town",
    city: "Lahore",
    area: "Johar Town",
    province: "Punjab",
    label: "Lahore, Johar Town",
    latitude: 31.4697,
    longitude: 74.2728,
    mapX: 74,
    mapY: 39,
  },
  {
    key: "sialkot-cantt",
    city: "Sialkot",
    area: "Cantt",
    province: "Punjab",
    label: "Sialkot, Cantt",
    latitude: 32.4945,
    longitude: 74.5229,
    mapX: 83,
    mapY: 28,
  },
  {
    key: "faisalabad-d-ground",
    city: "Faisalabad",
    area: "D Ground",
    province: "Punjab",
    label: "Faisalabad, D Ground",
    latitude: 31.418,
    longitude: 73.0791,
    mapX: 67,
    mapY: 43,
  },
  {
    key: "multan-cantt",
    city: "Multan",
    area: "Cantt",
    province: "Punjab",
    label: "Multan, Cantt",
    latitude: 30.1575,
    longitude: 71.5249,
    mapX: 50,
    mapY: 50,
  },
  {
    key: "bahawalpur-satellite-town",
    city: "Bahawalpur",
    area: "Satellite Town",
    province: "Punjab",
    label: "Bahawalpur, Satellite Town",
    latitude: 29.3956,
    longitude: 71.6836,
    mapX: 58,
    mapY: 49,
  },
  {
    key: "quetta-jinnah-town",
    city: "Quetta",
    area: "Jinnah Town",
    province: "Balochistan",
    label: "Quetta, Jinnah Town",
    latitude: 30.1798,
    longitude: 66.975,
    mapX: 26,
    mapY: 57,
  },
  {
    key: "sukkur-cantt",
    city: "Sukkur",
    area: "Cantt",
    province: "Sindh",
    label: "Sukkur, Cantt",
    latitude: 27.706,
    longitude: 68.8574,
    mapX: 51,
    mapY: 59,
  },
  {
    key: "hyderabad-latifabad",
    city: "Hyderabad",
    area: "Latifabad",
    province: "Sindh",
    label: "Hyderabad, Latifabad",
    latitude: 25.3792,
    longitude: 68.3683,
    mapX: 60,
    mapY: 77,
  },
  {
    key: "karachi-clifton",
    city: "Karachi",
    area: "Clifton",
    province: "Sindh",
    label: "Karachi, Clifton",
    latitude: 24.8138,
    longitude: 67.0308,
    mapX: 56,
    mapY: 87,
  },
  {
    key: "karachi-gulshan",
    city: "Karachi",
    area: "Gulshan-e-Iqbal",
    province: "Sindh",
    label: "Karachi, Gulshan-e-Iqbal",
    latitude: 24.9208,
    longitude: 67.0921,
    mapX: 59,
    mapY: 84,
  },
  {
    key: "karachi-dha",
    city: "Karachi",
    area: "DHA",
    province: "Sindh",
    label: "Karachi, DHA",
    latitude: 24.8124,
    longitude: 67.0667,
    mapX: 61,
    mapY: 88,
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
    (option) =>
      normalizedText(option.city) === city &&
      normalizedText(option.area) === area
  );
  if (byCityArea) return byCityArea;

  const byLabel = DOG_LOCATION_OPTIONS.find((option) => normalizedText(option.label) === label);
  if (byLabel) return byLabel;

  const byCity = DOG_LOCATION_OPTIONS.find((option) => normalizedText(option.city) === city);
  if (byCity) return byCity;

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

  return closest;
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
