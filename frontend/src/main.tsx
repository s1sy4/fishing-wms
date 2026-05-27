import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 🔹 ОБЯЗАТЕЛЬНО: Провайдер React Query */}
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={ruRU}>
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);