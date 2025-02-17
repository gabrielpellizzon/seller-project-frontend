import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  ProductRequest,
  ProductResponse,
} from '../../interfaces/product.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ProductDataService } from '../../../../shared/product-data.component';
import { Subscription } from 'rxjs';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  productDataSource = new MatTableDataSource<ProductResponse>();
  displayedColumns = ['name', 'description', 'quantity', 'price', 'actions'];
  searchProductInput = '';
  filteredProducts: ProductResponse[] = [];

  productEntries: ProductResponse[] = [];
  productEntriesSub = new Subscription();

  constructor(
    private productService: ProductDataService,
    private dialog: MatDialog
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

  openCreateProductDialog(productData?: ProductResponse) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '70%',
      maxWidth: '100vh',
      disableClose: false,
      data: productData || {},
    });

    dialogRef.afterClosed().subscribe((data: ProductRequest) => {
      if (data) {
        if (!productData) {
          const productToCreate: ProductRequest = data;
          this.productService.createProductEntry(productToCreate);
        } else {
          const farmToUpdate: ProductResponse = {
            ...productData,
            name: data.name,
            description: data.description,
            quantity: +data.quantity,
            price: +data.price,
          };

          this.productService.updateProductEntry(productData._id, farmToUpdate);
        }
      }
    });
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

  openConfirmationDialog(element: ProductResponse) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      disableClose: false,
      data: { title: element.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProduct(element._id);
      }
    });
  }

  deleteProduct(id: string) {
    this.productService.deleteProductEntry(id);
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
}
