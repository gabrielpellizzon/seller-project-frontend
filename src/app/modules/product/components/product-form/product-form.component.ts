import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductResponse } from '../../interfaces/product.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  productFormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ProductResponse,
    private dialogRef: MatDialogRef<ProductFormComponent>
  ) {
    this.productFormGroup = new FormGroup({
      name: new FormControl<string>(
        { value: '', disabled: false },
        { nonNullable: true, validators: Validators.required }
      ),
      description: new FormControl<string | undefined>(
        { value: undefined, disabled: false },
        { nonNullable: false }
      ),
      quantity: new FormControl<number>(
        { value: 1, disabled: false },
        { nonNullable: true, validators: Validators.required }
      ),
      price: new FormControl<number>(
        { value: 0, disabled: false },
        { nonNullable: true, validators: Validators.required }
      ),
    });

    if (!!Object.keys(this.data)?.length) {
      this.populateForms(this.data);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onAdd() {
    if (this.productFormGroup.valid) {
      this.dialogRef.close(this.productFormGroup.getRawValue());
    }
  }

  private populateForms(data: ProductResponse) {
    this.productFormGroup.controls.name.setValue(data.name);
    this.productFormGroup.controls.description.setValue(data.description);
    this.productFormGroup.controls.quantity.setValue(data.quantity);
    this.productFormGroup.controls.price.setValue(data.price);
  }
}
