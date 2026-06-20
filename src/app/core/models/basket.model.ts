import { AdaptedOrderLine } from "./orderLine.model";

export interface Basket {
  token: string;
  idCustomer: number;
  items: { [pizzaName: string]: AdaptedOrderLine };
}

export type BasketData = { [key: string]: AdaptedOrderLine[] };