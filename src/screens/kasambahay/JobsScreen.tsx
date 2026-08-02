import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const logoSource = require('../../../assets/serbisure-logo.png');

const { width } = Dimensions.get('window');

const MOCK_JOB_OPENINGS = [
  {
    id: 1,
    title: 'Full-time Housekeeper',
    location: 'Makati City',
    description: 'Looking for experienced detailed-oriented staff.',
    price: 'P 18,000',
    unit: 'per hour',
    tags: ['Verified Employer', 'STAY-IN'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    title: 'Private Nanny for Toddler',
    location: 'Bonifacio Global City',
    description: 'Energetic nanny needed for 3yo child. First aid certified preferred.',
    price: 'P 20,000',
    unit: 'per month',
    tags: ['Verified Employer', 'NEARBY'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    title: 'Family Cook & Meal Prep',
    location: 'Quezon City',
    description: 'Weekly meal prep and healthy cooking for a family of 4.',
    price: 'P 3,500',
    unit: 'per service',
    tags: ['Verified Employer', 'PART-TIME'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
  },
];

const FILTER_TABS = ['Stay-in', 'Part-time', 'Nearby'];

export function JobsScreen() {
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState(MOCK_JOB_OPENINGS);
  const [activeFilter, setActiveFilter] = useState('Stay-in');

  const handleNext = () => {
    setJobs((prev) => {
      const arr = [...prev];
      const first = arr.shift()!;
      arr.push(first);
      return arr;
    });
  };

  const handlePrev = () => {
    setJobs((prev) => {
      const arr = [...prev];
      const last = arr.pop()!;
      arr.unshift(last);
      return arr;
    });
  };

  const leftJob = jobs[jobs.length - 1]!;
  const centerJob = jobs[0]!;
  const rightJob = jobs[1]!;

  return (
    <View style={styles.container}>
      {/* Header Logo & Bell */}
      <View style={[styles.headerTop, { paddingTop: insets.top + 8 }]}>
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
          <Text style={styles.headerSubtitle}>Found 42 opportunities near your area</Text>
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <Pressable style={[styles.filterChip, styles.filterChipOutline]}>
          <Ionicons name="options-outline" size={14} color="#FFB43B" style={{ marginRight: 4 }} />
          <Text style={[styles.filterText, { color: '#FFB43B' }]}>Filters</Text>
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

      {/* Swipe Cards Area */}
      <View style={styles.cardsContainer}>
        {/* Background peek card (Left) */}
        <ImageBackground
          source={{ uri: leftJob.image }}
          style={[styles.peekCard, styles.peekCardLeft]}
          imageStyle={styles.peekCardImage}
        >
          <View style={styles.peekCardOverlay} />
        </ImageBackground>

        {/* Background peek card (Right) */}
        <ImageBackground
          source={{ uri: rightJob.image }}
          style={[styles.peekCard, styles.peekCardRight]}
          imageStyle={styles.peekCardImage}
        >
          <View style={styles.peekCardOverlay} />
        </ImageBackground>

        {/* Floating Side Buttons (X and Heart) */}
        <Pressable style={[styles.floatingActionBtn, styles.floatingActionBtnLeft]} onPress={handleNext}>
          <Ionicons name="close" size={20} color="#E53935" />
        </Pressable>
        <Pressable style={[styles.floatingActionBtn, styles.floatingActionBtnRight]} onPress={handlePrev}>
          <Ionicons name="heart-outline" size={20} color="#4CD964" />
        </Pressable>

        {/* Main Card */}
        <ImageBackground
          source={{ uri: centerJob.image }}
          style={styles.mainCard}
          imageStyle={styles.mainCardImage}
        >
          <View style={styles.cardGradient}>
            <View style={styles.cardInfoTop} />
            <View style={styles.cardInfoBottom}>
              <Text style={styles.workerName}>{centerJob.title}</Text>
              <Text style={styles.workerLocation}>{centerJob.location}</Text>
              <Text style={styles.workerRole}>{centerJob.description}</Text>

              <View style={styles.tagsPriceRow}>
                <View style={styles.tagsContainer}>
                  {centerJob.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceAmount}>{centerJob.price}</Text>
                  <Text style={styles.priceUnit}>{centerJob.unit}</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Pressable style={[styles.actionBtn, { backgroundColor: '#FFB43B' }]}>
          <Ionicons name="chatbubble" size={24} color="#FFF" />
        </Pressable>
        <Pressable style={[styles.actionBtn, { backgroundColor: '#8F5CFF' }]}>
          <Ionicons name="bookmark" size={24} color="#FFF" />
        </Pressable>
      </View>
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
    marginBottom: 20,
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
    paddingVertical: 18,
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
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  filterScroll: {
    flexGrow: 0,
    marginTop: 10,
    marginBottom: 10,
  },
  filterContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  filterChipOutline: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FFB43B',
  },
  filterChipActive: {
    backgroundColor: '#FFB43B',
  },
  filterText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  filterDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#D1D1D1',
    marginRight: 10,
  },
  cardsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    height: width * 0.95,
    marginTop: 10,
    position: 'relative',
  },
  mainCard: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFB43B',
    zIndex: 10,
  },
  mainCardImage: {
    borderRadius: 18,
  },
  peekCard: {
    position: 'absolute',
    width: '84%',
    height: '84%',
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 5,
  },
  peekCardImage: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },
  peekCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  peekCardLeft: {
    left: 12,
  },
  peekCardRight: {
    right: 12,
  },
  floatingActionBtn: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    top: '50%',
    marginTop: -19,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingActionBtnLeft: {
    left: 21,
  },
  floatingActionBtnRight: {
    right: 21,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.32)',
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
    fontSize: 11,
    color: '#FFF',
    marginBottom: 12,
    lineHeight: 15,
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
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  priceUnit: {
    fontSize: 10,
    color: '#FFF',
    opacity: 0.85,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 20,
  },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});
