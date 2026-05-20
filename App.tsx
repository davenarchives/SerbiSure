import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LivenessScreen } from './src/screens/LivenessScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <LivenessScreen onVerified={(result) => console.log('Liveness result:', result)} />
    </SafeAreaProvider>
  );
}
