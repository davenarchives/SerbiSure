import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MOCK_CHATS = [
  {
    id: 1,
    name: 'Joshua Asucal',
    badge: 'Homeowner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    time: '2m ago',
    message: 'Hello, i have seen your application..',
    online: true,
  },
  {
    id: 2,
    name: 'Daniela Mondaragon',
    badge: 'Homeowner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    time: '1h ago',
    message: 'Thank you for your service!',
    online: true,
  },
  {
    id: 3,
    name: 'Camille Prats',
    badge: 'Homeowner',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    time: 'Mon',
    message: 'You: Oki po, ty!',
    online: true,
  },
];

export function ChatsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search Conversations"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>RECENT</Text>

        <View style={styles.chatList}>
          {MOCK_CHATS.map((chat) => (
            <Pressable key={chat.id} style={({ pressed }) => [styles.chatCard, pressed && styles.chatCardPressed]}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: chat.avatar }} style={styles.avatar} />
                {chat.online && <View style={styles.onlineDot} />}
              </View>

              <View style={styles.chatContent}>
                <View style={styles.titleRow}>
                  <View style={styles.nameBadgeRow}>
                    <Text style={styles.name}>{chat.name}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{chat.badge}</Text>
                    </View>
                  </View>
                  <Text style={styles.time}>{chat.time}</Text>
                </View>
                <Text style={styles.message} numberOfLines={1}>
                  {chat.message}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#FFECCB',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  scrollContent: {
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  chatList: {
    paddingHorizontal: 24,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  chatCardPressed: {
    backgroundColor: '#F9F8F6',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  badge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6D28D9',
  },
  time: {
    fontSize: 11,
    color: '#888',
  },
  message: {
    fontSize: 13,
    color: '#666',
  },
});
