import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './shared/styles/global.css';
import App from '@/App';
import { queryClient } from './shared/apis/queryClient.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
      <ReactQueryDevtools />
    </StrictMode>
  </QueryClientProvider>,
);