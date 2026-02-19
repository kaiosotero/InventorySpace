
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { MenuIcon } from './icons/Icon';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
    const { currentUser } = useAppContext();

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
            <div className="flex items-center">
                <button 
                    className="text-neutral-600 mr-4 md:hidden"
                    onClick={onMenuClick}
                    aria-label="Open navigation menu"
                >
                    <MenuIcon />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-neutral-800">{title}</h1>
            </div>
            <div className="flex items-center">
                <div className="text-right mr-4 hidden sm:block">
                    <p className="font-semibold text-neutral-700">{currentUser.nome}</p>
                    <p className="text-sm text-neutral-500 capitalize">{currentUser.perfil}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg md:text-xl">
                    {currentUser.nome.charAt(0)}
                </div>
            </div>
        </header>
    );
};

export default Header;
