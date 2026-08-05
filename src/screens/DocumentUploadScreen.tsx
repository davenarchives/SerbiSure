import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { IDPhotoModal } from './IDPhotoModal';

const logoSource = require('../../assets/serbisure-logo.png');

function getFileName(uri: string | null, defaultName: string) {
  if (!uri) return defaultName;
  const raw = uri.split('/').pop()?.split('?')[0];
  if (raw && (raw.endsWith('.jpg') || raw.endsWith('.png') || raw.endsWith('.jpeg') || raw.endsWith('.pdf'))) {
    return raw;
  }
  return defaultName;
}

type DocumentUploadScreenProps = {
  role?: 'homeowner' | 'kasambahay';
  onBack?: () => void;
  onNext?: () => void;
  onCancel?: () => void;
  onSkip?: () => void;
};

export function DocumentUploadScreen({ role = 'kasambahay', onBack, onNext, onCancel, onSkip }: DocumentUploadScreenProps) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeBox, setActiveBox] = useState<'nbi' | 'police' | 'national' | null>(null);
  const [nbiImage, setNbiImage] = useState<string | null>(null);
  const [policeImage, setPoliceImage] = useState<string | null>(null);
  const [nationalImage, setNationalImage] = useState<string | null>(null);

  const handleBoxPress = (box: 'nbi' | 'police' | 'national') => {
    setActiveBox(box);
    setModalVisible(true);
  };

  const handlePickedImage = (uri: string) => {
    if (activeBox === 'nbi') setNbiImage(uri);
    else if (activeBox === 'police') setPoliceImage(uri);
    else if (activeBox === 'national') setNationalImage(uri);
  };

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
        <Text style={styles.subtitle}>Upload your documents to activate your profile</Text>
      </View>

      <View style={styles.alertBox}>
        <Ionicons name="alert-circle" size={16} color="#000" style={styles.alertIcon} />
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>Verification Process</Text>
          <Text style={styles.alertText}>Documents are securely stored and typically reviewed within 24 hours.</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.stepIndicator}>
          <View style={styles.stepDot} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />
        </View>

        <View style={styles.cardContent}>
          <View>
            {role === 'homeowner' ? (
              <Pressable style={[styles.uploadBox, !!nationalImage && styles.uploadBoxHasImage]} onPress={() => handleBoxPress('national')}>
                {nationalImage ? (
                  <View style={styles.attachmentContainer}>
                    <Image source={{ uri: nationalImage }} style={[styles.uploadPreview, styles.uploadPreviewHomeowner]} resizeMode="cover" />
                    <Text style={styles.fileNameTextItalic} numberOfLines={1}>
                      {getFileName(nationalImage, 'national_id_card.jpg')}
                    </Text>
                  </View>
                ) : (
                  <>
                    <Ionicons name="cloud-upload" size={28} color="#FFB43B" style={styles.uploadIcon} />
                    <Text style={styles.uploadTitle}>National ID</Text>
                    <Text style={styles.uploadSubtitle}>Tap or upload image</Text>
                    <Text style={styles.uploadMeta}>JPG, PNG, PDF (Max 5MB)</Text>
                  </>
                )}
              </Pressable>
            ) : (
              <>
                <Pressable style={[styles.uploadBox, styles.uploadBoxKasambahay, !!nbiImage && styles.uploadBoxHasImage]} onPress={() => handleBoxPress('nbi')}>
                  {nbiImage ? (
                    <View style={styles.attachmentContainer}>
                      <Image source={{ uri: nbiImage }} style={styles.uploadPreview} resizeMode="cover" />
                      <Text style={styles.fileNameTextItalic} numberOfLines={1}>
                        {getFileName(nbiImage, 'nbi_clearance.jpg')}
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Ionicons name="cloud-upload" size={26} color="#FFB43B" style={styles.uploadIcon} />
                      <Text style={styles.uploadTitle}>NBI Clearance</Text>
                      <Text style={styles.uploadSubtitle}>Click or drag file to upload</Text>
                      <Text style={styles.uploadMeta}>JPG, PNG, PDF (Max 5MB)</Text>
                    </>
                  )}
                </Pressable>

                <Pressable style={[styles.uploadBox, styles.uploadBoxKasambahay, !!policeImage && styles.uploadBoxHasImage]} onPress={() => handleBoxPress('police')}>
                  {policeImage ? (
                    <View style={styles.attachmentContainer}>
                      <Image source={{ uri: policeImage }} style={styles.uploadPreview} resizeMode="cover" />
                      <Text style={styles.fileNameTextItalic} numberOfLines={1}>
                        {getFileName(policeImage, 'police_clearance.jpg')}
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Ionicons name="cloud-upload" size={26} color="#FFB43B" style={styles.uploadIcon} />
                      <Text style={styles.uploadTitle}>Police Clearance</Text>
                      <Text style={styles.uploadSubtitle}>Click or drag file to upload</Text>
                      <Text style={styles.uploadMeta}>JPG, PNG, PDF (Max 5MB)</Text>
                    </>
                  )}
                </Pressable>
              </>
            )}
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

      <IDPhotoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPickedImage={handlePickedImage}
      />
    </View>
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
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
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#FFECCB',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginHorizontal: 20,
    marginBottom: 0,
  },
  alertIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 11,
    color: '#333',
    lineHeight: 14,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#777',
    borderStyle: 'dotted',
    borderRadius: 12,
    paddingVertical: 36,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
    backgroundColor: '#FAFAF8',
  },
  uploadBoxKasambahay: {
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 6,
  },
  uploadBoxHasImage: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F5F4F0',
  },
  uploadIcon: {
    marginBottom: 8,
  },
  attachmentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  uploadPreview: {
    width: '100%',
    height: 95,
    borderRadius: 8,
  },
  uploadPreviewHomeowner: {
    height: 140,
  },
  fileNameTextItalic: {
    fontStyle: 'italic',
    fontSize: 11,
    color: '#666666',
    marginTop: 6,
    textAlign: 'center',
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 11,
    color: '#555',
    marginBottom: 2,
  },
  uploadMeta: {
    fontSize: 9,
    color: '#999',
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
