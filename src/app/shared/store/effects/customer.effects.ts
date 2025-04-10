import { Injectable } from '@angular/core';
import * as CustomerActions from '../actions/customer.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CustomerService } from '../../../core/services/customer.service';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class CustomerEffects {
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      switchMap(() =>
        this.customerService.getCustomers().pipe(
          map((customers) =>
            CustomerActions.loadCustomersSuccess({ customers })
          ),
          catchError((error) => of(CustomerActions.loadCustomersFailure(error)))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private customerService: CustomerService
  ) {}
}
