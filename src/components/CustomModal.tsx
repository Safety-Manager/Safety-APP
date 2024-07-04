import React from 'react';
import {StyleSheet, Text, View, Modal, Pressable} from 'react-native';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  onConfirm: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  onConfirm,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{title}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonBorderRight]}
              onPress={() => {
                onConfirm();
                onClose();
              }}>
              <Text style={styles.textStyle}>예</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.textStyle}>아니요</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    paddingTop: 35,
    paddingHorizontal: 35,
    marginBottom: 14,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#000',
    textAlign: 'center',
  },
  modalMessage: {
    marginBottom: 14,
    fontSize: 14,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#000',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#DDDDDD',
  },
  button: {
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 50,
  },
  buttonBorderRight: {
    borderRightWidth: 1,
    borderColor: '#DDDDDD',
  },
  textStyle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#404d60',
  },
});

export default CustomModal;
