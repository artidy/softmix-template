import { createAPI } from './api';
import { REQUEST_TIMEOUT } from '../const';

// В проде /api проксирует nginx, в разработке — dev-сервер Vite.
export const http = createAPI('/api', REQUEST_TIMEOUT);
