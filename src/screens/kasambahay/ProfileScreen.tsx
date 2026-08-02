import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const logoSource = require('../../../assets/serbisure-logo.png');

export function ProfileScreen({
  avatarUri,
  onBack,
  onLogout,
}: {
  avatarUri?: string | null;
  onBack?: () => void;
  onLogout?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [currentView, setCurrentView] = useState<'main' | 'personal_info'>('main');
  const [isOnJob, setIsOnJob] = useState(false);

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
            source={{ uri: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' }}
            style={{ width: '100%', height: 220, position: 'absolute', top: 0 }}
          />
        ) : (
          <View style={[styles.headerBg, { height: insets.top + 200 }]} />
        )}

        {/* Header Row */}
        <View style={[styles.headerRow, { marginTop: insets.top + 10, marginBottom: 30 }]}>
          <Pressable onPress={() => (currentView === 'personal_info' ? setCurrentView('main') : onBack?.())}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={currentView === 'personal_info' ? '#FFB43B' : '#333'}
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
                  source={{ uri: avatarUri || 'https://i.pravatar.cc/150?u=daven' }}
                  style={styles.personalAvatar}
                />
              </View>

              <View style={styles.personalNameRow}>
                <Text style={styles.personalName}>Daven de Guzman</Text>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.personalRole}>Housekeeper & Cook</Text>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#555" />
                <Text style={styles.locationText}>Cagayan de Oro, Misamis Oriental</Text>
              </View>

              <View style={styles.sentimentDivider} />

              <View style={styles.sentimentRow}>
                <Text style={styles.sentimentLabel}>Client Sentiment</Text>
                <View style={styles.sentimentBarBg}>
                  <View style={styles.sentimentBarFill} />
                </View>
                <Text style={styles.sentimentScore}>86% Positive</Text>
              </View>

              <View style={styles.tagsContainer}>
                <View style={styles.pillTag}><Text style={styles.pillTagText}>Cleaning</Text></View>
                <View style={styles.pillTag}><Text style={styles.pillTagText}>Cook</Text></View>
                <View style={styles.pillTag}><Text style={styles.pillTagText}>Childcare</Text></View>
                <View style={styles.pillTag}><Text style={styles.pillTagText}>Meal Prep</Text></View>
                <View style={styles.pillTag}><Text style={styles.pillTagText}>Pet Friendly</Text></View>
              </View>
            </View>

            {/* About Section */}
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>About Daven</Text>
              <Text style={styles.aboutText}>
                Hi, I'm Michelangelo, a verified housekeeper and cook based in Cagayan de Oro. I provide reliable, top-rated home care services, specializing in house cleaning, meal prep, childcare, and pet care to keep your household running smoothly and efficiently.
              </Text>
            </View>

            {/* Reviews Section */}
            <View style={styles.reviewsSection}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Recent Reviews</Text>
                <Text style={styles.viewAllText}>View All 32</Text>
              </View>

              <View style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Ionicons key={i} name="star" size={14} color="#FFB43B" style={{ marginRight: 2 }} />
                    ))}
                  </View>
                  <View style={styles.positiveBadge}>
                    <Text style={styles.positiveBadgeText}>Positive</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>
                  "Daven is an amazing cook! His meal prep has been an absolute lifesaver for our busy workweeks. He is organized, hygienic, and cooks delicious, healthy meals exactly to our liking. If you need someone to take over the kitchen and save you hours of cooking time, he is highly recommended!"
                </Text>
                <Text style={styles.reviewAuthor}>— Maria A., C., Oct 2025</Text>
              </View>
            </View>

            {/* Bottom padding */}
            <View style={{ height: 100 }} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* Same Row Layout as Homeowner */}
            <View style={styles.profileInfoContainer}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: avatarUri || 'https://i.pravatar.cc/150?u=daven' }}
                  style={styles.avatar}
                />
                <View style={styles.editIconBadge}>
                  <Ionicons name="pencil" size={12} color="#FFF" />
                </View>
              </View>

              <View style={styles.profileDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.profileName}>Daven de Guzman</Text>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={{ marginLeft: 6 }} />
                </View>
                <Text style={styles.profilePhone}>+63 951 885 9238</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>KASAMBAHAY</Text>
                </View>
              </View>
            </View>

            {/* Settings Card (White Rounded Sheet like Homeowner) */}
            <View style={styles.settingsCard}>
              {/* Set Status Row */}
              <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <Ionicons name="toggle-outline" size={24} color="#FFB43B" style={styles.settingsIcon} />
                  <Text style={styles.statusLabel}>Set Status</Text>
                </View>

                {/* Figma Segmented Pill Control */}
                <Pressable
                  style={styles.pillTrack}
                  onPress={() => setIsOnJob(!isOnJob)}
                >
                  <View style={[styles.pillSegment, !isOnJob && styles.pillSegmentActive]}>
                    <Text style={[styles.pillSegmentText, !isOnJob && styles.pillSegmentTextActive]}>
                      Available
                    </Text>
                  </View>
                  <View style={[styles.pillSegment, isOnJob && styles.pillSegmentActive]}>
                    <Text style={[styles.pillSegmentText, isOnJob && styles.pillSegmentTextActive]}>
                      On the Job
                    </Text>
                  </View>
                </Pressable>
              </View>

              <View style={styles.divider} />

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
                  pressed && { backgroundColor: '#FFF0F0', borderRadius: 8, paddingHorizontal: 16, marginHorizontal: -16 },
                ]}
                onPress={onLogout}
              >
                {({ pressed }) => (
                  <>
                    <Ionicons
                      name="log-out-outline"
                      size={24}
                      color={pressed ? '#E74C3C' : '#FFB43B'}
                      style={styles.settingsIcon}
                    />
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

function SettingsItem({ icon, label, iconColor = '#FFB43B', hideChevron = false, rightComponent, onPress }: any) {
  return (
    <Pressable style={styles.settingsItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color={iconColor} style={styles.settingsIcon} />
      <Text style={styles.settingsLabel}>{label}</Text>
      {rightComponent ? rightComponent : !hideChevron && <Ionicons name="chevron-forward" size={20} color="#FFB43B" />}
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
    marginBottom: 16,
  },
  logo: {
    width: 44,
    height: 44,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
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
    transform: [{ scaleX: -1 }],
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
    backgroundColor: '#9F7AEA',
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
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    width: '100%',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  pillTrack: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    padding: 3,
    alignItems: 'center',
  },
  pillSegment: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSegmentActive: {
    backgroundColor: '#2EBE03',
  },
  pillSegmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  pillSegmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingsIcon: {
    marginRight: 16,
    width: 24,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    color: '#666',
    marginRight: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EFEB',
  },
  sectionSpacing: {
    height: 20,
  },
  // Personal Info Card
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
    transform: [{ scaleX: -1 }],
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
    gap: 4,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 12,
    color: '#555',
  },
  sentimentDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    width: '100%',
    marginVertical: 16,
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  sentimentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sentimentBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginHorizontal: 10,
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
    fontWeight: '700',
  },
  aboutSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  reviewsSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: '#FFB43B',
    fontWeight: '700',
  },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
  },
  positiveBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  positiveBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  reviewText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
});
