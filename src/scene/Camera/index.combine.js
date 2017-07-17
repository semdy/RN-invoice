import React, {Component} from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import Toast from 'react-native-root-toast';
import Camera from 'react-native-camera';
import {QRScannerView} from '../../component/qrscanner';
import Spinner from '../../component/spinner';
import fetch from '../../service/fetch';
import {session} from '../../service/auth';

export default class DefaultScreen extends Component {
  constructor(props) {
    super(props);

    this.scanview = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.memory,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
        captureQuality: Camera.constants.CaptureQuality.medium
      },
      captureImgURI: null,
      loaded: true
    };
  }

  captureResume(){
    this.setState({
      captureImgURI: null
    });
  }

  captureDone(){
    this.setState({
      loaded: false
    });
    fetch.post("upload", {customer: session.get().id, file: this.state.captureImgURI}).then(data => {
      if( data === true ){
        Toast.show("上传成功");
        this.captureResume();
      } else {
        Toast.show("上传失败 " + (data.message||""));
      }
      this.setState({
        loaded: true
      });
    }, errMsg => {
      Toast.show("上传失败, 请重试!");
      this.setState({
        loaded: true
      });
    });
  }

  render() {
    let {captureImgURI} = this.state;
    return (
      <View style={styles.container}>
        {
          !captureImgURI ?
        <View style={styles.cameraWrap}>
            <QRScannerView
              ref={(scanview) => {
                this.scanview = scanview;
              }}
              rectStyle={{right: 30, top: 60}}
              rectHeight={80}
              rectWidth={80}
              cornerBorderWidth={2}
              scanBarHeight={1}
              scanBarVertical={true}
              onBarCodeRead={this.barcodeReceived.bind(this)}
              renderTopBarView={() => this._renderTitleBar()}
              renderBottomMenuView={() => this._renderMenu()}

              style={styles.preview}
              aspect={this.state.camera.aspect}
              captureTarget={this.state.camera.captureTarget}
              type={this.state.camera.type}
              orientation={this.state.camera.orientation}
              flashMode={this.state.camera.flashMode}
              captureQuality={this.state.camera.captureQuality}
              barCodeTypes={['qr']}
              defaultTouchToFocus={true}
              mirrorImage={false}
            />
            <View style={styles.outsideCorner}>
              <View style={[styles.corner, {
                left: 0,
                top:0,
                borderLeftWidth: 1,
                borderTopWidth: 1,
              }]}/>
              <View style={[styles.corner, {
                right: 0,
                top: 0,
                borderRightWidth: 1,
                borderTopWidth: 1,
              }]}/>
              <View style={[styles.corner, {
                left: 0,
                bottom: 0,
                borderLeftWidth: 1,
                borderBottomWidth: 1,
              }]}/>
              <View style={[styles.corner, {
                right: 0,
                bottom: 0,
                borderRightWidth: 1,
                borderBottomWidth: 1,
              }]}/>
              <View style={styles.sealCircle}/>
            </View>
        </View>
           :
        <View style={styles.capturePreview}>
          <Image
            source={{uri: "data:image/jpg;base64," + captureImgURI}}
            style={styles.previewImg}
          />
          <View style={styles.resultActions}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.iconButton}
              onPress={this.captureResume.bind(this)}
            >
              <Image
                source={require('../../img/error.png')}
                style={styles.imgButton}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.iconButton, {marginLeft: 80}]}
              onPress={this.captureDone.bind(this)}
            >
              <Image
                source={require('../../img/ok.png')}
                style={styles.imgButton}
              />
            </TouchableOpacity>
          </View>
        </View>
        }
        {
          !this.state.loaded &&
          <Spinner/>
        }
      </View>
    )
  }

  _renderTitleBar(){

  }

  _renderMenu() {
    return (
      <View style={styles.bottom}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.iconButton}
          onPress={this.takePicture.bind(this)}
        >
          <Image
            source={require('../../img/camera/ic_photo_camera_36pt.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }

  takePicture() {
    if (this.scanview) {
      this.scanview.camera.capture()
        .then((res) => {
          this.setState({
            captureImgURI: res.data
          });
        })
        .catch(err => Toast.show("拍照出错，请重试！"));
    }
  }

  barcodeReceived(e) {
    alert('Type: ' + e.type + '\nData: ' + e.data);
    this.takePicture();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraWrap: {
    flex: 1,
    position: 'relative'
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  iconButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 40
  },
  capturePreview: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  previewImg: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  resultActions: {
    position: 'absolute',
    left:0,
    right: 0,
    bottom: 30,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imgButton: {
    width: 30,
    height: 30
  },
  outsideCorner: {
    position: 'absolute',
    left: 20,
    top: 40,
    right: 20,
    bottom: 60,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  corner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderColor: "#1DA1F2"
  },
  sealCircle: {
    width: 90,
    height: 90,
    borderRadius: 200,
    borderWidth:  1,
    borderColor: "#cc0000",
    transform: [{
      scaleX: 0.7
    }]
  }
});
