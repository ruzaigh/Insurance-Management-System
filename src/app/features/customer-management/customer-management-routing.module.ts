import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CustomerManagementComponent } from './customer-management.component';

const routes: Routes = [{ path: '', component: CustomerManagementComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerManagementRoutingModule {}
