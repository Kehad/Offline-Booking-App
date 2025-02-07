import React, { useState } from "react";

import { Alert } from "react-native";
import { EditBookingForm } from "./EditBookingForm";
import { updateBookingSyncStatus } from "../utils/storage";

export default function EditBookingScreen({ route, navigation }) {
  const { booking, onSave } = route.params;
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async (updatedBooking) => {
    try {
        setIsUpdating(true);
        
      await updateBookingSyncStatus(updatedBooking);
      onSave(updatedBooking);
      navigation.navigate("Home");

      Alert.alert("Success", "Booking updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update booking");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <EditBookingForm
      booking={booking}
      onSave={handleSave}
      onCancel={() => navigation.goBack()}
      isLoading={isUpdating}
    />
  );
}
