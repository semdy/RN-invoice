import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import Camera from '../Camera';
import Scanner from '../Scanner';

export default class ScanCamera extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'scanner'
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

  switchMode(mode){
    this.setState({
      mode
    });
  }

  render(){
    let {mode} = this.state;
    let {navigation} = this.props;
    let switchMode = this.switchMode.bind(this);
    return (
      mode === 'scanner' ?
        <Scanner switchMode={switchMode} navigation={navigation}/>
        :
        <Camera switchMode={switchMode} navigation={navigation}/>
    )
  }
}