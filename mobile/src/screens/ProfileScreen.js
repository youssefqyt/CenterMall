import React, { useState } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { fallbackData } from '../api/mockData';

export default function ProfileScreen({ navigation }) {
  const { user, login, register, logout } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please fill in both email and password.');
      return;
    }

    setLoading(true);
    if (isLoginTab) {
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) {
        Alert.alert('Login', res.message || 'Could not log in.');
      }
    } else {
      if (!name) {
        setLoading(false);
        Alert.alert('Required Fields', 'Please enter your full name.');
        return;
      }
      const res = await register(name, email, password, phone);
      setLoading(false);
      if (!res.success) {
        Alert.alert('Registration', res.message || 'Could not register.');
      }
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    await login('youssef@centermall.com', 'password123');
    setLoading(false);
  };

  const bookmarkedStores = fallbackData.stores.filter(s => user?.bookmarks?.includes(s.id));

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Center MALL Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {user ? (
          <View>
            {/* VIP Loyalty Card */}
            <View style={styles.vipCard}>
              <View style={styles.vipCardHeader}>
                <View>
                  <Text style={styles.vipTier}>{user.membershipTier || 'Gold VIP Member'}</Text>
                  <Text style={styles.vipName}>{user.name}</Text>
                </View>
                <Ionicons name="ribbon" size={28} color="#F59E0B" />
              </View>

              <View style={styles.vipPointsRow}>
                <View>
                  <Text style={styles.pointsLabel}>Loyalty Points Balance</Text>
                  <Text style={styles.pointsValue}>{user.loyaltyPoints || 1250} PTS</Text>
                </View>
                <View style={styles.cashbackBox}>
                  <Text style={styles.cashbackText}>
                    = ${(Number(user.loyaltyPoints || 1250) / 100).toFixed(2)} Off
                  </Text>
                </View>
              </View>

              <View style={styles.vipCardFooter}>
                <Text style={styles.vipEmail}>{user.email}</Text>
                <Text style={styles.vipNumber}>CARD #CM-8829</Text>
              </View>
            </View>

            {/* Bookmarked Stores */}
            <Text style={styles.sectionHeading}>Favorite Stores ({bookmarkedStores.length})</Text>
            {bookmarkedStores.length > 0 ? (
              bookmarkedStores.map(store => (
                <TouchableOpacity
                  key={store.id}
                  style={styles.bookmarkedItem}
                  onPress={() => navigation.navigate('StoreDetail', { storeId: store.id })}
                >
                  <View style={styles.bookmarkedIcon}>
                    <Ionicons name="business" size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.storeName}>{store.name}</Text>
                    <Text style={styles.storeFloor}>Floor {store.floor} • {store.unit}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyBookmarks}>
                <Text style={styles.emptyBookmarksText}>No saved stores yet. Tap the bookmark icon on any store to save it here.</Text>
              </View>
            )}

            {/* Quick Actions */}
            <Text style={styles.sectionHeading}>Mall Privileges & Perks</Text>
            <View style={styles.perksCard}>
              <View style={styles.perkRow}>
                <Ionicons name="car-outline" size={20} color={colors.accent} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.perkTitle}>Complimentary Valet Parking</Text>
                  <Text style={styles.perkSub}>Show your VIP card at the Main Gate</Text>
                </View>
              </View>
              <View style={styles.perkRow}>
                <Ionicons name="wifi-outline" size={20} color={colors.accent} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.perkTitle}>Priority High-Speed Wi-Fi</Text>
                  <Text style={styles.perkSub}>Unlimited gigabit VIP mall network</Text>
                </View>
              </View>
              <View style={[styles.perkRow, { borderBottomWidth: 0 }]}>
                <Ionicons name="gift-outline" size={20} color={colors.accent} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.perkTitle}>Birthday Special Discounts</Text>
                  <Text style={styles.perkSub}>Receive 20% vouchers during your birthday month</Text>
                </View>
              </View>
            </View>

            {/* Logout button */}
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Ionicons name="log-out-outline" size={18} color={colors.danger} style={{ marginRight: 6 }} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Sign In / Sign Up Form */
          <View style={styles.authContainer}>
            <View style={styles.authBanner}>
              <View style={styles.authIconWrap}>
                <Ionicons name="person" size={26} color="#FFF" />
              </View>
              <Text style={styles.authTitle}>Join Center MALL Club</Text>
              <Text style={styles.authSubtitle}>
                Unlock exclusive discounts, cinema perks, food delivery and valet parking!
              </Text>
            </View>

            {/* Tabs */}
            <View style={styles.authTabBar}>
              <TouchableOpacity
                style={[styles.authTab, isLoginTab && styles.authTabActive]}
                onPress={() => setIsLoginTab(true)}
              >
                <Text style={[styles.authTabText, isLoginTab && styles.authTabTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authTab, !isLoginTab && styles.authTabActive]}
                onPress={() => setIsLoginTab(false)}
              >
                <Text style={[styles.authTabText, !isLoginTab && styles.authTabTextActive]}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            {!isLoginTab && (
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {!isLoginTab && (
              <TextInput
                style={styles.input}
                placeholder="Phone Number (Optional)"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.authSubmitBtn, loading && { opacity: 0.7 }]}
              disabled={loading}
              onPress={handleAuth}
            >
              <Text style={styles.authSubmitText}>
                {loading ? 'Please wait...' : (isLoginTab ? 'Sign In to Center MALL' : 'Create VIP Account')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickDemoBtn} onPress={handleDemoSignIn}>
              <Ionicons name="sparkles" size={16} color={colors.secondary} style={{ marginRight: 6 }} />
              <Text style={styles.quickDemoText}>Instant 1-Click Demo Login (Youssef)</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backBtn: {
    padding: 6
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary
  },
  scroll: {
    padding: 16
  },
  vipCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4
  },
  vipCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  vipTier: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5
  },
  vipName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2
  },
  vipPointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 12,
    marginVertical: 10
  },
  pointsLabel: {
    color: '#94A3B8',
    fontSize: 11
  },
  pointsValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  cashbackBox: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  cashbackText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold'
  },
  vipCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  vipEmail: {
    color: '#94A3B8',
    fontSize: 11
  },
  vipNumber: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: 'bold'
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    marginTop: 10
  },
  bookmarkedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  bookmarkedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  storeName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary
  },
  storeFloor: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  emptyBookmarks: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyBookmarksText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18
  },
  perksCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  perkTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary
  },
  perkSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 10
  },
  logoutText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: 'bold'
  },
  authContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  authBanner: {
    alignItems: 'center',
    marginBottom: 20
  },
  authIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  authTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary
  },
  authSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18
  },
  authTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16
  },
  authTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8
  },
  authTabActive: {
    backgroundColor: colors.surface
  },
  authTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary
  },
  authTabTextActive: {
    color: colors.primary,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
    color: colors.text
  },
  authSubmitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6
  },
  authSubmitText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  quickDemoBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  quickDemoText: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: 'bold'
  }
});

