// App.tsx
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import Container from './components/page/Container';
import Header from './components/template/Header';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useCompanyStore } from './store/companyStore';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { fetchCompanies, error } = useCompanyStore();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

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
        <main className="p-4 w-full flex items-center justify-center min-h-screen">
          {selectedCompanyId ? (
            <Container selectedCompanyId={selectedCompanyId} />
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