import { enableMock } from './api-mock';

if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
  enableMock();
}
