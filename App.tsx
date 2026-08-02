import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  LandingScreen,
  UserSelectionScreen,
  RegistrationStep1,
  RegistrationStep2,
  RegistrationStep3,
} from './src/screens';
import { BottomTabNavigator, type Role } from './src/navigation/BottomTabNavigator';

// Clean App Navigation Flow matching Figma structure:
// landing -> user_selection -> registration1-3 -> dashboard (bottom tab navigator)
type AppFlowState =
  | 'landing'
  | 'user_selection'
  | 'registration1'
  | 'registration2'
  | 'registration3'
  | 'dashboard';

export default function App() {
  const [flowState, setFlowState] = useState<AppFlowState>('landing');
  const [selectedRole, setSelectedRole] = useState<Role>('homeowner');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setFlowState('registration1');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style={flowState === 'registration3' ? 'light' : 'dark'} />

      {/* Step 1: Landing Page */}
      {flowState === 'landing' && (
        <LandingScreen onGetStarted={() => setFlowState('user_selection')} />
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
          onNext={() => setFlowState('registration2')}
          onCancel={() => setFlowState('landing')}
        />
      )}

      {/* Step 4: Registration 2 - Verify Identity / Document Upload */}
      {flowState === 'registration2' && (
        <RegistrationStep2
          role={selectedRole}
          onBack={() => setFlowState('registration1')}
          onNext={() => setFlowState('registration3')}
          onCancel={() => setFlowState('landing')}
          onSkip={() => setFlowState('dashboard')}
        />
      )}

      {/* Step 5: Registration 3 - Take a Selfie / Liveness Verification */}
      {flowState === 'registration3' && (
        <RegistrationStep3
          onVerified={(result) => {
            if (result.selfiePath) {
              setAvatarUri(`file://${result.selfiePath}`);
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
          onLogout={() => setFlowState('landing')}
        />
      )}
    </SafeAreaProvider>
  );
}
