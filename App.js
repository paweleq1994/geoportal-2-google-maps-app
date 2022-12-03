import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import SinglePlot from "./screens/SinglePlot";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "./screens/Home";
import ManyPlots from "./screens/ManyPlots";
import ManyPlotsResults from "./screens/ManyPlotsResults";

const Stack = createNativeStackNavigator();

export default function App() {
   return (
       <NavigationContainer>
           <Stack.Navigator initialRouteName="Home">
               <Stack.Screen
                   name="Home"
                   component={Home}
                   options={{
                       title: 'Geoportal to Google Maps',
                   }}
               />
               <Stack.Screen
                   name="SinglePlot"
                   component={SinglePlot}
                   options={{
                       title: 'Jedna działka',
                   }}
               />
               <Stack.Screen
                   name="ManyPlots"
                   component={ManyPlots}
                   options={{
                       title: 'Wiele działek',
                   }}
               />
               <Stack.Screen
                   name="ManyPlotsResult"
                   component={ManyPlotsResults}
                   options={{
                       title: 'Wiele działek - wynik',
                   }}
               />
           </Stack.Navigator>
       </NavigationContainer>
   )
}

