import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const logoSource = require('../../assets/serbisure-logo.png');

type RegistrationScreenProps = {
  role: 'homeowner' | 'kasambahay';
  onBack?: () => void;
  onNext?: () => void;
  onCancel?: () => void;
};

export function RegistrationScreen({ role, onBack, onNext, onCancel }: RegistrationScreenProps) {
  const insets = useSafeAreaInsets();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const isHomeowner = role === 'homeowner';

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <Pressable onPress={onBack}>
              <Ionicons name="arrow-back" size={26} color="#2A2925" />
            </Pressable>
          </View>
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
          <View style={[styles.headerSide, styles.headerSideRight]} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{isHomeowner ? 'Join as Homeowner' : 'Join as Kasambahay'}</Text>
          <Text style={styles.subtitle}>
            {isHomeowner 
              ? 'Join as a homeowner to find trusted professionals for your household.'
              : 'Start your journey as a trusted professional. Fill in your details below to create your Kasambahay profile.'}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.formContent}>
            <View style={{ paddingTop: 4 }}>
              <View style={styles.stepIndicator}>
                <View style={[styles.stepDot, styles.stepDotActive]} />
                <View style={styles.stepDot} />
                <View style={styles.stepDot} />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={16} color="#000" style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="" placeholderTextColor="#999" />
                </View>
              </View>

              {!isHomeowner && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Primary Specialization</Text>
                  <View style={styles.specializationRow}>
                    <View style={[styles.specTag, styles.specTagActive]}>
                      <Text style={styles.specTagEmoji}>🤝</Text>
                      <Text style={[styles.specTagText, styles.specTagTextActive]}>Nanny</Text>
                    </View>
                    <View style={styles.specTag}>
                      <Text style={styles.specTagEmoji}>🧹</Text>
                      <Text style={styles.specTagText}>Cleaner</Text>
                    </View>
                    <View style={styles.addSpecBtn}>
                      <Ionicons name="add" size={16} color="#000" />
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call" size={16} color="#000" style={styles.inputIcon} />
                  <TextInput style={styles.input} keyboardType="phone-pad" />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={16} color="#000" style={styles.inputIcon} />
                  <TextInput style={styles.input} keyboardType="email-address" autoCapitalize="none" />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={16} color="#000" style={styles.inputIcon} />
                  <TextInput style={styles.input} secureTextEntry />
                </View>
              </View>

              {isHomeowner && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={16} color="#000" style={styles.inputIcon} />
                    <TextInput style={styles.input} secureTextEntry />
                  </View>
                </View>
              )}

              <View style={styles.checkboxGroup}>
                <Pressable style={styles.checkboxRow} onPress={() => setTermsAccepted(!termsAccepted)}>
                  <Ionicons 
                    name={termsAccepted ? "checkbox-outline" : "square-outline"} 
                    size={16} 
                    color="#000" 
                  />
                  <Text style={styles.checkboxText}>
                    I consent to <Text style={styles.linkText}>Terms and Conditions</Text>.
                  </Text>
                </Pressable>

                <Pressable style={styles.checkboxRow} onPress={() => setPrivacyAccepted(!privacyAccepted)}>
                  <Ionicons 
                    name={privacyAccepted ? "checkbox-outline" : "square-outline"} 
                    size={16} 
                    color="#000" 
                  />
                  <Text style={styles.checkboxText}>
                    I consent to <Text style={styles.linkText}>Data Privacy Policy</Text>.
                  </Text>
                </Pressable>
              </View>
            </View>

            <View>
              <View style={styles.divider} />
              <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} onPress={onNext}>
                <Text style={styles.primaryButtonText}>Next</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]} onPress={onCancel}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#F6F5F2',
    flex: 1,
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
  logo: {
    height: 44,
    width: 44,
  },
  skipText: {
    color: '#FFB43B',
    fontSize: 14,
    fontWeight: '500',
  },
  titleBlock: {
    marginTop: 12,
    paddingHorizontal: 24,
  },
  title: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 29,
    marginBottom: 2,
  },
  subtitle: {
    color: '#444444',
    fontSize: 13,
    lineHeight: 17,
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#FFECCB',
    marginHorizontal: 24,
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  alertIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  card: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flex: 1,
    marginTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 14,
    width: '88%',
  },
  homeownerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  kasambahayContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  formContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dashIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dash: {
    width: 20,
    height: 3,
    backgroundColor: '#D1D1D1',
    borderRadius: 2,
  },
  dashActive: {
    backgroundColor: '#FFB43B',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#333',
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#444',
    marginBottom: 16,
  },
  uploadInfo: {
    fontSize: 10,
    color: '#888',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 34,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#000',
    height: '100%',
  },
  specializationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  specTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
  },
  specTagActive: {
    backgroundColor: '#FFECCB',
  },
  specTagEmoji: {
    marginRight: 6,
    fontSize: 14,
  },
  specTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
  },
  specTagTextActive: {
    color: '#000',
  },
  addSpecBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxGroup: {
    marginTop: 12,
    gap: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxText: {
    fontSize: 11,
    color: '#333333',
  },
  linkText: {
    color: '#9F5BFF',
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#707070',
    marginTop: 16,
    marginBottom: 12,
    width: '100%',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFB43B',
    height: 38,
    justifyContent: 'center',
    marginBottom: 12,
    marginHorizontal: 18,
  },
  buttonPressed: {
    opacity: 0.78,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
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
});
