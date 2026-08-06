import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from './src/context/LanguageContext';

import {
  LandingScreen,
  LoginScreen,
  UserSelectionScreen,
  RegistrationStep1,
  RegistrationStep2,
  RegistrationStep3,
} from './src/screens';
import { BottomTabNavigator, type Role } from './src/navigation/BottomTabNavigator';

// Clean App Navigation Flow matching Figma structure:
// landing -> login -> user_selection -> registration1-3 -> dashboard (bottom tab navigator)
type AppFlowState =
  | 'landing'
  | 'login'
  | 'user_selection'
  | 'registration1'
  | 'registration2'
  | 'registration3'
  | 'dashboard';

export default function App() {
  const [flowState, setFlowState] = useState<AppFlowState>('landing');
  const [selectedRole, setSelectedRole] = useState<Role>('homeowner');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setFlowState('registration1');
  };

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <StatusBar style={flowState === 'registration3' ? 'light' : 'dark'} />

        {/* Step 1: Landing Page */}
        {flowState === 'landing' && (
          <LandingScreen
            onGetStarted={() => setFlowState('user_selection')}
            onLogin={() => setFlowState('login')}
          />
        )}

        {/* Step 1.5: Login Screen */}
        {flowState === 'login' && (
          <LoginScreen
            onLoginSuccess={(token?: string) => {
              if (token) setAccessToken(token);
              setFlowState('dashboard');
            }}
            onSignUp={() => setFlowState('user_selection')}
            onBack={() => setFlowState('landing')}
          />
        )}

        {/* Step 2: User Selection (Homeowner / Kasambahay) */}
        {flowState === 'user_selection' && (
          <UserSelectionScreen
            onSelectRole={handleSelectRole}
            onBack={() => setFlowState('landing')}
          />
        )}

        {/* Step 3: Registration 1 - Account Form Details */}
        {flowState === 'registration1' && (
          <RegistrationStep1
            role={selectedRole}
            onBack={() => setFlowState('user_selection')}
            onNext={(token?: string) => {
              if (token) setAccessToken(token);
              setFlowState('registration2');
            }}
            onCancel={() => setFlowState('landing')}
          />
        )}

        {/* Step 4: Registration 2 - Verify Identity / Document Upload */}
        {flowState === 'registration2' && (
          <RegistrationStep2
            role={selectedRole}
            token={accessToken}
            onBack={() => setFlowState('registration1')}
            onNext={() => setFlowState('registration3')}
            onCancel={() => setFlowState('landing')}
            onSkip={() => setFlowState('dashboard')}
          />
        )}

        {/* Step 5: Registration 3 - Take a Selfie / Liveness Verification */}
        {flowState === 'registration3' && (
          <RegistrationStep3
            token={accessToken}
            onVerified={(result) => {
              if (result.selfiePath) {
                const uri = result.selfiePath.startsWith('data:') || result.selfiePath.startsWith('file:')
                  ? result.selfiePath
                  : `file://${result.selfiePath}`;
                setAvatarUri(uri);
              }
              setFlowState('dashboard');
            }}
            onBack={() => setFlowState('registration2')}
            onCancel={() => setFlowState('landing')}
            onSkip={() => setFlowState('dashboard')}
          />
        )}

        {/* Step 6: Main Dashboard (Bottom Tab Navigator - Home, Services/Jobs, Chats, Profile) */}
        {flowState === 'dashboard' && (
          <BottomTabNavigator
            role={selectedRole}
            avatarUri={avatarUri}
            onUpdateAvatar={(uri: string) => setAvatarUri(uri)}
            onLogout={() => setFlowState('login')}
          />
        )}
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
