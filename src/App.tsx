import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import Container from './components/page/Container';
import Header from './components/template/Header';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useCompanyStore } from './store/companyStore';

const queryClient = new QueryClient();

const useCompanySelection = () => {
  const { fetchCompanies, error } = useCompanyStore();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleClearSearch = () => setSearchTerm('');

  return {
    selectedCompanyId,
    setSelectedCompanyId,
    searchTerm,
    handleClearSearch,
    error,
  };
};

const App: React.FC = () => {
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    handleClearSearch,
    error,
  } = useCompanySelection();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Header 
          onSelectCompany={setSelectedCompanyId}
          selectedCompanyId={selectedCompanyId} 
          onClearSearch={handleClearSearch}
        />
        <main className={`p-4 w-full flex items-center justify-center min-h-screen ${!selectedCompanyId ? 'pointer-events-none' : ''}`}>
          {selectedCompanyId ? (
            <Container selectedCompanyId={selectedCompanyId} />
          ) : (
            <div className="p-4 bg-tractian-blue-200 text-center border-2 rounded-lg">
              <p className="text-tractian-blue-50 text-2xl font-bold">Select the Unit</p>
            </div>
          )}
        </main>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
