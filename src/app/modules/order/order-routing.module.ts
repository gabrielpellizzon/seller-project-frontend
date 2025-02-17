import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderViewComponent } from './pages/order-view/order-view.component';

const routes: Routes = [{ path: '', component: OrderViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
