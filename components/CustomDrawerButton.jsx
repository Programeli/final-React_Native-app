import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDrawerButton = ({ navigation, state, descriptors }) => {
  return (
    <View style={styles.container}>
      {state.routeNames.map((routeName, index) => {
        const { options } = descriptors[state.routes[index].key];
        const label =
          options.drawerLabel !== undefined
            ? options.drawerLabel
            : options.title !== undefined
            ? options.title
            : routeName;

        const onPress = () => {
          navigation.navigate(routeName);
        };

        // Only show routes that are not hidden
        if (options.drawerItemStyle && options.drawerItemStyle.display === 'none') {
          return null;
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f8f9fa',
  },
  button: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonText: {
    fontSize: 18,
  },
});

export default CustomDrawerButton;
