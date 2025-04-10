import {Quote} from "../models/customer.model";
import {catchError, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private quotesUrl = 'assets/data/quotes.json';

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<Quote[]> {
    return this.http.get<{ quotes: Quote[] }>(this.quotesUrl)
      .pipe(
        map(response => response.quotes),
        catchError(this.handleError<Quote[]>('getQuotes', []))
      );
  }

  getQuotesByCustomerId(customerId: string): Observable<Quote[]> {
    return this.getQuotes()
      .pipe(
        map(quotes => quotes.filter(quote => quote.customerId === customerId)),
        catchError(this.handleError<Quote[]>(`getQuotesByCustomerId customerId=${customerId}`, []))
      );
  }

  getQuoteById(id: string): Observable<Quote | undefined> {
    return this.getQuotes()
      .pipe(
        map(quotes => quotes.find(quote => quote.id === id)),
        catchError(this.handleError<Quote | undefined>(`getQuote id=${id}`))
      );
  }

  addQuote(quote: Quote): Observable<Quote> {
    // In a real app, this would be an HTTP POST
    const newQuote = {
      ...quote,
      id: quote.id,
      createdDate: quote.createdDate || new Date().toISOString()
    };
    return of(newQuote);
  }

  updateQuote(quote: Quote): Observable<Quote> {
    // In a real app, this would be an HTTP PUT
    return of(quote);
  }

  deleteQuote(id: string): Observable<string> {
    // In a real app, this would be an HTTP DELETE
    return of(id);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
