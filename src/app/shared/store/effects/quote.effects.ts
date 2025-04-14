import { QuoteService } from '../../../core/services/quote.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as QuoteActions from '../actions/quote.actions';
import { Injectable } from '@angular/core';
import { catchError, map, of, switchMap } from 'rxjs';
import { Quote } from '../../../core/models/customer.model';

@Injectable()
export class QuoteEffects {
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.loadQuotes),
      switchMap(() =>
        this.quoteService.getQuotes().pipe(
          map((quotes) => QuoteActions.loadQuotesSuccess({ quotes })),
          catchError((error) => of(QuoteActions.loadQuotesFailure(error)))
        )
      )
    )
  );

  addQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.addQuote),
      switchMap((action: { quote: Quote }) =>
        this.quoteService.addQuote(action.quote).pipe(
          map((id) => QuoteActions.addQuoteSuccess({ quote: action.quote })),
          catchError((error) => of(QuoteActions.addQuoteFailure({ error })))
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.updateQuote),
      switchMap((action: { quote: Quote }) =>
        this.quoteService.updateQuote(action.quote).pipe(
          map((quote) => QuoteActions.updateQuoteSuccess({ quote })),
          catchError((error) => of(QuoteActions.updateQuoteFailure({ error })))
        )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.deleteQuote),
      switchMap((action: { id: string }) =>
        this.quoteService.deleteQuote(action.id).pipe(
          map((id) => QuoteActions.deleteQuoteSuccess({ id: action.id })),
          catchError((error) => of(QuoteActions.deleteQuoteFailure({ error })))
        )
      )
    )
  );
  constructor(private actions$: Actions, private quoteService: QuoteService) {}
}
