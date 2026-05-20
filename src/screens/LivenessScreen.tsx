import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaceCamera } from '../camera/FaceCamera';
import type { LandmarkFrame } from '../face/types';
import {
  advanceLiveness,
  initialLivenessState,
  retryCurrentStep,
  type LivenessResult,
  type LivenessState,
} from '../liveness/livenessMachine';
import { getFaceAlignment } from '../liveness/livenessRules';
import { FaceOverlay } from '../ui/FaceOverlay';
import { StepProgress } from '../ui/StepProgress';

type LivenessScreenProps = {
  onVerified?: (result: LivenessResult) => void;
};

const NEXT_DEMO_STATE: Record<LivenessState['step'], Partial<LivenessState>> = {
  face: { step: 'blink', completedSteps: ['face'], instruction: 'Please blink your eyes' },
  blink: { step: 'turnLeft', completedSteps: ['face', 'blink'], instruction: 'Turn your head left' },
  turnLeft: {
    step: 'turnRight',
    completedSteps: ['face', 'blink', 'turnLeft'],
    instruction: 'Turn your head right',
  },
  turnRight: {
    step: 'still',
    completedSteps: ['face', 'blink', 'turnLeft', 'turnRight'],
    instruction: 'Please stay still',
    stillnessProgress: 0.35,
  },
  still: {
    step: 'verified',
    completedSteps: ['face', 'blink', 'turnLeft', 'turnRight', 'still'],
    instruction: 'Face verification complete',
    verified: true,
    stillnessProgress: 1,
  },
  verified: {},
};

export function LivenessScreen({ onVerified }: LivenessScreenProps) {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState(initialLivenessState);
  const [faceCentered, setFaceCentered] = useState(false);
  const [lastLandmarkAt, setLastLandmarkAt] = useState<number | null>(null);
  const [showTrackerNotice, setShowTrackerNotice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (lastLandmarkAt === null) {
        setShowTrackerNotice(true);
      }
    }, 2600);

    return () => clearTimeout(timer);
  }, [lastLandmarkAt]);

  const handleLandmarks = useCallback(
    (frame: LandmarkFrame) => {
      setLastLandmarkAt(Date.now());
      setShowTrackerNotice(false);
      setFaceCentered(getFaceAlignment(frame).centered);
      setState((current) => {
        const next = advanceLiveness(current, frame);
        if (!current.verified && next.verified) {
          onVerified?.({ verified: true, completedAt: Date.now() });
        }
        return next;
      });
    },
    [onVerified],
  );

  const title = useMemo(() => {
    if (state.verified) {
      return 'Verified';
    }

    if (state.step === 'turnLeft' || state.step === 'turnRight') {
      return 'Head Movement';
    }

    if (state.step === 'still') {
      return 'Stillness Check';
    }

    if (state.step === 'blink') {
      return 'Blink Detection';
    }

    return 'Verify Your Identity';
  }, [state.step, state.verified]);

  const helperText = showTrackerNotice
    ? 'Face tracking has not detected a centered face yet. Stay in bright light and keep your whole face inside the circle.'
    : 'Make sure your selfie is within the frame and you are in a well lit area. Remove anything on your face like a face mask or sunglasses.';

  const handleRetry = useCallback(() => {
    setState((current) => retryCurrentStep(current));
    setFaceCentered(false);
  }, []);

  const handleFinish = useCallback(() => {
    setState((current) => {
      const patch = NEXT_DEMO_STATE[current.step];
      const next = {
        ...current,
        ...patch,
        retryMessage: null,
      };

      if (!current.verified && next.verified) {
        onVerified?.({ verified: true, completedAt: Date.now() });
      }

      return next;
    });
  }, [onVerified]);

  const handleCancel = useCallback(() => {
    setState(initialLivenessState);
    setFaceCentered(false);
    setShowTrackerNotice(false);
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 14, paddingBottom: Math.max(insets.bottom, 18) }]}>
      <View style={styles.header}>
        <Text style={styles.backIcon}>{'<'}</Text>
        <View style={styles.brandBadge}>
          <View style={styles.brandMoon} />
          <View style={styles.brandCircle}>
            <View style={styles.brandDot} />
          </View>
        </View>
        <Text style={styles.skipText}>Skip</Text>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Take a selfie to verify your identity</Text>
      </View>

      <View style={styles.card}>
        <StepProgress currentStep={state.step} completedSteps={state.completedSteps} />

        <View style={styles.cameraRing}>
          <View style={styles.cameraClip}>
            <FaceCamera onLandmarks={handleLandmarks} />
          </View>
          <FaceOverlay active={faceCentered} verified={state.verified} />
        </View>

        <Text style={styles.instruction}>{state.instruction}</Text>
        <Text style={[styles.helperText, showTrackerNotice && styles.noticeText]}>{helperText}</Text>

        {state.step === 'still' ? (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${state.stillnessProgress * 100}%` }]} />
          </View>
        ) : null}

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          onPress={state.retryMessage ? handleRetry : handleFinish}
        >
          <Text style={styles.primaryButtonText}>{state.retryMessage ? 'Retry' : 'Finish'}</Text>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]} onPress={handleCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backIcon: {
    color: '#2A2925',
    fontSize: 34,
    lineHeight: 34,
    width: 48,
  },
  brandBadge: {
    alignItems: 'center',
    backgroundColor: '#F7A900',
    borderRadius: 18,
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    width: 46,
  },
  brandCircle: {
    alignItems: 'center',
    backgroundColor: '#0B4C75',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    marginLeft: -3,
    width: 20,
  },
  brandDot: {
    backgroundColor: '#FFB43B',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  brandMoon: {
    backgroundColor: '#0B4C75',
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
    height: 22,
    width: 18,
  },
  buttonPressed: {
    opacity: 0.78,
  },
  cameraClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 112,
    overflow: 'hidden',
  },
  cameraRing: {
    alignSelf: 'center',
    backgroundColor: '#F7F5F1',
    borderRadius: 112,
    height: 220,
    marginBottom: 34,
    marginTop: 56,
    overflow: 'hidden',
    position: 'relative',
    width: 220,
  },
  card: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 108,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 10,
    width: '82%',
  },
  divider: {
    backgroundColor: '#6C6C6C',
    height: StyleSheet.hairlineWidth,
    marginBottom: 20,
    marginTop: 24,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  helperText: {
    color: '#252525',
    fontSize: 15,
    lineHeight: 19,
    minHeight: 76,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  instruction: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 8,
    textAlign: 'center',
  },
  noticeText: {
    color: '#8A5A00',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFB43B',
    borderRadius: 0,
    height: 38,
    justifyContent: 'center',
    marginHorizontal: 28,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  progressFill: {
    backgroundColor: '#FFB43B',
    borderRadius: 3,
    height: '100%',
  },
  progressTrack: {
    alignSelf: 'center',
    backgroundColor: '#F0D9B2',
    borderRadius: 3,
    height: 6,
    marginTop: 10,
    overflow: 'hidden',
    width: '72%',
  },
  root: {
    backgroundColor: '#F6F4F0',
    flex: 1,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#FFB43B',
    borderRadius: 0,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    marginHorizontal: 28,
  },
  secondaryButtonText: {
    color: '#FFA51F',
    fontSize: 16,
    fontWeight: '500',
  },
  skipText: {
    color: '#FFA51F',
    fontSize: 14,
    textAlign: 'right',
    width: 48,
  },
  subtitle: {
    color: '#202020',
    fontSize: 16,
    marginTop: 6,
  },
  title: {
    color: '#000000',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 39,
  },
  titleBlock: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
});
