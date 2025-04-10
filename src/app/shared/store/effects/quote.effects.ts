import {Store} from "@ngrx/store";
import {QuoteService} from "../../../core/services/quote.service";
import {Actions, createEffect} from "@ngrx/effects";
import * as QuoteActions from '../actions/quote.actions';
import {Injectable} from "@angular/core";

@Injectable()
export class QuoteEffects {


  constructor(
    private actions$: Actions,
    private quoteService: QuoteService,
    private store: Store
  ) {}
}
