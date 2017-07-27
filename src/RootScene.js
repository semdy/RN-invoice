import React, { PureComponent } from 'react';
import {
  View,
  StatusBar
} from "react-native";
import { StackNavigator } from 'react-navigation';

import Login from './scene/Login';
import Home from './scene/Home';
import ScanCamera from './scene/ScanCamera';
import MyInfo from './scene/MyInfo';
import InvoiceList from './scene/InvoiceList';
import Detail from './scene/Detail';
import ImageViewer from './scene/Detail/ImageViewer';

import Orientation from 'react-native-orientation';

class RootScene extends PureComponent {
  constructor() {
    super();
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor="#0090ff"
          barStyle="light-content"
        />
        <Navigator/>
      </View>
    );
  }
}

const Navigator = StackNavigator(
  {
    Home: {
      screen: Home
    },
    InvoiceList: {
      screen: InvoiceList
    },
    Login: {
      screen: Login
    },
    MyInfo: {
      screen: MyInfo
    },
    Detail: {
      screen: Detail
    },
    ImageViewer: {
      screen: ImageViewer
    },
    ScanCamera: {
      screen: ScanCamera
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home'
  }
);

export default RootScene;