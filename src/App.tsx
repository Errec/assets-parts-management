import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useFetchCompanies } from './hooks/useFetchData';

const queryClient = new QueryClient();

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const { data: companies, error: companyError, isLoading: companyLoading } = useFetchCompanies();

  if (companyLoading) return <div>Loading...</div>;
  if (companyError) return <div>Error: {getErrorMessage(companyError)}</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="p-4">
          <h1 className="text-3xl font-bold">Companies</h1>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(companies, null, 2)}</pre>
          <Suspense fallback={<LoadingSpinner />}>
          </Suspense>
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
