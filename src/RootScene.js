import React, { PureComponent } from 'react';
import { StackNavigator } from 'react-navigation';

import Login from './scene/Login'
import Home from './scene/Home'
import Camera from './scene/Camera'
import Camera2 from './scene/Camera/kit'
import MyInfo from './scene/MyInfo'
import InvoiceList from './scene/InvoiceList'
import Detail from './scene/Detail'
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
    Login: {
      screen: Login
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
    ImageViewer: {
      screen: ImageViewer
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