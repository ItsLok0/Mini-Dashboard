import { Injectable } from '@angular/core';
import { Quote, QUOTES_FR } from '../store/QuoteStore';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  getDailyQuote(): Quote {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    return QUOTES_FR[dayOfYear % QUOTES_FR.length];
  }
}