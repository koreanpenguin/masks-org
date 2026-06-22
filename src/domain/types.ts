export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  category: string;
  badge: string | null;
  description: string;
  ingredients: string[];
  skinType: string[];
  howToUse: string;
  image: string;
  images: string[];
  inStock: boolean;
  quantity: number;
  packSize: number;
  iconType: string;
  cardColor: string;
  tagline?: string;
  asin?: string;
  featured?: boolean;
  comingSoon?: boolean;
  brand?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = "All" | "Sheet";
