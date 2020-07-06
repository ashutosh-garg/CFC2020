import "react-native-gesture-handler";
import * as React from "react";

import { Button } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoadingScreen from "./src/screens/loading";
import MyRequest from "./src/screens/home";
import EditRequest from "./src/screens/request-edit";
import Chat from "./src/screens/chat";
import SearchResources from "./src/screens/resources-search";
import AddResource from "./src/screens/resource-add";
import EditResource from "./src/screens/resource-edit";
import MyResources from "./src/screens/resources-my";
import Request from "./src/screens/request-add";

import { HomeIcon, DonateIcon, SearchIcon } from "./src/images/svg-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ResourcesStackOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <Button onPress={() => navigation.navigate("Chat")} title="Chat " />
    ),
  };
};

const DonationsStackOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <Button
        onPress={() => navigation.navigate("Add Donation")}
        title="Add "
      />
    ),
  };
};

const tabBarOptions = {
  // showLabel: false,
  activeTintColor: "#1062FE",
  inactiveTintColor: "#000",
  style: {
    backgroundColor: "#F1F0EE",
    paddingTop: 5,
  },
};

const TabLayout = () => (
  <Tab.Navigator
    style={{ paddingTop: 50 }}
    initialRouteName="MyRequest"
    tabBarOptions={tabBarOptions}
  >
    <Tab.Screen
      name="My Requests"
      component={RequestStackLayout}
      options={{
        tabBarIcon: ({ color }) => <HomeIcon fill={color} />,
      }}
    />
    <Tab.Screen
      name="Donate"
      component={DonateStackLayout}
      options={{
        tabBarIcon: ({ color }) => <DonateIcon fill={color} />,
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchStackLayout}
      options={{
        tabBarIcon: ({ color }) => <SearchIcon fill={color} />,
      }}
    />
  </Tab.Navigator>
);

const RequestStackLayout = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="My Requests"
      component={MyRequest}
    />
    <Stack.Screen name="Edit Request" component={EditRequest} />
  </Stack.Navigator>
);

const DonateStackLayout = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="My Donations"
      component={MyResources}
      options={DonationsStackOptions}
    />
    <Stack.Screen name="Add Donation" component={AddResource} />
    <Stack.Screen name="Edit Donation" component={EditResource} />
  </Stack.Navigator>
);

const SearchStackLayout = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Search Resources"
      component={SearchResources}
      options={ResourcesStackOptions}
    />
    <Stack.Screen name="Chat" component={Chat} />
    <Stack.Screen name="Add Request" component={Request} />
  </Stack.Navigator>
);

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  } else {
    return (
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    );
  }
};

export default App;
