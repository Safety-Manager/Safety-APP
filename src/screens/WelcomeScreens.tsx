import {RouteNames} from '@components/Route';
import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
const surveyData = {
  question: 'How satisfied are you with our service?',
  options: [
    'Very satisfied',
    'Satisfied',
    'Neutral',
    'Dissatisfied',
    'Very dissatisfied',
  ],
};

const WelcomeScreens = ({navigation}: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionPress = (option: any) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    // Here you can handle the submission logic, e.g., sending the response to a server
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Open Survey" onPress={() => setModalVisible(true)} />

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.question}>{surveyData.question}</Text>
            {surveyData.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === option && styles.selectedOption,
                ]}
                onPress={() => handleOptionPress(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.buttonContainer}>
              <Button
                title="Submit"
                onPress={navigation.navigate(RouteNames.HOMETABS)}
              />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#cceeff',
  },
  optionText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default WelcomeScreens;
