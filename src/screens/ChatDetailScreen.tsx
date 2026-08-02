import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export interface ChatMessage {
  id: string;
  sender: 'other' | 'me' | 'system';
  text?: string;
  time: string;
  avatar?: string;
  bookingInfo?: {
    title: string;
    startDate: string;
    details: string;
  };
  isTyping?: boolean;
}

interface ChatDetailScreenProps {
  visible: boolean;
  onClose: () => void;
  contactName?: string;
  contactRole?: string;
  contactAvatar?: string;
  isOnline?: boolean;
  initialMessage?: string;
}

export function ChatDetailScreen({
  visible,
  onClose,
  contactName = 'Vincente Ganda',
  contactRole = 'Cleaner',
  contactAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  isOnline = true,
  initialMessage,
}: ChatDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  React.useEffect(() => {
    if (visible) {
      const baseMessages: ChatMessage[] = [
        {
          id: '1',
          sender: 'other',
          text: "Good morning po! Anong oras ako darating this Monday?",
          time: '8:02 AM',
          avatar: contactAvatar,
        },
        {
          id: '2',
          sender: 'me',
          text: 'Good morning! Please come at 8 AM. 😊',
          time: '8:10 AM',
        },
        {
          id: '3',
          sender: 'system',
          time: '8:12 AM',
          bookingInfo: {
            title: 'BOOKING READY',
            startDate: 'May 11, 2026',
            details: 'P 5,000/mo · Mon – Sat · 8AM – 5PM',
          },
        },
        {
          id: '4',
          sender: 'other',
          text: "Noted, Ma'am!",
          time: '8:15 AM',
          avatar: contactAvatar,
        },
      ];

      if (initialMessage) {
        baseMessages.push({
          id: '5',
          sender: 'me',
          text: initialMessage,
          time: '11:51 PM',
        });
      }
      setMessages(baseMessages);
    }
  }, [visible, initialMessage, contactAvatar]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const timeString = `${formattedHours}:${minutes} ${ampm}`;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputMessage.trim(),
      time: timeString,
    };

    // Remove typing indicator if present, add message, then re-add typing indicator or keep message
    setMessages((prev) => {
      const nonTyping = prev.filter((m) => !m.isTyping);
      return [...nonTyping, newMessage];
    });

    setInputMessage('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <Pressable onPress={onClose} style={styles.backBtn} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </Pressable>

          <View style={styles.headerInfo}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: contactAvatar }} style={styles.headerAvatar} />
              {isOnline && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.headerTextCol}>
              <Text style={styles.contactName}>{contactName}</Text>
              <Text style={styles.contactSub}>
                {isOnline ? 'Online now' : 'Offline'} · {contactRole}
              </Text>
            </View>
          </View>

          <Pressable style={styles.homeBtn} onPress={onClose} hitSlop={10}>
            <Ionicons name="home-outline" size={22} color="#1A1A1A" />
          </Pressable>
        </View>

        {/* Chat Body */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatBody}
          contentContainerStyle={styles.chatBodyContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {/* Date Separator Pill */}
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>Today, May 07</Text>
          </View>

          {/* Messages */}
          {messages.map((item) => {
            if (item.sender === 'system' && item.bookingInfo) {
              return (
                <View key={item.id} style={styles.systemCardContainer}>
                  <View style={styles.bookingCard}>
                    <View style={styles.bookingTagRow}>
                      <Ionicons name="document-text-outline" size={16} color="#FFA51F" />
                      <Text style={styles.bookingTagText}>{item.bookingInfo.title}</Text>
                    </View>
                    <Text style={styles.bookingStartTitle}>Start: {item.bookingInfo.startDate}</Text>
                    <Text style={styles.bookingDetails}>{item.bookingInfo.details}</Text>
                    <Pressable style={styles.viewBtn}>
                      <Text style={styles.viewBtnText}>View ➔</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.systemTimeText}>{item.time}</Text>
                </View>
              );
            }

            if (item.sender === 'other') {
              return (
                <View key={item.id} style={styles.leftMessageRow}>
                  <Image source={{ uri: item.avatar || contactAvatar }} style={styles.msgAvatar} />
                  <View style={styles.leftMessageCol}>
                    <View style={[styles.leftBubble, item.isTyping && styles.typingBubble]}>
                      <Text style={[styles.leftMsgText, item.isTyping && styles.typingText]}>
                        {item.text}
                      </Text>
                    </View>
                    {item.time ? <Text style={styles.leftTimeText}>{item.time}</Text> : null}
                  </View>
                </View>
              );
            }

            // Right Message (me)
            return (
              <View key={item.id} style={styles.rightMessageRow}>
                <View style={styles.rightBubble}>
                  <Text style={styles.rightMsgText}>{item.text}</Text>
                </View>
                <Text style={styles.rightTimeText}>{item.time}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Messenger Style Input Footer */}
        <View style={[styles.inputFooter, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <Pressable style={styles.attachBtn}>
            <Ionicons name="add-circle" size={32} color="#FFB43B" />
          </Pressable>
          <Pressable style={styles.imageBtn}>
            <Ionicons name="image-outline" size={22} color="#888" />
          </Pressable>

          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
          />

          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              !inputMessage.trim() && styles.sendBtnDisabled,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleSend}
            disabled={!inputMessage.trim()}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F6',
  },
  header: {
    backgroundColor: '#FFECCB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    paddingRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFECCB',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  headerTextCol: {
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  contactSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 1,
  },
  homeBtn: {
    paddingLeft: 8,
  },
  chatBody: {
    flex: 1,
    backgroundColor: '#F9F8F6',
  },
  chatBodyContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  datePill: {
    alignSelf: 'center',
    backgroundColor: '#E4E2DC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginVertical: 14,
  },
  datePillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  leftMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    marginTop: 4,
  },
  leftMessageCol: {
    maxWidth: '78%',
  },
  leftBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  typingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  leftMsgText: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  typingText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
    color: '#333',
  },
  leftTimeText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    marginLeft: 4,
  },
  rightMessageRow: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    maxWidth: '78%',
  },
  rightBubble: {
    backgroundColor: '#FFB43B',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rightMsgText: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
    fontWeight: '500',
  },
  rightTimeText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  systemCardContainer: {
    alignSelf: 'flex-end',
    width: '82%',
    marginBottom: 12,
  },
  bookingCard: {
    backgroundColor: '#FFFBF2',
    borderWidth: 1.5,
    borderColor: '#FFB43B',
    borderRadius: 16,
    padding: 14,
  },
  bookingTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFA51F',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  bookingStartTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 6,
  },
  bookingDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: '#FFB43B',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 22,
    alignSelf: 'center',
    marginTop: 12,
  },
  viewBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  systemTimeText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputFooter: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#EFEFEF',
  },
  attachBtn: {
    marginRight: 4,
  },
  imageBtn: {
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F3',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 14,
    color: '#1A1A1A',
    maxHeight: 100,
    marginRight: 8,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFB43B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#E0E0E0',
  },
});
