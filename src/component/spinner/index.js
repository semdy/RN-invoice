import React, { PureComponent, PropTypes } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

class Spinner extends PureComponent{
  static defaultProps = {
    style: {},
    spinStyle: {},
    size: 'large'
  };

  static propTypes = {
    style: PropTypes.object,
    spinStyle: PropTypes.object
  };

  render(){
    let {style, spinStyle, ...spinProps} = this.props;
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator
          {...spinProps}
          style={spinStyle}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -40,
    marginTop: -40,
    backgroundColor: 'rgba(0,0,0,.7)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70
  }
});

export default Spinner;