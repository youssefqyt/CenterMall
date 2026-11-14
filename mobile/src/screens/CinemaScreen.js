import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import apiClient from '../api/apiClient';
import { fallbackData } from '../api/mockData';
import { useAuth } from '../context/AuthContext';

export default function CinemaScreen({ navigation }) {
  const [movies, setMovies] = useState(fallbackData.movies);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [ticketCount, setTicketCount] = useState(2);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await apiClient.get('/cinema');
      if (res.data.success) {
        setMovies(res.data.movies);
      }
    } catch {
      // Keep fallbackData
    }
  };

  const handleOpenBooking = (movie, time) => {
    setSelectedMovie(movie);
    setSelectedShowtime(time || movie.showtimes[0]);
    setModalVisible(true);
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      setModalVisible(false);
      Alert.alert('Sign In', 'Please sign in or continue to book your cinema tickets.', [
        { text: 'Cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('Profile') }
      ]);
      return;
    }

    try {
      const res = await apiClient.post('/cinema/book', {
        movieId: selectedMovie.id,
        showtime: selectedShowtime,
        ticketsCount: ticketCount
      });

      if (res.data.success) {
        setConfirmedBooking(res.data.booking);
      }
    } catch {
      // Local demo booking
      const demoBooking = {
        id: `book-${Date.now()}`,
        movieTitle: selectedMovie.title,
        hall: selectedMovie.hall,
        showtime: selectedShowtime,
        ticketsCount: ticketCount,
        seats: ['Row F - Seat 14', 'Row F - Seat 15'],
        totalPrice: selectedMovie.price * ticketCount,
        qrCode: `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      };
      setConfirmedBooking(demoBooking);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cinema City IMAX & 4DX</Text>
          <Text style={styles.subtitle}>Floor 3 • Entertainment Wing</Text>
        </View>
        <View style={styles.imaxBadge}>
          <Text style={styles.imaxText}>IMAX LASER</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cinema Feature Banner */}
        <View style={styles.banner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80' }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.dealPill}>
              <Text style={styles.dealPillText}>2-FOR-1 TUESDAYS</Text>
            </View>
            <Text style={styles.bannerTitle}>Next-Gen Cinema Experience</Text>
            <Text style={styles.bannerDesc}>Dolby Atmos sound, motorized recliner seats & gourmet concession bar.</Text>
          </View>
        </View>

        {/* Movies List */}
        <Text style={styles.sectionTitle}>Now Showing</Text>

        {movies.map(movie => (
          <View key={movie.id} style={styles.movieCard}>
            <Image source={{ uri: movie.poster }} style={styles.poster} />
            <View style={styles.movieInfo}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingBadgeText}>{movie.rating}</Text>
              </View>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.genre}>{movie.genre} • {movie.duration}</Text>
              <Text style={styles.hallTag}>{movie.hall}</Text>
              <Text style={styles.priceTag}>${movie.price?.toFixed(2)} / ticket</Text>

              <Text style={styles.timesLabel}>Select Showtime:</Text>
              <View style={styles.showtimesRow}>
                {movie.showtimes.map((time, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.timePill}
                    onPress={() => handleOpenBooking(movie, time)}
                  >
                    <Ionicons name="time-outline" size={12} color={colors.primary} style={{ marginRight: 3 }} />
                    <Text style={styles.timeText}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {confirmedBooking ? (
              <View style={styles.ticketSuccess}>
                <Ionicons name="checkmark-circle" size={54} color={colors.success} />
                <Text style={styles.successHeading}>Tickets Confirmed!</Text>
                <Text style={styles.successMovie}>{confirmedBooking.movieTitle}</Text>
                <Text style={styles.successMeta}>
                  {confirmedBooking.hall} • {confirmedBooking.showtime}
                </Text>
                <View style={styles.qrBox}>
                  <Ionicons name="qr-code" size={90} color={colors.primary} />
                  <Text style={styles.qrCodeText}>PASS: {confirmedBooking.qrCode}</Text>
                </View>
                <Text style={styles.seatsInfo}>
                  {confirmedBooking.ticketsCount} Seats • Total Paid: ${confirmedBooking.totalPrice?.toFixed(2)}
                </Text>
                <TouchableOpacity
                  style={styles.closeSuccessBtn}
                  onPress={() => {
                    setConfirmedBooking(null);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.closeSuccessText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Book Cinema Tickets</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {selectedMovie && (
                  <View style={styles.modalBody}>
                    <Text style={styles.modalMovieName}>{selectedMovie.title}</Text>
                    <Text style={styles.modalHallName}>{selectedMovie.hall}</Text>
                    <Text style={styles.modalShowtime}>Selected Time: {selectedShowtime}</Text>

                    {/* Quantity Stepper */}
                    <View style={styles.stepperRow}>
                      <Text style={styles.stepperLabel}>Number of Tickets:</Text>
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => setTicketCount(Math.max(1, ticketCount - 1))}
                        >
                          <Ionicons name="remove" size={18} color={colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.stepCount}>{ticketCount}</Text>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => setTicketCount(Math.min(8, ticketCount + 1))}
                        >
                          <Ionicons name="add" size={18} color={colors.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.modalSummary}>
                      <Text style={styles.summaryLabel}>Total Amount:</Text>
                      <Text style={styles.summaryTotal}>
                        ${(selectedMovie.price * ticketCount).toFixed(2)}
                      </Text>
                    </View>

                    <TouchableOpacity style={styles.payBtn} onPress={handleConfirmBooking}>
                      <Ionicons name="ticket-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                      <Text style={styles.payBtnText}>Confirm & Book Tickets</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  imaxBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  imaxText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800'
  },
  scrollContent: {
    padding: 16
  },
  banner: {
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20
  },
  bannerImage: {
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
  dealPill: {
    backgroundColor: colors.secondary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 4
  },
  dealPillText: {
    color: '#FFF',
    fontSize: 10,
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
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  poster: {
    width: 100,
    height: 145,
    borderRadius: 10,
    marginRight: 12
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'space-between'
  },
  ratingBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start'
  },
  ratingBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary
  },
  movieTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 4
  },
  genre: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  hallTag: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent,
    marginTop: 2
  },
  priceTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2
  },
  timesLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 6
  },
  showtimesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary
  },
  modalBody: {
    marginTop: 4
  },
  modalMovieName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary
  },
  modalHallName: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 2
  },
  modalShowtime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 16
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border
  },
  stepperLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12
  },
  modalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.textSecondary
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary
  },
  payBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold'
  },
  ticketSuccess: {
    alignItems: 'center',
    paddingVertical: 10
  },
  successHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
    marginTop: 10
  },
  successMovie: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 6
  },
  successMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2
  },
  qrBox: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  qrCodeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 6
  },
  seatsInfo: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20
  },
  closeSuccessBtn: {
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  closeSuccessText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

