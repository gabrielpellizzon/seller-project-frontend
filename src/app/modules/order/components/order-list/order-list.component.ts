import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  OrderRequest,
  OrderResponse,
  ProductOrderDto,
} from '../../interfaces/order.interface';
import { MatDialog } from '@angular/material/dialog';
import { OrderDataService } from '../../../../shared/order-data.component';
import { Subscription } from 'rxjs';
import { OrderCreateComponent } from '../order-create/order-create.component';
import { ProductOrderListComponent } from '../product-order-list/product-order-list.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit, OnDestroy {
  orderDataSource = new MatTableDataSource<OrderResponse>();
  displayedColumns = [
    'productList',
    'customerName',
    'customerEmail',
    'totalAmount',
    'date',
  ];
  searchOrderInput = '';
  filteredOrders: OrderResponse[] = [];

  orderEntries: OrderResponse[] = [];
  orderEntriesSub = new Subscription();

  constructor(
    private orderService: OrderDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.orderService.getOrderEntries();
    this.orderEntriesSub = this.orderService.orderSubject.subscribe(
      (entries) => {
        this.orderEntries = entries;
        this.orderDataSource.data = entries;
        this.filteredOrders = entries;
      }
    );
  }

  ngOnDestroy(): void {
    this.orderEntriesSub.unsubscribe();
  }

  openCreateOrderDialog() {
    const dialogRef = this.dialog.open(OrderCreateComponent, {
      width: '70%',
      maxWidth: '100vh',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((data: OrderRequest) => {
      if (data) {
        const orderToCreate: OrderRequest = data;
        this.orderService.createOrderEntry(orderToCreate);
      }
    });
  }

  getOrderCustomerName({ customerName }: OrderResponse) {
    return customerName;
  }

  getOrderCustomerEmail({ customerEmail }: OrderResponse) {
    return customerEmail;
  }

  getOrderTotalAmount({ totalAmount }: OrderResponse) {
    return totalAmount.toFixed(2);
  }

  getOrderDate({ created }: OrderResponse) {
    return created;
  }

  onSearchChange(searchValue: string) {
    this.searchOrderInput = searchValue;
    this.filterOrders();
  }

  openProductList(order: OrderResponse) {
    const groupedProducts: { [key: string]: ProductOrderDto } = {};

    order.products.forEach((product) => {
      if (groupedProducts[product.productId]) {
        groupedProducts[product.productId].quantity += product.quantity;
      } else {
        groupedProducts[product.productId] = { ...product };
      }
    });

    this.dialog.open(ProductOrderListComponent, {
      width: '70%',
      maxWidth: '100vh',
      disableClose: false,
      data: Object.values(groupedProducts),
    });
  }

  filterOrders() {
    if (this.searchOrderInput.trim() === '') {
      this.orderDataSource.data = this.filteredOrders;
    } else {
      this.orderDataSource.data = this.filteredOrders.filter(
        ({ customerName }) =>
          customerName
            .toLowerCase()
            .includes(this.searchOrderInput.toLowerCase())
      );
    }
  }
}
