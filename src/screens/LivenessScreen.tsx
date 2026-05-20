import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaceCamera, type FaceCameraHandle } from '../camera/FaceCamera';
import type { LandmarkFrame } from '../face/types';
import {
  advanceLiveness,
  initialLivenessState,
  retryCurrentStep,
  type LivenessResult,
  type LivenessState,
} from '../liveness/livenessMachine';
import { getFaceAlignment } from '../liveness/livenessRules';
import { StepProgress } from '../ui/StepProgress';

const logoSource = require('../../assets/face-placeholder.png');
const faceSource = require('../../assets/happybird-logo.png');

type LivenessScreenProps = {
  onVerified?: (result: LivenessResult) => void;
};

type LivenessRingProps = {
  progress: number;
  showFaceIcon: boolean;
  showCheck: boolean;
};

function LivenessRing({ progress, showFaceIcon, showCheck }: LivenessRingProps) {
  const size = 226;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const arcPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.addArc(
      {
        x: strokeWidth / 2,
        y: strokeWidth / 2,
        width: size - strokeWidth,
        height: size - strokeWidth,
      },
      -128,
      Math.min(Math.max(progress, 0), 1) * 360,
    );
    return path;
  }, [progress]);

  return (
    <View style={styles.ringBox}>
      <Canvas style={styles.ringCanvas}>
        <Circle cx={size / 2} cy={size / 2} r={radius} color="#FFB43B" style="stroke" strokeWidth={2} />
        <Path path={arcPath} color="#0AA018" style="stroke" strokeWidth={strokeWidth} strokeCap="round" />
      </Canvas>
      {showFaceIcon ? <Image source={faceSource} style={styles.faceIcon} resizeMode="contain" /> : null}
      {showCheck ? (
        <View style={styles.checkCircle}>
          <View style={styles.checkShort} />
          <View style={styles.checkLong} />
        </View>
      ) : null}
    </View>
  );
}

function getRingProgress(state: LivenessState) {
  if (state.verified) {
    return 1;
  }

  if (state.step === 'still') {
    return 0.75 + state.stillnessProgress * 0.25;
  }

  if (state.step === 'turnRight') {
    return 0.5;
  }

  if (state.step === 'turnLeft') {
    return 0.25;
  }

  return state.completedSteps.includes('face') ? 0.25 : 0;
}

function getInstruction(state: LivenessState, showTrackerNotice: boolean, countdownValue: number | null) {
  if (showTrackerNotice) {
    return 'Position your face inside the frame';
  }

  if (state.step === 'face') {
    return 'Position your face inside the frame';
  }

  if (state.step === 'turnLeft') {
    return 'Look Left';
  }

  if (state.step === 'turnRight') {
    return 'Look Right';
  }

  if (state.step === 'still' && countdownValue !== null) {
    return countdownValue > 0 ? `Face forward and stay still` : 'Face forward and stay still';
  }

  return 'Face forward and stay still';
}

export function LivenessScreen({ onVerified }: LivenessScreenProps) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<FaceCameraHandle | null>(null);
  const captureStartedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState(initialLivenessState);
  const [faceCentered, setFaceCentered] = useState(false);
  const [lastLandmarkAt, setLastLandmarkAt] = useState<number | null>(null);
  const [showTrackerNotice, setShowTrackerNotice] = useState(false);
  const [showCenterCheck, setShowCenterCheck] = useState(false);
  const [capturedSelfiePath, setCapturedSelfiePath] = useState<string | null>(null);

  useEffect(() => {
    if (!started) {
      return undefined;
    }

    const timer = setTimeout(() => {
      if (lastLandmarkAt === null) {
        setShowTrackerNotice(true);
      }
    }, 2600);

    return () => clearTimeout(timer);
  }, [lastLandmarkAt, started]);

  const handleLandmarks = useCallback((frame: LandmarkFrame) => {
    setLastLandmarkAt(Date.now());
    setShowTrackerNotice(false);
    setFaceCentered(getFaceAlignment(frame).centered);
    setState((current) => {
      const next = advanceLiveness(current, frame);
      if (next.completedSteps.length > current.completedSteps.length) {
        setShowCenterCheck(true);
        setTimeout(() => setShowCenterCheck(false), 650);
      }

      if (!current.verified && next.verified) {
        setShowCenterCheck(true);
        setTimeout(() => setShowCenterCheck(false), 1000);
      }

      return next;
    });
  }, []);

  useEffect(() => {
    if (!started || !state.verified || captureStartedRef.current) {
      return;
    }

    captureStartedRef.current = true;
    void cameraRef.current?.captureSelfie().then((selfiePath) => {
      setCapturedSelfiePath(selfiePath);
      onVerified?.({
        verified: true,
        completedAt: Date.now(),
        selfiePath: selfiePath ?? undefined,
      });
    });
  }, [onVerified, started, state.verified]);

  const countdownValue = useMemo(() => {
    if (state.step !== 'still' || state.verified) {
      return null;
    }

    return Math.max(1, Math.ceil(3 - state.stillnessProgress * 3));
  }, [state.step, state.stillnessProgress, state.verified]);

  const instruction = started
    ? getInstruction(state, showTrackerNotice, countdownValue)
    : 'Make sure your selfie is within the frame and you are in a well lit area. Remove anything on your face like a face mask or sunglasses.';
  const ringProgress = started ? getRingProgress(state) : 0;
  const showFaceIcon = !started;

  const handleContinue = useCallback(() => {
    setStarted(true);
    setState(initialLivenessState);
    setFaceCentered(false);
    setShowTrackerNotice(false);
    setShowCenterCheck(false);
    setLastLandmarkAt(null);
    setCapturedSelfiePath(null);
    captureStartedRef.current = false;
  }, []);

  const handleRetry = useCallback(() => {
    setState((current) => retryCurrentStep(current));
    setFaceCentered(false);
    setShowCenterCheck(false);
    setCapturedSelfiePath(null);
    captureStartedRef.current = false;
  }, []);

  const handleCancel = useCallback(() => {
    setState(initialLivenessState);
    setStarted(false);
    setFaceCentered(false);
    setShowTrackerNotice(false);
    setShowCenterCheck(false);
    setCapturedSelfiePath(null);
    captureStartedRef.current = false;
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={styles.header}>
        <Ionicons name="arrow-back-outline" size={30} color="#2A2925" style={styles.backIcon} />
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        <Text style={styles.skipText}>Skip</Text>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>Take a selfie to verify your identity</Text>
      </View>

      <View style={styles.card}>
        <StepProgress currentStep={state.step} completedSteps={state.completedSteps} />

        <View style={styles.verificationFrame}>
          {capturedSelfiePath ? (
            <Image source={{ uri: `file://${capturedSelfiePath}` }} style={styles.capturedSelfie} resizeMode="cover" />
          ) : started ? (
            <View style={styles.cameraCircle}>
              <FaceCamera ref={cameraRef} onLandmarks={handleLandmarks} />
            </View>
          ) : null}
          <LivenessRing progress={ringProgress} showFaceIcon={showFaceIcon} showCheck={started && showCenterCheck} />
          {started && countdownValue !== null ? (
            <View style={styles.countdownBadge}>
              <Text style={styles.countdownText}>{countdownValue}</Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.instruction, !started && styles.helperInstruction]}>
          {instruction}
        </Text>

        <View style={styles.divider} />

        {!started ? (
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        ) : state.retryMessage ? (
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} onPress={handleRetry}>
            <Text style={styles.primaryButtonText}>Finish</Text>
          </Pressable>
        ) : (
          <View style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Finish</Text>
          </View>
        )}

        <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]} onPress={handleCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backIcon: {
    width: 52,
  },
  buttonPressed: {
    opacity: 0.78,
  },
  card: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    marginTop: 44,
    minHeight: 528,
    paddingBottom: 18,
    paddingHorizontal: 18,
    paddingTop: 8,
    width: '88%',
  },
  cameraCircle: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 113,
    overflow: 'hidden',
  },
  capturedSelfie: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 113,
    height: '100%',
    width: '100%',
  },
  checkCircle: {
    alignItems: 'center',
    backgroundColor: '#14A11C',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    width: 50,
  },
  checkLong: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    height: 26,
    left: 27,
    position: 'absolute',
    top: 11,
    transform: [{ rotate: '42deg' }],
    width: 5,
  },
  checkShort: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    height: 14,
    left: 17,
    position: 'absolute',
    top: 22,
    transform: [{ rotate: '-45deg' }],
    width: 5,
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: 46,
    fontWeight: '900',
    lineHeight: 52,
    textAlign: 'center',
  },
  countdownBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.44)',
    borderRadius: 44,
    height: 88,
    justifyContent: 'center',
    position: 'absolute',
    width: 88,
  },
  divider: {
    backgroundColor: '#707070',
    height: StyleSheet.hairlineWidth,
    marginBottom: 14,
    marginTop: 38,
    width: '100%',
  },
  faceIcon: {
    height: 128,
    width: 128,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  helperInstruction: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 17,
    marginTop: 26,
    paddingHorizontal: 14,
  },
  instruction: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 22,
    minHeight: 44,
    textAlign: 'center',
  },
  logo: {
    height: 42,
    width: 62,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFB43B',
    height: 38,
    justifyContent: 'center',
    marginBottom: 12,
    marginHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  ringBox: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 226,
    justifyContent: 'center',
    width: 226,
  },
  ringCanvas: {
    ...StyleSheet.absoluteFillObject,
  },
  root: {
    backgroundColor: '#F6F5F2',
    flex: 1,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#FFB43B',
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    marginHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#FFA51F',
    fontSize: 14,
    fontWeight: '500',
  },
  skipText: {
    color: '#FFA51F',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    width: 52,
  },
  subtitle: {
    color: '#202020',
    fontSize: 13,
    lineHeight: 16,
    marginTop: 2,
  },
  title: {
    color: '#000000',
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 33,
  },
  titleBlock: {
    marginTop: 28,
    paddingHorizontal: 24,
  },
  verificationFrame: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 226,
    justifyContent: 'center',
    marginTop: 36,
    width: 226,
  },
});
