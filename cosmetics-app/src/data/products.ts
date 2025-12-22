export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  suitableFor: string[];
  colorType?: string;
  image: string;
}

export const productsDB: Product[] = [
  {
    id: 1,
    name: "Ультра-увлажняющий крем",
    price: 1500,
    category: "Уход",
    suitableFor: ["Сухая", "Нормальная"],
    image: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Матирующая сыворотка",
    price: 1800,
    category: "Сыворотки",
    suitableFor: ["Жирная", "Комбинированная"],
    image: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    name: "Мицеллярная вода Soft",
    price: 600,
    category: "Очищение",
    suitableFor: ["Все"],
    image: "https://via.placeholder.com/150"
  },
  {
    id: 4,
    name: "Помада 'Холодный красный'",
    price: 900,
    category: "Макияж",
    suitableFor: ["Все"],
    colorType: "Зима",
    image: "https://via.placeholder.com/150"
  }
];