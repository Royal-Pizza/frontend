export interface Pizza {
  idPizza: number;
  namePizza: string;
  pricePizza: number;
  image: any;
}

export interface DetailledPizza {
  idPizza: number;
  namePizza: string;
  pricePizza: Map<string, number>;
  ingredients: string[];
  image: any;
}
