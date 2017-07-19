import React, {PropTypes, PureComponent} from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';

class FormItem extends PureComponent {
  constructor(props){
    super(props);
    this.value = this.props.defaultValue;
    this.isReceived = false;
  }
  handleChange(text){
    this.value = text;
    this.props.onChangeText(text);
  }
  componentWillReceiveProps(nextProps) {
    if( this.isReceived ) return;
    this.value = nextProps.defaultValue;
    this.isReceived = true;
  }
  render() {
    let {label, size, style, labelStyle, labelTextStyle, inputStyle, password, placeholderTextColor, ...inputProps} = this.props;
    return (
      <View style={[styles.container, style]}>
        {
          label &&
          <View style={[styles.label, styles[size], labelStyle]}>
            <Text style={[styles.labelText, labelTextStyle]}>{label}</Text>
          </View>
        }
        <TextInput
          {...inputProps}
          style={[styles.input, styles[size], inputStyle]}
          underlineColorAndroid="transparent"
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={password}
          onChangeText={this.handleChange.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15
  },
  label: {
    width: 60,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  labelText: {
    backgroundColor: 'transparent'
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#008cee',
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "#fff",
    borderRadius: 4,
    fontSize: 14
  },
  normal: {
    height: 38
  },
  small: {
    height: 30
  },
  large: {
    height: 42
  }
});

FormItem.defaultProps = {
  onChangeText: function(){},
  password: false,
  style: {},
  labelStyle: {},
  inputStyle: {},
  labelTextStyle: {},
  placeholderTextColor: "#ccc",
  size: 'normal',
  defaultValue: ""
};

FormItem.propTypes = {
  onChangeText: PropTypes.func,
  password: PropTypes.bool,
  style: PropTypes.any,
  labelStyle: PropTypes.any,
  inputStyle: PropTypes.any,
  labelTextStyle: PropTypes.any,
  placeholderTextColor: PropTypes.string,
  size: PropTypes.string,
  defaultValue: PropTypes.string
};

export default FormItem;