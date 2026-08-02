import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const logoSource = require('../../assets/serbisure-logo.png');
const heroSource = require('../../assets/landingpage.png');

type LandingScreenProps = {
  onGetStarted?: () => void;
};

export function LandingScreen({ onGetStarted }: LandingScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.header}>
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brandText}>Serbisure</Text>
      </View>

      <View style={styles.heroContainer}>
        <Image source={heroSource} style={styles.heroImage} />
      </View>

      <View style={styles.contentBlock}>
        <Text style={styles.title}>Find the perfect help for your home</Text>
        <Text style={styles.subtitle}>
          SerbiSure connects Filipinos for reliable home services.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} onPress={onGetStarted}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward-outline" size={22} color="#FFFFFF" style={styles.buttonIcon} />
        </Pressable>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Pressable>
            <Text style={styles.loginLink}>Log in</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#F7F6F2',
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    height: 44,
    width: 44,
    marginBottom: 4,
  },
  brandText: {
    color: '#FFB43B',
    fontSize: 26,
    fontWeight: '600',
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 28,
    width: '100%',
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    resizeMode: 'cover',
  },
  contentBlock: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#000000',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  subtitle: {
    color: '#444444',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFB43B',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    marginBottom: 24,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    color: '#444444',
    fontSize: 12,
  },
  loginLink: {
    color: '#FFB43B',
    fontSize: 12,
    fontWeight: '600',
  },
});
