
import React, {PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import QRCode from '@remobile/react-native-qrcode-local-image';
import Button from '../../component/button';

export default class QRCodeDecode extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }
  onPress() {
    QRCode.decode('http://edm.mcake.com/shuxy/2017/20170712114306.jpg', (error, result)=>{
      this.setState({text: JSON.stringify({error, result})});
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.onPress.bind(this)}>测试</Button>
        <Text>
          {this.state.text}
        </Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    paddingVertical: 150
  }
});