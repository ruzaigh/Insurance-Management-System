import { createAction, props } from '@ngrx/store';
import { Quote } from '../../../core/models/quote.model';

export const loadQuotes = createAction('[Quote] Load Quotes');
export const loadQuotesSuccess = createAction(
  '[Quote] Load Quotes Success',
  props<{ quotes: Quote[] }>()
);
export const loadQuotesFailure = createAction(
  '[Quote] Load Quotes Failure',
  props<{ error: any }>()
);

export const addQuote = createAction(
  '[Quote] Add Quote',
  props<{ quote: Quote }>()
);
export const addQuoteSuccess = createAction(
  '[Quote] Add Quote Success',
  props<{ quote: Quote }>()
);
export const addQuoteFailure = createAction(
  '[Quote] Add Quote Failure',
  props<{ error: any }>()
);
export const updateQuote = createAction(
  '[Quote] Update Quote',
  props<{ quote: Quote }>()
);
export const updateQuoteSuccess = createAction(
  '[Quote] Update Quote Success',
  props<{ quote: Quote }>()
);

export const updateQuoteFailure = createAction(
  '[Quote] Update Quote Failure',
  props<{ error: any }>()
);

export const deleteQuote = createAction(
  '[Quote] Delete Quote',
  props<{ id: string }>()
);
export const deleteQuoteSuccess = createAction(
  '[Quote] Delete Quote Success',
  props<{ id: string }>()
);

export const deleteQuoteFailure = createAction(
  '[Quote] Delete Quote Failure',
  props<{ error: any }>()
);

export const loadCustomerQuotes = createAction(
  '[Quote] Load Customer Quotes',
  props<{ customerId: string }>()
);

export const loadCustomerQuotesSuccess = createAction(
  '[Quote] Load Customer Quotes Success',
  props<{ quotes: Quote[] }>()
);

export const loadCustomerQuotesFailure = createAction(
  '[Quote] Load Customer Quotes Failure',
  props<{ error: any }>()
);

export const loadSelectedCustomerQuotes = createAction(
  '[Quote] Load Selected Customer Quotes',
  props<{ id: string }>()
);

export const loadSelectedCustomerQuotesSuccess = createAction(
  '[Quote] Load Selected Customer Quotes Success',
  props<{ quote: Quote[] }>()
);

export const loadSelectedCustomerQuotesFailure = createAction(
  '[Quote] Load Selected Customer Quotes Failure',
  props<{ error: any }>()
);
