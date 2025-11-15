
import React from 'react';
import { I18nProvider } from './context/I18nContext';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import CaseDetailPage from './pages/CaseDetailPage';
import ClientDetailPage from './pages/ClientDetailPage';
import OpponentDetailPage from './pages/OpponentDetailPage';
import ClientsListPage from './pages/ClientsListPage';
import OpponentsListPage from './pages/OpponentsListPage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';
import LawyersListPage from './pages/LawyersListPage';
import LawyerDetailPage from './pages/LawyerDetailPage';
import CourtsListPage from './pages/CourtsListPage';
import CourtDetailPage from './pages/CourtDetailPage';
import HearingsListPage from './pages/HearingsListPage';
import HearingDetailPage from './pages/HearingDetailPage';
import DocumentsListPage from './pages/DocumentsListPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import ReportsPage from './pages/ReportsPage';
import NewHearingForm from './components/NewHearingForm';
import DocumentFormPage from './pages/UploadDocumentPage';
import RolesListPage from './pages/RolesListPage';
import RoleDetailPage from './pages/RoleDetailPage';
import TeamsListPage from './pages/TeamsListPage';
import TeamDetailPage from './pages/TeamDetailPage';
import UsersListPage from './pages/UsersListPage';
import UserDetailPage from './pages/UserDetailPage';
import { mockCases, getClientById, getOpponentById, getLawyerById, getCourtById, getHearingById, getDocumentById, getRoleById, getTeamById, getUserById } from './services/mockData';

export type View = 'dashboard' | 'case' | 'client' | 'opponent' | 'clients' | 'opponents' | 'tasks' | 'reports' | 'settings' | 'lawyers' | 'lawyer' | 'courts' | 'court' | 'hearings' | 'hearing' | 'documents' | 'document' | 'createHearing' | 'documentForm' | 'editDocument' | 'roles' | 'role' | 'teams' | 'team' | 'users' | 'user';

// FIX: Export ViewState type to be used in other components.
export type ViewState = 
  | { view: 'dashboard' }
  | { view: 'case'; caseId: number }
  | { view: 'client'; clientId: number }
  | { view: 'opponent'; opponentId: number }
  | { view: 'lawyer'; lawyerId: number }
  | { view: 'court'; courtId: number }
  | { view: 'hearing'; hearingId: number }
  | { view: 'document'; documentId: number }
  | { view: 'editDocument'; documentId: number }
  | { view: 'role'; roleId: number }
  | { view: 'team'; teamId: number | 'new' }
  | { view: 'user'; userId: number | 'new' }
  | { view: 'clients' }
  | { view: 'opponents' }
  | { view: 'lawyers' }
  | { view: 'courts' }
  | { view: 'tasks' }
  | { view: 'reports' }
  | { view: 'settings' }
  | { view: 'hearings' }
  | { view: 'documents' }
  | { view: 'createHearing' }
  | { view: 'documentForm' }
  | { view: 'roles' }
  | { view: 'teams' }
  | { view: 'users' };

const AppContent: React.FC = () => {
  const [history, setHistory] = React.useState<ViewState[]>([{ view: 'dashboard' }]);
  const currentViewState = history[history.length - 1];

  const navigateTo = (viewState: ViewState) => {
    setHistory(prev => [...prev, viewState]);
  };

  const goBack = () => {
    setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };
  
  const navigateRoot = (view: View) => {
    setHistory([{ view }]);
  };

  const renderContent = () => {
    switch (currentViewState.view) {
      case 'case':
        const caseData = mockCases.find(c => c.id === currentViewState.caseId);
        if (caseData) {
          return (
            <CaseDetailPage 
              caseData={caseData} 
              onBack={goBack}
              onSelectClient={(clientId) => navigateTo({ view: 'client', clientId })}
              onSelectOpponent={(opponentId) => navigateTo({ view: 'opponent', opponentId })}
              onSelectCourt={(courtId) => navigateTo({ view: 'court', courtId })}
              onSelectTeam={(teamId) => navigateTo({ view: 'team', teamId })}
            />
          );
        }
        navigateRoot('dashboard'); // Fallback if case not found
        return null;

      case 'client':
        const clientData = getClientById(currentViewState.clientId);
        if (clientData) {
          return <ClientDetailPage 
                    client={clientData} 
                    onBack={goBack} 
                    onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })}
                 />;
        }
        navigateRoot('dashboard'); // Fallback
        return null;
        
      case 'opponent':
        const opponentData = getOpponentById(currentViewState.opponentId);
        if (opponentData) {
          return <OpponentDetailPage 
                    opponent={opponentData} 
                    onBack={goBack} 
                    onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })}
                 />;
        }
        navigateRoot('dashboard'); // Fallback
        return null;

      case 'lawyer':
        const lawyerData = getLawyerById(currentViewState.lawyerId);
        if (lawyerData) {
            return <LawyerDetailPage
                lawyer={lawyerData}
                onBack={goBack}
                onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })}
            />;
        }
        navigateRoot('dashboard'); // Fallback
        return null;

      case 'court':
        const courtData = getCourtById(currentViewState.courtId);
        if (courtData) {
            return <CourtDetailPage
                court={courtData}
                onBack={goBack}
                onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })}
            />;
        }
        navigateRoot('dashboard'); // Fallback
        return null;

      case 'clients':
        return <ClientsListPage onSelectClient={(clientId) => navigateTo({ view: 'client', clientId })} />;

      case 'opponents':
        return <OpponentsListPage onSelectOpponent={(opponentId) => navigateTo({ view: 'opponent', opponentId })} />;

      case 'lawyers':
        return <LawyersListPage onSelectLawyer={(lawyerId) => navigateTo({ view: 'lawyer', lawyerId })} />;

      case 'courts':
        return <CourtsListPage onSelectCourt={(courtId) => navigateTo({ view: 'court', courtId })} />;

      case 'tasks':
        return <TasksPage onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })} />;

      case 'hearings':
        return <HearingsListPage 
                  onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })} 
                  onNavigateToCreate={() => navigateTo({ view: 'createHearing' })}
                  onSelectHearing={(hearingId) => navigateTo({ view: 'hearing', hearingId })}
                />;

      case 'hearing':
        const hearingData = getHearingById(currentViewState.hearingId);
        if (hearingData) {
          return <HearingDetailPage 
                    hearing={hearingData}
                    onBack={goBack}
                    onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })}
                    onSelectLawyer={(lawyerId) => navigateTo({ view: 'lawyer', lawyerId })}
                  />;
        }
        navigateRoot('hearings'); // Fallback
        return null;

      case 'createHearing':
          return <NewHearingForm 
                    onBack={goBack}
                    onSave={(data) => {
                      console.log("Saving new hearing:", data);
                      goBack(); // Navigate back after saving
                    }}
                  />;

      case 'documents':
        return <DocumentsListPage 
                    onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })} 
                    onSelectClient={(clientId) => navigateTo({ view: 'client', clientId })}
                    onSelectDocument={(documentId) => navigateTo({ view: 'document', documentId })}
                    onNavigateToCreate={() => navigateTo({ view: 'documentForm'})}
                />;
      
      case 'document':
        const documentData = getDocumentById(currentViewState.documentId);
        if (documentData) {
            return <DocumentDetailPage
                document={documentData}
                onBack={goBack}
                onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })}
                onSelectClient={(clientId) => navigateTo({ view: 'client', clientId })}
                onSelectLawyer={(lawyerId) => navigateTo({ view: 'lawyer', lawyerId })}
                onEditDocument={(documentId) => navigateTo({ view: 'editDocument', documentId })}
            />;
        }
        navigateRoot('documents'); // Fallback
        return null;

      case 'documentForm':
        return <DocumentFormPage 
                  onBack={goBack}
                  onSave={(data) => {
                    console.log("Saving new document:", data);
                    goBack();
                  }}
                />;
      
      case 'editDocument':
        const docToEdit = getDocumentById(currentViewState.documentId);
        if (docToEdit) {
            return <DocumentFormPage
                initialData={docToEdit}
                onBack={goBack}
                onSave={(data) => {
                    console.log("Updating document:", data);
                    goBack();
                }}
            />;
        }
        navigateRoot('documents');
        return null;

      case 'reports':
        return <ReportsPage 
                onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })} 
                onSelectClient={(clientId) => navigateTo({ view: 'client', clientId })}
                onSelectLawyer={(lawyerId) => navigateTo({ view: 'lawyer', lawyerId })}
              />;
      
      case 'settings':
        return <SettingsPage onNavigate={navigateRoot} />;
      
      case 'roles':
        return <RolesListPage onNavigate={navigateTo} />;
      
      case 'role':
        const roleData = getRoleById(currentViewState.roleId);
        if (roleData) {
            return <RoleDetailPage
                role={roleData}
                onBack={goBack}
            />;
        }
        navigateRoot('roles');
        return null;

      case 'teams':
        return <TeamsListPage onNavigate={navigateTo} />;

      case 'team':
        if (currentViewState.teamId === 'new') {
          return <TeamDetailPage onBack={goBack} onSave={(data) => { console.log('Saving new team:', data); goBack(); }} />;
        }
        const teamData = getTeamById(currentViewState.teamId);
        if (teamData) {
          return <TeamDetailPage team={teamData} onBack={goBack} onSave={(data) => { console.log('Updating team:', data); goBack(); }} />;
        }
        navigateRoot('teams');
        return null;
      
      case 'users':
        return <UsersListPage onNavigate={navigateTo} />;

      case 'user':
        if (currentViewState.userId === 'new') {
            return <UserDetailPage onBack={goBack} onSave={(data) => { console.log('Saving new user:', data); goBack(); }} />;
        }
        const userData = getUserById(currentViewState.userId);
        if (userData) {
            return <UserDetailPage user={userData} onBack={goBack} onSave={(data) => { console.log('Updating user:', data); goBack(); }} />;
        }
        navigateRoot('users');
        return null;

      case 'dashboard':
      default:
        return <DashboardPage onSelectCase={(caseId) => navigateTo({ view: 'case', caseId })} />;
    }
  };

  return (
    <Layout currentView={currentViewState.view} onNavigate={navigateRoot}>
      {renderContent()}
    </Layout>
  );
};


const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
