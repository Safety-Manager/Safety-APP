import {boardApi} from '@api/boardApi';
import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ReportModal = ({
  visible,
  onClose,
  boardIdx,
}: {
  visible: boolean;
  onClose: any;
  boardIdx: number;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<{
    categoryValue: string;
    categoryDesc: string;
  } | null>(null);
  const [content, setContent] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const {mutate} = boardApi.PostReport();

  const categories = [
    {categoryValue: 'PROFANITY', categoryDesc: '욕설'},
    {categoryValue: 'POST_WALLPAPERING', categoryDesc: '내용 도배'},
    {categoryValue: 'ADVERTISEMENT', categoryDesc: '광고'},
  ];

  const handleReport = () => {
    if (selectedCategory && content.trim()) {
      mutate(
        {
          boardIdx,
          reportCategory: selectedCategory.categoryValue,
          content,
        },
        {
          onSuccess: res => {
            onClose(); // Close the modal after submission
            console.log(res);
          },
          onError: error => {
            // Handle the error response here
            console.log(error);
          },
        },
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>신고하기</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setDropdownVisible(!dropdownVisible)}>
            <Text>
              {selectedCategory
                ? selectedCategory.categoryDesc
                : '신고 종류 선택'}
            </Text>
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdown}>
              {categories.map(item => (
                <TouchableOpacity
                  key={item.categoryValue}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCategory(item);
                    setDropdownVisible(false);
                  }}>
                  <Text>{item.categoryDesc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="신고내용"
            value={content}
            onChangeText={setContent}
            multiline={true}
            numberOfLines={4}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              !(selectedCategory && content.trim()) && styles.disabledButton, // 카테고리와 내용이 없으면 비활성화 스타일 적용
            ]}
            onPress={handleReport}
            disabled={!(selectedCategory && content.trim())} // 카테고리와 내용이 없으면 버튼 비활성화
          >
            <Text style={styles.submitButtonText}>제출</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#404d60', // 제출 버튼의 배경색
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#b0b0b0', // 비활성화된 버튼의 배경색
  },
  submitButtonText: {
    color: '#FFFFFF', // 제출 버튼의 텍스트 색상
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f44336', // 취소 버튼의 배경색 (연한 빨간색)
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#FFFFFF', // 취소 버튼의 텍스트 색상
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportModal;
