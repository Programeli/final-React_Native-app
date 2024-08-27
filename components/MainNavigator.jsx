import React from 'react';
import { useWindowDimensions } from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerNavigator from './DrawerNavigator';

const MainNavigator = () => {
  const { width } = useWindowDimensions();

  // Consider tablet if width > 768px (adjust as needed)
  const isTablet = width > 768;

  return isTablet ? <DrawerNavigator /> : <BottomTabNavigator />;
};

export default MainNavigator;
