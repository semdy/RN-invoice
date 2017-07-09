import React, { PureComponent } from 'react';
import { StackNavigator } from 'react-navigation';

import Login from './scene/Login'
import Home from './scene/Home'
import Camera from './scene/Camera'
import Camera2 from './scene/Camera/barcode'
import MyInfo from './scene/MyInfo'
import InvoiceList from './scene/InvoiceList'
import Detail from './scene/Detail'

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
    Login: {
      screen: Login
    },
    Home: {
      screen: Home
    },
    InvoiceList: {
      screen: InvoiceList
    },
    MyInfo: {
      screen: MyInfo
    },
    Detail: {
      screen: Detail
    },
    Camera: {
      screen: Camera
    },
    Camera2: {
      screen: Camera2
    }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerBackTitle: null,
      headerTintColor: '#333333',
      showIcon: true,
    },
  }
);

export default RootScene;