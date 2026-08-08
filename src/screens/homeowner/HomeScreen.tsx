import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';

const logoSource = require('../../../assets/serbisure-logo.png');

export function HomeScreen({ avatarUri, onAvatarPress, onViewProfile }: { avatarUri?: string | null, onAvatarPress?: () => void, onViewProfile?: () => void }) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { getFirstNameOnly } = useUser();
  
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  return (
    <View style={styles.container}>
      {/* Top Status Bar Spacer */}
      <View style={{ height: insets.top, backgroundColor: '#F6F5F2', zIndex: 10 }} />
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: 8 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Logo & Bell */}
        <View style={styles.header}>
          <View style={styles.headerSide} />
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
          <View style={[styles.headerSide, styles.headerSideRight]}>
            <Ionicons name="notifications" size={24} color="#333" />
          </View>
        </View>

        {/* Greeting Banner */}
        <View style={styles.greetingBanner}>
          <Pressable onPress={onAvatarPress}>
            <Image 
              source={{ uri: avatarUri || 'https://i.pravatar.cc/150?u=serbisure' }} 
              style={styles.avatar} 
            />
          </Pressable>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.dateText}>{dateString}</Text>
            <Text style={styles.greetingText} numberOfLines={1} adjustsFontSizeToFit>{t.greeting}, {getFirstNameOnly()}!</Text>
          </View>
          <Ionicons name="options-outline" size={28} color="#333" />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#333" style={styles.searchIcon} />
          <TextInput 
            placeholder={t.searchPlaceholder}
            placeholderTextColor="#333"
            style={styles.searchInput}
          />
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesContainer}>
          <CategoryItem icon="face-woman-outline" label="Child Care" />
          <CategoryItem icon="silverware-fork-knife" label="Cook" />
          <CategoryItem icon="broom" label="Cleaner" />
          <CategoryItem icon="washing-machine" label="Laundry" />
        </View>

        {/* Top Rated Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} numberOfLines={1} adjustsFontSizeToFit>{t.popularServices}</Text>
          <Text style={styles.seeAllText}>{t.viewAll}</Text>
        </View>

        <View style={styles.workerList}>
          <WorkerCard 
            name="Liza Soriano"
            role="Baby Sitter"
            years="5 years"
            rating="4.9"
            reviews="(159 reviews)"
            time="Posted 3h ago"
            avatar="https://i.pravatar.cc/150?u=liza"
            onViewProfile={onViewProfile}
          />
          <WorkerCard 
            name="Bald Seki"
            role="Cook"
            years="3 years"
            rating="4.7"
            reviews="(121 reviews)"
            time="Posted 10h ago"
            avatar="https://i.pravatar.cc/150?u=bald"
            onViewProfile={onViewProfile}
          />
        </View>

        {/* Bottom padding to account for floating tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Subcomponents

function CategoryItem({ icon, label }: { icon: any, label: string }) {
  return (
    <View style={styles.categoryItem}>
      <MaterialCommunityIcons name={icon} size={32} color="#333" />
      <Text style={styles.categoryLabel}>{label}</Text>
    </View>
  );
}

function WorkerCard({ name, role, years, rating, reviews, time, avatar, onViewProfile }: any) {
  return (
    <View style={styles.workerCard}>
      <Pressable style={styles.workerHeader} onPress={onViewProfile}>
        <Image source={{ uri: avatar }} style={styles.workerAvatar} />
        <View style={styles.workerInfo}>
          <View style={styles.workerNameRow}>
            <Text style={styles.workerName}>{name}</Text>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={{ marginLeft: 4 }} />
          </View>
          <Text style={styles.workerRole}>{role} • {years}</Text>
          <View style={styles.workerRatingRow}>
            <Ionicons name="star" size={12} color="#FFB43B" />
            <Text style={styles.workerRating}>{rating} <Text style={styles.workerReviews}>{reviews}</Text></Text>
          </View>
        </View>
        <Text style={styles.workerTime}>{time}</Text>
      </Pressable>
      <Pressable style={styles.viewProfileBtn} onPress={onViewProfile}>
        <Text style={styles.viewProfileText}>View Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F5F2',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F8F6',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E4DF',
    paddingHorizontal: 24,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryLabel: {
    marginTop: 8,
    fontSize: 11,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 12,
  },
  seeAllText: {
    flexShrink: 0,
    fontSize: 13,
    color: '#333',
  },
  workerList: {
    paddingHorizontal: 24,
  },
  workerCard: {
    marginBottom: 24,
  },
  workerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  workerInfo: {
    flex: 1,
  },
  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  workerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  workerRole: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  workerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerRating: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  workerReviews: {
    color: '#888',
    fontWeight: '400',
  },
  workerTime: {
    fontSize: 9,
    color: '#888',
    marginTop: 4,
  },
  viewProfileBtn: {
    borderWidth: 1,
    borderColor: '#FFB43B',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewProfileText: {
    color: '#FFB43B',
    fontWeight: '600',
    fontSize: 13,
  },
});
