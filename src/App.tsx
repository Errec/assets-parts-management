import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useAssetStore } from './store';

const queryClient = new QueryClient();

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const { fetchAndStoreData, loading, locations, error } = useAssetStore();

  useEffect(() => {
    fetchAndStoreData();
  }, [fetchAndStoreData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="p-4">
          <h1 className="text-3xl font-bold">Company Locations</h1>
          {locations && locations.length > 0 ? (
            <ul className="list-disc pl-6">
              {locations.map((location) => (
                <li key={location.id}>{location.name}</li>
              ))}
            </ul>
          ) : (
            <p>No locations available</p>
          )}
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
