import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import apiClient from '../api/apiClient';
import { fallbackData } from '../api/mockData';
import { useAuth } from '../context/AuthContext';

export default function StoresScreen({ route, navigation }) {
  const initialCat = route?.params?.category || 'all';
  const initialQuery = route?.params?.initialQuery || '';

  const [stores, setStores] = useState(fallbackData.stores);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [refreshing, setRefreshing] = useState(false);

  const { user, toggleBookmark } = useAuth();

  useEffect(() => {
    fetchStores();
  }, [selectedCategory, selectedFloor, searchQuery]);

  const fetchStores = async () => {
    try {
      let url = `/stores?category=${selectedCategory}&floor=${selectedFloor}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await apiClient.get(url);
      if (res.data.success) {
        setStores(res.data.stores);
      }
    } catch {
      // filter locally from fallbackData
      let filtered = [...fallbackData.stores];
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(s => s.category === selectedCategory);
      }
      if (selectedFloor !== 'all') {
        filtered = filtered.filter(s => s.floor === selectedFloor);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        );
      }
      setStores(filtered);
    } finally {
      setRefreshing(false);
    }
  };

  const floors = [
    { id: 'all', label: 'All Floors' },
    { id: 'G', label: 'Ground Floor' },
    { id: 'F1', label: 'Floor 1 (Fashion)' },
    { id: 'F2', label: 'Floor 2 (Tech)' },
    { id: 'F3', label: 'Floor 3 (Food & IMAX)' }
  ];

  const categories = fallbackData.categories;

  const renderStoreItem = ({ item }) => {
    const isBookmarked = user?.bookmarks?.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('StoreDetail', { storeId: item.id })}
      >
        <Image source={{ uri: item.image }} style={styles.storeImage} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeTitle} numberOfLines={1}>{item.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={13} color={colors.accent} />
                <Text style={styles.locationText}>Floor {item.floor} • {item.unit}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.bookmarkBtn}
              onPress={() => toggleBookmark(item.id)}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isBookmarked ? colors.secondary : colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

          <View style={styles.cardFooter}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingScore}>{item.rating}</Text>
              <Text style={styles.reviewsCount}>({item.reviewsCount || 40})</Text>
            </View>

            <View style={styles.hoursRow}>
              <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.hoursText}>{item.hours}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header & Search */}
      <View style={styles.topSection}>
        <Text style={styles.heading}>Mall Directory</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores, brands or items..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Floor Filter */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={floors}
          keyExtractor={item => item.id}
          style={styles.floorList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.floorPill, selectedFloor === item.id && styles.floorPillActive]}
              onPress={() => setSelectedFloor(item.id)}
            >
              <Text style={[styles.floorText, selectedFloor === item.id && styles.floorTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Category Filter */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={item => item.id}
          style={styles.categoryList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.catPill, selectedCategory === item.id && styles.catPillActive]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={14}
                color={selectedCategory === item.id ? '#FFF' : colors.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.catText, selectedCategory === item.id && styles.catTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Stores List */}
      <FlatList
        data={stores}
        keyExtractor={item => item.id}
        renderItem={renderStoreItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStores(); }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No stores found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or floor filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  topSection: {
    paddingTop: 50,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 10
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text
  },
  floorList: {
    marginBottom: 8
  },
  floorPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  floorPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  floorText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  floorTextActive: {
    color: '#FFF'
  },
  categoryList: {
    marginBottom: 4
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginRight: 6
  },
  catPillActive: {
    backgroundColor: colors.secondary
  },
  catText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary
  },
  catTextActive: {
    color: '#FFF'
  },
  listContent: {
    padding: 16,
    paddingBottom: 40
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  storeImage: {
    width: '100%',
    height: 140
  },
  cardBody: {
    padding: 14
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  locationText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
    marginLeft: 3
  },
  bookmarkBtn: {
    padding: 4
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 4
  },
  reviewsCount: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 2
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  hoursText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4
  }
});

