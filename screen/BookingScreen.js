import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { addExistingBooking } from "../utils/storage";
import * as Network from "expo-network";

export default function BookingScreen({ navigation }) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const networkState = await Network.getNetworkStateAsync();

      const booking = {
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date().toISOString(),
        synced: networkState.isInternetReachable,
      };

     const bookings =  await addExistingBooking(booking);

      if (networkState.isConnected) {
        Alert.alert("Success", "Booking created and synced!");
      } else {
        Alert.alert(
          "Offline Mode",
          "Booking saved locally and will sync when online"
        );
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save booking");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.origin && formData.destination && formData.weight;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Origin</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter origin"
            value={formData.origin}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, origin: text }))
            }
            editable={!isLoading}
          />

          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            value={formData.destination}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, destination: text }))
            }
            editable={!isLoading}
          />

          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter weight"
            value={formData.weight}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, weight: text }))
            }
            keyboardType="numeric"
            editable={!isLoading}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter description"
            value={formData.description}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, description: text }))
            }
            multiline
            numberOfLines={4}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isFormValid || isLoading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Booking</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
