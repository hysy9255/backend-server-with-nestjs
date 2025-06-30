// src/global-app.ts
import { INestApplicationContext } from '@nestjs/common';

export class GlobalApp {
  private static app: INestApplicationContext;

  static setApp(app: INestApplicationContext) {
    this.app = app;
  }

  static get<T>(type: any): T {
    if (!this.app) throw new Error('Nest app not initialized');
    return this.app.get(type);
  }
}
