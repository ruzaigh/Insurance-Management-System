import { Quote } from '../../../core/models/customer.model';
import { createReducer, on } from '@ngrx/store';
import * as QuoteActions from '../actions/quote.actions';
import * as CustomerActions from '../actions/customer.actions';

export interface QuoteState {
  quotes: Quote[];
  filteredQuotes?: Quote[];
}

export const initialQuoteState: QuoteState = {
  quotes: [],
  filteredQuotes: [],
};

export const quoteReducer = createReducer(
  initialQuoteState,

  on(QuoteActions.loadQuotesSuccess, (state, { quotes }) => ({
    ...state,
    quotes,
  })),

  on(QuoteActions.addQuoteSuccess, (state, { quote }) => ({
    ...state,
    quotes: [...state.quotes, quote],
  })),

  on(QuoteActions.updateQuoteSuccess, (state, { quote }) => ({
    ...state,
    quotes: state.quotes.map((q) => (q.id === quote.id ? quote : q)),
  })),

  on(QuoteActions.deleteQuoteSuccess, (state, { id }) => ({
    ...state,
    quotes: state.quotes.filter((q) => q.id !== id),
  })),

  on(CustomerActions.searchCustomersSuccess, (state, { searchTerm }) => {
    const term = searchTerm.toLowerCase().trim();

    // If search term is empty, don't filter
    if (!term) {
      return {
        ...state,
        filteredQuotes: [],
      };
    }

    // Filter quotes based on search term on ( customerFullName )
    const filteredQuotes = state.quotes.filter((quote) =>
      quote.customerFullName.toLowerCase().includes(term)
    );

    return {
      ...state,
      filteredQuotes,
    };
  })
);
