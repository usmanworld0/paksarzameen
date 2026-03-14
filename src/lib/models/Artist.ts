/**
 * Artist model representing featured artisans in the Paksarzameen Store marketplace.
 */

export interface Artist {
  id: string;
  name: string;
  slug: string;
  region: string;
  specialty: string;
  bio: string;
  description: string;
  image: string;
  products: number; // Number of products they have in the marketplace
  featured: boolean;
}
