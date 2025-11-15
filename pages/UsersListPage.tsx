
import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { getUsers } from '../services/mockData';
import type { ViewState } from '../App';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons';

interface UsersListPageProps {
    onNavigate: (viewState: ViewState) => void;
}

const UsersListPage: React.FC<UsersListPageProps> = ({ onNavigate }) => {
    const { t, language } = useI18n();
    const users = getUsers();

    const handleDelete = (userId: number) => {
        if (window.confirm(t('users_page.confirm_delete_text'))) {
            console.log("Deleting user with ID:", userId);
        }
    };
    
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t('users_page.title')}</h1>
                <button
                    onClick={() => onNavigate({ view: 'user', userId: 'new' })}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-white font-semibold hover:bg-primary-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    {t('users_page.new_user')}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('app.name')}</th>
                                <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('users_page.email')}</th>
                                <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('users_page.role')}</th>
                                <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('users_page.status')}</th>
                                <th className="p-3 text-start font-semibold text-gray-600 text-sm">{t('users_page.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="p-3 text-sm text-gray-800 font-medium">{language === 'ar' ? user.name_ar : user.name_en}</td>
                                    <td className="p-3 text-sm text-gray-600">{user.email}</td>
                                    <td className="p-3 text-sm text-gray-600">{user.role ? (language === 'ar' ? user.role.name_ar : user.role.name_en) : 'N/A'}</td>
                                    <td className="p-3 text-sm">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_active ? t('new_user_form.active') : t('new_user_form.inactive')}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => onNavigate({ view: 'user', userId: user.id })} 
                                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
                                                title={t('users_page.edit_user')}
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)} 
                                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600" 
                                                title={t('users_page.delete_user')}
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

export default UsersListPage;
