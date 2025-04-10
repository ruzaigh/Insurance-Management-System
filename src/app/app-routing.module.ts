import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: 'customers',
    loadChildren: () => import('./features/customer-management/customer-management.module').then(m => m.CustomerManagementModule)
  },
  // {
  //   path: 'quotes',
  //   loadChildren: () => import('./features/quote-management/quote-management.module').then(m => m.QuoteManagementModule)
  // },
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: '**', redirectTo: '/customers' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
