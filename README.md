# React Native Shipping App

A mobile application for managing shipping bookings with offline support and synchronization capabilities.

## Features

### Core Features
- Create new shipping bookings with origin, destination, weight, and description
- View detailed booking information
- Sync bookings when online
- Network status monitoring

### Bonus Features
- Local storage persistence using AsyncStorage
- Delete bookings functionality
- Booking sync status tracking
- Offline-first architecture
- Loading states and error handling
- Modern UI

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kehad/offlinebooking.git
cd shipping-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```



## Running the App

1. Start the development server:
```bash
npx expo start
```

2. Run on iOS simulator:
```bash
npx expo run:ios
```

3. Run on Android emulator:
```bash
npx expo run:android
```

## Usage

### Creating a Booking
1. Press the "+" button to create a new booking
2. Fill in the required fields:
   - Origin location
   - Destination
   - Weight
   - Description (optional)
3. Press "Submit"

### Viewing Booking Details
- Tap on any booking in the list to view its details
- View sync status, route information, and booking details
- Delete bookings using the trash icon

### Syncing Bookings
1. Navigate to the Sync screen
2. View all unsynced bookings
3. Press "Sync Bookings" when online to sync pending bookings
4. Monitor sync progress and status

## Local Storage Implementation

The app uses AsyncStorage for local data persistence:

