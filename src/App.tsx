import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from './components/template/Header';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useCompanyStore } from './store/companyStore';

const queryClient = new QueryClient();

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const { fetchCompanies, companies, loading, error } = useCompanyStore();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Header />
        <main className="p-4">
          {companies.length > 0 ? (
            <p>{companies[0].name}</p>
          ) : (
            <p>No companies available</p>
          )}
        </main>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;

