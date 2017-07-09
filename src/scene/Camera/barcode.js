import React, {Component} from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import Toast from 'react-native-root-toast';
import Camera from 'react-native-camera';
import {QRScannerView} from 'ac-qrcode';
import Spinner from '../../component/spinner';
import fetch from '../../service/fetch';
import {session} from '../../service/auth';

import BarcodeScanner from 'react-native-barcodescanner';

export default class BarcodeScannerApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      torchMode: 'off',
      cameraType: 'back',
    };
  }

  barcodeReceived(e) {
    alert('Type: ' + e.type + ", " +'Barcode: ' + e.data);
  }

  render() {
    return (
      <BarcodeScanner
        onBarCodeRead={this.barcodeReceived}
        style={{ flex: 1 }}
        torchMode={this.state.torchMode}
        cameraType={this.state.cameraType}
      />
    );
  }
}
