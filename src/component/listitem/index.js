import React, {PropTypes, PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

class ListItem extends PureComponent {
  constructor(props){
    super(props);
  }

  render() {
    let {label, content, style, labelStyle, contentStyle} = this.props;
    return (
      <View style={[styles.listItem, style]}>
        {
          label &&
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        }
        <Text style={[styles.content, contentStyle]}>{content}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    flexDirection: 'row'
  },
  label: {
    width: 130,
    paddingVertical: 12,
    paddingHorizontal: 8
  },
  content: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 8
  }
});

ListItem.defaultProps = {
  label: "",
  content: "",
  style: {},
  labelStyle: {},
  contentStyle: {}
};

ListItem.propTypes = {
  label: PropTypes.string,
  content: PropTypes.string,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
  contentStyle: PropTypes.object
};

export default ListItem;