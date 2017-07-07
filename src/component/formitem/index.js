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
    this.value = this.props.defaultValue || "";
  }
  handleChange(text){
    this.value = text;
    this.props.onChangeText(text);
  }
  render() {
    let {label, style, password, ...inputProps} = this.props;
    return (
      <View style={[styles.container, style]}>
        {
          label &&
          <Text style={styles.label}>{label}</Text>
        }
        <TextInput
          {...inputProps}
          style={[styles.input]}
          underlineColorAndroid="transparent"
          placeholderTextColor="#ccc"
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
    textAlign: 'right',
    height: 38,
    lineHeight: 28,
    marginRight: 8
  },
  input: {
    flex: 1,
    height: 38,
    lineHeight: 38,
    borderColor: '#008cee',
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "#fff",
    borderRadius: 4
  }
});

FormItem.defaultProps = {
  onChangeText: function(){},
  password: false
};

FormItem.propTypes = {
  onChangeText: PropTypes.func,
  password: PropTypes.bool
};

export default FormItem;