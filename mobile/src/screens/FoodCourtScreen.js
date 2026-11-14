import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import apiClient from '../api/apiClient';
import { fallbackData } from '../api/mockData';
import { useCart } from '../context/CartContext';

export default function FoodCourtScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedRest, setSelectedRest] = useState('all');

  const { addToCart, totalCount } = useCart();

  useEffect(() => {
    fetchFoodData();
  }, []);

  const fetchFoodData = async () => {
    try {
      const res = await apiClient.get('/stores?category=food');
      if (res.data.success) {
        setRestaurants(res.data.stores);
      }
      const prodRes = await apiClient.get('/products?category=food');
      if (prodRes.data.success) {
        setFoodItems(prodRes.data.products);
      }
    } catch {
      const restFallback = fallbackData.stores.filter(s => s.category === 'food');
      const prodFallback = fallbackData.products.filter(p => p.category === 'food');
      setRestaurants(restFallback);
      setFoodItems(prodFallback);
    }
  };

  const filteredItems = selectedRest === 'all'
    ? foodItems
    : foodItems.filter(item => item.storeId === selectedRest);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Food Court & Dining</Text>
          <Text style={styles.subtitle}>Floor 3 Gourmet Plaza & Ground Cafes</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="bag-handle-outline" size={22} color={colors.primary} />
          {totalCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80' }}
            style={styles.bannerImg}
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>DINE-IN OR TAKEAWAY</Text>
            </View>
            <Text style={styles.bannerTitle}>Order Food To Your Table</Text>
            <Text style={styles.bannerDesc}>Enjoy meals delivered directly to your Food Court seat or pick up on the go.</Text>
          </View>
        </View>

        {/* Restaurants Filter */}
        <Text style={styles.sectionTitle}>Popular Eateries</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.restScroll}>
          <TouchableOpacity
            style={[styles.restPill, selectedRest === 'all' && styles.restPillActive]}
            onPress={() => setSelectedRest('all')}
          >
            <Text style={[styles.restText, selectedRest === 'all' && styles.restTextActive]}>
              All ({foodItems.length})
            </Text>
          </TouchableOpacity>

          {restaurants.map(rest => (
            <TouchableOpacity
              key={rest.id}
              style={[styles.restPill, selectedRest === rest.id && styles.restPillActive]}
              onPress={() => setSelectedRest(rest.id)}
            >
              <Text style={[styles.restText, selectedRest === rest.id && styles.restTextActive]}>
                {rest.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Food Items */}
        <Text style={styles.sectionTitle}>Menu Items</Text>
        <View style={styles.foodList}>
          {filteredItems.map(item => (
            <View key={item.id} style={styles.foodCard}>
              <Image source={{ uri: item.image }} style={styles.foodImg} />
              <View style={styles.foodBody}>
                <View style={styles.restRow}>
                  <Text style={styles.storeName} numberOfLines={1}>{item.storeName}</Text>
                  {item.dealTag && (
                    <View style={styles.dealBadge}>
                      <Text style={styles.dealBadgeText}>{item.dealTag}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDesc} numberOfLines={2}>{item.description}</Text>

                <View style={styles.foodFooter}>
                  <Text style={styles.foodPrice}>${item.price?.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.orderBtn}
                    onPress={() => {
                      addToCart(item);
                      Alert.alert('Added', `${item.name} added to cart!`);
                    }}
                  >
                    <Ionicons name="add" size={16} color="#FFF" />
                    <Text style={styles.orderBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
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
  header: {
    paddingTop: 50,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  cartBtn: {
    padding: 6,
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  banner: {
    margin: 16,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative'
  },
  bannerImg: {
    width: '100%',
    height: '100%'
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    padding: 14,
    justifyContent: 'flex-end'
  },
  tag: {
    backgroundColor: colors.secondary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 4
  },
  tagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold'
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  bannerDesc: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10
  },
  restScroll: {
    paddingHorizontal: 12,
    paddingBottom: 12
  },
  restPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 4
  },
  restPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  restText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  restTextActive: {
    color: '#FFF'
  },
  foodList: {
    paddingHorizontal: 16
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1
  },
  foodImg: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12
  },
  foodBody: {
    flex: 1,
    justifyContent: 'space-between'
  },
  restRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  storeName: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700'
  },
  dealBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  dealBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold'
  },
  foodName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 2
  },
  foodDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2
  },
  foodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  foodPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary
  },
  orderBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6
  },
  orderBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2
  }
});

