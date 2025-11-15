
import React, { useState, useMemo } from 'react';
import { useI18n } from '../hooks/useI18n';
import { dbRoles } from '../services/database';
import type { User } from '../types';
import SearchableSelect from '../components/SearchableSelect';

interface UserDetailPageProps {
    user?: User;
    onBack: () => void;
    onSave: (userData: any) => void;
}

const UserDetailPage: React.FC<UserDetailPageProps> = ({ user, onBack, onSave }) => {
    const { t, language } = useI18n();
    const isEditing = !!user;

    const [formData, setFormData] = useState({
        name_en: user?.name_en || '',
        name_ar: user?.name_ar || '',
        email: user?.email || '',
        password: '',
        role_id: user?.role_id || '',
        is_active: user?.is_active ?? true,
    });

    const roleOptions = useMemo(() => 
        dbRoles.map(r => ({
            value: r.id,
            label: language === 'ar' ? r.name_ar : r.name_en,
        })),
        [language]
    );

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSelectChange = (value: string | number) => {
        setFormData(prev => ({ ...prev, role_id: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: user?.id });
    };

    const pageTitle = isEditing 
        ? `${t('new_user_form.title_edit')}: ${language === 'ar' ? user.name_ar : user.name_en}` 
        : t('new_user_form.title_new');

    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="text-primary-600 hover:underline mb-4">&larr; {t('settings_page.back_to_settings')}</button>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{pageTitle}</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name_en" className="block text-sm font-medium text-gray-700">{t('new_user_form.name_en')}</label>
                        <input type="text" id="name_en" name="name_en" value={formData.name_en} onChange={handleFormChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="name_ar" className="block text-sm font-medium text-gray-700">{t('new_user_form.name_ar')}</label>
                        <input type="text" id="name_ar" name="name_ar" value={formData.name_ar} onChange={handleFormChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('new_user_form.email')}</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('new_user_form.password')}</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    {isEditing && <p className="mt-1 text-xs text-gray-500">{t('new_user_form.password_help')}</p>}
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('new_user_form.role')}</label>
                        <SearchableSelect
                            options={roleOptions}
                            value={formData.role_id}
                            onChange={handleSelectChange}
                            placeholder={t('new_user_form.select_role')}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleFormChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">{t('new_user_form.active')}</label>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                    <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700">{t('common.cancel')}</button>
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">{t('common.save')}</button>
                </div>
            </form>
        </div>
    );
};

export default UserDetailPage;
