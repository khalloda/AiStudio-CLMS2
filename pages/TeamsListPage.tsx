
import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { dbTeams } from '../services/database';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons';
import type { ViewState } from '../App';

interface TeamsListPageProps {
    onNavigate: (viewState: ViewState) => void;
}

const TeamsListPage: React.FC<TeamsListPageProps> = ({ onNavigate }) => {
    const { t, language } = useI18n();

    const handleDelete = (teamId: number) => {
        if (window.confirm(t('teams_page.confirm_delete_text'))) {
            console.log("Deleting team with ID:", teamId);
            // In a real app, update state here
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t('teams_page.title')}</h1>
                <button
                    onClick={() => onNavigate({ view: 'team', teamId: 'new' })}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-white font-semibold hover:bg-primary-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    {t('teams_page.new_team')}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                <div className="overflow-x-auto">
                    {dbTeams.length > 0 ? (
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('teams_page.team_name')}</th>
                                    <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('teams_page.description')}</th>
                                    <th className="p-3 text-center font-semibold text-gray-600 text-sm">{t('teams_page.members')}</th>
                                    <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('teams_page.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dbTeams.map(team => (
                                    <tr key={team.id}>
                                        <td className="p-3 text-sm text-gray-800 font-medium">{language === 'ar' ? team.name_ar : team.name_en}</td>
                                        <td className="p-3 text-sm text-gray-600 max-w-md">{language === 'ar' ? team.description_ar : team.description_en}</td>
                                        <td className="p-3 text-center text-sm">
                                            <span className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded-full">{team.lawyer_ids.length}</span>
                                        </td>
                                        <td className="p-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => onNavigate({ view: 'team', teamId: team.id })} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title={t('teams_page.edit_team')}>
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(team.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600" title={t('teams_page.delete_team')}>
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p className="text-center p-10 text-gray-500">{t('teams_page.no_teams')}</p>}
                </div>
            </div>
        </div>
    );
};

export default TeamsListPage;
