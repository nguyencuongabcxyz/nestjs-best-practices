export class ServiceError extends Error {
  readonly module: string;
  readonly code: string;
  readonly details?: any;

  constructor(module: string, code: string, message: string, details?: any) {
    super(message);
    this.module = module;
    this.code = code;
    this.details = details;
  }

  errorPayload(): ErrorPayload {
    return {
      module: this.module,
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

interface ErrorPayload {
  module: string;
  code: string;
  message: string;
  details?: any;
}
