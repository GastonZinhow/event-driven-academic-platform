export interface RetryOptions {
  exchange: string;

  deadLetterExchange: string;

  deadLetterRoutingKey: string;

  maxRetries: number;
}