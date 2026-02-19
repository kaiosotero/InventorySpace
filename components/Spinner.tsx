
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-neutral-600">Carregando dados...</p>
    </div>
  );
};

export default Spinner;
