import React, {PropTypes, PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Icon from '../../component/icon';

class ListItem extends PureComponent {
  constructor(props){
    super(props);
  }

  render() {
    let {onPress, iconName, text, extraText, style, iconStyle, textStyle, extraTextStyle, angleStyle, showArrow} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={[styles.listItem, style]}
        onPress={onPress}
      >
        <Icon
          name={iconName}
          style={[styles.icon, iconStyle]}
        />
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
        {
          extraText &&
          <Text style={[styles.extraText, extraTextStyle]}>
            {extraText}
          </Text>
        }
        {
          showArrow &&
          <Icon name="angle-right"
                style={[styles.angle, angleStyle]}
                iconStyle={{width: 8, height: 14}}
          />
        }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 5,
    minHeight: 40
  },
  icon: {
  },
  text: {
    flex: 1
  },
  extraText: {
  },
  angle: {
    marginLeft: 8,
    padding: 0,
    opacity:.5
  }
});

ListItem.defaultProps = {
  iconName: "",
  text: "",
  extraText: "",
  style: {},
  iconStyle: {},
  textStyle: {},
  extraTextStyle: {},
  angleStyle: {},
  showArrow: true,
  onPress: function(){}
};

ListItem.propTypes = {
  iconName: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  extraText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  style: PropTypes.object,
  iconStyle: PropTypes.object,
  textStyle: PropTypes.object,
  extraTextStyle: PropTypes.object,
  angleStyle: PropTypes.object,
  showArrow: PropTypes.bool,
  onPress: PropTypes.func
};

export default ListItem;