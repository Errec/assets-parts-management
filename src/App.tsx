import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import Header from './components/template/Header';
import TreeView from './components/template/TreeView';
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
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyName) {
      setSelectedCompanyName(companies[0].id); // Automatically select the first company
    }
  }, [companies, selectedCompanyName]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Header onSelectCompany={setSelectedCompanyName} selectedCompanyId={selectedCompanyName} />
        <main className="p-4">
          {selectedCompanyName ? (
            <TreeView companyId={selectedCompanyName} />
          ) : (
            <p>{companies.length > 0 ? companies[0].name : 'No companies available'}</p>
          )}
        </main>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
