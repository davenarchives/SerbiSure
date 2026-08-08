import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL, fetchWithTimeout } from '../config/api';

const logoSource = require('../../assets/serbisure-logo.png');
const heroSource = require('../../assets/landingpage.png');

type LandingScreenProps = {
  isLoginView?: boolean;
  onGetStarted?: () => void;
  onLoginPress?: () => void;
  onBackToLanding?: () => void;
  onLoginSuccess?: (token?: string) => void;
  onSignUp?: () => void;
};

export function LandingScreen({
  isLoginView = false,
  onGetStarted,
  onLoginPress,
  onBackToLanding,
  onLoginSuccess,
  onSignUp,
}: LandingScreenProps) {
  const insets = useSafeAreaInsets();
  const animProgress = useRef(new Animated.Value(isLoginView ? 1 : 0)).current;

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Animated.spring(animProgress, {
      toValue: isLoginView ? 1 : 0,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  }, [isLoginView]);

  const formatDjangoError = (data: any): string => {
    if (!data) return "An unexpected error occurred. Please try again.";
    if (typeof data === 'string') return data;
    if (data.detail) return String(data.detail);
    if (data.message) return String(data.message);

    if (typeof data === 'object') {
      const messages: string[] = [];
      for (const [key, value] of Object.entries(data)) {
        const fieldName = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());

        const valList = Array.isArray(value) ? value : [value];
        valList.forEach((msg) => {
          if (key === 'non_field_errors' || key === 'detail') {
            messages.push(msg);
          } else {
            messages.push(`${fieldName}: ${msg}`);
          }
        });
      }
      if (messages.length > 0) {
        return messages.join('\n');
      }
    }

    return "Invalid email or password. Please try again.";
  };

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/v1/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(formatDjangoError(data));
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.access);
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Unable to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Interpolated Animation Values
  const landingContentOpacity = animProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0.2, 0],
  });

  const landingContentTranslateY = animProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const loginCardOpacity = animProgress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.3, 1],
  });

  const loginCardTranslateY = animProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [140, 0],
  });

  const backBtnOpacity = animProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F7F6F2' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 14) }]}>
        
        {/* Animated Back Arrow for Login View */}
        <Animated.View
          pointerEvents={isLoginView ? 'auto' : 'none'}
          style={[styles.backBtnWrapper, { opacity: backBtnOpacity }]}
        >
          <Pressable onPress={onBackToLanding} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </Pressable>
        </Animated.View>

        {!isLoginView ? (
          /* LANDING PAGE CONTENT */
          <Animated.View
            pointerEvents="auto"
            style={[
              styles.landingContent,
              {
                opacity: landingContentOpacity,
                transform: [{ translateY: landingContentTranslateY }],
              },
            ]}
          >
            <View style={styles.animatedHeader}>
              <Image source={logoSource} style={styles.logo} resizeMode="contain" />
              <Text style={styles.brandTitle}>SerbiSure</Text>
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
              <Pressable
                style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
                onPress={onGetStarted}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward-outline" size={22} color="#FFFFFF" style={styles.buttonIcon} />
              </Pressable>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Pressable onPress={onLoginPress}>
                  <Text style={styles.loginLink}>Log in</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        ) : (
          /* LOGIN VIEW (Scrolls & Bumps Logo Up When Keyboard Appears) */
          <Animated.View
            pointerEvents="auto"
            style={[
              styles.loginViewWrapper,
              {
                opacity: loginCardOpacity,
                transform: [{ translateY: loginCardTranslateY }],
              },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollCard}
            >
              {/* Centered Login Header (Bumps up when typing) */}
              <View style={styles.loginHeader}>
                <Image source={logoSource} style={styles.loginLogo} resizeMode="contain" />
                <Text style={styles.loginBrandTitle}>SerbiSure</Text>
              </View>

              {/* Form Card */}
              <View style={styles.formCard}>
                {errorMsg ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={18} color="#E53935" />
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  </View>
                ) : null}

                {/* Email Field Container */}
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail" size={18} color="#000000" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Field Container */}
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed" size={18} color="#000000" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#000000"
                    />
                  </Pressable>
                </View>

                {/* Remember Me + Forgot Password Row */}
                <View style={styles.optionsRow}>
                  <Pressable style={styles.rememberRow} onPress={() => setRememberMe(!rememberMe)}>
                    <Ionicons
                      name={rememberMe ? "checkbox-outline" : "square-outline"}
                      size={18}
                      color="#000000"
                    />
                    <Text style={styles.rememberText}>Remember me</Text>
                  </Pressable>

                  <Pressable style={styles.forgotBtn}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </Pressable>
                </View>

                {/* Login Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.loginBtn,
                    (pressed || isLoading) && styles.btnPressed,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.loginBtnText}>Log in</Text>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </Pressable>

                {/* Hairline Divider */}
                <View style={styles.divider} />

                {/* Sign Up Link */}
                <View style={styles.signupRow}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <Pressable onPress={onSignUp}>
                    <Text style={styles.signupLink}>Sign up</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        )}

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#F7F6F2',
    flex: 1,
    paddingHorizontal: 24,
  },
  backBtnWrapper: {
    position: 'absolute',
    left: 20,
    top: 48,
    zIndex: 30,
  },
  backBtn: {
    padding: 6,
  },
  animatedHeader: {
    alignItems: 'center',
    marginBottom: 4,
  },
  logo: {
    height: 48,
    width: 48,
    marginBottom: 4,
  },
  brandTitle: {
    color: '#FFB43B',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  landingContent: {
    flex: 1,
    marginTop: 20,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 24,
  },
  title: {
    color: '#000000',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 12,
  },
  subtitle: {
    color: '#444444',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
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
    height: 52,
    marginBottom: 18,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
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
    fontSize: 12.5,
  },
  loginLink: {
    color: '#FFB43B',
    fontSize: 12.5,
    fontWeight: '600',
  },
  loginViewWrapper: {
    flex: 1,
    width: '100%',
  },
  scrollCard: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 24,
    paddingTop: 12,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginLogo: {
    width: 56,
    height: 56,
    marginBottom: 6,
  },
  loginBrandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFB43B',
    letterSpacing: -0.5,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 13.5,
    color: '#1A1A1A',
    height: '100%',
  },
  eyeBtn: {
    paddingLeft: 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 18,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rememberText: {
    fontSize: 12.5,
    color: '#333333',
  },
  forgotBtn: {
    paddingVertical: 2,
  },
  forgotText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFB43B',
  },
  loginBtn: {
    backgroundColor: '#FFB43B',
    borderRadius: 14,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.88,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 18,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 13,
    color: '#666',
  },
  signupLink: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0AA018',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorText: {
    color: '#E53935',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
});
