import React, {PropTypes, PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import FormItem from '../../component/formitem';

class ListItem extends PureComponent {
  constructor(props){
    super(props);
  }

  getValue(){
    return this.props.editable ? this.refs.input.value : undefined;
  }

  render() {
    let {label, content, style, labelStyle, contentStyle, editable} = this.props;
    return (
      <View style={[styles.listItem, style]}>
        {
          label &&
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        }
        {
          editable ?
          <FormItem ref="input" defaultValue={content} style={{flex: 1, marginBottom: 0}}/> :
          <Text style={[styles.content, contentStyle]}>{content}</Text>
        }
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
    borderColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 8
  }
});

ListItem.defaultProps = {
  label: "",
  content: "",
  style: {},
  labelStyle: {},
  contentStyle: {},
  editable: false
};

ListItem.propTypes = {
  label: PropTypes.string,
  content: PropTypes.oneOfType(
    PropTypes.string,
    PropTypes.number
  ),
  style: PropTypes.any,
  labelStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  editable: PropTypes.bool
};

export default ListItem;