export interface Pizza {
  idPizza: number;
  namePizza: string;
  pricePizza: { [key: string]: number };
  ingredients: string[];
  image: any;
  available: boolean;
}
