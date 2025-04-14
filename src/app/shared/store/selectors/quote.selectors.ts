import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuoteState } from '../reducers/quote.reducer';

export const selectQuoteState = createFeatureSelector<QuoteState>('quote');

export const selectAllQuotes = createSelector(
  selectQuoteState,
  (state: QuoteState) => {
    // If filteredQuotes exists and has quote use filteredQuotes
    if (state.filteredQuotes && state.filteredQuotes.length > 0) {
      return state.filteredQuotes;
    }
    // Otherwise return all quotes
    return state.quotes;
  }
);
