import React from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { SnackbarProvider, useSnackbar } from "notistack";
import { theme } from "~/theme";
import axios from "axios";

const AppWrapper = () => {
  const { enqueueSnackbar } = useSnackbar();

  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response.status === 401 || err.response.status === 403) {
        enqueueSnackbar(`Authorization error: ${err.response.status}`, {
          variant: "error",
        });
      }
      return Promise.reject(err);
    }
  );

  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

// Default user token for demo purposes. User is created on the first request.
localStorage.setItem('authorization_token', 'VGVzdFVzZXI6VGVzdA==');

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <AppWrapper />
  </SnackbarProvider>
);
