import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Network from "expo-network";

import {
  deleteBooking,
  updateBookingSyncStatus,
} from "../utils/storage";

const { width } = Dimensions.get("window");

export default function BookingDetailsScreen({ route, navigation }) {
  const { booking } = route.params;
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSync = async (bookingId) => {
    try {
      setIsSyncing(true);
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        Alert.alert("Error", "No internet connection available");
        return;
      }
      const syncStatus = await updateBookingSyncStatus(bookingId);
      Alert.alert("Success", "Booking synced successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to sync booking");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeletes = async (booking) => {
    Alert.alert(
      "Delete Booking",
      "Are you sure you want to delete this booking?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setIsDeleting(true);
              const hand = await deleteBooking(booking);
              if (hand) {
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete booking");
            } finally {
              setIsDeleting(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Booking Details</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                booking.synced ? styles.syncedBadge : styles.pendingBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {booking.synced ? "Synced" : "Pending"}
              </Text>
            </View>

            {!booking.synced && (
              <TouchableOpacity
                style={[styles.iconButton, styles.syncButton]}
                onPress={() => handleSync(booking.id)}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <ActivityIndicator size="small" color="#2196F3" />
                ) : (
                  <Ionicons name="sync" size={20} color="#2196F3" />
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.iconButton, styles.deleteButton]}
              onPress={() => handleDeletes(booking.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#f44336" />
              ) : (
                <Ionicons name="trash" size={20} color="#f44336" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipment Route</Text>
          <View style={styles.routeContainer}>
            <View style={styles.locationCard}>
              <Ionicons name="location" size={24} color="#2196F3" />
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Origin</Text>
                <Text style={styles.locationText}>{booking.origin}</Text>
              </View>
            </View>

            <View style={styles.routeConnector}>
              <Ionicons name="arrow-down" size={24} color="#666" />
            </View>

            <View style={styles.locationCard}>
              <Ionicons name="location" size={24} color="#4CAF50" />
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text style={styles.locationText}>{booking.destination}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipment Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Booking ID</Text>
              <Text style={styles.detailText}>{booking.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight</Text>
              <Text style={styles.detailText}>{booking.weight} kg</Text>
            </View>
            <View style={[styles.detailRow, styles.lastDetailRow]}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailText}>
                {new Date(booking.timestamp).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>
              {booking.description || "No description provided"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  syncedBadge: {
    backgroundColor: "#E8F5E9",
  },
  pendingBadge: {
    backgroundColor: "#FFF3E0",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  syncButton: {
    backgroundColor: "#E3F2FD",
  },
  deleteButton: {
    backgroundColor: "#FFEBEE",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  routeContainer: {
    gap: 12,
    alignItems: "center",
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  routeConnector: {
    height: 40,
    justifyContent: "center",
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  detailsCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
  },
  detailText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  descriptionCard: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1a1a1a",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#f44336",
    fontWeight: "500",
  },
});
