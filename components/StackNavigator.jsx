// StackNavigator.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MaintenanceAssignment from './MaintenanceAssignment';
import ReportDetails from './ReportDetails';
import ImageModal from './ImageModal';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MaintenanceAssignment" component={MaintenanceAssignment} />
      <Stack.Screen name="ReportDetails" component={ReportDetails} />
      <Stack.Screen name="ImageModal" component={ImageModal} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
