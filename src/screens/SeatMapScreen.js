import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SeatMapScreen({ navigation }) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch('http://10.58.39.195:5000/api/seats');
        const data = await response.json();
        setSeats(data);
      } catch (error) {
        console.error('Error fetching seats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSeats();
    });

    fetchSeats();
    return unsubscribe;
  }, [navigation]);

  const handleSeatPress = (seatId) => {
    if (selectedSeat === seatId) {
      setSelectedSeat(null); // Deselect if already selected
    } else {
      setSelectedSeat(seatId);
    }
  };

  const renderSeat = ({ item }) => {
    const isSelected = selectedSeat === item.seatId;
    const isBooked = item.status === 'booked';

    let seatStyle = [styles.seat];
    let seatTextStyle = [styles.seatText];

    if (isBooked) {
      seatStyle.push(styles.seatBooked);
      seatTextStyle.push(styles.seatTextBooked);
    } else if (isSelected) {
      seatStyle.push(styles.seatSelected);
      seatTextStyle.push(styles.seatTextSelected);
    } else {
      seatStyle.push(styles.seatAvailable);
      seatTextStyle.push(styles.seatTextAvailable);
    }

    const displayText = item.seatId ? item.seatId.replace('Seat-', 'A') : '';

    return (
      <TouchableOpacity
        style={seatStyle}
        disabled={isBooked}
        onPress={() => handleSeatPress(item.seatId)}
        activeOpacity={0.7}
      >
        <Text style={seatTextStyle}>{displayText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Select Your Seat</Text>
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatAvailable]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatSelected]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatBooked]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>

        {/* Seat Grid or Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <FlatList
            data={seats}
            renderItem={renderSeat}
            keyExtractor={(item) => item.seatId}
            numColumns={4}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Footer with Action Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !selectedSeat && styles.buttonDisabled]}
            disabled={!selectedSeat}
            onPress={() => navigation.navigate('Booking', { seatId: selectedSeat })}
          >
            <Text style={styles.buttonText}>Continue to Booking</Text>
          </TouchableOpacity>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  gridContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  seat: {
    width: 65,
    height: 65,
    margin: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  seatAvailable: {
    backgroundColor: '#ECFDF5',
    borderColor: '#34D399',
    borderWidth: 2,
  },
  seatBooked: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    borderWidth: 2,
    shadowOpacity: 0,
    elevation: 0,
  },
  seatSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
    borderWidth: 2,
  },
  seatText: {
    fontSize: 16,
    fontWeight: '600',
  },
  seatTextAvailable: {
    color: '#059669',
  },
  seatTextBooked: {
    color: '#9CA3AF',
  },
  seatTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
