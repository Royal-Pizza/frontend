export interface NewCustomer {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}

export interface Customer {
  idCustomer: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  wallet: number;
  isAdmin: boolean;
}

export interface LoginDTO {
  email: string;
  password: string;
}
