import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Dimensions
} from 'react-native';

import Icon from '../../component/icon';
import Header from '../../component/header';
import Button from '../../component/button';
import Lightbox from 'react-native-lightbox';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';

import ListTable from './ListTable';
import fetch from '../../service/fetch';
import api from '../../service/api';

import Toast from 'react-native-root-toast';

const dataSource1 = [
  {
  label: "发票代码",
  content: '23234553889'
  },
  {
    label: "发票号码",
    content: '23234553889'
  },
  {
    label: "开票日期",
    content: '2017-06-20'
  },
  {
    label: "税前金额(合计)",
    content: '1820'
  },
  {
    label: "销售方名称",
    content: '天津诚信康达医疗器械贸易有限公司'
  },
  {
    label: "购买方名称",
    content: '中国人民解放军第二五四医院'
  },
  {
    label: "购买方纳税人识别号",
    content: '5665565'
  },
  {
    label: "销售方纳税人识别号",
    content: '5665565'
  },
  {
    label: "税额合计",
    content: '53332'
  },
  {
    label: "价税合计(小写)",
    content: '4333'
  },
  {
    label: "是否作废",
    content: '否'
  },
  {
    label: "购买方地址、电话",
    content: 'xxxx,1376449944'
  },
  {
    label: "购买方开户行、账号",
    content: 'xxxx,1376449944'
  },
  {
    label: "销售方地址、电话",
    content: 'xxxx,1376449944'
  },
  {
    label: "销售方开户行、账号",
    content: 'xxxx,1376449944'
  }
];

const dataSource2 = [
  {
    label: "合计",
    content: '2条'
  },
  {
    label: "名称",
    content: '四极标测导管'
  },
  {
    label: "规格型号",
    content: ''
  },
  {
    label: "单位",
    content: '套'
  },
  {
    label: "数量",
    content: '3'
  },
  {
    label: "单价",
    content: '2538.46'
  },
  {
    label: "金额",
    content: '7615.38'
  },
  {
    label: "税率",
    content: '17%'
  },
  {
    label: "税额",
    content: '1294.62'
  }];

class Detail extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      viewHeight: 100,
      fillMode: "cover"
    };
  }

  handleClick(){
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    /*this.setState({
      isEditing: true
    });*/

   /* fetch(api.login, {username, password}).then(res => {

    }).catch(err => {
      this.setState({
        isEditing: false
      });
    });*/

    this.props.navigation.navigate('Home', {user: username});
  }

  handleDel(){
    Alert.alert(
      '确认信息',
      '确定要删除吗?',
      [
        {text: '取消', onPress: () => console.log('Ask me later pressed')},
        {text: '确定', onPress: () => console.log('Cancel Pressed'), style: 'destructive'}
      ]
    )
  }

  handleOpen(){
    this.setState({
      viewHeight: Dimensions.get('window').height,
      fillMode: 'contain'
    });
  }

  handleClose(){
    this.setState({
      viewHeight: 100,
      fillMode: 'cover'
    });
  }

  handleCamClick(){
    this.props.navigation.navigate('Camera');
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          left={(
            <Icon name="arrow-left-white" onPress={this.props.navigation.navigate.bind(this,'InvoiceList')}/>
          )}
        >
          发票详情
        </Header>
        <View style={styles.container}>

          <View style={styles.viewContainer}>
            <Lightbox
              onOpen={this.handleOpen.bind(this)}
              onClose={this.handleClose.bind(this)}
            >
              <Image
                style={{ height: this.state.viewHeight }}
                resizeMode={this.state.fillMode}
                source={{ uri: 'http://knittingisawesome.com/wp-content/uploads/2012/12/cat-wearing-a-reindeer-hat1.jpg' }}
              />
            </Lightbox>
          </View>

          <ScrollableTabView
            style={styles.tabContainer}
            tabBarBackgroundColor='white'
            tabBarActiveTextColor='#FE566D'
            tabBarInactiveTextColor='#555555'
            tabBarTextStyle={styles.tabBarText}
            tabBarUnderlineStyle={styles.tabBarUnderline}
          >
            <ListTable tabLabel="发票信息" dataSource={dataSource1} style={styles.listTable}/>
            <ListTable tabLabel="货物信息" dataSource={dataSource2} style={styles.listTable}/>
          </ScrollableTabView>

        </View>

        <View style={styles.footer}>
          <Button
            style={{width: 100}}
            onPress={this.handleCamClick.bind(this)}
          >
            上传出库单
          </Button>
          <Button type="danger" style={{width: 100}} onPress={this.handleDel.bind(this)}>删除</Button>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#fff"
  },
  viewContainer: {

  },
  tabContainer: {
    backgroundColor: "#f3f3f3"
  },
  listTable: {
    height: Dimensions.get('window').height - 280
  },
  tabBarText: {
    fontSize: 14,
    marginTop: 13,
  },
  tabBarUnderline: {
    backgroundColor: '#FE566D'
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 8,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'space-between'
  }
});

export default Detail;