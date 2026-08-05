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

const logoSource = require('../../assets/serbisure-logo.png');
const faceSource = require('../../assets/face-placeholder.png');

type LivenessScreenProps = {
  onVerified?: (result: LivenessResult) => void;
  onBack?: () => void;
  onCancel?: () => void;
  onSkip?: () => void;
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
        <Circle cx={size / 2} cy={size / 2} r={(size - 2) / 2} color="#FFB43B" style="stroke" strokeWidth={2} />
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
  if (state.verified) {
    return 'Verification Complete!';
  }

  if (showTrackerNotice) {
    return 'Position your face\ninside the frame';
  }

  if (state.step === 'face') {
    return 'Position your face\ninside the frame';
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

export function LivenessScreen({ onVerified, onBack, onCancel, onSkip }: LivenessScreenProps) {
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
      }

      return next;
    });
  }, []);

  useEffect(() => {
    if (!started || !state.verified || captureStartedRef.current) {
      return;
    }

    captureStartedRef.current = true;
    setShowCenterCheck(true);

    void cameraRef.current?.captureSelfie().then((selfiePath) => {
      if (selfiePath) {
        setCapturedSelfiePath(selfiePath);
      }
      setTimeout(() => {
        onVerified?.({
          verified: true,
          completedAt: Date.now(),
          selfiePath: selfiePath ?? undefined,
        });
      }, 900);
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
    : 'Make sure your selfie is within the frame and you\'re in a well lit area. Remove anything on your face like a face mask or sunglasses.';
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
    onCancel?.();
  }, [onCancel]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Pressable onPress={onBack}>
            <Ionicons name="arrow-back" size={26} color="#2A2925" />
          </Pressable>
        </View>
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <Pressable onPress={onSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>Take a selfie to verify your identity</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.stepIndicator}>
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
        </View>

        <View style={styles.cardContent}>
          <View>
            <View style={styles.verificationFrame}>
              {capturedSelfiePath ? (
                <Image
                  source={{
                    uri: capturedSelfiePath.startsWith('file://') || capturedSelfiePath.startsWith('data:')
                      ? capturedSelfiePath
                      : `file://${capturedSelfiePath}`,
                  }}
                  style={styles.capturedSelfie}
                  resizeMode="cover"
                />
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
          </View>

          <View>
            <View style={styles.divider} />
            {!started ? (
              <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} onPress={handleContinue}>
                <Text style={styles.primaryButtonText}>Continue</Text>
              </Pressable>
            ) : state.retryMessage ? (
              <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} onPress={handleRetry}>
                <Text style={styles.primaryButtonText}>Continue</Text>
              </Pressable>
            ) : (
              <View style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Continue</Text>
              </View>
            )}
            <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]} onPress={handleCancel}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.78,
  },
  card: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    flex: 1,
    marginTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 18,
    paddingTop: 8,
    width: '88%',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
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
    marginBottom: 12,
    marginTop: 16,
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
    width: '100%',
  },
  headerSide: {
    width: 44,
    justifyContent: 'center',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  helperInstruction: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 17,
    marginTop: 32,
    paddingHorizontal: 14,
  },
  instruction: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 32,
    minHeight: 48,
    textAlign: 'center',
  },
  logo: {
    height: 44,
    width: 44,
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
  },
  titleBlock: {
    height: 64,
    marginTop: 12,
    paddingHorizontal: 24,
  },
  title: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
    marginBottom: 2,
  },
  subtitle: {
    color: '#202020',
    fontSize: 13,
    lineHeight: 17,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    marginTop: 4,
  },
  stepDot: {
    width: 24,
    height: 4,
    backgroundColor: '#D9D9D9',
    borderRadius: 2,
  },
  stepDotActive: {
    backgroundColor: '#FFB43B',
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
