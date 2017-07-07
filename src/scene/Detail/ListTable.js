import React, { PureComponent, PropTypes } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import ListItem from '../../component/listitem';

export default class ListTable extends PureComponent {

  static defaultProps = {
    dataSource: [],
    style: {}
  };

  static propTypes = {
    dataSource: PropTypes.arrayOf(
      PropTypes.object
    ),
    style: PropTypes.any
  };

  constructor(props){
    super(props);
  }

  render(){
    let {dataSource, style} = this.props;
    return (
      <View style={[styles.container, style]}>
        <ScrollView style={{flex: 1}}>
        {
          dataSource.map((item, i) => {
            return (
              <ListItem key={i} label={item.label} content={item.content}/>
            )
          })
        }
        </ScrollView>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {

  }
});