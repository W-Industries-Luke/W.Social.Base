import { Injectable } from '@angular/core';
import { AppConfig } from '../models/config.interface';
import { APP_CONFIG } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly config: AppConfig = APP_CONFIG;

  constructor() {}

  getApiRoute(routeName: string): string {
    return this.config.apiRoutes[routeName] || '';
  }

  getHeartlandAuthRoute(): string {
    return this.getApiRoute('heartlandAuth');
  }

  getAllApiRoutes(): { [key: string]: string } {
    return { ...this.config.apiRoutes };
  }
}