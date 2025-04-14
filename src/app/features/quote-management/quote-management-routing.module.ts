import { RouterModule, Routes } from '@angular/router';
import { QuoteListComponent } from './quote-list/quote-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: QuoteListComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuoteManagementRoutingModule {}
