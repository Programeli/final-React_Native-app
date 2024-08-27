import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import ImageModal from './ImageModal'; // Adjust the path as necessary
import { useNavigation } from '@react-navigation/native';

const ReportDetails = ({ route, navigation }) => {
  const { reportId } = route.params;
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reportRef = doc(db, 'reports', reportId);
        const reportDoc = await getDoc(reportRef);
        if (reportDoc.exists()) {
          setReport(reportDoc.data());
          setStatus(reportDoc.data().status);
          setImageUri(reportDoc.data().imageUrl);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleStatusChange = async (newStatus) => {
    Alert.alert(
      'Confirm Status Change',
      `האם ברצונך לשנות את סטטוס הבקשה ל "${newStatus}"?`,
      [
        {
          text: 'ביטול',
          style: 'cancel',
        },
        {
          text: 'אישור',
          onPress: async () => {
            try {
              const reportRef = doc(db, 'reports', reportId);
              await updateDoc(reportRef, { status: newStatus });
              setStatus(newStatus);
              Alert.alert('Success', `Report status updated to "${newStatus}".`);
            } catch (error) {
              console.error('Error updating status:', error);
              Alert.alert('Error', 'Failed to update report status.');
            }
          },
        },
      ]
    );
  };

  const openImageModal = () => {
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
  };

  if (!report) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  const navigation2 = useNavigation();

  return (
    <ScrollView style={styles.container}>
        
      <Text style={styles.header}>פרטי בקשה</Text>
      <Text style={styles.label}>מזהה תקלה: {report.id}</Text>
      <Text style={styles.label}>איש תחזוקה: {report.assignedTo || 'Unassigned'}</Text>
      <Text style={styles.label}>סטטוס: {status}</Text>

      <View style={styles.divider}>
        <Text style={styles.label2}>שם שוכר: {report.name}</Text>
        <Text style={styles.label2}>תאריך: {report.createdAt.toDate().toLocaleString()}</Text>
        {report.location && (
          <Text style={styles.label2}>
            מיקום: {report.location.latitude}, {report.location.longitude}
          </Text>
        )}
        <Text style={styles.label2}>סוג תקלה: {report.problemType}</Text>
      </View>

      <Text style={styles.header}>{report.title}</Text>
      <Text style={styles.description}>{report.description}</Text>
      
      {imageUri && (
        <Pressable onPress={openImageModal}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </Pressable>
      )}
      <View style={styles.buttonContainer}>
        {status !== 'done' && (
          <Pressable
            style={[styles.button, styles.doneButton]}
            onPress={() => handleStatusChange('done')}
          >
            <Text style={styles.buttonText}>סמן כטופל</Text>
          </Pressable>
        )}
      </View>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>חזור</Text>
      </Pressable>

      {/* Include the ImageModal component */}
      <ImageModal
        visible={isModalVisible}
        imageUri={imageUri}
        onClose={closeImageModal}
      />
    </ScrollView>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    width: '40%',
  },
  doneButton: {
    backgroundColor: '#28a745',
  },
  backButton: {
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
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 10,
  },
  label2: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportDetails;
