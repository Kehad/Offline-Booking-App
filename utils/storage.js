// utils/storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageKeys = {
  BOOKINGS: "@shipments_bookings",
};


export const addExistingBooking = async (newBooking) => {
  try {
    const existingBookings = await loadBookings(); // Load existing bookings
    const updatedBookings = [...existingBookings, newBooking]; // Append new booking
    
    await AsyncStorage.setItem(
      StorageKeys.BOOKINGS,
      JSON.stringify(updatedBookings)
    );
    
  } catch (error) {
  
  }
};
export const loadBookings = async () => {
  try {
    const bookingsJson = await AsyncStorage.getItem(StorageKeys.BOOKINGS);
   
    return bookingsJson ? JSON.parse(bookingsJson) : [];
  } catch (error) {
   
    return [];
  }
};
export const deleteBooking = async (bookingId) => {
  try {
    // Load existing bookings
    const existingBookings = await loadBookings();


    // Filter out the booking with the specified ID
    const updatedBookings = existingBookings?.filter(
      (booking) => booking.id !== bookingId
    );

    console.log("Deleting booking:", bookingId);
    console.log("Updated bookings list:", updatedBookings);

    // Save the updated bookings back to storage
    await AsyncStorage.setItem(
      StorageKeys.BOOKINGS,
      JSON.stringify(updatedBookings)
    );

    return true; // Return success
  } catch (error) {
    
    throw error; // Propagate error to caller
  }
};
export const updateBookingSyncStatus = async (bookingId) => {
  try {
    // Load existing bookings
    const existingBookings = await loadBookings();

    // Find and update the specific booking
    const updatedBookings = existingBookings.map((booking) =>
      booking.id === bookingId ? { ...booking, synced: true } : booking
    );
    
    // Save back to storage
    await AsyncStorage.setItem(
      StorageKeys.BOOKINGS,
      JSON.stringify(updatedBookings)
    );

    return true;
  } catch (error) {
   
    throw error;
  }
};