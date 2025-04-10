import {Quote} from "../../../core/models/customer.model";
import {createReducer, on} from "@ngrx/store";
import * as QuoteActions from '../actions/quote.actions';

export interface QuoteState {
  quotes: Quote[];
  selectedQuoteId: string | null;
  loading: boolean;
  error: any;
  filteredCustomerId: string | null;
}

export const initialQuoteState: QuoteState = {
  quotes: [],
  selectedQuoteId: null,
  loading: false,
  error: null,
  filteredCustomerId: null
};

export const quoteReducer = createReducer(
  initialQuoteState,

  on(QuoteActions.loadQuotes, state => ({
    ...state,
    loading: true,
    error: null,
    filteredCustomerId: null
  })),

  on(QuoteActions.loadQuotesSuccess, (state, { quotes }) => ({
    ...state,
    quotes,
    loading: false
  })),

  on(QuoteActions.loadQuotesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(QuoteActions.loadCustomerQuotes, (state, { customerId }) => ({
    ...state,
    filteredCustomerId: customerId,
    loading: true
  })),

  on(QuoteActions.selectQuote, (state, { id }) => ({
    ...state,
    selectedQuoteId: id
  })),

  on(QuoteActions.addQuoteSuccess, (state, { quote }) => ({
    ...state,
    quotes: [...state.quotes, quote]
  })),

  on(QuoteActions.updateQuoteSuccess, (state, { quote }) => ({
    ...state,
    quotes: state.quotes.map(q =>
      q.id === quote.id ? quote : q
    )
  })),

  on(QuoteActions.deleteQuoteSuccess, (state, { id }) => ({
    ...state,
    quotes: state.quotes.filter(q => q.id !== id),
    selectedQuoteId: state.selectedQuoteId === id ? null : state.selectedQuoteId
  }))
);
