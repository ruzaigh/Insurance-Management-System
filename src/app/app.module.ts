import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { quoteReducer } from './shared/store/reducers/quote.reducer';
import { customerReducer } from './shared/store/reducers/customer.reducers';
import { QuoteEffects } from './shared/store/effects/quote.effects';
import { CustomerEffects } from './shared/store/effects/customer.effects';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CustomerManagementModule } from './features/customer-management/customer-management.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(
      {
        customer: customerReducer,
        quote: quoteReducer,
      },
      {}
    ),
    EffectsModule.forRoot([CustomerEffects, QuoteEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    MatToolbarModule,
    RouterOutlet,
    HttpClientModule,
    AppRoutingModule,
    CustomerManagementModule,
    MatSnackBarModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
