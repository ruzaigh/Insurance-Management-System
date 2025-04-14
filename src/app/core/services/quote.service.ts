import { Quote } from '../models/customer.model';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private quotesUrl = 'assets/data/quotes.json';

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<Quote[]> {
    return this.http.get<{ quotes: Quote[] }>(this.quotesUrl).pipe(
      // to display my loading state
      delay(1000),
      map((response) => response.quotes)
    );
  }

  addQuote(quote: Quote): Observable<Quote> {
    const newQuote = {
      ...quote,
      id: quote.id,
      createdDate: quote.createdDate || new Date().toISOString(),
    };
    return of(newQuote);
  }

  updateQuote(quote: Quote): Observable<Quote> {
    return of(quote);
  }

  deleteQuote(id: string): Observable<string> {
    return of(id);
  }
}
