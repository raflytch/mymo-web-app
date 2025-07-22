"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Provider untuk React Query tanpa devtools
export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Buat QueryClient instance sekali saja
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache selama 5 menit
            staleTime: 5 * 60 * 1000,
            // Retry maksimal 3 kali
            retry: 3,
            // Tidak refetch saat window focus (opsional)
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
