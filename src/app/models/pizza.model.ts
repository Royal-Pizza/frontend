export interface Pizza {
  idPizza: number;
  namePizza: string;
  pricePizza: { [key: string]: number };
  ingredients: string[];
  image: any;
  available: boolean;
}

export interface UpdatedPizza {
  idPizza: number;
  namePizza: string;
  pricePizza: number ;
  ingredients: string[];
  image: any;
  available: boolean;
}

export interface NewPizza {
  namePizza: string;
  pricePizza: number
  ingredients: string[];
  image: any;
}
