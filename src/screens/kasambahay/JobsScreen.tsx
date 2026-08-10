import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { chatStore } from '../../store/chatStore';
import { ChatDetailScreen } from '../ChatDetailScreen';

const logoSource = require('../../../assets/serbisure-logo.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

export interface JobOpening {
  id: number;
  employerName: string;
  title: string;
  location: string;
  description: string;
  price: string;
  unit: string;
  tags: string[];
  image: string;
  avatar: string;
}

const INITIAL_JOB_OPENINGS: JobOpening[] = [
  {
    id: 1,
    employerName: 'Camille Prats',
    title: 'Full-time Housekeeper',
    location: 'Makati City',
    description: 'Looking for experienced detailed-oriented staff for a 3-bedroom unit.',
    price: 'P 18,000',
    unit: 'per month',
    tags: ['Verified Employer', 'STAY-IN'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 2,
    employerName: 'Sabrina Reyes',
    title: 'Private Nanny for Toddler',
    location: 'Bonifacio Global City',
    description: 'Energetic nanny needed for 3yo child. First aid certified preferred.',
    price: 'P 20,000',
    unit: 'per month',
    tags: ['Verified Employer', 'NEARBY'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 3,
    employerName: 'Joshua Asucal',
    title: 'Family Cook & Meal Prep',
    location: 'Quezon City',
    description: 'Weekly meal prep and healthy cooking for a family of 4.',
    price: 'P 3,500',
    unit: 'per service',
    tags: ['Verified Employer', 'PART-TIME'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 4,
    employerName: 'Daniela Mondragon',
    title: 'Senior Caregiver & Companion',
    location: 'Mandaluyong City',
    description: 'Compassionate caregiver for elderly grandmother. Light housekeeping.',
    price: 'P 22,000',
    unit: 'per month',
    tags: ['Verified Employer', 'STAY-IN'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 5,
    employerName: 'Maria Santos',
    title: 'All-Around Kasambahay',
    location: 'Pasig City',
    description: 'General house cleaning, laundry, ironing, and daily meal preparation.',
    price: 'P 16,500',
    unit: 'per month',
    tags: ['Verified Employer', 'FULL-TIME'],
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 6,
    employerName: 'Victoria Zobel',
    title: 'Deep Cleaner & Laundry Specialist',
    location: 'Alabang, Muntinlupa',
    description: 'Bi-weekly deep cleaning and wardrobe laundry care for modern residence.',
    price: 'P 4,000',
    unit: 'per day',
    tags: ['Verified Employer', 'PART-TIME'],
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  },
];

const FILTER_TABS = ['Stay-in', 'Part-time', 'Nearby'];

export function JobsScreen({ onViewProfile, token }: { onViewProfile?: () => void, token?: string | null } = {}) {
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOB_OPENINGS);
  const [activeFilter, setActiveFilter] = useState('Stay-in');
  const [activeChat, setActiveChat] = useState<{
    visible: boolean;
    name: string;
    role: string;
    avatar: string;
    initialMessage?: string;
  }>({
    visible: false,
    name: '',
    role: '',
    avatar: '',
  });

  // Floating Count (+1 / -1) Animation Values
  const plusAnim = useRef(new Animated.Value(0)).current;
  const minusAnim = useRef(new Animated.Value(0)).current;

  // Card Swipe Gesture Animated Values
  const position = useRef(new Animated.ValueXY()).current;

  const showCountAnimation = (type: 'plus' | 'minus') => {
    const targetAnim = type === 'plus' ? plusAnim : minusAnim;
    targetAnim.setValue(1);
    Animated.timing(targetAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const removeCurrentCard = (swipedRight: boolean) => {
    const currentJob = jobs[0];
    if (!currentJob) return;

    if (swipedRight) {
      showCountAnimation('plus');
      chatStore.addOrUpdateChat({
        id: currentJob.id + 100,
        name: currentJob.employerName,
        badge: 'Homeowner',
        avatar: currentJob.avatar,
        time: 'Just now',
        message: 'I am interested in this job position',
        online: true,
      });

      // Directly open ChatDetailScreen modal with auto message!
      setActiveChat({
        visible: true,
        name: currentJob.employerName,
        role: 'Homeowner',
        avatar: currentJob.avatar,
        initialMessage: 'I am interested in this job position',
      });
    } else {
      showCountAnimation('minus');
    }

    setJobs((prev) => prev.slice(1));
    position.setValue({ x: 0, y: 0 });
  };

  const swipeCard = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => removeCurrentCard(direction === 'right'));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          swipeCard('right');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          swipeCard('left');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Card Rotation
  const rotateCard = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  // Button Color & Highlight Interpolations
  const passBgColor = position.x.interpolate({
    inputRange: [-150, -20, 0],
    outputRange: ['#E53935', '#FFEBEE', '#FFFFFF'],
    extrapolate: 'clamp',
  });

  const passBorderColor = position.x.interpolate({
    inputRange: [-150, -20, 0],
    outputRange: ['#E53935', '#FFCDD2', '#FFCDD2'],
    extrapolate: 'clamp',
  });

  const passHighlightOpacity = position.x.interpolate({
    inputRange: [-120, -15, 0],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });

  const likeBgColor = position.x.interpolate({
    inputRange: [0, 20, 150],
    outputRange: ['#FFFFFF', '#E8F5E9', '#4CD964'],
    extrapolate: 'clamp',
  });

  const likeBorderColor = position.x.interpolate({
    inputRange: [0, 20, 150],
    outputRange: ['#C8E6C9', '#C8E6C9', '#4CD964'],
    extrapolate: 'clamp',
  });

  const likeHighlightOpacity = position.x.interpolate({
    inputRange: [0, 15, 120],
    outputRange: [0, 0.4, 1],
    extrapolate: 'clamp',
  });

  // Card Stack
  const card0 = jobs[0];
  const card1 = jobs[1];
  const card2 = jobs[2];

  const handleResetDeck = () => {
    setJobs(INITIAL_JOB_OPENINGS);
    position.setValue({ x: 0, y: 0 });
  };

  return (
    <View style={styles.container}>
      {/* Top Status Bar Spacer */}
      <View style={{ height: insets.top, backgroundColor: '#F6F5F2', zIndex: 10 }} />

      {/* Header Logo & Bell */}
      <View style={[styles.headerTop, { paddingTop: 8 }]}>
        <View style={styles.headerSide} />
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <Ionicons name="notifications" size={24} color="#333" />
        </View>
      </View>

      {/* Yellow Title Banner */}
      <View style={styles.greetingBanner}>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.headerTitle}>Job Openings</Text>
          <Text style={styles.headerSubtitle}>
            {jobs.length > 0 ? `${jobs.length} opportunities available nearby` : 'No more jobs left nearby'}
          </Text>
        </View>
      </View>

      {/* Filter Chips Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <Pressable style={[styles.filterChip, styles.filterChipOutline]}>
          <Ionicons name="funnel-outline" size={14} color="#FFB43B" style={{ marginRight: 6 }} />
          <Text style={[styles.filterText, { color: '#FFB43B', fontWeight: '700' }]}>Filters</Text>
        </Pressable>
        <View style={styles.filterDivider} />
        {FILTER_TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.filterChip, activeFilter === tab && styles.filterChipActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterText, activeFilter === tab && styles.filterTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Vertical Stacked Cards Deck Area */}
      <View style={styles.cardsContainer}>
        {jobs.length === 0 ? (
          <View style={styles.emptyDeckCard}>
            <Ionicons name="checkmark-circle-outline" size={56} color="#FFB43B" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>You've reviewed all jobs!</Text>
            <Text style={styles.emptySub}>Check back later or reset the deck to review again.</Text>
            <Pressable style={styles.resetBtn} onPress={handleResetDeck}>
              <Ionicons name="reload" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.resetBtnText}>Refresh Deck</Text>
            </Pressable>
          </View>
        ) : (
          <React.Fragment>
            {/* Card 2 (Deepest Stack) */}
            {card2 && (
              <View style={[styles.stackedCard, styles.stackedCardDeep]}>
                <ImageBackground source={{ uri: card2.image }} style={styles.mainCard} imageStyle={styles.mainCardImage}>
                  <View style={styles.cardGradientOverlay} />
                </ImageBackground>
              </View>
            )}

            {/* Card 1 (Middle Stack) */}
            {card1 && (
              <View style={[styles.stackedCard, styles.stackedCardMid]}>
                <ImageBackground source={{ uri: card1.image }} style={styles.mainCard} imageStyle={styles.mainCardImage}>
                  <View style={styles.cardGradientOverlay} />
                </ImageBackground>
              </View>
            )}

            {/* Card 0 (Front Swipable Card) */}
            {card0 && (
              <Animated.View
                style={[
                  styles.stackedCard,
                  styles.stackedCardFront,
                  {
                    transform: [
                      { translateX: position.x },
                      { translateY: position.y },
                      { rotate: rotateCard },
                    ],
                  },
                ]}
                {...panResponder.panHandlers}
              >
                <ImageBackground
                  source={{ uri: card0.image }}
                  style={styles.mainCard}
                  imageStyle={styles.mainCardImage}
                >
                  <View style={styles.cardGradient}>
                    <View style={styles.cardInfoTop} />
                    <View style={styles.cardInfoBottom}>
                      <Text style={styles.workerName}>{card0.title}</Text>
                      <Text style={styles.workerLocation}>{card0.location}</Text>
                      <Text style={styles.workerRole}>{card0.description}</Text>

                      <View style={styles.tagsPriceRow}>
                        <View style={styles.tagsContainer}>
                          {card0.tags.map((tag) => (
                            <View key={tag} style={styles.tag}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                        <View style={styles.priceContainer}>
                          <Text style={styles.priceAmount}>{card0.price}</Text>
                          <Text style={styles.priceUnit}>{card0.unit}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </Animated.View>
            )}
          </React.Fragment>
        )}
      </View>

      {/* Action Buttons (X and Heart) with Interactive Drag Highlights & Floating +1 / -1 */}
      <View style={styles.actionButtonsContainer}>
        {/* Pass Button & Floating -1 Indicator */}
        <View style={styles.actionBtnWrapper}>
          <Animated.View
            style={[
              styles.countFloat,
              {
                opacity: minusAnim,
                transform: [
                  {
                    translateY: minusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, -5],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.minusCountText}>-1</Text>
          </Animated.View>

          <Pressable
            onPress={() => swipeCard('left')}
            disabled={jobs.length === 0}
          >
            <Animated.View
              style={[
                styles.actionBtn,
                {
                  backgroundColor: passBgColor,
                },
              ]}
            >
              {/* Default Red Icon */}
              <Ionicons name="close" size={22} color="#E53935" />
              {/* Highlighted White Icon */}
              <Animated.View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: passHighlightOpacity,
                  },
                ]}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </Animated.View>
            </Animated.View>
          </Pressable>
        </View>

        {/* Interested Button & Floating +1 Indicator */}
        <View style={styles.actionBtnWrapper}>
          <Animated.View
            style={[
              styles.countFloat,
              {
                opacity: plusAnim,
                transform: [
                  {
                    translateY: plusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, -5],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.plusCountText}>+1</Text>
          </Animated.View>

          <Pressable
            onPress={() => swipeCard('right')}
            disabled={jobs.length === 0}
          >
            <Animated.View
              style={[
                styles.actionBtn,
                {
                  backgroundColor: likeBgColor,
                },
              ]}
            >
              {/* Default Green Icon */}
              <Ionicons name="heart" size={20} color="#4CD964" />
              {/* Highlighted White Icon */}
              <Animated.View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: likeHighlightOpacity,
                  },
                ]}
              >
                <Ionicons name="heart" size={20} color="#FFFFFF" />
              </Animated.View>
            </Animated.View>
          </Pressable>
        </View>
      </View>

      {/* Messenger-style Chat Detail Modal */}
      <ChatDetailScreen
        visible={activeChat.visible}
        onClose={() => setActiveChat((prev) => ({ ...prev, visible: false }))}
        contactName={activeChat.name}
        contactRole={activeChat.role}
        contactAvatar={activeChat.avatar}
        initialMessage={activeChat.initialMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F5F2',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 6,
    width: '100%',
  },
  headerSide: {
    width: 44,
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  logo: {
    width: 44,
    height: 44,
  },
  greetingBanner: {
    backgroundColor: '#FFECCB',
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  filterScroll: {
    maxHeight: 46,
    marginVertical: 10,
  },
  filterContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#FFB43B',
    borderColor: '#FFB43B',
  },
  filterChipOutline: {
    borderColor: '#FFB43B',
  },
  filterText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filterDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#FFB43B',
    opacity: 0.6,
    marginRight: 10,
  },
  cardsContainer: {
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 6,
  },
  stackedCard: {
    position: 'absolute',
    borderRadius: 24,
    overflow: 'hidden',
  },
  stackedCardFront: {
    width: SCREEN_WIDTH - 48,
    height: 380,
    zIndex: 10,
  },
  stackedCardMid: {
    width: SCREEN_WIDTH - 64,
    height: 380,
    top: -12,
    zIndex: 5,
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  stackedCardDeep: {
    width: SCREEN_WIDTH - 80,
    height: 380,
    top: -24,
    zIndex: 2,
    opacity: 0.65,
    transform: [{ scale: 0.92 }],
  },
  mainCard: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  mainCardImage: {
    borderRadius: 24,
  },
  cardGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.38)',
    padding: 20,
  },
  cardInfoTop: {
    flex: 1,
  },
  cardInfoBottom: {},
  workerName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  workerLocation: {
    fontSize: 13,
    color: '#FFB43B',
    fontWeight: '700',
    marginBottom: 6,
  },
  workerRole: {
    fontSize: 12,
    color: '#FFF',
    marginBottom: 12,
    lineHeight: 16,
  },
  tagsPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
    marginRight: 8,
  },
  tag: {
    backgroundColor: '#FFF0DB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#333',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  priceUnit: {
    fontSize: 10,
    color: '#FFF',
    opacity: 0.85,
  },
  emptyDeckCard: {
    width: SCREEN_WIDTH - 48,
    height: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  resetBtn: {
    backgroundColor: '#FFB43B',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    gap: 28,
  },
  actionBtnWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  countFloat: {
    position: 'absolute',
    top: -18,
    alignItems: 'center',
  },
  plusCountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4CD964',
  },
  minusCountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E53935',
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
});
