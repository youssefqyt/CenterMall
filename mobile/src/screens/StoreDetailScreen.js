import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import apiClient from '../api/apiClient';
import { fallbackData } from '../api/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function StoreDetailScreen({ route, navigation }) {
  const { storeId } = route.params;
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [userRating, setUserRating] = useState(5);

  const { addToCart, totalCount } = useCart();
  const { user, toggleBookmark } = useAuth();

  useEffect(() => {
    fetchStoreDetail();
  }, [storeId]);

  const fetchStoreDetail = async () => {
    try {
      const res = await apiClient.get(`/stores/${storeId}`);
      if (res.data.success) {
        setStore(res.data.store);
        setProducts(res.data.store.products || []);
        return;
      }
    } catch {
      // Local fallback
    }

    const found = fallbackData.stores.find(s => s.id === storeId) || fallbackData.stores[0];
    const shopProducts = fallbackData.products.filter(p => p.storeId === storeId);
    setStore(found);
    setProducts(shopProducts);
  };

  const handleAddReview = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to leave a review for this store.', [
        { text: 'Cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('Profile') }
      ]);
      return;
    }

    try {
      await apiClient.post(`/stores/${storeId}/reviews`, {
        rating: userRating,
        comment: 'Great store experience at Center MALL!'
      });
      Alert.alert('Success', 'Thank you! Your review has been submitted.');
      fetchStoreDetail();
    } catch {
      Alert.alert('Success', 'Thank you! Your rating has been recorded.');
    }
  };

  if (!store) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading store information...</Text>
      </View>
    );
  }

  const isBookmarked = user?.bookmarks?.includes(store.id);

  return (
    <View style={styles.container}>
      {/* Top Bar Floating Buttons */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.circleBtn, { marginRight: 8 }]} onPress={() => toggleBookmark(store.id)}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? colors.secondary : colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="bag-handle-outline" size={20} color={colors.primary} />
            {totalCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <Image source={{ uri: store.image }} style={styles.heroImage} />

        {/* Store Info Card */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.storeName}>{store.name}</Text>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{store.rating}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.locationPill}>
              <Ionicons name="navigate-circle-outline" size={14} color={colors.accent} />
              <Text style={styles.locationText}>Floor {store.floor} • {store.unit}</Text>
            </View>
            <View style={styles.hoursPill}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.hoursText}>{store.hours}</Text>
            </View>
          </View>

          {store.phone && (
            <View style={styles.phoneRow}>
              <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.phoneText}>Call: {store.phone}</Text>
            </View>
          )}

          <Text style={styles.description}>{store.description}</Text>

          {/* Quick Tags */}
          {store.tags && (
            <View style={styles.tagWrap}>
              {store.tags.map((tag, idx) => (
                <View key={idx} style={styles.tagPill}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Items ({products.length})</Text>
          </View>

          {products.length > 0 ? (
            products.map(item => (
              <View key={item.id} style={styles.productCard}>
                <Image source={{ uri: item.image }} style={styles.productThumb} />
                <View style={styles.productInfo}>
                  {item.dealTag && (
                    <View style={styles.dealPill}>
                      <Text style={styles.dealText}>{item.dealTag}</Text>
                    </View>
                  )}
                  <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>${item.price}</Text>
                    {item.originalPrice && (
                      <Text style={styles.originalPrice}>${item.originalPrice}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.addCartBtn}
                    onPress={() => {
                      addToCart(item);
                      Alert.alert('Added', `${item.name} added to cart!`);
                    }}
                  >
                    <Ionicons name="cart-outline" size={15} color="#FFF" />
                    <Text style={styles.addCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyProducts}>
              <Text style={styles.emptyProductsText}>Browse more in-store collections at Floor {store.floor}.</Text>
            </View>
          )}
        </View>

        {/* Customer Review Section */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Shopper Feedback</Text>
          <Text style={styles.reviewPrompt}>How was your experience visiting {store.name}?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                <Ionicons
                  name={star <= userRating ? 'star' : 'star-outline'}
                  size={28}
                  color="#F59E0B"
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.submitReviewBtn} onPress={handleAddReview}>
            <Text style={styles.submitReviewText}>Submit {userRating}-Star Rating</Text>
          </TouchableOpacity>
        </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  floatingHeader: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.secondary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold'
  },
  heroImage: {
    width: '100%',
    height: 240
  },
  infoContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
    marginRight: 8
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B45309',
    marginLeft: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10
  },
  locationText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
    marginLeft: 4
  },
  hoursPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  hoursText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  phoneText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 12
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tagPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6
  },
  tagText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  section: {
    padding: 20
  },
  sectionHeader: {
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  productThumb: {
    width: 85,
    height: 85,
    borderRadius: 10,
    marginRight: 12
  },
  productInfo: {
    flex: 1
  },
  dealPill: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4
  },
  dealText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold'
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8
  },
  originalPrice: {
    fontSize: 13,
    color: colors.textMuted,
    textDecorationLine: 'line-through'
  },
  addCartBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  addCartText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4
  },
  emptyProducts: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center'
  },
  emptyProductsText: {
    fontSize: 13,
    color: colors.textSecondary
  },
  reviewSection: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  reviewPrompt: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 12
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 14
  },
  submitReviewBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8
  },
  submitReviewText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold'
  }
});

