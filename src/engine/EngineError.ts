export class EngineError extends Error {
  constructor(origin: string, message: string) {
    super(`[${origin}] ${message}`);
  }
}
