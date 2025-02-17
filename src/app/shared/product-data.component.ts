import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ProductResponse,
  ProductRequest,
} from '../modules/product/interfaces/product.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
  private readonly apiUrl = '/api/products';

  public productSubject = new Subject<ProductResponse[]>();
  private productEntries: ProductResponse[] = [];

  constructor(private http: HttpClient) {}

  getProductEntries() {
    this.http
      .get<ProductResponse[]>(this.apiUrl)
      .pipe()
      .subscribe((response) => {
        this.productEntries = response;
        this.productSubject.next(this.productEntries);
      });
  }

  getProductEntry(id: string) {
    const index = this.productEntries.findIndex((entry) => {
      return entry._id == id;
    });
    return this.productEntries[index];
  }

  createProductEntry(productEntry: ProductRequest) {
    this.http.post<ProductRequest>(this.apiUrl, productEntry).subscribe(() => {
      this.getProductEntries();
    });
  }

  updateProductEntry(id: string, productEntry: ProductRequest) {
    this.http
      .put<ProductRequest>(`${this.apiUrl}/${id}`, productEntry)
      .subscribe(() => {
        this.getProductEntries();
      });
  }

  deleteProductEntry(id: string) {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe(() => {
      this.getProductEntries();
    });
  }
}
