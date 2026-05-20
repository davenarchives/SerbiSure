import { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Camera as VisionCamera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Camera as FaceDetectorCamera, type Face } from 'react-native-vision-camera-face-detector';

import { faceDetectorToLandmarkFrame } from '../face/mediapipeFaceTracker';
import type { LandmarkFrame } from '../face/types';

type FaceCameraProps = {
  onLandmarks: (frame: LandmarkFrame) => void;
};

export function FaceCamera({ onLandmarks }: FaceCameraProps) {
  const cameraRef = useRef<VisionCamera | null>(null);
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [previewSize, setPreviewSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    if (!hasPermission) {
      void requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPreviewSize({
      width: Math.max(width, 1),
      height: Math.max(height, 1),
    });
  }, []);

  const handleFacesDetected = useCallback(
    (faces: Face[]) => {
      const face = faces[0];
      if (!face) {
        return;
      }

      onLandmarks(faceDetectorToLandmarkFrame(face, previewSize.width, previewSize.height));
    },
    [onLandmarks, previewSize.height, previewSize.width],
  );

  if (!hasPermission) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackTitle}>Camera permission is required</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackTitle}>Front camera unavailable</Text>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill} onLayout={handleLayout}>
      <FaceDetectorCamera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        faceDetectionCallback={handleFacesDetected}
        faceDetectionOptions={{
          autoMode: true,
          cameraFacing: 'front',
          classificationMode: 'all',
          contourMode: 'all',
          landmarkMode: 'all',
          minFaceSize: 0.15,
          performanceMode: 'fast',
          windowHeight: previewSize.height,
          windowWidth: previewSize.width,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: '#F7F5F1',
    justifyContent: 'center',
    padding: 24,
  },
  fallbackTitle: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
