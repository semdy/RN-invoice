import React, { PureComponent, PropTypes } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import ListItem from './listitem';

class SaleItem extends PureComponent {

  static defaultProps = {
    item: []
  };

  static propTypes = {
    dataSource: PropTypes.object
  };

  constructor(props){
    super(props);
  }

  render(){
    let {item} = this.props;
    return (
      <View style={[styles.itemContainer]}>
        <ListItem labelStyle={{width: 'auto'}} label="货物名称" content={item.name}/>
        <ListItem labelStyle={{width: 'auto'}} label="规格型号" content={item.type}/>
        <View style={styles.itemWrap}>
          <ListItem label="单位" labelStyle={{width: 'auto'}} style={styles.inlineItem} content={item.unit}/>
          <ListItem label="数量" labelStyle={{width: 'auto'}} style={styles.inlineItem} content={item.total}/>
        </View>
        <View style={styles.itemWrap}>
          <ListItem label="单价" labelStyle={{width: 'auto'}} style={styles.inlineItem} content={item.price}/>
          <ListItem label="税额" labelStyle={{width: 'auto'}} style={styles.inlineItem} content={item.tax}/>
        </View>
      </View>
    )
  }
}

export default class ListTableSales extends PureComponent {

  static defaultProps = {
    dataSource: [],
    style: {},
    renderFooter: function(){},
    renderEmpty: function () {}
  };

  static propTypes = {
    dataSource: PropTypes.arrayOf(
      PropTypes.object
    ),
    style: PropTypes.any,
    renderFooter: PropTypes.func,
    renderEmpty: PropTypes.func
  };

  constructor(props){
    super(props);
  }

  render(){
    let {dataSource, style, renderEmpty, renderFooter} = this.props;
    return (
      <View style={[styles.container, style]}>
        {
          dataSource.length === 0 ?
            renderEmpty() :
          <ScrollView style={{flex: 1}}>
            {
              dataSource.map((item, i) => {
                return (
                  <SaleItem key={i} item={item}/>
                )
              })
            }
          </ScrollView>
        }
        {renderFooter()}
      </View>
    )
  }
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 5,
    paddingRight: 5,
    paddingBottom: 5
  },
  container: {

  },
  itemWrap: {
    flexDirection: 'row'
  },
  inlineItem: {
    flex: 1
  }
});