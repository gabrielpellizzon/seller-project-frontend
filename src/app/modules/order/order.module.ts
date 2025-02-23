import { NgModule } from '@angular/core';
import { OrderViewComponent } from './pages/order-view/order-view.component';
import { OrderCreateComponent } from './components/order-create/order-create.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { TemplateModule } from '../../template/template.module';
import { ProductOrderListComponent } from './components/product-order-list/product-order-list.component';

@NgModule({
  declarations: [OrderViewComponent, OrderListComponent, OrderCreateComponent, ProductOrderListComponent],
  imports: [CommonModule, OrderRoutingModule, SharedModule, TemplateModule],
})
export class OrderModule {}
