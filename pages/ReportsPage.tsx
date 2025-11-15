import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { mockCases, mockClients } from '../services/mockData';
import { dbHearings, dbLawyers } from '../services/database';
import type { CaseStatus, Lawyer, Client, Case } from '../types';

interface ReportsPageProps {
  onSelectCase: (caseId: number) => void;
  onSelectClient: (clientId: number) => void;
  onSelectLawyer: (lawyerId: number) => void;
}

const ReportWidget: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">{title}</h2>
    <div>{children}</div>
  </div>
);

const ReportsPage: React.FC<ReportsPageProps> = ({ onSelectCase, onSelectClient, onSelectLawyer }) => {
  const { t, language } = useI18n();

  const caseStatusData = React.useMemo(() => {
    const counts = mockCases.reduce((acc, currentCase) => {
      acc[currentCase.status] = (acc[currentCase.status] || 0) + 1;
      return acc;
    }, {} as Record<CaseStatus, number>);
    
    const total = mockCases.length;
    
    return {
      active: counts.active || 0,
      closed: counts.closed || 0,
      pending: counts.pending || 0,
      total,
    };
  }, []);

  const partnerCaseload = React.useMemo(() => {
    const caseload: { [key: number]: { partner: Lawyer, count: number } } = {};
    mockCases.forEach(c => {
      if (c.partner) {
        if (!caseload[c.partner.id]) {
          caseload[c.partner.id] = { partner: c.partner, count: 0 };
        }
        caseload[c.partner.id].count++;
      }
    });
    return Object.values(caseload).sort((a, b) => b.count - a.count);
  }, []);
  
  const topClients = React.useMemo(() => {
      const clientCaseCounts: { [key: number]: { client: Client, count: number } } = {};
      mockCases.forEach(c => {
          if(!clientCaseCounts[c.client.id]) {
              clientCaseCounts[c.client.id] = { client: c.client, count: 0};
          }
          clientCaseCounts[c.client.id].count++;
      });

      return Object.values(clientCaseCounts).sort((a,b) => b.count - a.count).slice(0, 5);
  }, []);

  const upcomingHearings = React.useMemo(() => {
    const now = new Date();
    return dbHearings
      .filter(h => h.date && new Date(h.date) >= now)
      .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
      .slice(0, 5)
      .map(hearing => {
          const relatedCase = mockCases.find(c => c.id === hearing.matter_id);
          return { ...hearing, relatedCase };
      });
  }, []);


  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('reports_page.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        <ReportWidget title={t('reports_page.case_status_distribution')}>
            <div className="space-y-4">
                {(['active', 'closed', 'pending'] as CaseStatus[]).map(status => {
                    const count = caseStatusData[status];
                    const percentage = caseStatusData.total > 0 ? (count / caseStatusData.total) * 100 : 0;
                    const colors = {
                        active: 'bg-green-500',
                        closed: 'bg-red-500',
                        pending: 'bg-yellow-500',
                    }
                    return (
                        <div key={status}>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-gray-700">{t(`status.${status}`)}</span>
                                <span className="text-sm font-medium text-gray-700">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className={`${colors[status]} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </ReportWidget>

        <ReportWidget title={t('reports_page.partner_caseload')}>
            <div className="space-y-3">
                {partnerCaseload.map(({ partner, count }) => (
                    <div key={partner.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <a href="#" onClick={(e) => { e.preventDefault(); onSelectLawyer(partner.id); }} className="font-semibold text-primary-700 hover:underline">
                            {language === 'ar' ? partner.lawyer_name_ar : partner.lawyer_name_en}
                        </a>
                        <span className="font-bold text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full text-sm">{count}</span>
                    </div>
                ))}
            </div>
        </ReportWidget>
        
        <ReportWidget title={t('reports_page.top_clients')} className="lg:col-span-1">
             <div className="space-y-3">
                {topClients.map(({ client, count }) => (
                    <div key={client.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                        <a href="#" onClick={(e) => { e.preventDefault(); onSelectClient(client.id); }} className="font-semibold text-blue-800 hover:underline">
                           {language === 'ar' ? (client.client_name_ar || client.client_name_en) : (client.client_name_en || client.client_name_ar)}
                        </a>
                        <span className="font-bold text-blue-800 bg-blue-200 px-2 py-0.5 rounded-full text-sm">{count}</span>
                    </div>
                ))}
            </div>
        </ReportWidget>

        <ReportWidget title={t('reports_page.upcoming_hearings')} className="lg:col-span-1">
            <div className="space-y-4">
                {upcomingHearings.map(({ id, date, relatedCase }) => (
                    <div key={id} className="border-s-4 border-primary-500 ps-4">
                        <p className="font-bold text-gray-800">{date ? new Date(date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                        {relatedCase && (
                            <a href="#" onClick={(e) => { e.preventDefault(); onSelectCase(relatedCase.id); }} className="text-sm text-primary-600 hover:underline">
                                {language === 'ar' ? relatedCase.case_name_ar : relatedCase.case_name_en}
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </ReportWidget>

      </div>
    </div>
  );
};

export default ReportsPage;