import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, doc, onSnapshot, updateDoc, collection, query, where } from 'firebase/firestore';

const MaintenanceAssignment = ({ route, navigation }) => {
  const { requestId } = route.params; // Get the report ID from route parameters
  const [maintenancePersons, setMaintenancePersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [report, setReport] = useState(null);
  const db = getFirestore();

  // Fetch maintenance persons from Firestore
  const fetchMaintenancePersons = () => {
    const q = query(collection(db, 'maintenancePersons'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const persons = [];
      querySnapshot.forEach((doc) => {
        const personData = doc.data();
        persons.push({ id: doc.id, name: personData.name });
      });
      setMaintenancePersons(persons);
    }, (error) => {
      console.error('Error fetching maintenance persons: ', error);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  };

  // Fetch report details
  const fetchReport = () => {
    const reportRef = doc(db, 'reports', requestId);
    const unsubscribe = onSnapshot(reportRef, (doc) => {
      if (doc.exists()) {
        const reportData = doc.data();
        setReport(reportData);
        setSelectedPerson(reportData.assignedTo || ''); // Set the selected person if assigned
      } else {
        console.log('No such document!');
      }
    }, (error) => {
      console.error('Error fetching report: ', error);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  };

  // Update the report assignment and status
  const assignMaintenancePerson = async () => {
    try {
      const reportRef = doc(db, 'reports', requestId);
      await updateDoc(reportRef, { 
        assignedTo: selectedPerson,
        status: 'in progress' // Update status to "in progress"
      });
      Alert.alert('Success', 'Maintenance person assigned and status updated to "in progress"');
      navigation.goBack();
    } catch (error) {
      console.error('Error assigning maintenance person: ', error);
      Alert.alert('Error', 'Failed to assign maintenance person.');
    }

    setSelectedPerson('');
  };

  useEffect(() => {
    // Start listening to Firestore
    const unsubscribePersons = fetchMaintenancePersons();
    const unsubscribeReport = fetchReport();

    // Clean up subscriptions on unmount
    return () => {
      if (unsubscribePersons) unsubscribePersons();
      if (unsubscribeReport) unsubscribeReport();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assign Maintenance Person</Text>
      <Text style={styles.label}>Select Maintenance Person:</Text>
      <Picker
        selectedValue={selectedPerson}
        onValueChange={(itemValue) => setSelectedPerson(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a person" value="" />
        {maintenancePersons.map((person) => (
          <Picker.Item key={person.id} label={person.name} value={person.id} />
        ))}
      </Picker>
      <Pressable
        style={styles.button}
        onPress={assignMaintenancePerson}
        disabled={!selectedPerson}
      >
        <Text style={styles.buttonText}>Assign</Text>
      </Pressable>
      {report?.assignedTo && (
        <Text style={styles.currentAssignment}>
          Currently assigned to: {maintenancePersons.find(person => person.id === report.assignedTo)?.name || 'None'}
        </Text>
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
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  currentAssignment: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default MaintenanceAssignment;
