import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { mockCases, mockClients } from '../services/mockData';
import { dbLawyers, dbOptionValues } from '../services/database';
import SearchableSelect from '../components/SearchableSelect';
import { DocumentIcon } from '../components/icons';
import type { ClientDocument } from '../types';

interface DocumentFormPageProps {
    onBack: () => void;
    onSave: (formData: any) => void;
    initialData?: ClientDocument;
}

const Section: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 bg-gray-50 p-3 border-b border-gray-200">
            {icon}
            <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
        <div className="p-4 space-y-4">
            {children}
        </div>
    </div>
);

const DocumentFormPage: React.FC<DocumentFormPageProps> = ({ onBack, onSave, initialData }) => {
    const { t, language } = useI18n();
    const isEditing = !!initialData;
    
    const [formData, setFormData] = useState({
        storageType: 'physical',
        client: '',
        case: '',
        documentName: '',
        documentType: '',
        caseNumber: '',
        description: '',
        pagesCount: '',
        documentDate: '',
        depositDate: '',
        responsibleLawyer: '',
        movementCard: false,
        mfilesUploaded: false,
        mfilesId: '',
        notes: '',
    });

    useEffect(() => {
        if (initialData) {
            // Find lawyer ID from name string for the dropdown
            const lawyer = dbLawyers.find(l => l.lawyer_name_en === initialData.responsible_lawyer || l.lawyer_name_ar === initialData.responsible_lawyer);

            setFormData({
                storageType: initialData.document_storage_type,
                client: initialData.client_id.toString(),
                case: initialData.matter_id?.toString() || '',
                documentName: initialData.document_name || '',
                documentType: initialData.document_type || '',
                caseNumber: initialData.case_number || '',
                description: initialData.document_description || '',
                pagesCount: initialData.pages_count || '',
                documentDate: initialData.document_date ? initialData.document_date.split('T')[0] : '',
                depositDate: initialData.deposit_date ? initialData.deposit_date.split('T')[0] : '',
                responsibleLawyer: lawyer ? lawyer.id.toString() : '',
                movementCard: initialData.movement_card,
                mfilesUploaded: initialData.mfiles_uploaded,
                mfilesId: initialData.mfiles_id || '',
                notes: initialData.notes || '',
            });
        }
    }, [initialData]);

    const docTypeOptions = useMemo(() =>
        dbOptionValues.filter(o => o.set_id === 23).map(o => ({
            value: o.label_en,
            label: language === 'ar' ? o.label_ar : o.label_en,
        })).sort((a,b) => a.label.localeCompare(b.label)),
        [language]
    );

    const clientOptions = useMemo(() =>
        mockClients.map(c => ({
            value: c.id,
            label: `[${c.client_code || c.id}] ${language === 'ar' ? (c.client_name_ar || c.client_name_en) : (c.client_name_en || c.client_name_ar)}`
        })).sort((a, b) => a.label.localeCompare(b.label)),
        [language]
    );

    const caseOptions = useMemo(() =>
        mockCases
            .filter(c => !formData.client || c.client.id === Number(formData.client))
            .map(c => ({
                value: c.id,
                label: `[${c.case_number}] ${language === 'ar' ? c.case_name_ar : c.case_name_en}`
            })).sort((a, b) => a.label.localeCompare(b.label)),
        [language, formData.client]
    );

    const lawyerOptions = useMemo(() =>
        dbLawyers.map(l => ({
            value: l.id,
            label: `[${l.id}] ${language === 'ar' ? l.lawyer_name_ar : l.lawyer_name_en}`
        })).sort((a, b) => a.label.localeCompare(b.label)),
        [language]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSelectChange = (name: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({...formData, id: initialData?.id});
    };

    const isPhysical = formData.storageType === 'physical' || formData.storageType === 'both';
    
    const pageTitle = isEditing ? t('document_page.edit_document') : t('new_document_form.title');

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <DocumentIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
                </div>
                <div>
                    <button onClick={onBack} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                        &larr; {t('app.back')}
                    </button>
                </div>
            </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="bg-white p-6 rounded-lg shadow-md border">
                    <Section title={t('new_document_form.document_upload_form')} icon={<DocumentIcon className="w-5 h-5 text-gray-500" />}>
                        {/* Storage Type */}
                        <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 mb-2">{t('new_document_form.storage_type')}</legend>
                            <div className="flex items-center gap-6">
                                {(['physical', 'digital', 'both'] as const).map(type => (
                                    <div key={type} className="flex items-center">
                                        <input id={`storage_type_${type}`} name="storageType" type="radio" value={type} checked={formData.storageType === type} onChange={handleChange} className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                                        <label htmlFor={`storage_type_${type}`} className="ms-2 block text-sm text-gray-900">
                                            {t(`new_document_form.${type}`)} - <span className="text-gray-500">{t(`new_document_form.${type}_desc`)}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                        
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('new_document_form.document_file')}</label>
                            <div className="mt-1 flex items-center">
                                <label className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                    <span>{t('new_document_form.choose_file')}</span>
                                    <input type="file" className="sr-only" disabled />
                                </label>
                                <span className="ms-3 text-sm text-gray-500">{t('new_document_form.no_file_chosen')}</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{t('new_document_form.supported_formats')}</p>
                            <p className="text-xs text-gray-500">{t('new_document_form.max_file_size')}</p>
                            <p className="text-xs text-gray-500">{t('new_document_form.file_upload_optional')}</p>
                        </div>
                        
                        {/* Document Name */}
                        <div>
                           <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">{t('document.document_name')}</label>
                           <input type="text" id="documentName" name="documentName" value={formData.documentName} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                        </div>

                        {/* Client & Case */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('new_document_form.client')}</label>
                                <SearchableSelect options={clientOptions} value={formData.client} onChange={(v) => handleSelectChange('client', v)} placeholder={t('new_document_form.select_client')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('new_document_form.case')}</label>
                                <SearchableSelect options={caseOptions} value={formData.case} onChange={(v) => handleSelectChange('case', v)} placeholder={t('new_document_form.select_case')} />
                            </div>
                        </div>

                        {/* Doc Type & Case Number */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('new_document_form.document_type')}</label>
                                <SearchableSelect options={docTypeOptions} value={formData.documentType} onChange={(v) => handleSelectChange('documentType', v)} placeholder={t('new_document_form.select_document_type')} />
                            </div>
                             <div>
                                <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700">{t('new_document_form.case_number')}</label>
                                <input type="text" id="caseNumber" name="caseNumber" value={formData.caseNumber} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>
                        
                        {/* Description */}
                        <div>
                             <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('common.description')}</label>
                             <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                    </Section>

                    {/* Physical Details */}
                    {isPhysical && (
                        <Section title={t('new_document_form.physical_details')} icon={<DocumentIcon className="w-5 h-5 text-gray-500" />}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="pagesCount" className="block text-sm font-medium text-gray-700">{t('new_document_form.pages_count')}</label>
                                    <input type="number" id="pagesCount" name="pagesCount" value={formData.pagesCount} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="documentDate" className="block text-sm font-medium text-gray-700">{t('new_document_form.document_date')}</label>
                                    <input type="date" id="documentDate" name="documentDate" value={formData.documentDate} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                                 <div>
                                    <label htmlFor="depositDate" className="block text-sm font-medium text-gray-700">{t('new_document_form.deposit_date')}</label>
                                    <input type="date" id="depositDate" name="depositDate" value={formData.depositDate} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('new_document_form.responsible_lawyer')}</label>
                                    <SearchableSelect options={lawyerOptions} value={formData.responsibleLawyer} onChange={(v) => handleSelectChange('responsibleLawyer', v)} placeholder={t('new_document_form.select_lawyer')} />
                                </div>
                                 <div className="flex items-center gap-2">
                                    <input type="checkbox" id="movementCard" name="movementCard" checked={formData.movementCard} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                    <label htmlFor="movementCard" className="text-sm font-medium text-gray-700">{t('new_document_form.movement_card')}</label>
                                </div>
                            </div>
                        </Section>
                    )}

                    {/* M-Files Integration */}
                     <Section title={t('new_document_form.mfiles_integration')} icon={<DocumentIcon className="w-5 h-5 text-gray-500" />}>
                         <div className="flex items-center gap-2">
                            <input type="checkbox" id="mfilesUploaded" name="mfilesUploaded" checked={formData.mfilesUploaded} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                            <label htmlFor="mfilesUploaded" className="text-sm font-medium text-gray-700">{t('new_document_form.uploaded_to_mfiles')}</label>
                        </div>
                        {formData.mfilesUploaded && (
                             <div>
                                <label htmlFor="mfilesId" className="block text-sm font-medium text-gray-700">{t('new_document_form.mfiles_id')}</label>
                                <input type="text" id="mfilesId" name="mfilesId" value={formData.mfilesId} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                <p className="mt-1 text-xs text-gray-500">{t('new_document_form.mfiles_id_required')}</p>
                            </div>
                        )}
                     </Section>

                     {/* Notes */}
                    <Section title={t('new_document_form.notes')}>
                         <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                    </Section>
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-6">
                    <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700">
                        {t('common.cancel')}
                    </button>
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
                        {t('new_document_form.save_document')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentFormPage;