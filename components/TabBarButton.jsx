import React from 'react';
import { Pressable } from 'react-native';

const TabBarButton = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={{ flex: 1 }}
    >
      {props.children}
    </Pressable>
  );
};

export default TabBarButton;
