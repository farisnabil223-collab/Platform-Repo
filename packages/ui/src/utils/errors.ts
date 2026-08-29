export class AppError extends Error {
  public code: string;
  public timestamp: string;

  constructor(message: string, code = 'APP_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new Target().constructor.prototype);
  }
}

// Target helper for ES5/ES6 prototype chain fix
class Target {}

export class ValidationError extends AppError {
  public fields?: Record<string, string>;

  constructor(message: string, fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR');
    this.fields = fields;
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 'AUTHORIZATION_ERROR');
  }
}

export class UnknownError extends AppError {
  constructor(message: string) {
    super(message, 'UNKNOWN_ERROR');
  }
}
