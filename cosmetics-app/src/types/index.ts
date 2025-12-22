export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  survey?: SurveyAnswers;
}

export interface Product {
  id: string;
  name: string;
  category: string;
}

export interface SurveyAnswers {
  [key: string]: boolean;
}
