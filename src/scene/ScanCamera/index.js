import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Camera from 'react-native-camera';
import Scanner from '../../scene/Scanner';
import CameraView from '../../scene/Camera';

export default class ScanCamera extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'scanner',
      barCode: null,
      torchMode: 'off',
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.memory,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.portrait,
        torchMode: Camera.constants.TorchMode.off,
        captureQuality: Camera.constants.CaptureQuality.medium
      },
    };
  }

  componentWillMount(){
    const {params} = this.props.navigation.state;
    if( params && params.mode ) {
      this.setState({
        mode: params.mode
      });
    }
  }

  switchMode(mode) {
    this.setState({
      mode
    });
  }

  switchTorchMode() {
    this.setState({
      torchMode: this.state.torchMode === 'on' ? 'off' : 'on',
      barCode: null
    });
  }

  barcodeReceived(e){
    if( this.state.mode === 'scanner' ) {
      this.setState({
        barCode: e
      });
    }
  }

  takePicture() {
    return this.refs.camera.capture();
  }

  render(){
    let {mode, barCode} = this.state;
    let {navigation} = this.props;
    let switchMode = this.switchMode.bind(this);
    let switchTorchMode = this.switchTorchMode.bind(this);
    return (
      <View style={styles.container}>
        <Camera
          ref="camera"
          style={{flex: 1}}
          onBarCodeRead={this.barcodeReceived.bind(this)}
          torchMode={this.state.torchMode}
          barCodeTypes={['qr']}
          defaultTouchToFocus={true}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          type={this.state.camera.type}
          orientation={this.state.camera.orientation}
          captureQuality={this.state.camera.captureQuality}
          mirrorImage={false}
        />
        {
          mode === 'scanner' ?
          <Scanner
            navigation={navigation}
            switchMode={switchMode}
            switchTorchMode={switchTorchMode}
            barCode={barCode}
            style={styles.overlay}
          />
          :
          <CameraView
            navigation={navigation}
            switchMode={switchMode}
            switchTorchMode={switchTorchMode}
            takePicture={this.takePicture.bind(this)}
            style={styles.overlay}
          />
        }
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  }
});