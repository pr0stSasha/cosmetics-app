export interface AppUser {
  id: string;
  username: string;
  isAdmin: boolean;
  skin_type?: string;
  age?: number;
  full_name?: string;
  care_type?: string[];
  preference_type?: string;
  color_type?: string;
  skin_problem?: string[];
  budget_segment?: string;
}

export interface Product {
  id: string;
  name: string;
  product_url: string;
  price: number;
  category_type: 'care' | 'makeup'; 
  skin_type: string[];
  budget_segment: 'budget' | 'medium' | 'luxury';
  image_url: string;
  description?: string;
}