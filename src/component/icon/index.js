
import React, { PureComponent, PropTypes } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'

function captialize(str){
  if( typeof str !== 'string') return '';
  return str.replace(/\w/, function(a){
    return a.toUpperCase();
  });
}

function genIconPath(props){
  switch (props.name){
    case "setting":
      return require('../../img/setting.png');
    case "arrow-left":
      return require('../../img/arrow-left.png');
    case "arrow-right":
      return require('../../img/arrow-right.png');
    case "arrow-left-white":
      return require('../../img/arrow-left-white.png');
    case "arrow-right-white":
      return require('../../img/arrow-right-white.png');
    case 'camera_1':
      return require('../../img/camera_1.png');
    case 'close':
      return require('../../img/close.png');
    case 'find':
      return require('../../img/find.png');
    case 'angle-right':
      return require('../../img/angle-right.png');
    case 'file-error':
      return require('../../img/file-error.png');
    case 'refresh':
      return require('../../img/refresh.png');
    case 'search-error':
      return require('../../img/search-error.png');
    case 'camera-blue':
      return require('../../img/camera-blue.png');
    case 'detail':
      return require('../../img/detail.png');
    case 'list-add':
      return require('../../img/list-add.png');
    case 'need-update':
      return require('../../img/need-update.png');
    case 'delete':
      return require('../../img/delete.png');
    case 'delete-white':
      return require('../../img/delete-white.png');
    case 'plus':
      return require('../../img/plus.png');
    case 'qrcode':
      return require('../../img/qrcode.png');
    case 'qrcode-land':
      return require('../../img/qrcode-land.png');
    case 'camera-white':
      return require('../../img/camera-white.png');
    case 'angle-down':
      return require('../../img/angle-down.png');
    case 'circle-close':
      return require('../../img/circle-close.png');
    case 'flash':
      return require('../../img/flash.png');
    case 'redo':
      return require('../../img/redo.png');
  }
}

class Icon extends PureComponent{
  static defaultProps = {
    path: '',
    name: '',
    size: 'normal',
    style: {},
    iconStyle: {},
    activeOpacity: 0.6
  };

  static propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.any,
    iconStyle: PropTypes.any,
    onPress: PropTypes.func,
    activeOpacity: PropTypes.number
  };

  render(){
    let {onPress, size, style, iconStyle, activeOpacity} = this.props;
    let icon = (
        <Image style={[styles["icon" + captialize(size)], iconStyle]} source={genIconPath(this.props)}/>
    );
    return (
      onPress ?
      <TouchableOpacity
        activeOpacity={activeOpacity}
        style={[{padding: 8}, style]}
        onPress={onPress.bind(this)}
      >
        {icon}
      </TouchableOpacity>
      :
      <View
        style={[{padding: 8}, style]}
      >
        {icon}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  iconNormal: {
    width: 20,
    height: 20
  },
  iconSmall: {
    width: 16,
    height: 16
  },
  iconLarge: {
    width: 36,
    height: 36
  }
});

export default Icon;