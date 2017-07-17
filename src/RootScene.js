import React, { PureComponent } from 'react';
import { StackNavigator } from 'react-navigation';

import Login from './scene/Login';
import Home from './scene/Home';
import ScanCamera from './scene/ScanCamera';
import MyInfo from './scene/MyInfo';
import InvoiceList from './scene/InvoiceList';
import Detail from './scene/Detail';
import ImageViewer from './scene/Detail/ImageViewer';

class RootScene extends PureComponent {
  constructor() {
    super();
  }

  render() {
    return (
      <Navigator/>
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
    headerMode: 'none'
  }
);

export default RootScene;