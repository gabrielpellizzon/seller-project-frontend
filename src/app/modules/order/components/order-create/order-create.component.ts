import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductResponse } from '../../../product/interfaces/product.interface';
import { Subscription } from 'rxjs';
import { ProductDataService } from '../../../../shared/product-data.component';
import { CartItem } from '../../interfaces/order.interface';

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
  cartList: CartItem[] = [];

  productEntries: ProductResponse[] = [];
  productEntriesSub = new Subscription();

  constructor(private productService: ProductDataService) {}

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
    const currentCart = this.cartList || [];
    const existingProductIndex = currentCart.findIndex(
      (product) => product._id === productRow._id
    );

    if (existingProductIndex !== -1) {
      currentCart[existingProductIndex].quantityItem += 1;
      this.cartList.push(...currentCart);
    } else {
      this.cartList.push(...currentCart, { ...productRow, quantityItem: 1 });
      console.log(this.cartList);
    }
  }

  removeProductFromCart(productId: string) {
    const currentCart = this.cartList;
    const existingProductIndex = currentCart.findIndex(
      (product) => product._id === productId
    );

    if (existingProductIndex !== -1) {
      const updatedCart = [...currentCart];

      if (updatedCart[existingProductIndex].quantityItem > 1) {
        updatedCart[existingProductIndex].quantityItem -= 1;
      } else {
        updatedCart.splice(existingProductIndex, 1);
      }

      this.cartList.push(...updatedCart);
    }
  }

  getCartItemQuantity(productId: string): number {
    return (
      this.cartList?.find((item) => item._id === productId)?.quantityItem || 0
    );
  }

  onPurschase() {}
}
