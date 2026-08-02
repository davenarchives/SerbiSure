import React from 'react';
import { StyleSheet, Text, View, TextInput, Image, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export function ChatsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Messages</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search Conversations"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>RECENT</Text>
        
        <ChatItem 
          name="Vincente Ganda"
          role="Cleaner"
          message="Ok po! Nandito na ako..."
          time="2m ago"
          avatar="https://i.pravatar.cc/150?u=vincente"
          online={true}
        />
        <View style={styles.divider} />
        
        <ChatItem 
          name="Tiya Kalood"
          role="Babysitter"
          message="Thank you po, Ma'am!"
          time="1h ago"
          avatar="https://i.pravatar.cc/150?u=tiya"
          online={true}
        />
        <View style={styles.divider} />
        
        <ChatItem 
          name="Sisa"
          role="Yaya/Cook"
          message="You: See you tomorrow!"
          time="Mon"
          avatar="https://i.pravatar.cc/150?u=sisa"
          online={true}
        />
        <View style={styles.divider} />

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>BOOKING UPDATES</Text>
        
        <View style={styles.bookingCard}>
          <View style={styles.bookingIconContainer}>
            <Ionicons name="document-text" size={24} color="#FFF" />
          </View>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingTitle}>Vincente Ganda booked.</Text>
            <View style={styles.bookingSubRow}>
              <Text style={styles.bookingSubtext}>Start date: May 11</Text>
              <Text style={styles.bookingDot}>•</Text>
              <Text style={styles.bookingAction}>Tap to review</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function ChatItem({ name, role, message, time, avatar, online }: any) {
  return (
    <Pressable style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        {online && <View style={styles.onlineDot} />}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{name}</Text>
          <Text style={styles.chatTime}>{time}</Text>
        </View>
        
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{role}</Text>
        </View>
        
        <Text style={styles.chatMessage} numberOfLines={1}>{message}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F6',
  },
  header: {
    backgroundColor: '#FFECCB',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  chatTime: {
    fontSize: 13,
    color: '#888',
  },
  roleBadge: {
    backgroundColor: '#EBE9F6', // light purple
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 6,
  },
  roleText: {
    fontSize: 10,
    color: '#551A8B', // purple text
    fontWeight: '600',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E4DF',
    marginLeft: 76,
  },
  bookingCard: {
    backgroundColor: '#FFECCB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB43B',
  },
  bookingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFB43B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  bookingSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingSubtext: {
    fontSize: 13,
    color: '#666',
  },
  bookingDot: {
    fontSize: 13,
    color: '#666',
    marginHorizontal: 8,
  },
  bookingAction: {
    fontSize: 13,
    color: '#666',
  }
});
