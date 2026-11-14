import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import apiClient from '../api/apiClient';
import { fallbackData } from '../api/mockData';
import { useAuth } from '../context/AuthContext';

export default function ServicesScreen({ navigation }) {
  const [parking, setParking] = useState(fallbackData.parking);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [reservedPass, setReservedPass] = useState(null);
  const [activeTab, setActiveTab] = useState('parking'); // 'parking', 'floors', 'amenities'

  const { user } = useAuth();

  useEffect(() => {
    fetchParking();
  }, []);

  const fetchParking = async () => {
    try {
      const res = await apiClient.get('/parking');
      if (res.data.success) {
        setParking(res.data.parking);
      }
    } catch {
      // Keep fallback
    }
  };

  const handleReserveParking = async () => {
    if (!vehiclePlate.trim()) {
      Alert.alert('Vehicle Plate Required', 'Please enter your license plate number to reserve a space.');
      return;
    }

    try {
      const res = await apiClient.post('/parking/reserve', {
        vehiclePlate: vehiclePlate.trim(),
        level: 'P1'
      });
      if (res.data.success) {
        setReservedPass(res.data.reservation);
        Alert.alert('Reserved!', 'Your parking space at Level P1 has been reserved.');
      }
    } catch {
      const demoPass = {
        id: `park-${Date.now()}`,
        spotNumber: `P1-${Math.floor(Math.random() * 80 + 10)}`,
        level: 'Level P1 (Express & Valet)',
        vehiclePlate: vehiclePlate.toUpperCase(),
        validUntil: 'Valid for 4 hours'
      };
      setReservedPass(demoPass);
      Alert.alert('Reserved!', `Spot ${demoPass.spotNumber} is reserved for vehicle ${demoPass.vehiclePlate}.`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mall Services & Map</Text>
        <Text style={styles.subtitle}>Parking • Floor Plans • Facilities</Text>

        {/* Tab Pills */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'parking' && styles.tabItemActive]}
            onPress={() => setActiveTab('parking')}
          >
            <Ionicons name="car-outline" size={16} color={activeTab === 'parking' ? '#FFF' : colors.textSecondary} />
            <Text style={[styles.tabLabel, activeTab === 'parking' && styles.tabLabelActive]}>
              Live Parking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'floors' && styles.tabItemActive]}
            onPress={() => setActiveTab('floors')}
          >
            <Ionicons name="map-outline" size={16} color={activeTab === 'floors' ? '#FFF' : colors.textSecondary} />
            <Text style={[styles.tabLabel, activeTab === 'floors' && styles.tabLabelActive]}>
              Floor Guide
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'amenities' && styles.tabItemActive]}
            onPress={() => setActiveTab('amenities')}
          >
            <Ionicons name="sparkles-outline" size={16} color={activeTab === 'amenities' ? '#FFF' : colors.textSecondary} />
            <Text style={[styles.tabLabel, activeTab === 'amenities' && styles.tabLabelActive]}>
              Amenities
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* TAB 1: PARKING */}
        {activeTab === 'parking' && (
          <View>
            {/* Live Counter Card */}
            <View style={styles.parkingHero}>
              <View style={styles.counterCircle}>
                <Text style={styles.counterNum}>{parking.availableSpaces}</Text>
                <Text style={styles.counterLabel}>SPOTS FREE</Text>
              </View>
              <View style={styles.counterInfo}>
                <Text style={styles.parkingTitle}>Center MALL Smart Parking</Text>
                <Text style={styles.parkingDesc}>
                  Total Capacity: {parking.totalSpaces} | Occupied: {parking.occupiedSpaces}
                </Text>
                <Text style={styles.ratePill}>Rate: {parking.ratePerHour} (First 2h FREE)</Text>
              </View>
            </View>

            {/* Levels breakdown */}
            <Text style={styles.sectionHeading}>Parking Levels</Text>
            {parking.levels.map(lvl => (
              <View key={lvl.id} style={styles.levelCard}>
                <View style={styles.levelHeader}>
                  <Text style={styles.levelName}>{lvl.name}</Text>
                  <View style={styles.availBadge}>
                    <Text style={styles.availText}>{lvl.available} available</Text>
                  </View>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.round(((lvl.capacity - lvl.available) / lvl.capacity) * 100)}%` }
                    ]}
                  />
                </View>
                <Text style={styles.capacityText}>Capacity: {lvl.capacity} vehicles</Text>
              </View>
            ))}

            {/* Reserve spot form */}
            <View style={styles.reserveCard}>
              <Text style={styles.reserveTitle}>Reserve Your Spot in Advance</Text>
              <Text style={styles.reserveDesc}>Enter your license plate number to secure a guaranteed space upon arrival.</Text>

              {reservedPass ? (
                <View style={styles.passBox}>
                  <Ionicons name="checkmark-circle" size={32} color={colors.success} />
                  <Text style={styles.passSpot}>{reservedPass.spotNumber}</Text>
                  <Text style={styles.passLvl}>{reservedPass.level}</Text>
                  <Text style={styles.passPlate}>Vehicle: {reservedPass.vehiclePlate}</Text>
                  <Text style={styles.passExpiry}>Status: Active Reservation</Text>
                </View>
              ) : (
                <View>
                  <TextInput
                    style={styles.plateInput}
                    placeholder="e.g. 123 TN 4567"
                    placeholderTextColor={colors.textMuted}
                    value={vehiclePlate}
                    onChangeText={setVehiclePlate}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity style={styles.reserveBtn} onPress={handleReserveParking}>
                    <Ionicons name="key-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.reserveBtnText}>Reserve Level P1 Space</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* TAB 2: FLOOR GUIDE */}
        {activeTab === 'floors' && (
          <View>
            <Text style={styles.sectionHeading}>Mall Floor Plan & Directory</Text>
            {fallbackData.mall.floors.map(floor => (
              <View key={floor.id} style={styles.floorCard}>
                <View style={styles.floorBadge}>
                  <Text style={styles.floorBadgeText}>{floor.id}</Text>
                </View>
                <View style={styles.floorDetails}>
                  <Text style={styles.floorTitle}>{floor.name}</Text>
                  <Text style={styles.floorDesc}>{floor.description}</Text>
                  <TouchableOpacity
                    style={styles.viewFloorShops}
                    onPress={() => navigation.navigate('Stores', { selectedFloor: floor.id })}
                  >
                    <Text style={styles.viewFloorText}>View Stores on this level &gt;</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: AMENITIES */}
        {activeTab === 'amenities' && (
          <View>
            <Text style={styles.sectionHeading}>Visitor Services & Facilities</Text>
            {fallbackData.mall.amenities.map(item => (
              <View key={item.id} style={styles.amenityCard}>
                <View style={styles.amenityIcon}>
                  <Ionicons name={item.icon || 'shield-checkmark-outline'} size={24} color={colors.primary} />
                </View>
                <View style={styles.amenityInfo}>
                  <Text style={styles.amenityName}>{item.name}</Text>
                  <Text style={styles.amenityFloor}>Location: {item.floor}</Text>
                  <Text style={styles.amenityDesc}>{item.description}</Text>
                </View>
              </View>
            ))}

            <View style={styles.infoBox}>
              <Ionicons name="call" size={20} color={colors.accent} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.infoTitle}>Mall Information Desk</Text>
                <Text style={styles.infoText}>Phone: +216 71 800 900</Text>
                <Text style={styles.infoText}>Email: info@centermall.com</Text>
                <Text style={styles.infoText}>Address: 100 Avenue Habib Bourguiba, Downtown</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingTop: 50,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 12
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8
  },
  tabItemActive: {
    backgroundColor: colors.primary
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 4
  },
  tabLabelActive: {
    color: '#FFF'
  },
  content: {
    padding: 16
  },
  parkingHero: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  counterCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14
  },
  counterNum: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065F46'
  },
  counterLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#047857'
  },
  counterInfo: {
    flex: 1
  },
  parkingTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary
  },
  parkingDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3
  },
  ratePill: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.accent,
    marginTop: 6
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    marginTop: 6
  },
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  levelName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary
  },
  availBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  availText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.success
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary
  },
  capacityText: {
    fontSize: 11,
    color: colors.textSecondary
  },
  reserveCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  reserveTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary
  },
  reserveDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 6
  },
  plateInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary
  },
  reserveBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10
  },
  reserveBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold'
  },
  passBox: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  passSpot: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 4
  },
  passLvl: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600'
  },
  passPlate: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4
  },
  passExpiry: {
    fontSize: 11,
    color: colors.success,
    marginTop: 2
  },
  floorCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  floorBadge: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14
  },
  floorBadgeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  floorDetails: {
    flex: 1
  },
  floorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary
  },
  floorDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 3
  },
  viewFloorShops: {
    alignSelf: 'flex-start',
    marginTop: 2
  },
  viewFloorText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.accent
  },
  amenityCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  amenityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14
  },
  amenityInfo: {
    flex: 1
  },
  amenityName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary
  },
  amenityFloor: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent,
    marginTop: 1
  },
  amenityDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18
  }
});

