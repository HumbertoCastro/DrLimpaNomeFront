export interface User {
  id: string;
  name?: string;
  avatar?: string;
  documet?: string;
  saldo?: number;
  createdAt?: Date;
  email?: string;

  [key: string]: unknown;
}
