import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { QuoteManagementComponent } from './quote-management.component';

const routes: Routes = [{ path: '', component: QuoteManagementComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuoteManagementRoutingModule {}
