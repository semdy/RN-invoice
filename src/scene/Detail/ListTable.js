import React, { PureComponent, PropTypes } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import ListItem from './listitem';

export default class ListTable extends PureComponent {

  static defaultProps = {
    dataSource: [],
    style: {},
    renderFooter: function(){}
  };

  static propTypes = {
    dataSource: PropTypes.arrayOf(
      PropTypes.object
    ),
    style: PropTypes.any,
    renderFooter: PropTypes.func
  };

  constructor(props){
    super(props);
  }

  getValueByKey(key){
    return this.refs[key].getValue();
  }

  render(){
    let {dataSource, style, renderFooter} = this.props;
    return (
      <View style={[styles.container, style]}>
        <ScrollView style={{flex: 1}}>
        {
          dataSource.map((item, i) => {
            return (
              <ListItem
                ref={item.key}
                key={i}
                editable={item.editable}
                label={item.label}
                content={item.content}
              />
            )
          })
        }
        </ScrollView>
        {renderFooter()}
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {

  }
});