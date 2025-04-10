import {createFeatureSelector, createSelector} from "@ngrx/store";
import {QuoteState} from "../reducers/quote.reducer";

export const selectQuoteState = createFeatureSelector<QuoteState>('quote');

export const selectAllQuotes = createSelector(
  selectQuoteState,
  (state: QuoteState) => state.quotes
);

export const selectQuoteLoading = createSelector(
  selectQuoteState,
  (state: QuoteState) => state.loading
);

export const selectQuoteError = createSelector(
  selectQuoteState,
  (state: QuoteState) => state.error
);

export const selectSelectedQuoteId = createSelector(
  selectQuoteState,
  (state: QuoteState) => state.selectedQuoteId
);

export const selectSelectedQuote = createSelector(
  selectAllQuotes,
  selectSelectedQuoteId,
  (quotes, selectedId) =>
    selectedId ? quotes.find(quote => quote.id === selectedId) : null
);

export const selectFilteredCustomerId = createSelector(
  selectQuoteState,
  (state: QuoteState) => state.filteredCustomerId
);

export const selectFilteredQuotes = createSelector(
  selectAllQuotes,
  selectFilteredCustomerId,
  (quotes, customerId) =>
    customerId ? quotes.filter(quote => quote.customerId === customerId) : quotes
);
