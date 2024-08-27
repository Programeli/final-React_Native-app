import React from 'react';
import { SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';

import BottomTabNavigator from './BottomTabNavigator';
import DrawerNavigator from './DrawerNavigator';



const App = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768; // Adjust based on your definition of tablet vs mobile

  return (
    
      <SafeAreaView style={styles.container}>
        
        {isTablet ? <DrawerNavigator /> : <BottomTabNavigator />}

      </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default App;