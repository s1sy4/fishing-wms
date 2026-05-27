// backend/src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'WMS Снасти API 🎣',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/auth/login',
        catalog: '/catalog/inventory-types',
        health: '/',
      },
    };
  }
}