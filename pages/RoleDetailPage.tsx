import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { dbPermissions } from '../services/database';
import type { Role, Permission } from '../types';

interface RoleDetailPageProps {
    role: Role;
    onBack: () => void;
}

const RoleDetailPage: React.FC<RoleDetailPageProps> = ({ role, onBack }) => {
    const { t, language } = useI18n();

    const [formData, setFormData] = useState({
        name_en: role.name_en,
        name_ar: role.name_ar,
        description_en: role.description_en,
        description_ar: role.description_ar,
    });
    
    const [permissions, setPermissions] = useState<Set<Permission>>(new Set(role.permissions));

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handlePermissionChange = (permission: Permission, isChecked: boolean) => {
        setPermissions(prev => {
            const newPermissions = new Set(prev);
            if (isChecked) {
                newPermissions.add(permission);
            } else {
                newPermissions.delete(permission);
            }
            return newPermissions;
        });
    };
    
    const handleSave = () => {
        const updatedRole = {
            ...role,
            ...formData,
            permissions: Array.from(permissions),
        };
        console.log("Saving Role:", updatedRole);
        onBack(); // Go back after saving
    };

    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="text-primary-600 hover:underline mb-4">&larr; {t('settings_page.back_to_roles')}</button>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t('roles_page.edit_role')}: <span className="text-primary-600">{language === 'ar' ? role.name_ar : role.name_en}</span></h1>
            </div>

            <div className="space-y-6">
                {/* Role Details Form */}
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{t('roles_page.role_details')}</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name_en" className="block text-sm font-medium text-gray-700">Name (English)</label>
                                <input type="text" id="name_en" name="name_en" value={formData.name_en} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                             <div>
                                <label htmlFor="name_ar" className="block text-sm font-medium text-gray-700">Name (Arabic)</label>
                                <input type="text" id="name_ar" name="name_ar" value={formData.name_ar} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">Description (English)</label>
                            <textarea id="description_en" name="description_en" value={formData.description_en} onChange={handleFormChange} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <div>
                            <label htmlFor="description_ar" className="block text-sm font-medium text-gray-700">Description (Arabic)</label>
                            <textarea id="description_ar" name="description_ar" value={formData.description_ar} onChange={handleFormChange} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                    </div>
                </div>

                {/* Permissions */}
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{t('roles_page.assign_permissions')}</h2>
                    <div className="space-y-4">
                        {dbPermissions.map(group => (
                            <div key={group.groupKey}>
                                <h3 className="text-md font-semibold text-gray-700 border-b pb-2 mb-3">{t(`permissions.${group.groupKey}`)}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {group.permissions.map(perm => (
                                        <div key={perm.key} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={perm.key}
                                                checked={permissions.has(perm.key)}
                                                onChange={(e) => handlePermissionChange(perm.key, e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <label htmlFor={perm.key} className="ms-2 text-sm text-gray-600">{language === 'ar' ? perm.description_ar : perm.description_en}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

             <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
                <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700">
                    {t('common.cancel')}
                </button>
                <button type="button" onClick={handleSave} className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
                    {t('common.save')}
                </button>
            </div>
        </div>
    );
};

export default RoleDetailPage;
