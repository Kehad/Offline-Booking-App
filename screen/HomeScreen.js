// screens/HomeScreen.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { loadBookings } from "../utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [syncBooking, setSyncBooking] = useState([]);

  const loadStoredBookings = async () => {
    const storedBookings = await loadBookings();
    setSyncBooking(storedBookings);
  };

  // Load bookings when the screen is focused (useful for navigating back)
  useFocusEffect(
    useCallback(() => {
      loadStoredBookings();
    }, [])
  );

  // Also load bookings when the component first mounts
  useEffect(() => {
    loadStoredBookings();
  }, []);

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => {
        // TODO: Implement booking details view

        navigation.navigate("BookingDetails", { booking: item });
      }}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingId}>ID: {item.id.slice(-4)}</Text>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusText,
              { color: item.synced ? "#4CAF50" : "#FFA000" },
            ]}
          >
            {item.synced ? "Synced" : "Pending"}
          </Text>
          {!item.synced && (
            <Ionicons name="warning" size={16} color="#FFA000" />
          )}
        </View>
      </View>

      <View style={styles.routeContainer}>
        <Text style={styles.locationText}>{item.origin}</Text>
        <Ionicons name="arrow-forward" size={20} color="#666" />
        <Text style={styles.locationText}>{item.destination}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Weight: {item.weight} kg</Text>
        <Text style={styles.dateText}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No shipments yet</Text>
      <Text style={styles.emptySubtext}>
        Create a new booking to get started
      </Text>
    </View>
  );

  // if (error) {
  //   return (
  //     <View style={styles.centerContainer}>
  //       <Text style={styles.errorText}>Unable to get boookings</Text>
  //       <TouchableOpacity
  //         style={styles.retryButton}
  //         onPress={loadStoredBookings}
  //       >
  //         <Text style={styles.retryText}>Retry</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <FlatList
        data={syncBooking}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Book")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 14,
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#2196F3",
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

