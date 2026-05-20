import { StyleSheet, View } from 'react-native';

import type { LivenessStep } from '../liveness/livenessMachine';

const visibleSteps: LivenessStep[] = ['face', 'blink', 'turnLeft', 'still'];

type StepProgressProps = {
  currentStep: LivenessStep;
  completedSteps: LivenessStep[];
};

export function StepProgress({ currentStep, completedSteps }: StepProgressProps) {
  return (
    <View style={styles.container}>
      {visibleSteps.map((step) => {
        const completed =
          completedSteps.includes(step) ||
          (step === 'turnLeft' && completedSteps.includes('turnRight')) ||
          currentStep === 'verified';
        const active = currentStep === step || (step === 'turnLeft' && currentStep === 'turnRight');

        return <View key={step} style={[styles.bar, (active || completed) && styles.barActive]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#F0D9B2',
    borderRadius: 2,
    height: 4,
    width: 24,
  },
  barActive: {
    backgroundColor: '#FFB43B',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    minHeight: 18,
  },
});
