import { Injectable } from '@angular/core';
import * as CustomerActions from '../actions/customer.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CustomerService } from '../../../core/services/customer.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { Customer } from '../../../core/models/customer.model';

@Injectable()
export class CustomerEffects {
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      switchMap(() =>
        this.customerService.getCustomers().pipe(
          map((customers) =>
            CustomerActions.loadCustomersSuccess({ customers }),
          ),
          catchError((error) =>
            of(CustomerActions.loadCustomersFailure(error)),
          ),
        ),
      ),
    ),
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      switchMap((action: { customer: Customer }) =>
        this.customerService.updateCustomer(action.customer).pipe(
          map((customer) =>
            CustomerActions.updateCustomerSuccess({ customer }),
          ),
          catchError((error) =>
            of(CustomerActions.updateCustomerFailure({ error })),
          ),
        ),
      ),
    ),
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomer),
      switchMap((action: { id: string }) =>
        this.customerService.deleteCustomer(action.id).pipe(
          map((id) => CustomerActions.deleteCustomerSuccess({ id: action.id })),
          catchError((error) =>
            of(CustomerActions.deleteCustomerFailure({ error })),
          ),
        ),
      ),
    ),
  );

  addCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.addCustomer),
      switchMap((action: { customer: Customer }) =>
        this.customerService.addCustomer(action.customer).pipe(
          map((id) =>
            CustomerActions.addCustomerSuccess({ customer: action.customer }),
          ),
          catchError((error) =>
            of(CustomerActions.addCustomerFailure({ error })),
          ),
        ),
      ),
    ),
  );

  searchCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.searchCustomers),
      map((action) =>
        CustomerActions.searchCustomersSuccess({
          searchTerm: action.searchTerm,
        }),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private customerService: CustomerService,
  ) {}
}
