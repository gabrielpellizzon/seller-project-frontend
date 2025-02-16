import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';
import { SharedModule } from '../../shared/shared.module';
import { TemplateModule } from '../../template/template.module';

@NgModule({
  declarations: [ProductViewComponent, ProductListComponent],
  imports: [CommonModule, ProductRoutingModule, SharedModule, TemplateModule],
})
export class ProductModule {}
