import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const logoSource = require('../../../assets/serbisure-logo.png');

export function ProfileScreen({ avatarUri, onBack, onLogout }: { avatarUri?: string | null, onBack?: () => void, onLogout?: () => void }) {
  const insets = useSafeAreaInsets();
  const [currentView, setCurrentView] = React.useState<'main' | 'personal_info'>('main');

  return (
    <View style={styles.container}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 0 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Backgrounds */}
        {currentView === 'personal_info' ? (
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800' }} 
            style={{ width: '100%', height: 220, position: 'absolute', top: 0 }}
          />
        ) : (
          <View style={[styles.headerBg, { height: insets.top + 200 }]} />
        )}

        {/* Header Row (Scrolls with content) */}
        <View style={[styles.headerRow, { marginTop: insets.top + 10, marginBottom: 30 }]}>
          <Pressable onPress={() => currentView === 'personal_info' ? setCurrentView('main') : onBack?.()}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={currentView === 'personal_info' ? "#FFB43B" : "#333"} 
            />
          </Pressable>
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
          <View style={{ width: 24 }} />
        </View>

        {currentView === 'personal_info' ? (
          <React.Fragment>
            {/* Beige Info Card */}
            <View style={styles.personalInfoCard}>
              <View style={styles.personalAvatarWrapper}>
                <Image 
                  source={{ uri: avatarUri || 'https://i.pravatar.cc/150?u=maja' }} 
                  style={styles.personalAvatar} 
                />
              </View>
              
              <View style={styles.personalNameRow}>
                <Text style={styles.personalName}>User</Text>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.personalRole}>Homeowner</Text>
              
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#555" />
                <Text style={styles.locationText}>Cagayan de Oro, Misamis Oriental</Text>
              </View>

              <View style={styles.sentimentDivider} />
              
              <View style={styles.sentimentRow}>
                <Text style={styles.sentimentLabel}>Worker Sentiment</Text>
                <View style={styles.sentimentBarBg}>
                  <View style={styles.sentimentBarFill} />
                </View>
                <Text style={styles.sentimentScore}>86% Positive</Text>
              </View>

              <View style={styles.tagsContainer}>
                <View style={styles.pillTag}><Text style={styles.pillTagText}>Non-Smoker</Text></View>
                <View style={styles.pillTag}><Text style={styles.pillTagText}>Respectful</Text></View>
                <View style={styles.pillTag}><Text style={styles.pillTagText}>Pet Owner</Text></View>
                <View style={styles.pillTag}><Text style={styles.pillTagText}>Family-Oriented</Text></View>
              </View>
            </View>

            {/* About Section */}
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>About User</Text>
              <Text style={styles.aboutText}>
                I'm a homeowner in Cagayan de Oro with two kids and a pet cat. I'm looking for a reliable nanny who can help care for my children, assist with daily routines, and be comfortable around pets while keeping our home safe and organized.
              </Text>
            </View>

            {/* Reviews Section */}
            <View style={styles.reviewsSection}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Recent Reviews</Text>
                <Text style={styles.viewAllText}>View All 3</Text>
              </View>

              <View style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <View style={styles.starsRow}>
                    {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={14} color="#FFB43B" style={{marginRight: 2}} />)}
                  </View>
                  <View style={styles.positiveBadge}>
                    <Text style={styles.positiveBadgeText}>Positive</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>
                  "The homeowner is kind and supportive. As an employer, they are respectful, organized, and clear with instructions. Working in their home with their two kids and pet has been a positive experience, and they create a safe and comfortable environment for staff. They are highly recommended as an employer."
                </Text>
                <Text style={styles.reviewAuthor}>— Clara A., D., Oct 2026</Text>
              </View>
            </View>

            {/* Bottom padding for tab bar */}
            <View style={{ height: 100 }} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <View style={styles.profileInfoContainer}>
              <View style={styles.avatarWrapper}>
                <Image 
                  source={{ uri: avatarUri || 'https://i.pravatar.cc/150?u=maja' }} 
                  style={styles.avatar} 
                />
                <View style={styles.editIconBadge}>
                  <Ionicons name="pencil" size={12} color="#FFF" />
                </View>
              </View>
              
              <View style={styles.profileDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.profileName}>User</Text>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={{ marginLeft: 6 }} />
                </View>
                <Text style={styles.profilePhone}>+63 951 885 9238</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>HOMEOWNER</Text>
                </View>
              </View>
            </View>

            <View style={styles.settingsCard}>
              <SettingsItem 
                icon="person-outline" 
                label="Personal Info" 
                onPress={() => setCurrentView('personal_info')} 
              />
              <View style={styles.divider} />
              <SettingsItem icon="lock-closed-outline" label="Passwords & Security" />
              <View style={styles.divider} />
              <SettingsItem icon="checkmark-circle-outline" label="Get Verified" iconColor="#4CAF50" />
              
              <View style={styles.sectionSpacing} />
              
              <SettingsItem icon="notifications-outline" label="Notifications" />
              <View style={styles.divider} />
              <SettingsItem 
                icon="globe-outline" 
                label="Language" 
                rightComponent={
                  <View style={styles.languageSelector}>
                    <Text style={styles.languageText}>English</Text>
                    <Ionicons name="chevron-down" size={14} color="#888" />
                  </View>
                } 
              />
              
              <View style={styles.sectionSpacing} />
              
              <SettingsItem icon="help-circle-outline" label="About Us" />
              <View style={styles.divider} />
              <SettingsItem icon="shield-checkmark-outline" label="Privacy Policy" />
              
              <View style={styles.sectionSpacing} />
              
              <Pressable 
                style={({ pressed }) => [
                  styles.settingsItem,
                  pressed && { backgroundColor: '#FFF0F0', borderRadius: 8, paddingHorizontal: 16, marginHorizontal: -16 }
                ]} 
                onPress={onLogout}
              >
                {({ pressed }) => (
                  <>
                    <Ionicons name="log-out-outline" size={24} color={pressed ? "#E74C3C" : "#FFB43B"} style={styles.settingsIcon} />
                    <Text style={[styles.settingsLabel, { color: pressed ? '#E74C3C' : '#333' }]}>Log out</Text>
                  </>
                )}
              </Pressable>
              
              {/* Bottom padding for tab bar */}
              <View style={{ height: 100 }} />
            </View>
          </React.Fragment>
        )}
      </ScrollView>
    </View>
  );
}

function SettingsItem({ icon, label, iconColor = "#FFB43B", hideChevron = false, rightComponent, onPress }: any) {
  return (
    <Pressable style={styles.settingsItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color={iconColor} style={styles.settingsIcon} />
      <Text style={styles.settingsLabel}>{label}</Text>
      {rightComponent ? rightComponent : (!hideChevron && <Ionicons name="chevron-forward" size={20} color="#FFB43B" />)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F6',
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFECCB',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  logo: {
    width: 44,
    height: 44,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFB43B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFECCB',
  },
  profileDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  profilePhone: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: '#9F7AEA', // purple
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
  },
  settingsCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingsIcon: {
    marginRight: 16,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 40,
  },
  sectionSpacing: {
    height: 40,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB43B',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  languageText: {
    fontSize: 12,
    color: '#333',
    marginRight: 8,
  },
  // Personal Info Styles
  personalInfoCard: {
    backgroundColor: '#FFECCB',
    borderRadius: 24,
    marginHorizontal: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginTop: 20,
    position: 'relative',
  },
  personalAvatarWrapper: {
    alignSelf: 'flex-start',
    marginTop: -35,
    marginBottom: 12,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#F9F8F6',
  },
  personalAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  personalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  personalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  personalRole: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
  },
  sentimentDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sentimentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 12,
  },
  sentimentBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  sentimentBarFill: {
    width: '86%',
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  sentimentScore: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4CAF50',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillTag: {
    backgroundColor: '#FFB43B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pillTagText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  aboutSection: {
    paddingHorizontal: 24,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  reviewsSection: {
    paddingHorizontal: 24,
    marginTop: 30,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 12,
    color: '#FFB43B',
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
  },
  positiveBadge: {
    backgroundColor: '#14A11C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positiveBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  reviewText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  reviewAuthor: {
    fontSize: 12,
    color: '#888',
  }
});
