export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface ProductResponse extends ProductRequest {
  _id: string;
  created: Date;
  updated: Date;
  __v: number;
}
