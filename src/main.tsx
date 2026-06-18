import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { queryClient } from '@/shared/apis/queryClient.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SkeletonTheme } from 'react-loading-skeleton';
import { registerSW } from 'virtual:pwa-register';
import '@/shared/firebase/settingFCM';
import 'react-loading-skeleton/dist/skeleton.css';

registerSW({
  immediate: true,
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <BrowserRouter>
        <SkeletonTheme baseColor="#393a36" highlightColor="#535450">
          <App />
        </SkeletonTheme>
        <ReactQueryDevtools />
      </BrowserRouter>
    </StrictMode>
  </QueryClientProvider>,
);
