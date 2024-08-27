import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome } from 'react-native-vector-icons'; // Import icons
import Home from './Home';
import SubmitReport from './SubmitReport';
import RepairRequests from './RepairRequests';
import MaintenanceAssignment from './MaintenanceAssignment';
import ReportDetails from './ReportDetails';
import ImageModal from './ImageModal';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Submit Report"
        component={SubmitReport}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="edit" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Repair Requests"
        component={RepairRequests}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="build" size={size} color={color} />
          ),
        }}
      />

      {/* Hide from bottom tab but navigable */}
      <Tab.Screen
        name="MaintenanceAssignment"
        component={MaintenanceAssignment}
        options={{ tabBarButton: () => null }} // Hides this tab
      />
      <Tab.Screen
        name="ReportDetails"
        component={ReportDetails}
        options={{ tabBarButton: () => null }} // Hides this tab
      />
      <Tab.Screen
        name="ImageModal"
        component={ImageModal}
        options={{ tabBarButton: () => null }} // Hides this tab
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
