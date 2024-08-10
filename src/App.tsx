import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import Header from './components/template/Header';
import TreeView from './components/template/TreeView';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useCompanyStore } from './store/companyStore';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { fetchCompanies, error } = useCompanyStore();
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Header onSelectCompany={setSelectedCompanyName} selectedCompanyId={selectedCompanyName} />
        <main className="pt-12 px-4 flex items-center justify-center min-h-screen">
          {selectedCompanyName ? (
            <TreeView companyId={selectedCompanyName} />
          ) : (
            <div className="p-4 bg-blue-100 text-center">
              <p className="text-blue-600">Select the unit</p>
            </div>
          )}
        </main>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
