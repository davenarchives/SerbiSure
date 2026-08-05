import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';

import { ChatDetailScreen } from '../ChatDetailScreen';
import { chatStore, ChatConversation } from '../../store/chatStore';

export function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [chatList, setChatList] = useState<ChatConversation[]>(chatStore.getChats());
  const [activeChat, setActiveChat] = useState<{
    visible: boolean;
    name: string;
    role: string;
    avatar: string;
  }>({
    visible: false,
    name: 'Vincente Ganda',
    role: 'Cleaner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  });

  React.useEffect(() => {
    setChatList([...chatStore.getChats()]);
    const unsubscribe = chatStore.subscribe(() => {
      setChatList([...chatStore.getChats()]);
    });
    return unsubscribe;
  }, []);

  const openChat = (name: string, role: string, avatar: string) => {
    setActiveChat({ visible: true, name, role, avatar });
  };

  return (
    <View style={styles.container}>
      {/* Top Status Bar Spacer */}
      <View style={{ height: insets.top, backgroundColor: '#FFECCB', zIndex: 10 }} />

      {/* Top Banner */}
      <View style={[styles.header, { paddingTop: 16 }]}>
        <Text style={styles.headerTitle}>{t.chatsHeader}</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder={t.searchChats}
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>RECENT</Text>

        <View style={styles.chatList}>
          {chatList.map((chat) => (
            <Pressable
              key={chat.id}
              style={({ pressed }) => [styles.chatCard, pressed && styles.chatCardPressed]}
              onPress={() => openChat(chat.name, chat.badge, chat.avatar)}
            >
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

        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>BOOKING UPDATES</Text>

        <View style={{ paddingHorizontal: 24 }}>
          <Pressable
            style={styles.bookingCard}
            onPress={() => openChat('Vincente Ganda', 'Cleaner', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300')}
          >
            <View style={styles.bookingIconContainer}>
              <Ionicons name="document-text" size={24} color="#FFF" />
            </View>
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingTitle}>Vincente Ganda booked.</Text>
              <Text style={styles.bookingSubtext}>Start date: May 11  •  Tap to review</Text>
            </View>
          </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Messenger-style Chat Detail Modal */}
      <ChatDetailScreen
        visible={activeChat.visible}
        onClose={() => setActiveChat((prev) => ({ ...prev, visible: false }))}
        contactName={activeChat.name}
        contactRole={activeChat.role}
        contactAvatar={activeChat.avatar}
        userRole="homeowner"
      />
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
  bookingCard: {
    backgroundColor: '#FFECCB',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB43B',
  },
  bookingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFB43B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  bookingSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
