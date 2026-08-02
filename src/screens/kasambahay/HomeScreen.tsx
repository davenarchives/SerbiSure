import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const logoSource = require('../../../assets/serbisure-logo.png');

interface JobOffer {
  id: number;
  employerName: string;
  avatar: string;
  time: string;
  location: string;
  roleTag: string;
  termTag: string;
  price: string;
  unit: string;
  aboutText: string;
}

const MOCK_JOBS: JobOffer[] = [
  {
    id: 1,
    employerName: 'Joshua Asucal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    time: 'Posted 1h ago',
    location: 'Brgy. Pagatpat, CDO',
    roleTag: 'Cook',
    termTag: 'Long-term',
    price: '₱15,000',
    unit: '/ month',
    aboutText: 'Experienced cook for daily meal preparation — breakfast, lunch & dinner. Comfortable with Filipino and simple Western dishes. Available Mon–Sat.',
  },
  {
    id: 2,
    employerName: 'Camille Prats',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    time: 'Posted 2h ago',
    location: 'Makati City',
    roleTag: 'Cleaner',
    termTag: 'Short-term',
    price: '₱2,500',
    unit: '/ service',
    aboutText: 'Deep cleaning needed for 2-bedroom condo unit. Includes vacuuming, scrubbing bathrooms, wiping down kitchen cabinets, and washing windows.',
  },
  {
    id: 3,
    employerName: 'Sabrina Reyes',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    time: 'Posted 5h ago',
    location: 'Quezon City',
    roleTag: 'Yaya / Nanny',
    termTag: 'Long-term',
    price: '₱8,000',
    unit: '/ month',
    aboutText: 'Caring nanny for a 2-year-old child. Responsible for feeding, playing, bathing, and light nursery cleanup. Experience with toddlers preferred.',
  },
];

export function HomeScreen({ avatarUri, onAvatarPress }: { avatarUri?: string | null; onAvatarPress?: () => void }) {
  const insets = useSafeAreaInsets();
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  const handleApply = (jobId: number) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
    }
    setSelectedJob(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8 }]}
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
              source={{ uri: avatarUri || 'https://i.pravatar.cc/150?u=daven' }}
              style={styles.avatar}
            />
          </Pressable>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.dateText}>{dateString}</Text>
            <Text style={styles.greetingText}>Good day, Daven!</Text>
          </View>
          <Ionicons name="options-outline" size={28} color="#333" />
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Job Offering</Text>
          <Text style={styles.seeAllText}>See All</Text>
        </View>

        {/* Job List */}
        <View style={styles.jobList}>
          {MOCK_JOBS.map((job) => {
            const isApplied = appliedJobs.includes(job.id);
            return (
              <Pressable key={job.id} style={styles.jobCard} onPress={() => setSelectedJob(job)}>
                <View style={styles.jobHeader}>
                  <Image source={{ uri: job.avatar }} style={styles.employerAvatar} />
                  <View style={styles.jobEmployerInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.employerName}>{job.employerName}</Text>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={{ marginLeft: 4 }} />
                    </View>
                    <Text style={styles.postTime}>{job.time}</Text>

                    <View style={styles.tagsRow}>
                      <View style={[styles.tagBadge, styles.tagRole]}>
                        <Text style={styles.tagRoleText}>{job.roleTag}</Text>
                      </View>
                      <View style={[styles.tagBadge, styles.tagTerm]}>
                        <Text style={styles.tagTermText}>{job.termTag}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.jobFooter}>
                  <Text style={styles.priceText}>
                    {job.price} <Text style={styles.unitText}>{job.unit}</Text>
                  </Text>

                  <Pressable
                    style={[styles.quickApplyBtn, isApplied && styles.quickApplyBtnDone]}
                    onPress={() => handleApply(job.id)}
                  >
                    <Text style={[styles.quickApplyText, isApplied && styles.quickApplyTextDone]}>
                      {isApplied ? 'Applied' : 'Quick Apply'}
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Job Details Modal Sheet */}
      <Modal visible={!!selectedJob} transparent animationType="slide" onRequestClose={() => setSelectedJob(null)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedJob(null)} />
          {selectedJob && (
            <View style={styles.sheetContent}>
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeader}>
                <Image source={{ uri: selectedJob.avatar }} style={styles.sheetAvatar} />
                <View style={styles.sheetTitleInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.sheetEmployerName}>{selectedJob.employerName}</Text>
                    <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={{ marginLeft: 4 }} />
                  </View>
                  <Text style={styles.sheetLocation}>
                    <Ionicons name="location-sharp" size={12} color="#666" /> {selectedJob.location}
                  </Text>
                  <View style={styles.sheetTagRow}>
                    <View style={[styles.tagBadge, styles.tagRole]}>
                      <Text style={styles.tagRoleText}>{selectedJob.roleTag}</Text>
                    </View>
                    <Text style={styles.sheetPostTime}>{selectedJob.time}</Text>
                  </View>
                </View>
              </View>

              {/* Price & Term */}
              <View style={styles.sheetPriceRow}>
                <Text style={styles.sheetPrice}>
                  {selectedJob.price} <Text style={styles.sheetUnit}>{selectedJob.unit}</Text>
                </Text>
                <View style={[styles.tagBadge, styles.tagTerm]}>
                  <Text style={styles.tagTermText}>{selectedJob.termTag}</Text>
                </View>
              </View>

              {/* About this role */}
              <View style={styles.aboutBox}>
                <Text style={styles.aboutTitle}>ABOUT THIS ROLE</Text>
                <Text style={styles.aboutBody}>{selectedJob.aboutText}</Text>
              </View>

              {/* Feedback summary */}
              <Text style={styles.feedbackTitle}>Worker Feedback Summary</Text>
              <View style={styles.feedbackRow}>
                <View style={[styles.feedbackCard, styles.feedbackPositive]}>
                  <Text style={[styles.feedbackValue, { color: '#00875A' }]}>72%</Text>
                  <Text style={[styles.feedbackLabel, { color: '#00875A' }]}>Positive</Text>
                </View>
                <View style={[styles.feedbackCard, styles.feedbackNeutral]}>
                  <Text style={[styles.feedbackValue, { color: '#5E6C84' }]}>18%</Text>
                  <Text style={[styles.feedbackLabel, { color: '#5E6C84' }]}>Neutral</Text>
                </View>
                <View style={[styles.feedbackCard, styles.feedbackNegative]}>
                  <Text style={[styles.feedbackValue, { color: '#DE350B' }]}>10%</Text>
                  <Text style={[styles.feedbackLabel, { color: '#DE350B' }]}>Negative</Text>
                </View>
              </View>

              {/* Compliance banner */}
              <View style={styles.complianceBox}>
                <Ionicons name="information-circle" size={18} color="#7C3AED" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.complianceText}>
                  SerbiSure enforces fair wage compliance (₱9,000 meets RTWPB-10 minimum). Our Booking Frequency Cap prevents illegal misclassification of regular work as short-term gigs.
                </Text>
              </View>

              {/* Apply button */}
              <Pressable
                style={({ pressed }) => [styles.applyNowBtn, pressed && { opacity: 0.8 }]}
                onPress={() => handleApply(selectedJob.id)}
              >
                <Text style={styles.applyNowText}>
                  {appliedJobs.includes(selectedJob.id) ? 'Application Submitted' : 'Apply Now'}
                </Text>
              </Pressable>
              <Text style={styles.applyNotice}>Your application goes directly to the employer</Text>
            </View>
          )}
        </View>
      </Modal>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 13,
    color: '#FFB43B',
    fontWeight: '600',
  },
  jobList: {
    paddingHorizontal: 24,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 16,
    marginBottom: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  employerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  jobEmployerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  postTime: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagRole: {
    backgroundColor: '#8F5CFF',
  },
  tagRoleText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  tagTerm: {
    backgroundColor: '#FFF0DB',
  },
  tagTermText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFB43B',
  },
  unitText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
  },
  quickApplyBtn: {
    borderWidth: 1,
    borderColor: '#FFB43B',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickApplyBtnDone: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  quickApplyText: {
    color: '#FFB43B',
    fontSize: 13,
    fontWeight: '600',
  },
  quickApplyTextDone: {
    color: '#2E7D32',
  },
  // Modal Sheet
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  sheetTitleInfo: {
    flex: 1,
  },
  sheetEmployerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sheetLocation: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },
  sheetTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetPostTime: {
    fontSize: 11,
    color: '#888',
  },
  sheetPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  sheetUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  aboutBox: {
    backgroundColor: '#FAF9F6',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB43B',
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  aboutBody: {
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  feedbackCard: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  feedbackPositive: {
    backgroundColor: '#E6F4EA',
    borderColor: '#A3D9B1',
  },
  feedbackNeutral: {
    backgroundColor: '#F4F5F7',
    borderColor: '#DFE1E6',
  },
  feedbackNegative: {
    backgroundColor: '#FFEBE6',
    borderColor: '#FFBDAD',
  },
  feedbackValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  feedbackLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  complianceBox: {
    flexDirection: 'row',
    backgroundColor: '#F3E8FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  complianceText: {
    flex: 1,
    fontSize: 11,
    color: '#6B21A8',
    lineHeight: 15,
  },
  applyNowBtn: {
    backgroundColor: '#FFB43B',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 6,
  },
  applyNowText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  applyNotice: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
});
