import React, {PropTypes, PureComponent} from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';

import DatePicker from 'react-native-datepicker'

class FormItem extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      value: this.props.defaultValue
    };
  }
  handleChange(value){
    this.setState({
      value
    });
    this.props.onChangeText(value);
  }
  componentWillReceiveProps(nextProps) {
    if( nextProps.defaultValue !== this.props.defaultValue ) {
      this.setState({
        value: nextProps.defaultValue
      });
    }
  }
  get value(){
    return this.state.value;
  }
  set value(value){
    this.handleChange(value);
  }
  render() {
    let {
      label,
      size,
      style,
      labelStyle,
      labelTextStyle,
      inputStyle,
      password,
      placeholderTextColor,
      datepickerProps,
      datepicker,
      ...inputProps
    } = this.props;

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
          defaultValue={this.state.value}
          style={[styles.input, styles[size], inputStyle]}
          underlineColorAndroid="transparent"
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={password}
          onChangeText={this.handleChange.bind(this)}
        />
        {
          datepicker &&
          <DatePicker
            {...datepickerProps}
            style={styles.datepicker}
            hideText={true}
            showIcon={false}
            date={this.state.value}
            onDateChange={this.handleChange.bind(this)}
          />
        }
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
  },
  datepicker: {
    position: "absolute",
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
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
  defaultValue: "",
  datepicker: false,
  datepickerProps: {}
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
  defaultValue: PropTypes.string,
  datepicker: PropTypes.bool,
  datepickerProps: PropTypes.object
};

export default FormItem;