import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import * as Network from "expo-network";
import { loadBookings, updateBookingSyncStatus } from "../utils/storage";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function SyncScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [syncBookings, setSyncBookings] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnectivity();
    loadStoredBookings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadStoredBookings();
      checkConnectivity();
    }, [])
  );

  const loadStoredBookings = async () => {
    try {
      setIsLoading(true);
      const storedBookings = await loadBookings();
      const unsyncedBookings = storedBookings.filter(
        (booking) => !booking.synced
      );
      setSyncBookings(unsyncedBookings);
    } catch (error) {
      Alert.alert("Error", "Failed to load unsynced bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnectivity = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const isConnected =
        networkState.isConnected && networkState.isInternetReachable;
      setIsOnline(isConnected);
      return isConnected;
    } catch (error) {
      console.error("Error checking connectivity:", error);
      setIsOnline(false);
      return false;
    }
  };

  const syncBooking = async (booking) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
       const networkState = await Network.getNetworkStateAsync();
      const isConnected =
        networkState.isConnected && networkState.isInternetReachable;
      const updatedBooking = { ...booking, synced: isConnected };
await updateBookingSyncStatus(updatedBooking);
      return true;
    } catch (error) {
      console.error(`Error syncing booking ${booking.id}:`, error);
      return false;
    }
  };

  const handleSync = async () => {
    if (!isOnline) {
      Alert.alert("Error", "No internet connection available");
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);

    try {
      let successCount = 0;
      const total = syncBookings.length;

      for (const [index, booking] of syncBookings.entries()) {
        console.log(booking)
       
        const success = await syncBooking(booking);
        if (success) {
          successCount++;
        }
        setSyncProgress(((index + 1) / total) * 100);
      }

      await loadStoredBookings();

      Alert.alert(
        "Sync Complete",
        `Successfully synced ${successCount} out of ${total} bookings`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to sync some bookings");
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingIdContainer}>
          <Ionicons name="cube-outline" size={20} color="#666" />
          <Text style={styles.bookingId}>ID: {item.id.slice(-4)}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Ionicons name="time-outline" size={16} color="#FFA000" />
          <Text style={styles.pendingText}>Pending</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#2196F3" />
          <Text style={styles.locationText}>{item.origin}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={16} color="#666" />
        </View>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#4CAF50" />
          <Text style={styles.locationText}>{item.destination}</Text>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={16} color="#666" />
        <Text style={styles.dateText}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Network Status</Text>
          <View
            style={[
              styles.statusIndicator,
              isOnline ? styles.statusOnline : styles.statusOffline,
            ]}
          >
            <Feather
              name={isOnline ? "wifi" : "wifi-off"}
              size={16}
              color={isOnline ? "#4CAF50" : "#f44336"}
            />
            <Text
              style={[
                styles.statusValue,
                { color: isOnline ? "#4CAF50" : "#f44336" },
              ]}
            >
              {isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.syncButton,
            (!isOnline || isSyncing || syncBookings.length === 0) &&
              styles.syncButtonDisabled,
          ]}
          onPress={handleSync}
          disabled={!isOnline || isSyncing || syncBookings.length === 0}
        >
          {isSyncing ? (
            <View style={styles.syncingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.syncButtonText}>Syncing...</Text>
            </View>
          ) : (
            <View style={styles.syncingContainer}>
              <Ionicons name="sync" size={20} color="#fff" />
              <Text style={styles.syncButtonText}>Sync Bookings</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : syncBookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="documents-outline" size={48} color="#666" />
          <Text style={styles.emptyText}>No bookings to sync</Text>
        </View>
      ) : (
        <FlatList
          data={syncBookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  statusOnline: {
    backgroundColor: "#E8F5E9",
  },
  statusOffline: {
    backgroundColor: "#FFEBEE",
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  syncButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  syncButtonDisabled: {
    backgroundColor: "#BDBDBD",
  },
  syncingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  syncButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 16,
  },
  bookingIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  pendingText: {
    color: "#FFA000",
    fontSize: 14,
    fontWeight: "500",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  arrowContainer: {
    paddingHorizontal: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
