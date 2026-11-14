import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import apiClient from '../api/apiClient';
import { fallbackData } from '../api/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [mallInfo, setMallInfo] = useState(fallbackData.mall);
  const [stores, setStores] = useState(fallbackData.stores);
  const [deals, setDeals] = useState(fallbackData.deals);
  const [events, setEvents] = useState(fallbackData.events);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { totalCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mallRes, storesRes, dealsRes, eventsRes] = await Promise.all([
        apiClient.get('/mall/info').catch(() => null),
        apiClient.get('/stores?featured=true').catch(() => null),
        apiClient.get('/deals').catch(() => null),
        apiClient.get('/events').catch(() => null)
      ]);

      if (mallRes?.data?.success) setMallInfo(mallRes.data.mall);
      if (storesRes?.data?.success) setStores(storesRes.data.stores);
      if (dealsRes?.data?.success) setDeals(dealsRes.data.deals);
      if (eventsRes?.data?.success) setEvents(eventsRes.data.events);
    } catch {
      // Use fallbackData
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <View style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="business" size={16} color="#FFF" />
            </View>
            <Text style={styles.brandTitle}>CENTER MALL</Text>
          </View>
          <Text style={styles.subTitle}>Open Today: 09:00 - 22:00</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="bag-handle-outline" size={24} color={colors.primary} />
            {totalCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={30} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.searchBox}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Stores', { initialQuery: searchQuery })}
          >
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search 150+ stores, brands, dining..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => navigation.navigate('Stores', { initialQuery: searchQuery })}
            />
          </TouchableOpacity>
        </View>

        {/* Live Mall Bar */}
        <View style={styles.mallStatusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            Mall Open • <Text style={styles.boldText}>238</Text> Parking spots available
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Services')}>
            <Text style={styles.statusLink}>View Map &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=80' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.saleTag}>
              <Text style={styles.saleTagText}>MEGA SALE</Text>
            </View>
            <Text style={styles.heroTitle}>Summer Festival At Center MALL</Text>
            <Text style={styles.heroSubtitle}>Up to 50% off top international fashion & electronics</Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate('Stores')}
            >
              <Text style={styles.heroButtonText}>Explore Stores</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Stores')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {[
            { id: 'fashion', label: 'Fashion', icon: 'shirt-outline', color: '#EEF2FF', iconColor: '#4F46E5' },
            { id: 'electronics', label: 'Tech & Gadgets', icon: 'laptop-outline', color: '#ECFDF5', iconColor: '#059669' },
            { id: 'food', label: 'Dining & Food Court', icon: 'restaurant-outline', color: '#FFFBEB', iconColor: '#D97706' },
            { id: 'entertainment', label: 'Cinema & IMAX', icon: 'film-outline', color: '#EFF6FF', iconColor: '#2563EB' },
            { id: 'beauty', label: 'Beauty & Care', icon: 'sparkles-outline', color: '#FDF2F8', iconColor: '#DB2777' },
            { id: 'sports', label: 'Sportswear', icon: 'fitness-outline', color: '#F0FDF4', iconColor: '#16A34A' }
          ].map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.catCard}
              onPress={() => navigation.navigate('Stores', { category: cat.id })}
            >
              <View style={[styles.catIconWrap, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon} size={24} color={cat.iconColor} />
              </View>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Flash Deals Carousel */}
        <View style={styles.sectionHeader}>
          <View style={styles.flashHeaderRow}>
            <Ionicons name="flame" size={20} color="#EF4444" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Exclusive Mall Deals</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealsScroll}>
          {deals.map(deal => (
            <TouchableOpacity
              key={deal.id}
              style={styles.dealCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Stores')}
            >
              <Image source={{ uri: deal.image }} style={styles.dealImage} />
              <View style={styles.dealOverlay}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>{deal.discount}</Text>
                </View>
                <Text style={styles.dealTitle} numberOfLines={1}>{deal.title}</Text>
                <Text style={styles.dealStore}>{deal.store}</Text>
                {deal.code && (
                  <View style={styles.codePill}>
                    <Ionicons name="pricetag-outline" size={12} color="#FFF" style={{ marginRight: 4 }} />
                    <Text style={styles.codeText}>CODE: {deal.code}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Stores */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Stores</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Stores')}>
            <Text style={styles.seeAllText}>All Stores ({stores.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.storesGrid}>
          {stores.slice(0, 4).map(store => (
            <TouchableOpacity
              key={store.id}
              style={styles.storeItem}
              onPress={() => navigation.navigate('StoreDetail', { storeId: store.id })}
            >
              <Image source={{ uri: store.image }} style={styles.storeThumb} />
              <View style={styles.storeContent}>
                <View style={styles.storeHeader}>
                  <Text style={styles.storeName} numberOfLines={1}>{store.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingText}>{store.rating}</Text>
                  </View>
                </View>
                <Text style={styles.storeFloor}>Floor {store.floor} • {store.unit}</Text>
                <Text style={styles.storeCategory}>{store.category?.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mall Events */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Happening at Center MALL</Text>
        </View>

        {events.map(event => (
          <View key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventBody}>
              <View style={styles.eventDateTag}>
                <Ionicons name="calendar-outline" size={14} color={colors.secondary} style={{ marginRight: 4 }} />
                <Text style={styles.eventDateText}>{event.date}</Text>
              </View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventLocRow}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={styles.eventLocText}>{event.location}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 8,
    marginRight: 8
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.2
  },
  subTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    padding: 8,
    marginRight: 10,
    position: 'relative'
  },
  avatarButton: {
    padding: 4
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold'
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text
  },
  mallStatusPill: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 8
  },
  statusText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1
  },
  boldText: {
    fontWeight: 'bold'
  },
  statusLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857'
  },
  heroBanner: {
    marginHorizontal: 20,
    height: 190,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    elevation: 3
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    padding: 18,
    justifyContent: 'flex-end'
  },
  saleTag: {
    backgroundColor: colors.secondary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6
  },
  saleTagText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  heroSubtitle: {
    color: '#E2E8F0',
    fontSize: 12,
    marginBottom: 10
  },
  heroButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  heroButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8
  },
  flashHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingBottom: 14
  },
  catCard: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 76
  },
  catIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6
  },
  catLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center'
  },
  dealsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 14
  },
  dealCard: {
    width: width * 0.72,
    height: 160,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative'
  },
  dealImage: {
    width: '100%',
    height: '100%'
  },
  dealOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    padding: 14,
    justifyContent: 'flex-end'
  },
  discountBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4
  },
  discountBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold'
  },
  dealTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold'
  },
  dealStore: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2
  },
  codePill: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  codeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold'
  },
  storesGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  storeItem: {
    width: (width - 52) / 2,
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  storeThumb: {
    width: '100%',
    height: 110
  },
  storeContent: {
    padding: 10
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  storeName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
    marginRight: 4
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#B45309',
    marginLeft: 2
  },
  storeFloor: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3
  },
  storeCategory: {
    fontSize: 9,
    color: colors.accent,
    fontWeight: '700',
    marginTop: 4
  },
  eventCard: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row'
  },
  eventImage: {
    width: 100,
    height: 90
  },
  eventBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  eventDateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3
  },
  eventDateText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.secondary
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4
  },
  eventLocRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  eventLocText: {
    fontSize: 11,
    color: colors.textSecondary
  }
});

