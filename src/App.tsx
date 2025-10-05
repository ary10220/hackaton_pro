import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { AstronomicalEvents } from './components/astronomical/AstronomicalEvents';
import { EventPlanner } from './components/planning/EventPlanner';
import { Recommendations } from './components/recommendations/Recommendations';
import { Community } from './components/community/Community';
import { Statistics } from './components/statistics/Statistics';
import { Alerts } from './components/alerts/Alerts';
import { Settings } from './components/settings/Settings';

function AppContent() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Cargando CLIMEXA...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'login') {
      return <LoginForm onBack={() => setAuthView('welcome')} />;
    }
    if (authView === 'register') {
      return <RegisterForm onBack={() => setAuthView('welcome')} />;
    }
    return (
      <WelcomeScreen
        onLogin={() => setAuthView('login')}
        onRegister={() => setAuthView('register')}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8">
        {activeTab === 'dashboard' && <DashboardHome />}
        {activeTab === 'plan' && <EventPlanner />}
        {activeTab === 'recommendations' && <Recommendations />}
        {activeTab === 'astronomical' && <AstronomicalEvents />}
        {activeTab === 'statistics' && <Statistics />}
        {activeTab === 'community' && <Community />}
        {activeTab === 'alerts' && <Alerts />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
