import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ProductRequest,
  ProductResponse,
} from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = '/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get<ProductResponse[]>(`${this.apiUrl}`);
  }

  getByIdProducts(id: string) {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  createProduct(farm: ProductRequest) {
    return this.http.post<ProductRequest>(this.apiUrl, farm);
  }

  updateProduct(id: string, farm: ProductRequest) {
    return this.http.put<ProductRequest>(`${this.apiUrl}/${id}`, farm);
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
