import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Import the package
import { db, storage } from '../firebaseConfig'; // Adjust the path as necessary
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, Timestamp } from 'firebase/firestore'; // Firebase Firestore
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import * as Location from 'expo-location'; // If using Expo for geolocation

const SubmitReport = () => {
  const [name, setName] = useState('');
  const [problemType, setProblemType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Select image from the library
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          setImageUri(result.assets[0].uri);
        } else {
          alert('No image selected.');
        }
      } else {
        alert('Image picking was canceled.');
      }
    } catch (error) {
      console.error('Error picking image: ', error);
      alert('Failed to pick image.');
    }
  };

  // Optionally fetch user's current location
  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  // Submit report function
  const submitReport = async () => {
    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
      }

      await addDoc(collection(db, 'reports'), {
        name,
        problemType,
        description,
        location,
        imageUrl,
        status: 'pending',
        assignedTo: "none",
        createdAt: Timestamp.fromDate(new Date()),
      });

      alert('Report submitted successfully');
    } catch (error) {
      console.error('Error submitting report: ', error);
      alert('Failed to submit report.');
    }

    setIsSubmitting(false);
    setProblemType('');
    setName('');
    setDescription('');
    setImageUri(null);
    setLocation(null);
  };

  // Upload image function
  const uploadImage = async (imageUri) => {
    try {
      if (!imageUri) {
        throw new Error('No image URI provided');
      }

      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error('Failed to fetch image data');
      }

      const blob = await response.blob();
      const storageRef = ref(storage, `reports/${new Date().toISOString()}`);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      console.log('Image uploaded successfully:', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
      return '';
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>הגשת בקשה</Text>
      <TextInput
        style={styles.inputSmall}
        placeholder="שם השוכר"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.inputSmall}
        placeholder="סוג התקלה"
        value={problemType}
        onChangeText={setProblemType}
      />
      <TextInput
        style={styles.input}
        placeholder="תיאור הבעיה.."
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Pressable style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>בחירת תמונה</Text>
      </Pressable>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Pressable style={styles.button} onPress={fetchLocation}>
        <Text style={styles.buttonText}>הוספת מיקום</Text>
      </Pressable>
      <Pressable
        style={[
          styles.button,
          isSubmitting && styles.buttonDisabled,
          !description.trim() && styles.buttonDisabled,
        ]}
        onPress={submitReport}
        disabled={isSubmitting || !description.trim()}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'שולח...' : 'הגשת בקשה'}
        </Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    height: 200,
    textAlignVertical: 'top',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    width: '70%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    height: 40,
  },
});

export default SubmitReport;
