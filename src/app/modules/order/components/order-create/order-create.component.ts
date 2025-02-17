import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductResponse } from '../../../product/interfaces/product.interface';
import { Subscription } from 'rxjs';
import { ProductDataService } from '../../../../shared/product-data.component';
import {
  OrderRequest,
  ProductOrderDto,
} from '../../interfaces/order.interface';
import { OrderDataService } from '../../../../shared/order-data.component';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss',
})
export class OrderCreateComponent implements OnInit, OnDestroy {
  productDataSource = new MatTableDataSource<ProductResponse>();
  displayedColumns = ['name', 'description', 'price', 'actions'];
  searchProductInput = '';
  filteredProducts: ProductResponse[] = [];
  cartList: ProductResponse[] = [];

  productEntries: ProductResponse[] = [];
  productEntriesSub = new Subscription();

  constructor(
    private productService: ProductDataService,
    private orderService: OrderDataService
  ) {}

  ngOnInit(): void {
    this.productService.getProductEntries();
    this.productEntriesSub = this.productService.productSubject.subscribe(
      (entries) => {
        this.productEntries = entries;
        this.productDataSource.data = entries;
        this.filteredProducts = entries;
      }
    );
  }

  ngOnDestroy(): void {
    this.productEntriesSub.unsubscribe();
  }

  getProductName({ name }: ProductResponse) {
    return name;
  }

  getProductDescription({ description }: ProductResponse) {
    return description;
  }

  getProductQuantity({ quantity }: ProductResponse) {
    return quantity;
  }

  getProductPrice({ price }: ProductResponse) {
    return price;
  }

  onSearchChange(searchValue: string) {
    this.searchProductInput = searchValue;
    this.filterProducts();
  }

  filterProducts() {
    if (this.searchProductInput.trim() === '') {
      this.productDataSource.data = this.filteredProducts;
    } else {
      this.productDataSource.data = this.filteredProducts.filter(({ name }) =>
        name.toLowerCase().includes(this.searchProductInput.toLowerCase())
      );
    }
  }

  addProductIntoCart(productRow: ProductResponse) {
    this.cartList = [...this.cartList, { ...productRow }];
  }

  removeProductFromCart(productId: string) {
    const indexToRemove = this.cartList.findIndex(
      (item) => item._id === productId
    );

    if (indexToRemove !== -1) {
      this.cartList = this.cartList.filter(
        (_, index) => index !== indexToRemove
      );
    }
  }

  getCartItemQuantity(productId: string): number {
    return this.cartList.filter((item) => item._id === productId).length;
  }

  onPurschase() {
    let productToBuy: ProductOrderDto[] = [];
    this.cartList.map((product) => {
      productToBuy.push({ productId: product._id, quantity: 1 });
    });

    const orderData: OrderRequest = {
      customerName: 'Teste',
      customerEmail: 'teste@email.com',
      products: productToBuy,
    };

    this.orderService.createOrderEntry(orderData);
  }
}
