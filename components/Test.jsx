import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { TabContext } from './TabContext'; // Adjust path

const TestComponent = () => {
  const { activeTab, setActiveTab } = useContext(TabContext);
  
  return (
    <View>
      <Text>Current Tab: {activeTab}</Text>
      <Text onPress={() => setActiveTab('Submit Report')}>Switch to Submit Report</Text>
    </View>
  );
};

export default TestComponent;
