import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const logoSource = require('../../assets/serbisure-logo.png');
const homeownerSource = require('../../assets/homeowner.png');
const kasambahaySource = require('../../assets/kasambahay.png');

type RoleSelectionScreenProps = {
  onSelectRole?: (role: 'homeowner' | 'kasambahay') => void;
  onBack?: () => void;
};

export function RoleSelectionScreen({ onSelectRole, onBack }: RoleSelectionScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          {onBack ? (
            <Pressable onPress={onBack}>
              <Ionicons name="arrow-back" size={26} color="#2A2925" />
            </Pressable>
          ) : null}
        </View>
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerSide} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          How would <Text style={styles.titleHighlight}>you</Text>{'\n'}like to join?
        </Text>
        <Text style={styles.subtitle}>Choose the path to get started</Text>
      </View>

      <View style={styles.cardsContainer}>
        <Pressable 
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => onSelectRole?.('homeowner')}
        >
          <Image source={homeownerSource} style={styles.cardImage} />
          <View style={[styles.cardLabel, styles.homeownerLabel]}>
            <Text style={styles.cardLabelText}>I am a Homeowner</Text>
          </View>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => onSelectRole?.('kasambahay')}
        >
          <Image source={kasambahaySource} style={styles.cardImage} />
          <View style={[styles.cardLabel, styles.kasambahayLabel]}>
            <Text style={styles.cardLabelText}>I am a Kasambahay</Text>
          </View>
        </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  headerSide: {
    width: 44,
    justifyContent: 'center',
  },
  logo: {
    height: 44,
    width: 44,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    color: '#000000',
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  titleHighlight: {
    color: '#FFB43B',
  },
  subtitle: {
    color: '#333333',
    fontSize: 18,
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    gap: 20,
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EAEAEA',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardLabel: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  homeownerLabel: {
    backgroundColor: '#FFB43B',
  },
  kasambahayLabel: {
    backgroundColor: '#9F5BFF',
  },
  cardLabelText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
