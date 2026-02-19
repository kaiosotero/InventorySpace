
import React from 'react';
import { Page } from '../types';
import { DashboardIcon, ProductsIcon, MovementsIcon, ReportsIcon } from './icons/Icon';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white shadow-md'
          : 'text-neutral-300 hover:bg-primary-dark hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
    { page: 'products', label: 'Produtos', icon: <ProductsIcon className="w-6 h-6" /> },
    { page: 'movements', label: 'Movimentações', icon: <MovementsIcon className="w-6 h-6" /> },
    { page: 'reports', label: 'Relatórios', icon: <ReportsIcon className="w-6 h-6" /> },
  ];
  
  const sidebarClasses = `
    w-64 bg-neutral-800 text-white flex flex-col p-4 shadow-lg 
    fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
    md:relative md:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-center mb-10 border-b border-neutral-700 pb-6">
          <ProductsIcon className="w-8 h-8 text-primary-light" />
          <h1 className="text-2xl font-bold ml-2">Inventory<span className="text-primary-light">Space</span></h1>
        </div>
        <nav>
          <ul className="space-y-3">
            {navItems.map((item) => (
              <NavItem
                key={item.page}
                icon={item.icon}
                label={item.label}
                isActive={currentPage === item.page}
                onClick={() => setCurrentPage(item.page)}
              />
            ))}
          </ul>
        </nav>
        <div className="mt-auto text-center text-neutral-400 text-sm">
          <p>InventorySpace &copy; 2024</p>
          <p className="font-semibold">Estoque sob controle, sem perdas.</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
