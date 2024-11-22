export class CustomError extends Error {
    message: any;
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  }