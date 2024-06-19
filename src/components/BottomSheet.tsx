import React, {useRef} from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
} from 'react-native';
import CheckIcon from '@assets/icons/Check.png';
import CloseIcon from '@assets/icons/Close.png';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  searchCategory: string | null;
  setSearchCategory: (text: string) => void;
};

const BottomSheet = ({
  visible,
  onClose,
  searchCategory,
  setSearchCategory,
}: BottomSheetProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  const data = [
    '전체',
    '산업안전보건법',
    '산업안전보건법 시행령',
    '산업안전보건법 시행규칙',
    '산업안전보건법 기준에 관한 규칙',
    '고시 · 훈령 · 예규',
    'KOSHA GUIDE',
  ];

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (visible) {
    slideIn();
  }

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={slideOut}
      animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0], // Bottom Sheet가 올라오는 애니메이션
                  }),
                },
              ],
            },
          ]}>
          <TouchableWithoutFeedback onPress={slideOut}>
            <Image
              source={CloseIcon}
              resizeMode="contain"
              style={styles.closeIcon}
            />
          </TouchableWithoutFeedback>
          <View style={styles.bottomContainer}>
            {data.map((item, index) => (
              <View style={styles.sheetContainer} key={index}>
                <TouchableOpacity onPress={() => setSearchCategory(item)}>
                  <Text style={styles.sheetTitle}>{item}</Text>
                </TouchableOpacity>
                {searchCategory === item ? (
                  <Image
                    source={CheckIcon}
                    style={styles.checkIcon}
                    resizeMode="contain"
                  />
                ) : null}
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    height: 360,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomContainer: {
    marginTop: 25,
    marginLeft: 20,
    width: '100%',
  },
  sheetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 3 : 22,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#000',
  },
  checkIcon: {
    width: 11,
    height: 8,
    marginRight: 40,
  },
  closeIcon: {
    height: 26,
    bottom: 375,
    position: 'absolute',
    right: 10,
  },
});

export default BottomSheet;
