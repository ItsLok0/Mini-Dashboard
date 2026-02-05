import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../../../app/services/quote';

@Component({
  selector: 'app-daily-quote',
  imports: [],
  templateUrl: './daily-quote.html',
  styleUrl: './daily-quote.scss',
})
export class DailyQuote implements OnInit {
  private quoteService: QuoteService;
  quote: any;

  constructor(quoteService: QuoteService) {
    this.quoteService = quoteService;
  }

  ngOnInit(): void {
    this.quote = this.quoteService.getDailyQuote();
  }
}
