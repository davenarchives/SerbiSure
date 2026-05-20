import { StyleSheet, View } from 'react-native';

type FaceOverlayProps = {
  active: boolean;
  verified: boolean;
};

export function FaceOverlay({ active, verified }: FaceOverlayProps) {
  return (
    <View pointerEvents="none" style={styles.container}>
      <View
        style={[
          styles.frame,
          active && styles.frameActive,
          verified && styles.frameVerified,
        ]}
      >
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    alignItems: 'center',
    aspectRatio: 1,
    borderColor: '#FFB43B',
    borderRadius: 220,
    borderWidth: 2,
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  frameActive: {
    borderColor: '#FFB43B',
  },
  frameVerified: {
    borderColor: '#2FA84F',
  },
  corner: {
    borderColor: 'transparent',
    height: 0,
    position: 'absolute',
    width: 0,
  },
  topLeft: {
    borderLeftWidth: 4,
    borderTopWidth: 4,
    left: 22,
    top: 26,
  },
  topRight: {
    borderRightWidth: 4,
    borderTopWidth: 4,
    right: 22,
    top: 26,
  },
  bottomLeft: {
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    bottom: 26,
    left: 22,
  },
  bottomRight: {
    borderBottomWidth: 4,
    borderRightWidth: 4,
    bottom: 26,
    right: 22,
  },
});
