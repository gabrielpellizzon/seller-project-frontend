import { ProductResponse } from '../../product/interfaces/product.interface';

interface ProductOrderDto {
  productId: string;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  customerEmail: string;
  products: ProductOrderDto[];
}

export interface OrderResponse extends OrderRequest {
  _id: string;
  created: Date;
  updated: Date;
  totalAmount: number;
  __v: number;
}

export interface CartItem extends ProductResponse {
  quantityItem: number;
}
