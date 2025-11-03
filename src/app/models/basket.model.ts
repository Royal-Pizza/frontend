import { OrderLine } from "./orderLine.model";

export interface Basket {
  token: string;
  idCustomer: number;
  items: { [pizzaName: string]: OrderLine };
}