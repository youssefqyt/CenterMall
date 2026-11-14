import React, { useState } from 'react';
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
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

export default function CartScreen({ navigation }) {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, tax, total } = useCart();
  const { user } = useAuth();
  const [pickupType, setPickupType] = useState('Store Pickup'); // 'Store Pickup', 'Food Court Table', 'Mall Valet Delivery'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!user) {
      Alert.alert('Sign In', 'Please sign in or continue to place your order.', [
        { text: 'Cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('Profile') }
      ]);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        pickupType,
        deliveryLocation: pickupType === 'Food Court Table' ? 'Table #24 (Central Plaza)' : 'Main Information Counter',
        paymentMethod: 'Card on Pickup'
      };

      const res = await apiClient.post('/orders', orderPayload);
      clearCart();
      navigation.navigate('OrderConfirmation', {
        order: res.data.order || {
          orderNumber: `CM-${Math.floor(100000 + Math.random() * 900000)}`,
          total,
          pickupType,
          status: 'PREPARING'
        }
      });
    } catch {
      // Local fallback
      const mockOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `CM-${Math.floor(100000 + Math.random() * 900000)}`,
        items: items.map(i => ({ name: i.product.name, price: i.product.price, quantity: i.quantity })),
        total,
        pickupType,
        deliveryLocation: 'Main Information Desk',
        status: 'PREPARING',
        createdAt: new Date().toISOString()
      };
      clearCart();
      navigation.navigate('OrderConfirmation', { order: mockOrder });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="bag-handle-outline" size={50} color={colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
        <Text style={styles.emptySubtitle}>Explore stores and dining options at Center MALL to add items!</Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate('Stores')}
        >
          <Text style={styles.browseBtnText}>Browse Stores</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Shopping Bag ({items.length})</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Cart Items List */}
        {items.map(item => (
          <View key={item.product.id} style={styles.itemCard}>
            <Image source={{ uri: item.product.image }} style={styles.thumb} />
            <View style={styles.itemInfo}>
              <View style={styles.itemHeader}>
                <Text style={styles.storeName}>{item.product.storeName}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
              <Text style={styles.productName} numberOfLines={1}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>${item.product.price}</Text>

              {/* Quantity selector */}
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product.id, -1)}
                >
                  <Ionicons name="remove" size={16} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product.id, 1)}
                >
                  <Ionicons name="add" size={16} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.lineTotal}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* Pickup Options */}
        <Text style={styles.sectionTitle}>Pickup & Fulfillment</Text>
        <View style={styles.pickupCard}>
          {[
            { id: 'Store Pickup', label: 'Store Counter Pickup', desc: 'Pick up directly at the shop' },
            { id: 'Food Court Table', label: 'Food Court Table Delivery', desc: 'Delivered to your table' },
            { id: 'Mall Valet Delivery', label: 'Valet Gate Pickup', desc: 'Ready as you collect your car' }
          ].map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.pickupOption, pickupType === opt.id && styles.pickupActive]}
              onPress={() => setPickupType(opt.id)}
            >
              <Ionicons
                name={pickupType === opt.id ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={pickupType === opt.id ? colors.accent : colors.textMuted}
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.pickupLabel}>{opt.label}</Text>
                <Text style={styles.pickupDesc}>{opt.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pricing Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mall Municipal Tax (7%)</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          style={[styles.checkoutBtn, isSubmitting && { opacity: 0.7 }]}
          disabled={isSubmitting}
          onPress={handleCheckout}
        >
          <Ionicons name="card-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.checkoutBtnText}>
            {isSubmitting ? 'Processing Order...' : `Pay & Place Order ($${total.toFixed(2)})`}
          </Text>
        </TouchableOpacity>

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  browseBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10
  },
  browseBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold'
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
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary
  },
  clearText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600'
  },
  scroll: {
    padding: 16
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between'
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  storeName: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700'
  },
  productName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 2
  },
  itemPrice: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginHorizontal: 10
  },
  lineTotal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 'auto'
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 14,
    marginBottom: 8
  },
  pickupCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  pickupOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  pickupActive: {
    backgroundColor: '#F8FAFC'
  },
  pickupLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary
  },
  pickupDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 0
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold'
  }
});

