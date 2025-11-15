import React, { useState, useMemo } from 'react';
import { dbOpponents } from '../services/database';
import { useI18n } from '../hooks/useI18n';
import type { Opponent } from '../types';
import { FilterIcon, XIcon, PlusIcon } from '../components/icons';
import NewOpponentForm from '../components/NewOpponentForm';

interface OpponentsListPageProps {
  onSelectOpponent: (opponentId: number) => void;
}

const OpponentCard: React.FC<{ opponent: Opponent; onSelect: () => void }> = ({ opponent, onSelect }) => {
    const { language } = useI18n();
    const opponentName = language === 'ar' ? (opponent.opponent_name_ar || opponent.opponent_name_en) : (opponent.opponent_name_en || opponent.opponent_name_ar);
    return (
        <div 
            className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
        >
            <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800 truncate">{opponentName}</p>
                <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded-full whitespace-nowrap">ID: {opponent.id}</span>
            </div>
            {opponent.description && <p className="text-sm text-gray-500 truncate mt-2">{opponent.description}</p>}
        </div>
    );
}


const OpponentsListPage: React.FC<OpponentsListPageProps> = ({ onSelectOpponent }) => {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activityFilter, setActivityFilter] = useState('');
  const [isNewOpponentModalOpen, setIsNewOpponentModalOpen] = useState(false);

  const clearFilters = () => {
    setActivityFilter('');
  };

  const handleSaveOpponent = (data: any) => {
    console.log("New Opponent Saved:", data);
    setIsNewOpponentModalOpen(false);
  };

  const filteredOpponents = useMemo(() => {
    return dbOpponents.filter(opponent => {
        if (activityFilter && String(opponent.is_active) !== activityFilter) {
            return false;
        }

        if (!searchTerm) return true;
        const lowercasedSearch = searchTerm.toLowerCase();
        const opponentName = `${opponent.opponent_name_en || ''} ${opponent.opponent_name_ar || ''}`.toLowerCase();
        return opponentName.includes(lowercasedSearch);
    });
  }, [searchTerm, activityFilter]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('opponents_page.title')}</h1>
        <div className="flex items-center gap-2">
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
                <FilterIcon className="w-5 h-5" />
                {t('dashboard.filter_cases')}
            </button>
            <button
                onClick={() => setIsNewOpponentModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-white font-semibold hover:bg-primary-700 transition-colors"
            >
                <PlusIcon className="w-5 h-5" />
                {t('opponents_page.new_opponent')}
            </button>
        </div>
      </div>
      
       {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select name="activity" value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
              <option value="">{t('filters.all')}</option>
              <option value="true">{t('filters.active')}</option>
              <option value="false">{t('filters.inactive')}</option>
            </select>
          </div>
          <button
            onClick={clearFilters}
            className="mt-4 flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-semibold"
          >
            <XIcon className="w-4 h-4" />
            {t('dashboard.clear_filters')}
          </button>
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input
                type="search"
                className="block w-full max-w-md p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500"
                placeholder={t('app.search_placeholder_generic')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredOpponents.map(opponent => (
            <OpponentCard key={opponent.id} opponent={opponent} onSelect={() => onSelectOpponent(opponent.id)} />
        ))}
      </div>

      {isNewOpponentModalOpen && (
        <NewOpponentForm 
            onClose={() => setIsNewOpponentModalOpen(false)}
            onSave={handleSaveOpponent}
        />
      )}
    </div>
  );
};

export default OpponentsListPage;