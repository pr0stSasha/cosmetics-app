export interface User {
  id: string;
  email?: string;
  username?: string;
  isAdmin: boolean; 
}

export interface Product {
  id: string;
  name: string;
  brand: string | null;
  price: number;
  description: string | null;
  image_url: string;
  category: string | null;
}

export interface SurveyAnswers {
  [key: string]: boolean;
}
