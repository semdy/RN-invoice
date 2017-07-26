import React, {Component} from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";

import Toast from 'react-native-root-toast';
import Header from '../../component/header';
import Icon from '../../component/icon';
import {QRScannerView} from '../../component/qrscanner';
import Spinner from '../../component/spinner';
import fetch from '../../service/fetch';
import {session} from '../../service/auth';

function parseDate(dateStr){
  dateStr = String(dateStr);
  return dateStr.substring(0, 4) + "-" + dateStr.substring(4, 6) + "-" + dateStr.substring(6, dateStr.length);
}

export default class DefaultScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: true,
      cameraEnable: false,
      showCaptureHint: true,
      torchMode: 'off'
    };

    this.timeId = null;
    this.isScaned = false;
  }

  _parseInvoiceInfo(data){
    let codes = data.split(",");
    return {
      customer: session.get().id,
      invoiceCode: codes[2],
      invoiceNumber: codes[3],
      invoicePrice: codes[4],
      issueDate: parseDate(codes[5]),
      correctCode: codes[6]
    };
  }

  uploadBarCode(data, goBack) {

    this.setState({
      loaded: false
    });

    this.resumeScan();

    fetch.post("upload", this._parseInvoiceInfo(data)).then(data => {
      this.setState({
        loaded: true
      });
      if (data === true) {
        Toast.show("上传成功");
        if (goBack) {
          this.handleGoBack()
        } else {
          this.captureResume();
        }
      } else {
        Toast.show("该发票已存在");
      }
    }, errMsg => {
      this.setState({
        loaded: true
      });
      Toast.show("上传失败, 请重试!");
    });
  }

  handleGoBack() {
    //this.props.navigation.navigate("Home");
    this.props.navigation.goBack();
  }

  handleCapture() {
    this.setState({
      showCaptureHint: false
    });
    this.props.switchMode("camera");
  }

  resumeScan(){
    this.isScaned = false;
  }

  switchTorchMode() {
    this.setState({
      torchMode: this.state.torchMode === 'on' ? 'off' : 'on'
    });
  }

  componentDidMount() {
    this.timeId = setTimeout(() => {
      this.setState({
        cameraEnable: true
      });
    }, 6000);
  }

  componentWillUnmount() {
    if( this.timeId ) clearTimeout(this.timeId);
  }

  render() {
    let {loaded, cameraEnable, showCaptureHint} = this.state;
    return (
      <View style={styles.container}>
        <Header
          left={(
            <Icon name="arrow-left-white" onPress={this.handleGoBack.bind(this)}/>
          )}
          right={(
            <Icon name="flash" onPress={this.switchTorchMode.bind(this)}/>
          )}
        >
          二维码扫描
        </Header>
        <View style={styles.cameraWrap}>
          <QRScannerView
            onBarCodeRead={this.barcodeReceived.bind(this)}
            renderTopBarView={() => function () {}}
            renderBottomMenuView={() => function () {}}
            hintText="请将发票左上角的二维码放入框内即可自动扫描"
            hintTextPosition={80}
            style={styles.preview}
            torchMode={this.state.torchMode}
            barCodeTypes={['qr']}
            defaultTouchToFocus={true}
          />
        </View>
        {
          this._renderMenu()
        }
        {
          cameraEnable && showCaptureHint &&
          <View style={styles.captureHint}>
            <Text style={styles.captureHintText}>二维码无法识别请拍摄发票</Text>
            <Icon size="small" name="angle-down" style={styles.captureHintIcon}/>
          </View>
        }
        {
          !loaded &&
          <Spinner/>
        }
      </View>
    )
  }

  _renderMenu() {
    let {cameraEnable} = this.state;
    return (
      <View style={styles.bottom}>
        <View style={styles.actionItem}>
          <Icon size="large" name="qrcode" style={styles.actionIcon}/>
          <Text style={styles.actionText}>扫码</Text>
        </View>
        <TouchableOpacity
          style={[styles.actionItem]}
          onPress={this.handleCapture.bind(this)}
        >
          <View style={{opacity: cameraEnable ? 1 : 0.3}}>
            <Icon size="large" name="camera-white" style={styles.actionIcon}/>
            <Text style={styles.actionText}>拍照</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  barcodeReceived(e) {
    if( this.isScaned ) return;
    if (this.timeId) clearTimeout(this.timeId);

    this.isScaned = true;

    let isExpectQrcode = true;
    let ret = e.data.split(",");
    if (ret.length < 3) {
      isExpectQrcode = false;
    }
    else if (ret[2].length < 10) {
      isExpectQrcode = false;
    }
    else if( ret[3].length < 8 ){
      isExpectQrcode = false;
    }

    if (isExpectQrcode) {
      Alert.alert(
        '二维码识别成功',
        e.data,
        [
          {text: '完成', onPress: () => this.uploadBarCode(e.data, true)},
          {text: '下一张', onPress: () => this.uploadBarCode(e.data, false), style: 'destructive'}
        ]
      );
    } else {
      Alert.alert(
        '二维码识别失败',
        "请扫描发票左上角二维码",
        [
          {text: '取消', onPress: () => this.handleGoBack()},
          {text: '重新扫描', onPress: () => this.resumeScan(), style: 'destructive'}
        ]
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraWrap: {
    flex: 1
  },
  bottom: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#48acfa'
  },
  actionItem: {
    padding: 5,
    justifyContent: 'center'
  },
  actionText: {
    color: "#fff",
    textAlign: 'center'
  },
  actionIcon: {
    padding: 3
  },
  captureHint: {
    position: 'absolute',
    bottom: 70,
    right: 37,
    width: 100,
    justifyContent: 'center'
  },
  captureHintText: {
    color: "#fff",
    textAlign: 'center'
  },
  captureHintIcon: {
    width: 30,
    padding: 3,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});
