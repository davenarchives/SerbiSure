import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const logoSource = require('../../../assets/serbisure-logo.png');

const { width } = Dimensions.get('window');

const MOCK_PROFILES = [
  {
    id: 1,
    name: 'Sisa',
    location: 'Quezon City',
    role: 'Experienced Yaya & Cook',
    years: '3 yrs',
    tags: ['Infant Care', 'Meal Prep'],
    price: 'P 300',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    name: 'Maria',
    location: 'Makati City',
    role: 'Professional Cleaner',
    years: '5 yrs',
    tags: ['Deep Cleaning', 'Laundry'],
    price: 'P 450',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    name: 'Teresa',
    location: 'Taguig City',
    role: 'Babysitter',
    years: '2 yrs',
    tags: ['Toddlers', 'First Aid'],
    price: 'P 350',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  },
];

export function ServicesScreen({ avatarUri }: { avatarUri?: string | null }) {
  const insets = useSafeAreaInsets();
  
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  const [profiles, setProfiles] = useState(MOCK_PROFILES);

  const handleNext = () => {
    // Rotate array left (swipe left / pass)
    setProfiles((prev) => {
      const newProfiles = [...prev];
      const first = newProfiles.shift()!;
      newProfiles.push(first);
      return newProfiles;
    });
  };

  const handlePrev = () => {
    // Rotate array right (swipe right / like)
    setProfiles((prev) => {
      const newProfiles = [...prev];
      const last = newProfiles.pop()!;
      newProfiles.unshift(last);
      return newProfiles;
    });
  };

  const leftProfile = profiles[profiles.length - 1]!;
  const centerProfile = profiles[0]!;
  const rightProfile = profiles[1]!;

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

      {/* Greeting Banner */}
      <View style={styles.greetingBanner}>
        <Image 
          source={{ uri: avatarUri || 'https://i.pravatar.cc/150?u=maja' }} 
          style={styles.avatar} 
        />
        <View style={styles.greetingTextContainer}>
          <Text style={styles.dateText}>{dateString}</Text>
          <Text style={styles.greetingText}>Good day, User!</Text>
        </View>
        <Ionicons name="options-outline" size={28} color="#333" />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <Pressable style={[styles.filterChip, styles.filterChipOutline]}>
          <Ionicons name="filter" size={14} color="#FFB43B" style={{ marginRight: 4 }} />
          <Text style={[styles.filterText, { color: '#FFB43B' }]}>Filters</Text>
        </Pressable>
        <View style={styles.filterDivider} />
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterText}>Top Rated</Text>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterText}>Cleaning</Text>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterText}>Cooking</Text>
        </Pressable>
      </ScrollView>

      {/* Swipe Cards Area */}
      <View style={styles.cardsContainer}>
        {/* Background peek card (Left) */}
        <ImageBackground 
          source={{ uri: leftProfile.image }}
          style={[styles.peekCard, styles.peekCardLeft]}
          imageStyle={styles.peekCardImage}
        >
          <View style={styles.peekCardOverlay} />
        </ImageBackground>

        {/* Background peek card (Right) */}
        <ImageBackground 
          source={{ uri: rightProfile.image }}
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
          source={{ uri: centerProfile.image }}
          style={styles.mainCard}
          imageStyle={styles.mainCardImage}
        >
          {/* Gradient Overlay for text readability */}
          <View style={styles.cardGradient}>
            <View style={styles.cardInfoTop} />
            <View style={styles.cardInfoBottom}>
              <Text style={styles.workerName}>{centerProfile.name}</Text>
              <Text style={styles.workerLocation}>{centerProfile.location}</Text>
              <Text style={styles.workerRole}>{centerProfile.role} • <Text style={{ fontWeight: '800' }}>{centerProfile.years}</Text></Text>
              
              <View style={styles.tagsPriceRow}>
                <View style={styles.tagsContainer}>
                  {centerProfile.tags.map(tag => (
                    <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
                  ))}
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceAmount}>{centerProfile.price}</Text>
                  <Text style={styles.priceUnit}>per hour</Text>
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
          <Ionicons name="home-outline" size={24} color="#FFF" />
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
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    transform: [{ scaleX: -1 }],
  },
  greetingTextContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1A1A1A',
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
  },
  filterChipOutline: {
    borderWidth: 1,
    borderColor: '#FFB43B',
  },
  filterText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
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
    fontSize: 24,
    fontWeight: '700',
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
  },
  tagsPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: '#FFF0DB',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 15,
    fontWeight: '700',
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
