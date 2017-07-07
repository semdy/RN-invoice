
import React, { PureComponent, PropTypes } from 'react'
import {
  View,
  StyleSheet,
  Image,
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
  }
}

class Icon extends PureComponent{
  static defaultProps = {
    path: '',
    name: '',
    size: 'normal',
    style: {},
    iconStyle: {},
    onPress: function(){}
  };

  static propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    onPress: PropTypes.func
  };

  render(){
    let {onPress, size, style, iconStyle} = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={onPress.bind(this)}
      >
        <View style={[{padding: 8}, style]}>
          <Image style={[styles["icon" + captialize(size)], iconStyle]} source={genIconPath(this.props)}/>
        </View>
      </TouchableWithoutFeedback>
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
    width: 30,
    height: 30
  }
});

export default Icon;