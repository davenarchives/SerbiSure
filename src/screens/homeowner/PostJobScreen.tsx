import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const logoSource = require('../../../assets/serbisure-logo.png');

interface PostJobScreenProps {
  visible: boolean;
  onClose: () => void;
}

export function PostJobScreen({ visible, onClose }: PostJobScreenProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedService, setSelectedService] = useState('Cleaning');
  const [engagementType, setEngagementType] = useState<'short' | 'long'>('short');
  const [viewDate, setViewDate] = useState<Date>(new Date(2026, 4, 1)); // May 2026 default
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 4, 26)); // May 26, 2026 default
  const [selectedTime, setSelectedTime] = useState<'morning' | 'afternoon' | 'night'>('afternoon');
  const [address, setAddress] = useState('');
  const [floorUnit, setFloorUnit] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [instructions, setInstructions] = useState('');
  const [offerAmount, setOfferAmount] = useState('1500');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [postedSuccess, setPostedSuccess] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Animation values for Logo Loader
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (postedSuccess) {
      // Spring pop-in scale animation
      scaleAnim.setValue(0.7);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();

      // Continuous 360-degree rotation animation for the loader ring
      rotateAnim.setValue(0);
      const animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();

      return () => animation.stop();
    }
  }, [postedSuccess]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{
      date: Date;
      dayNum: number;
      isCurrentMonth: boolean;
    }> = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({
        date: prevDate,
        dayNum: prevDate.getDate(),
        isCurrentMonth: false,
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const currDate = new Date(year, month, d);
      days.push({
        date: currDate,
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    const totalCells = days.length > 35 ? 42 : 35;
    const remaining = totalCells - days.length;
    for (let n = 1; n <= remaining; n++) {
      const nextDate = new Date(year, month + 1, n);
      days.push({
        date: nextDate,
        dayNum: n,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const formatSelectedDate = (date: Date) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const services = [
    { id: 'Cleaning', label: 'Cleaning', icon: 'brush-outline' },
    { id: 'Child Care', label: 'Child Care', icon: 'happy-outline' },
    { id: 'Cook', label: 'Cook', icon: 'restaurant-outline' },
    { id: 'Caregiver', label: 'Caregiver', icon: 'heart-outline' },
    { id: 'Laundry', label: 'Laundry', icon: 'shirt-outline' },
    { id: 'All-around', label: 'All-around', icon: 'home-outline' },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      // Step 4 Submit
      setIsPosting(true);
      setPostedSuccess(true);
      setTimeout(() => {
        setPostedSuccess(false);
        setIsPosting(false);
        setStep(1);
        onClose();
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.innerContainer,
            {
              paddingTop: Math.max(insets.top, 16),
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          {/* Top Section (Anchored to Top) */}
          <View style={styles.topSection}>
            {/* Header Row */}
            <View style={styles.header}>
              <Pressable style={styles.headerLeft} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                <Text style={styles.headerTitle}>Post a Job</Text>
              </Pressable>
              <Image source={logoSource} style={styles.logo} resizeMode="contain" />
            </View>

            {/* Step Counter */}
            <Text style={styles.stepCounter}>Step {step} of 4</Text>

            {/* Step Main Title */}
            <View style={styles.titleBlock}>
              {step === 1 && (
                <Text style={styles.mainTitle}>
                  What <Text style={styles.titleHighlight}>service</Text> do you need today?
                </Text>
              )}
              {step === 2 && (
                <Text style={styles.mainTitle}>
                  When do you <Text style={styles.titleHighlight}>need</Text> the service?
                </Text>
              )}
              {step === 3 && <Text style={styles.mainTitle}>Job Details</Text>}
              {step === 4 && (
                <Text style={styles.mainTitle}>
                  Review & <Text style={styles.titleHighlight}>submit</Text>
                </Text>
              )}
            </View>
          </View>

          {/* Dynamic Content Area (Fits without scrolling) */}
          <View style={styles.contentArea}>
            {/* STEP 1 */}
            {step === 1 && (
              <View style={styles.serviceGrid}>
                {services.map((item) => {
                  const isSelected = selectedService === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.serviceCard, isSelected && styles.serviceCardActive]}
                      onPress={() => setSelectedService(item.id)}
                    >
                      <View style={[styles.iconCircle, isSelected && styles.iconCircleActive]}>
                        <Ionicons name={item.icon as any} size={26} color="#FFB43B" />
                      </View>
                      <Text style={[styles.serviceLabel, isSelected && styles.serviceLabelActive]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <View style={styles.step2Container}>
                {/* Short-term / Long-term Toggle */}
                <View style={styles.typeToggleRow}>
                  <Pressable
                    style={[styles.typeCard, engagementType === 'short' && styles.typeCardActive]}
                    onPress={() => setEngagementType('short')}
                  >
                    <View style={styles.typeIconCircle}>
                      <Ionicons name="time-outline" size={20} color="#FFB43B" />
                    </View>
                    <View style={{ width: '100%' }}>
                      <Text style={styles.typeTitle}>Short-term</Text>
                      <Text style={styles.typeSub}>Single visit or short service</Text>
                    </View>
                  </Pressable>

                  <Pressable
                    style={[styles.typeCard, engagementType === 'long' && styles.typeCardActive]}
                    onPress={() => setEngagementType('long')}
                  >
                    <View style={styles.typeIconCircle}>
                      <Ionicons name="calendar-outline" size={20} color="#FFB43B" />
                    </View>
                    <View style={{ width: '100%' }}>
                      <Text style={styles.typeTitle}>Long-term</Text>
                      <Text style={styles.typeSub}>Weekly or monthly service</Text>
                    </View>
                  </Pressable>
                </View>

                {/* Calendar Grid */}
                <View style={styles.calendarCard}>
                  <View style={styles.calendarHeader}>
                    <Text style={styles.calendarMonth}>
                      {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Text>
                    <View style={styles.calendarArrows}>
                      <Pressable onPress={handlePrevMonth} style={{ padding: 4, marginRight: 6 }} hitSlop={10}>
                        <Ionicons name="chevron-back" size={16} color="#666" />
                      </Pressable>
                      <Pressable onPress={handleNextMonth} style={{ padding: 4 }} hitSlop={10}>
                        <Ionicons name="chevron-forward" size={16} color="#666" />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.daysHeader}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <Text key={d} style={styles.dayHeaderText}>
                        {d}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.datesGrid}>
                    {getCalendarDays().map((item, idx) => {
                      const isSelected =
                        selectedDate.getFullYear() === item.date.getFullYear() &&
                        selectedDate.getMonth() === item.date.getMonth() &&
                        selectedDate.getDate() === item.date.getDate();

                      return (
                        <View key={idx} style={styles.dateCellWrapper}>
                          <Pressable
                            style={[
                              styles.dateCell,
                              isSelected && styles.dateCellSelected,
                            ]}
                            onPress={() => {
                              setSelectedDate(item.date);
                              if (!item.isCurrentMonth) {
                                setViewDate(new Date(item.date.getFullYear(), item.date.getMonth(), 1));
                              }
                            }}
                          >
                            <Text
                              style={[
                                styles.dateCellText,
                                !item.isCurrentMonth && styles.dateCellMuted,
                                isSelected && styles.dateCellTextSelected,
                              ]}
                            >
                              {item.dayNum}
                            </Text>
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Time Selection */}
                <Text style={styles.sectionLabel}>What time works best?</Text>
                <View style={styles.timeSlotRow}>
                  <Pressable
                    style={[styles.timeSlotCard, selectedTime === 'morning' && styles.timeSlotActive]}
                    onPress={() => setSelectedTime('morning')}
                  >
                    <Ionicons name="sunny-outline" size={18} color="#FFB43B" />
                    <Text style={styles.timeSlotTitle}>Morning</Text>
                    <Text style={styles.timeSlotSub}>8 AM - 12 PM</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.timeSlotCard, selectedTime === 'afternoon' && styles.timeSlotActive]}
                    onPress={() => setSelectedTime('afternoon')}
                  >
                    <Ionicons name="partly-sunny-outline" size={18} color="#FFB43B" />
                    <Text style={styles.timeSlotTitle}>Afternoon</Text>
                    <Text style={styles.timeSlotSub}>12 PM - 5 PM</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.timeSlotCard, selectedTime === 'night' && styles.timeSlotActive]}
                    onPress={() => setSelectedTime('night')}
                  >
                    <Ionicons name="moon-outline" size={18} color="#FFB43B" />
                    <Text style={styles.timeSlotTitle}>Night</Text>
                    <Text style={styles.timeSlotSub}>5 PM - 9 PM</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <View style={styles.step3Container}>
                <Text style={styles.inputGroupLabel}>SERVICE ADDRESS</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter street, building, or area"
                  placeholderTextColor="#999"
                  value={address}
                  onChangeText={setAddress}
                />

                <View style={styles.twoColumnRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.inputGroupLabel}>FLOOR / UNIT #</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Optional"
                      placeholderTextColor="#999"
                      value={floorUnit}
                      onChangeText={setFloorUnit}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.inputGroupLabel}>ZIP CODE</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. 1200"
                      placeholderTextColor="#999"
                      value={zipCode}
                      onChangeText={setZipCode}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Text style={styles.sectionLabelLarge}>Add specific instructions</Text>
                <TextInput
                  style={styles.multilineInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Example: 'Must be comfortable with large dogs' or 'The doorbell is broken, please knock loudly'."
                  placeholderTextColor="#999"
                  value={instructions}
                  onChangeText={setInstructions}
                />

                <Text style={styles.inputGroupLabel}>OFFER AMOUNT</Text>
                <View style={styles.offerInputWrapper}>
                  <Text style={styles.currencyPrefix}>₱</Text>
                  <TextInput
                    style={styles.offerInput}
                    value={offerAmount}
                    onChangeText={setOfferAmount}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.recommendBox}>
                  <Text style={styles.recommendTitle}>
                    Recommended range for Home Cleaning <Text style={{ fontWeight: '800' }}>₱ 800 - ₱ 1500</Text>
                  </Text>
                  <Text style={styles.recommendSub}>
                    Based on 4 hours of professional domestic service in your area.
                  </Text>
                </View>
              </View>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <View style={styles.step4Container}>
                <Text style={styles.summaryTitle}>SUMMARY</Text>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Service</Text>
                    <Text style={styles.summaryValue}>{selectedService}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Type</Text>
                    <Text style={styles.summaryValue}>
                      {engagementType === 'short' ? 'Short-term' : 'Long-term'}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Date</Text>
                    <Text style={styles.summaryValue}>{formatSelectedDate(selectedDate)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Rate</Text>
                    <Text style={[styles.summaryValue, { color: '#D97706', fontWeight: '800' }]}>
                      ₱{offerAmount} / day
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Time</Text>
                    <Text style={styles.summaryValue}>12:00 - 5:00 PM</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Location</Text>
                    <Text style={[styles.summaryValue, { textAlign: 'right', flex: 1, marginLeft: 20 }]}>
                      Lower Tambo Macasandig, Blk 5
                    </Text>
                  </View>
                </View>

                <View style={styles.visibleNoticeBox}>
                  <Text style={styles.visibleNoticeText}>
                    Your job will be visible to verified Kasambahay once posted.
                  </Text>
                </View>

                <Pressable
                  style={styles.checkboxRow}
                  onPress={() => setAgreedTerms(!agreedTerms)}
                >
                  <View style={[styles.checkbox, agreedTerms && styles.checkboxActive]}>
                    {agreedTerms && <Ionicons name="checkmark" size={14} color="#FFF" />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to the <Text style={{ color: '#8F5CFF', fontWeight: '600' }}>SerbiSure Terms of Service</Text> and understand that I will be charged once the job is confirmed and completed by the professional.
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Fixed Bottom Buttons Area (Same Position & Size across all 4 steps!) */}
          <View style={styles.bottomButtonsContainer}>
            <Pressable
              style={({ pressed }) => [styles.nextButton, pressed && styles.btnPressed]}
              onPress={handleNext}
              disabled={isPosting}
            >
              <Text style={styles.nextButtonText}>
                {isPosting ? 'Posting...' : step === 4 ? 'Post →' : 'Next →'}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.backButton, pressed && styles.btnPressed]}
              onPress={handleBack}
              disabled={isPosting}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>
          </View>
        </View>

        {/* Job Posted Success Overlay (Animated Logo & Loader Ring) */}
        {postedSuccess && (
          <View style={styles.successOverlay}>
            <Animated.View style={[styles.successContainer, { transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.logoRingWrapper}>
                <Animated.View style={[styles.rotatingRing, { transform: [{ rotate: spin }] }]} />
                <View style={styles.innerLogoCircle}>
                  <Image source={logoSource} style={styles.successLogoImage} resizeMode="contain" />
                </View>
              </View>
              <Text style={styles.successTitleText}>Job posted!</Text>
            </Animated.View>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F5F2',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topSection: {
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 10,
  },
  logo: {
    width: 36,
    height: 36,
  },
  stepCounter: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  titleHighlight: {
    color: '#FFB43B',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
  },
  // STEP 1 STYLES
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  serviceCardActive: {
    borderColor: '#FFB43B',
    backgroundColor: '#FFFBF5',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF0DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconCircleActive: {
    backgroundColor: '#FFECCB',
  },
  serviceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFB43B',
  },
  serviceLabelActive: {
    color: '#D97706',
    fontWeight: '800',
  },
  // STEP 2 STYLES
  step2Container: {},
  typeToggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  typeCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
  },
  typeCardActive: {
    borderColor: '#FFB43B',
    backgroundColor: '#FFFBF5',
  },
  typeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  typeSub: {
    fontSize: 9.5,
    color: '#888',
    lineHeight: 12,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarMonth: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  calendarArrows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayHeaderText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCellWrapper: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dateCell: {
    width: 26,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  dateCellSelected: {
    backgroundColor: '#FFB43B',
  },
  dateCellText: {
    fontSize: 10,
    color: '#333',
  },
  dateCellMuted: {
    color: '#CCC',
  },
  dateCellTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  timeSlotRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeSlotCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
  },
  timeSlotActive: {
    borderColor: '#FFB43B',
    backgroundColor: '#FFFBF5',
  },
  timeSlotTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 2,
  },
  timeSlotSub: {
    fontSize: 8,
    color: '#888',
  },
  // STEP 3 STYLES
  step3Container: {},
  inputGroupLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#666',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    marginBottom: 12,
  },
  twoColumnRow: {
    flexDirection: 'row',
  },
  sectionLabelLarge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  multilineInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 80,
    paddingHorizontal: 14,
    paddingTop: 10,
    fontSize: 12,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  offerInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    marginBottom: 12,
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 8,
  },
  offerInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  recommendBox: {
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#00ACC1',
  },
  recommendTitle: {
    fontSize: 10,
    color: '#006064',
  },
  recommendSub: {
    fontSize: 9,
    color: '#00838F',
    marginTop: 2,
  },
  // STEP 4 STYLES
  step4Container: {},
  summaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  visibleNoticeBox: {
    backgroundColor: '#E0F2F1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  visibleNoticeText: {
    fontSize: 11,
    color: '#00695C',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#888',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#8F5CFF',
    borderColor: '#8F5CFF',
  },
  checkboxText: {
    flex: 1,
    fontSize: 11,
    color: '#555',
    lineHeight: 16,
  },
  // BOTTOM BUTTONS (STATIONARY & UNIFIED ACROSS ALL STEPS - MATCHES REGISTRATION SCREEN)
  bottomButtonsContainer: {
    marginTop: 14,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#FFB43B',
    height: 38,
    width: '82%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFB43B',
    height: 36,
    width: '82%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFA51F',
    fontSize: 14,
    fontWeight: '500',
  },
  btnPressed: {
    opacity: 0.78,
  },
  // SUCCESS OVERLAY (DARK BACKDROP WITH ANIMATED LOGO & LOADER RING)
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRingWrapper: {
    width: 144,
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  rotatingRing: {
    position: 'absolute',
    width: 144,
    height: 144,
    borderRadius: 72,
    borderWidth: 4.5,
    borderColor: '#FFB43B',
    borderTopColor: 'transparent',
    borderRightColor: '#FFA51F',
  },
  innerLogoCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#1C3144',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB43B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  successLogoImage: {
    width: 82,
    height: 82,
  },
  successTitleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
