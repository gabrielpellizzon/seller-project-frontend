import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  OrderResponse,
  OrderRequest,
} from '../modules/order/interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderDataService {
  private readonly apiUrl = '/api/orders';

  public orderSubject = new Subject<OrderResponse[]>();
  private orderEntries: OrderResponse[] = [];

  constructor(private http: HttpClient) {}

  getOrderEntries() {
    this.http
      .get<OrderResponse[]>(this.apiUrl)
      .pipe()
      .subscribe((response) => {
        this.orderEntries = response;
        this.orderSubject.next(this.orderEntries);
      });
  }

  createOrderEntry(orderEntry: OrderRequest) {
    this.http.post<OrderRequest>(this.apiUrl, orderEntry).subscribe(() => {
      this.getOrderEntries();
    });
  }
}
