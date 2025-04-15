import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { Quote } from '../../../core/models/quote.model';
import { Customer } from '../../../core/models/customer.model';
import {
  loadCustomerQuotes,
  loadCustomerQuotesSuccess,
} from '../../../shared/store/actions/quote.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-customer-quotes',
  templateUrl: './customer-quotes.component.html',
  styleUrls: ['./customer-quotes.component.scss'],
})
export class CustomerQuotesComponent implements OnInit, OnDestroy {
  public customer: Customer;
  public quotes$!: Observable<Quote[]>;
  private subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private actions$: Actions,
    public dialogRef: MatDialogRef<CustomerQuotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer: Customer }
  ) {
    this.customer = data.customer;
  }

  ngOnInit(): void {
    this.store.dispatch(loadCustomerQuotes({ customerId: this.customer.id }));

    this.quotes$ = this.actions$.pipe(ofType(loadCustomerQuotesSuccess)).pipe(
      map(({ quotes }) => {
        return quotes;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  async viewQuote(quote: Quote) {
    this.dialogRef.close();
    await this.router.navigate(['/quotes'], { queryParams: { id: quote.id } });
  }
}
