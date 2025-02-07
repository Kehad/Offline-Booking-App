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
  } catch (error) {}
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





export const updateBookingSyncStatus = async (bookings) => {
  // if (!bookingId) {
  //   throw new Error("bookingId is required");
  // }

  try {
    // Load existing bookings
    const existingBookings = await loadBookings();
    console.log('bookings')
    console.log(bookings);

    if (!Array.isArray(existingBookings)) {
      throw new Error("Invalid bookings data structure");
    }

    // Find the booking to update
    const bookingToUpdate = existingBookings.find(
      (booking) => booking.id === bookings.id
    );
    if (!bookingToUpdate) {
      throw new Error(`Booking with id ${bookings.id} not found`);
    }

    // Only update if not already synced to prevent unnecessary writes
    // if (bookingToUpdate.synced) {
    //   return true;
    // }

    // Find and update the specific booking
    const updatedBookings = existingBookings.map((booking) =>
      booking.id === bookings.id
        ? {
            ...bookings,
            timestamp: new Date().toISOString(),
          }
        : booking
    );
    console.log(updatedBookings)

    // Save back to storage
    await AsyncStorage.setItem(
      StorageKeys.BOOKINGS,
      JSON.stringify(updatedBookings)
    );

    return true;
  } catch (error) {
    // Add context to the error
    throw new Error(`Failed to update booking sync status: ${error.message}`);
  }
};

