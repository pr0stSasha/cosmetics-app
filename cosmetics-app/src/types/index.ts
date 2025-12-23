export interface User {
  id: string;
  email?: string;
  username?: string;
  isAdmin: boolean; 
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  skin_type: string[];
  budget_segment: string;
  category_type: string;
}

export interface SurveyAnswers {
  [key: string]: boolean;
}
