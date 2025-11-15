import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { dbRoles } from '../services/database';
import type { ViewState } from '../App';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons';

interface RolesListPageProps {
    onNavigate: (viewState: ViewState) => void;
}

const RolesListPage: React.FC<RolesListPageProps> = ({ onNavigate }) => {
    const { t, language } = useI18n();

    const handleDelete = (roleId: number) => {
        if (window.confirm(t('roles_page.confirm_delete_text'))) {
            console.log("Deleting role with ID:", roleId);
            // In a real app, you would update state here
        }
    };
    
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t('roles_page.title')}</h1>
                <button
                    onClick={() => alert("New Role form not implemented yet.")}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-white font-semibold hover:bg-primary-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    {t('roles_page.new_role')}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('roles_page.role_name')}</th>
                                <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('roles_page.description')}</th>
                                <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('roles_page.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {dbRoles.map(role => (
                                <tr key={role.id}>
                                    <td className="p-3 text-sm text-gray-800 font-medium">{language === 'ar' ? role.name_ar : role.name_en}</td>
                                    <td className="p-3 text-sm text-gray-600 max-w-md">{language === 'ar' ? role.description_ar : role.description_en}</td>
                                    <td className="p-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => onNavigate({ view: 'role', roleId: role.id })} 
                                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
                                                title={t('roles_page.edit_role')}
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(role.id)} 
                                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600" 
                                                title={t('roles_page.delete_role')}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RolesListPage;
