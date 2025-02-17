import { AfterContentInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductOrderDto } from '../../interfaces/order.interface';
import { DialogRef } from '@angular/cdk/dialog';
import { ProductDataService } from '../../../../shared/product-data.component';
import { ProductResponse } from '../../../product/interfaces/product.interface';

@Component({
  selector: 'app-product-order-list',
  templateUrl: './product-order-list.component.html',
  styleUrl: './product-order-list.component.scss',
})
export class ProductOrderListComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ProductOrderDto[],
    private dialogRef: DialogRef<ProductOrderListComponent>,
    private productService: ProductDataService
  ) {}

  ngOnInit(): void {
    this.productService.getProductEntries();
  }

  getProductName({ productId }: ProductOrderDto) {
    const product: ProductResponse =
      this.productService.getProductEntry(productId);

    return product?.name;
  }

  onClose() {
    this.dialogRef.close();
  }
}
