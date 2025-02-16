import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductResponse } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  productDataSource = new MatTableDataSource<ProductResponse>();
  displayedColumns = ['name', 'description', 'quantity', 'price', 'actions'];
  searchProductInput = '';
  filteredProducts: ProductResponse[] = [];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProductList();
  }

  getProductList() {
    this.productService.getAllProducts().subscribe({
      next: (productList) => {
        console.log(productList);
        this.productDataSource.data = productList;
        this.filteredProducts = productList;
      },
      error: () => alert('Load error'),
    });
  }

  openCreateProductDialog() {
    throw new Error('Method not implemented.');
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

  deleteProduct(_id: string) {
    this.productService.deleteProduct(_id).subscribe({
      error: () => alert('Delete error'),
      complete: () => {
        alert('Delete success');
        this.getProductList();
      },
    });
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
