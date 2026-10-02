import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyBookingsScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('https://smart-library-reservation.onrender.com/api/reservations');
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (response.ok) setReservations(data);
        } catch (e) {
          console.error("Backend returned non-JSON. Is the server running? Response:", text);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchReservations();
    });

    fetchReservations();
    return unsubscribe;
  }, [navigation]);

  const renderTicket = ({ item }) => {
    const bookingDate = new Date(item.bookingTime).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const displaySeat = item.seatId ? item.seatId.replace('Seat-', 'A') : 'Unknown';

    return (
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketTitle}>Seat Reservation</Text>
          <Text style={styles.seatBadge}>{displaySeat}</Text>
        </View>
        <View style={styles.ticketBody}>
          <Text style={styles.detailLabel}>Booked on:</Text>
          <Text style={styles.detailValue}>{bookingDate}</Text>
          
          <Text style={[styles.detailLabel, { marginTop: 8 }]}>Duration:</Text>
          <Text style={styles.detailValue}>{item.durationHours} Hours</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Tickets</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : reservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no reservations yet.</Text>
          </View>
        ) : (
          <FlatList
            data={reservations}
            renderItem={renderTicket}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  listContainer: {
    paddingBottom: 20,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginHorizontal: 4,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  seatBadge: {
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontWeight: 'bold',
    fontSize: 16,
    overflow: 'hidden',
  },
  ticketBody: {
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
