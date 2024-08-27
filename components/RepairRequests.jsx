import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const RepairRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const db = getFirestore();

  // Fetch repair requests from Firestore with real-time updates
  const fetchRequests = () => {
    const unsubscribe = onSnapshot(collection(db, 'reports'), (querySnapshot) => {
      const fetchedRequests = [];
      querySnapshot.forEach((doc) => {
        fetchedRequests.push({ ...doc.data(), id: doc.id });
      });
      // Sort requests by date from oldest to newest
      fetchedRequests.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
      setRequests(fetchedRequests);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching requests: ', error);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  };

  useEffect(() => {
    const unsubscribe = fetchRequests();

    // Clean up subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Render each request as a card
  const renderRequestCard = ({ item }) => {
    // Determine button color based on status
    const getButtonColor = () => {
      switch (item.status) {
        case 'pending':
          return '#007BFF'; // Blue
        case 'in progress':
          return '#FFC107'; // Yellow
        case 'done':
          return '#28A745'; // Green
        default:
          return '#007BFF'; // Default to blue
      }
    };

    // Determine button disabled state based on status
    const isButtonDisabled = item.status === 'done';

    return (
      <View style={styles.card}>
        <Text style={styles.tenantName}>{item.name || ''}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {/* If image exists */}
        {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />  
        ) : null}

        {/* If location exists */}
        {item.location ? (
          <Text style={styles.location}>
            Location: {item.location.latitude}, {item.location.longitude}
          </Text>
        ) : null}

        {/* Show More Details Button */}
        <Pressable
          style={styles.detailsButton}
          onPress={() => navigation.navigate('ReportDetails', { reportId: item.id })}
        >
          <Text style={styles.buttonText}>Show More Details</Text>
        </Pressable>

        {/* Assign Maintenance Button */}
        <Pressable
          style={[styles.assignButton, { backgroundColor: getButtonColor() }, isButtonDisabled && styles.buttonDisabled]}
          onPress={() => !isButtonDisabled && navigation.navigate('MaintenanceAssignment', { requestId: item.id })}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Assign Maintenance Person</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Repair Requests</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderRequestCard}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  tenantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  location: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#555',
  },
  assignButton: {
    marginTop: 15,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  detailsButton: {
    marginTop: 15,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default RepairRequests;
