export type MockDog = {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  story: string;
  imageUrl: string;
};

export const mockDogs: MockDog[] = [
  {
    id: "milo",
    name: "Milo",
    breed: "Labrador mix",
    age: "2 years",
    location: "City shelter, Lahore",
    story: "Gentle, leash-trained, and happiest when he has a person to follow around.",
    imageUrl: "/hero-sequence/ezgif-frame-018.jpg",
  },
  {
    id: "luna",
    name: "Luna",
    breed: "Indie street rescue",
    age: "1 year",
    location: "Foster home, Islamabad",
    story: "A calm companion who warms up quickly and loves slow evening walks.",
    imageUrl: "/hero-sequence/ezgif-frame-046.jpg",
  },
  {
    id: "rio",
    name: "Rio",
    breed: "Shepherd mix",
    age: "3 years",
    location: "Rescue center, Karachi",
    story: "Alert, smart, and ready for a family that wants a loyal running buddy.",
    imageUrl: "/hero-sequence/ezgif-frame-079.jpg",
  },
  {
    id: "poppy",
    name: "Poppy",
    breed: "Terrier mix",
    age: "10 months",
    location: "Temporary foster, Multan",
    story: "Playful, curious, and always the first to greet visitors with a wag.",
    imageUrl: "/hero-sequence/ezgif-frame-112.jpg",
  },
  {
    id: "noor",
    name: "Noor",
    breed: "Mixed breed",
    age: "4 years",
    location: "Shelter outreach, Faisalabad",
    story: "Easygoing, affectionate, and ideal for a home with a steady routine.",
    imageUrl: "/hero-sequence/ezgif-frame-151.jpg",
  },
  {
    id: "archie",
    name: "Archie",
    breed: "Hound mix",
    age: "5 years",
    location: "Adoption partner, Rawalpindi",
    story: "A wise old soul with a soft spot for treats and quiet company.",
    imageUrl: "/hero-sequence/ezgif-frame-198.jpg",
  },
];
