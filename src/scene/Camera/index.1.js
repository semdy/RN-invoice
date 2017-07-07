import React, {PureComponent} from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

import fetch from '../../service/fetch';
import api from '../../service/api';

import Camera from 'react-native-camera';

class CameraWidget extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
     };
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <TouchableWithoutFeedback onPress={this.takePicture.bind(this)}>
            <Image
            source={require("../../img/camera_1.png")} style={styles.camera}
            />
          </TouchableWithoutFeedback>
        </Camera>
      </View>
    );
  }

  takePicture() {
    this.camera.capture()
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  camera: {
    width: 40,
    height: 34,
    marginBottom: 15
  },
});

export default CameraWidget;