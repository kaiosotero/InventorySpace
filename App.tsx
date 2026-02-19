
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Movements from './pages/Movements';
import Reports from './pages/Reports';
import { Page } from './types';
import Header from './components/Header';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleSetCurrentPage = (page: Page) => {
    setCurrentPage(page);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'movements':
        return <Movements />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  const pageTitles: { [key in Page]: string } = {
    dashboard: 'Dashboard',
    products: 'Produtos',
    movements: 'Movimentação de Estoque',
    reports: 'Relatórios',
  };

  return (
    <AppProvider>
      <div className="flex h-screen bg-neutral-100 font-sans">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={handleSetCurrentPage} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={pageTitles[currentPage]} onMenuClick={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 md:p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
