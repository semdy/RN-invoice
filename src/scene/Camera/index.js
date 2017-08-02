import React, {Component} from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter
} from "react-native";

import Toast from 'react-native-root-toast';
import Spinner from '../../component/spinner';
import Icon from '../../component/icon';
import fetch from '../../service/fetch';
import {session} from '../../service/auth';

export default class DefaultScreen extends Component {
  constructor(props) {
    super(props);

    this.uploadType = "newUpload";
    this.invoiceInfo = {};

    this.state = {
      captureImgURI: null,
      loaded: true
    };
  }

  captureResume(){
    this.setState({
      captureImgURI: null
    });
  }

  captureDone( isGoHome ){
    this.setState({
      loaded: false
    });

    const thenFun = () => {
      if( isGoHome ){
        this.props.navigation.goBack();
        if( this.uploadType === 'uploadSales' ){
          DeviceEventEmitter.emit('salesCaptureDone');
        }
      } else {
        if( this.uploadType === 'newUpload' ){
          this.switchToScanner();
        }
      }
    };

    if( this.uploadType === 'newUpload' ){
      this.uploadInvoice().then(thenFun);
    } else if( this.uploadType === 'uploadSales' ){
      this.uploadSales().then(thenFun);
    }
  }

  uploadInvoice(){
    return fetch.post("upload", {customer: session.get().id, file: this.state.captureImgURI}).then(data => {
      this.setState({
        loaded: true,
        captureImgURI: null
      });

      if( data === true ){
        Toast.show("上传成功");
        this.captureResume();
      } else {
        Toast.show("上传失败 ");
      }

    }, errMsg => {
      this.setState({
        loaded: true
      });
      Toast.show("上传失败, 请重试!");
    });
  }

  uploadSales(){
    let params = {
      number: this.invoiceInfo.number,
      invoice: this.invoiceInfo.id,
      file: this.state.captureImgURI
    };
    return fetch.post("uploadSales", params).then(data => {
      this.setState({
        loaded: true,
        captureImgURI: null
      });

      if( data === true ){
        Toast.show("上传成功");
        this.captureResume();
      } else {
        Toast.show("上传失败 ");
      }

    }, errMsg => {
      this.setState({
        loaded: true
      });
      Toast.show("上传失败, 请重试!");
    });
  }

  switchToScanner(){
    this.props.switchMode("scanner");
  }

  componentWillMount(){
    const {params} = this.props.navigation.state;
    if( params ) {
      this.uploadType = params.uploadType || this.uploadType;
      this.invoiceInfo = params.invoiceInfo || this.invoiceInfo;
    }
  }

  render() {
    let {captureImgURI} = this.state;
    return (
      <View style={[styles.container, this.props.style]}>
        {
          !captureImgURI ?
          <View style={styles.cameraWrap}>
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
            <Icon
              name="circle-close"
              size="large"
              style={styles.iconBack}
              iconStyle={{width: 50, height: 50}}
              onPress={this.handleBack.bind(this)}
            />
            {this._renderMenu()}
          </View>
           :
          <View style={styles.capturePreview}>
            <Image
              source={{uri: "data:image/jpg;base64," + captureImgURI}}
              style={styles.previewImg}
            />
            <View style={styles.resultActions}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.iconButton}
                onPress={this.captureDone.bind(this, true)}
              >
                <Text style={styles.imgButton}>完成</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.iconButton}
                onPress={this.captureDone.bind(this, false)}
              >
                <Text style={styles.imgButton}>下一张</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.redoWrap}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.redoButton}
                onPress={this.captureResume.bind(this)}
              >
                <Text style={styles.redoHint}>模糊不清, 重新拍摄</Text>
                <Icon
                  name="redo"
                  size="large"
                  style={{padding: 12}}
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

  _renderMenu() {
    return (
      <View style={styles.bottom}>
        {
          this.uploadType === "newUpload" ?
            <View style={styles.leftAction}>
              <Text style={styles.actionText}>扫码</Text>
              <Icon size="large"
                    name="qrcode-land"
                    style={styles.actionIcon}
                    onPress={this.switchToScanner.bind(this)}
              />
            </View>
            :
          <Text style={styles.leftCancel}
            onPress={this.handleBack.bind(this)}
          >
            取消
          </Text>
        }
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.outerCircle}
          onPress={this.takePicture.bind(this)}
        >
          <View style={styles.innerCircle}/>
        </TouchableOpacity>
        <Icon name="flash"
              size="large"
              style={styles.torchStyle}
              onPress={this.switchTorchMode.bind(this)}
        />
      </View>
    )
  }

  switchTorchMode(){
    this.props.switchTorchMode();
  }

  takePicture() {
    this.props.takePicture()
      .then((res) => {
        this.setState({
          captureImgURI: res.data
        });
      })
      .catch(err => Toast.show("拍照出错，请重试！"));
  }

  handleBack(){
    this.props.navigation.goBack();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraWrap: {
    flex: 1,
    position: "relative"
  },
  iconBack: {
    position: "absolute",
    left: '50%',
    top: 5,
    marginLeft: -25
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,.6)'
  },
  leftAction: {
    position: 'absolute',
    left: -5,
    top: 5,
    padding: 0,
    flexDirection: 'row'
  },
  actionText: {
    color: '#fff',
    textAlign: 'center',
    marginRight: 8,
    transform: [{
      rotate: '90deg'
    }]
  },
  leftCancel: {
    position: 'absolute',
    left: 5,
    top: 15,
    padding: 8,
    color: '#fff',
    transform: [{
      rotate: '90deg'
    }]
  },
  torchStyle: {
    position: "absolute",
    right: 5,
    top: "50%",
    marginTop: -20
  },
  outerCircle: {
    width: 55,
    height: 55,
    borderWidth: 3,
    borderColor: '#fff',
    padding: 3,
    borderRadius: 80
  },
  innerCircle: {
    flex: 1,
    backgroundColor: "#3c76fe",
    borderRadius: 80
  },
  iconButton: {
    width: 70,
    height: 70,
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 60
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
    left: 20,
    top: 0,
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgButton: {
    fontSize: 18,
    fontWeight: 'bold',
    transform: [
     {
      rotate: "90deg"
     }
    ]
  },
  redoWrap: {
    position: 'absolute',
    right: 0,
    bottom: 10
  },
  redoButton: {
    height: 150,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center'
  },
  redoHint: {
    color: '#fff',
    transform: [
      {
        rotate: '90deg'
      },
      {
        translateX: 40,
      },
      {
        translateY: -30
      }
    ]
  },
  outsideCorner: {
    position: 'absolute',
    left: 20,
    top: 40,
    right: 20,
    bottom: 70,
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
