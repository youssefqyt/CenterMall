import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function OrderConfirmationScreen({ route, navigation }) {
  const { order } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.successIconWrap}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          </View>
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.subtitle}>Thank you for shopping at Center MALL.</Text>

          {/* Live Order Tracker */}
          <View style={styles.trackerCard}>
            <Text style={styles.trackerTitle}>Order Status: {order.status}</Text>
            <View style={styles.progressSteps}>
              <View style={[styles.stepDot, styles.stepActive]}>
                <Ionicons name="checkmark" size={14} color="#FFF" />
              </View>
              <View style={[styles.stepLine, styles.stepLineActive]} />
              <View style={[styles.stepDot, styles.stepActive]}>
                <Ionicons name="restaurant" size={14} color="#FFF" />
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepDot}>
                <Ionicons name="bag-check" size={14} color={colors.textMuted} />
              </View>
            </View>
            <View style={styles.stepLabels}>
              <Text style={styles.stepLabelActive}>Confirmed</Text>
              <Text style={styles.stepLabelActive}>Preparing</Text>
              <Text style={styles.stepLabel}>Ready</Text>
            </View>
          </View>

          {/* Order Details */}
          <View style={styles.detailsBox}>
            <View style={styles.row}>
              <Text style={styles.detailKey}>Order ID</Text>
              <Text style={styles.detailVal}>{order.orderNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.detailKey}>Pickup Method</Text>
              <Text style={styles.detailVal}>{order.pickupType}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.detailKey}>Location</Text>
              <Text style={styles.detailVal}>{order.deliveryLocation || 'Main Information Desk'}</Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Text style={styles.detailKey}>Total Paid</Text>
              <Text style={styles.totalVal}>${order.total?.toFixed(2)}</Text>
            </View>
          </View>

          {/* Barcode representation */}
          <View style={styles.barcodeBox}>
            <Ionicons name="barcode-outline" size={70} color={colors.primary} />
            <Text style={styles.barcodeText}>{order.orderNumber}</Text>
            <Text style={styles.barcodeSub}>Present this code when picking up your items</Text>
          </View>

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.doneBtnText}>Back to Mall Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  scroll: {
    padding: 20,
    paddingTop: 60
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  successIconWrap: {
    marginBottom: 10
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20
  },
  trackerCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  trackerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 12
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepActive: {
    backgroundColor: colors.success
  },
  stepLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#E2E8F0'
  },
  stepLineActive: {
    backgroundColor: colors.success
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 6
  },
  stepLabel: {
    fontSize: 11,
    color: colors.textMuted
  },
  stepLabelActive: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary
  },
  detailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  detailKey: {
    fontSize: 13,
    color: colors.textSecondary
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary
  },
  totalVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.secondary
  },
  barcodeBox: {
    alignItems: 'center',
    marginVertical: 10
  },
  barcodeText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 3,
    color: colors.primary,
    marginTop: 4
  },
  barcodeSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4
  },
  doneBtn: {
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

