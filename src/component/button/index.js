import React, {PropTypes, PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const colorMap = {
  primary: '#38adff',
  success: '#5cb85c',
  info: '#5bc0de',
  warning: '#f0ad4e',
  danger: '#d9534f'
};

class Button extends PureComponent {

  handlePress(e){
    if( !this.props.disabled ) {
      this.props.onPress(e);
    }
  }

  render() {
    let {disabled, style, disableStyle, textStyle, size, activeOpacity, type, numberOfLines} = this.props;
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={[styles.button, styles[size], {backgroundColor: colorMap[type]}, style, disabled && styles.disabled, disableStyle]}
        activeOpacity={activeOpacity}
      >
        <Text style={[styles.text, textStyle]} numberOfLines={numberOfLines}>
          {
            this.props.children
          }
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#38adff",
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  large: {
    height: 42
  },
  normal: {
    height: 38
  },
  small: {
    height: 26
  },
  disabled: {
    backgroundColor: '#ccc'
  },
  text: {
    color: '#fff',
    fontSize: 14
  }
});

Button.defaultProps = {
  disabled: false,
  onPress: function(){},
  style: {},
  disableStyle: {},
  textStyle: {},
  type: 'primary',
  size: 'normal',
  activeOpacity: 0.8,
  numberOfLines: 0
};

Button.propTypes = {
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.any,
  disableStyle: PropTypes.any,
  textStyle: PropTypes.any,
  type: PropTypes.string,
  size: PropTypes.string,
  activeOpacity: PropTypes.number,
  numberOfLines: PropTypes.number
};

export default Button;