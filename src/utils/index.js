import {
  Alert
} from 'react-native';

export const confirm = (msg) => {
  return new Promise((resolve, reject) => {
     Alert.alert(
      '确认信息',
      msg,
      [
        {text: '取消', onPress: () => reject("cancel")},
        {text: '确定', onPress: () => resolve("ok"), style: 'destructive'}
      ]
    );
  });
};