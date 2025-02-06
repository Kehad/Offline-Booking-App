// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./store";
import HomeScreen from "./screen/HomeScreen";
import BookingScreen from "./screen/BookingScreen";
import SyncScreen from "./screen/SyncScreen";
import BookingDetailsScreen from "./screen/BookindDetailScreen";
import { Button } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
   
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={({ navigation }) => ({
                title: 'Shipment Bookings',
                headerRight: () => (
                  <Button
                    onPress={() => navigation.navigate('Sync')}
                    title="Sync"
                  />
                ),
              })}
            />
            <Stack.Screen name="Book" component={BookingScreen} />
            <Stack.Screen name="Sync" component={SyncScreen} />
            <Stack.Screen 
              name="BookingDetails" 
              component={BookingDetailsScreen}
              options={{ title: 'Booking Details' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>

  );
}
