import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDatabase, createAdmin } from "./src/services/database";
import JsonDataScreen from "./src/screens/JsonDataScreen";
import UserListScreen from "./src/screens/UserListScreen";
import AdminDashboardScreen from "./src/screens/AdminDashboardScreen";
import ReviewScreen from "./src/screens/ReviewScreen";
import CardListScreen from "./src/screens/CardListScreen";
import CardFormScreen from "./src/screens/CardFormScreen";

// ─── Telas originais (Giulia) ─────────────────────────────────────────────────
import SignInScreen from "./src/screens/SignInScreen";
import SecurityQuestionsScreen from "./src/screens/SecurityQuestionsScreen";
import LogInScreen from "./src/screens/LogInScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import BookDetailsScreen from "./src/screens/BookDetailsScreen";
import MyLibraryScreen from "./src/screens/MyLibraryScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";

// ─── Telas novas (Lucas) ──────────────────────────────────────────────────────
import StoreHomeScreen from "./src/screens/StoreHomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import MyOrdersScreen from "./src/screens/MyOrdersScreen";
import OrderDetailScreen from "./src/screens/OrderDetailScreen";
import AddressListScreen from "./src/screens/AddressListScreen";
import AddressFormScreen from "./src/screens/AddressFormScreen";
import OrderConfirmationScreen from "./src/screens/OrderConfirmationScreen";
import AdminProductListScreen from "./src/screens/AdminProductListScreen";
import AdminProductFormScreen from "./src/screens/AdminProductFormScreen";
import AdminCategoryListScreen from "./src/screens/AdminCategoryListScreen";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initDatabase();
    createAdmin();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LogInScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SecurityQuestions" component={SecurityQuestionsScreen}/>
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}/>
          <Stack.Screen name="BookDetailsScreen" component={BookDetailsScreen} />
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
          <Stack.Screen name="MyLibrary" component={MyLibraryScreen} />
          <Stack.Screen name="CartScreen" component={CartScreen} />

          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="CardList" component={CardListScreen} />
          <Stack.Screen name="CardForm" component={CardFormScreen} />
          <Stack.Screen name="StoreHome" component={StoreHomeScreen} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="AddressList" component={AddressListScreen} />
          <Stack.Screen name="AddressForm" component={AddressFormScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen}/>
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen}/>
          <Stack.Screen name="AdminProductList"component={AdminProductListScreen}/>
          <Stack.Screen name="AdminProductForm"component={AdminProductFormScreen}/>
          <Stack.Screen name="JsonData" component={JsonDataScreen} />
          <Stack.Screen name="UserList" component={UserListScreen} />
          <Stack.Screen name="AdminCategoryList" component={AdminCategoryListScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}