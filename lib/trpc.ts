import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import Constants from 'expo-constants';
import type { AppRouter } from '../backend/trpc/app-router';

// Get base URL from environment or use default
const getBaseUrl = () => {
  // Check for environment variable first
  const envUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || Constants.expoConfig?.extra?.apiBaseUrl;
  if (envUrl) return envUrl;
  
  // Fallback to localhost for development
  return 'http://localhost:3000';
};

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});