import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';

import Icon from '../../component/icon';
import Header from '../../component/header';
import Button from '../../component/button';
import Lightbox from 'react-native-lightbox';
import Spinner from '../../component/spinner';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import ListTable from './ListTable';
import fetch, {serverUrl} from '../../service/fetch';
import {confirm} from '../../utils';
import Toast from 'react-native-root-toast';

const dataSource1 = [
  {
  label: "发票代码",
  content: '',
    key: "invoiceCode"
  },
  {
    label: "发票号码",
    content: '',
    key: "invoiceNumber"
  },
  {
    label: "开票日期",
    content: '',
    key: "issueDate"
  },
  {
    label: "税前金额(合计)",
    content: '',
    key: "total.total"
  },
  {
    label: "销售方名称",
    content: '',
    key: "seller.sellerName"
  },
  {
    label: "购买方名称",
    content: '',
    key: "payer.payerName"
  },
  {
    label: "购买方纳税人识别号",
    content: '',
    key: "payer.ratePayerId"
  },
  {
    label: "销售方纳税人识别号",
    content: '',
    key: "seller.sellerId"
  },
  {
    label: "税额合计",
    content: '',
    key: "taxTotal"
  },
  {
    label: "价税合计(小写)",
    content: '',
    key: "total.totalCoverTaxDigits"
  },
  {
    label: "是否作废",
    content: '',
    key: "invalid"
  },
  {
    label: "购买方地址、电话",
    content: '',
    key: 'payer.payerAddressAndTel'
  },
  {
    label: "购买方开户行、账号",
    content: '',
    key: "payer.payerBank"
  },
  {
    label: "销售方地址、电话",
    content: '',
    key: "seller.sellerAddressAndTel"
  },
  {
    label: "销售方开户行、账号",
    content: '',
    key: "seller.sellerBank"
  }
];

const dataSource2 = [
  {
    label: "合计",
    content: '',
    key: "total"
  },
  {
    label: "名称",
    content: '',
    key: "name"
  },
  {
    label: "规格型号",
    content: '',
    key: "type"
  },
  {
    label: "单位",
    content: '',
    key: "unit"
  },
  {
    label: "数量",
    content: '',
    key: "total"
  },
  {
    label: "单价",
    content: '',
    key: "price"
  },
  {
    label: "金额",
    content: '',
    key: "totalPrice"
  },
  {
    label: "税率",
    content: '',
    key: 'tariff'
  },
  {
    label: "税额",
    content: '',
    key: "tax"
  }];

const FILE_PATH_PREFIX = serverUrl + "/data/wwwroot/wxfp.qtdatas.com/cdn/app/";

function getValueByKey(data, keys){
  let result = data;
  keys.split(".").forEach(key => {
    result = result[key];
  });
  return result;
}

class Detail extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      viewHeight: 100,
      fillMode: "cover",
      loaded: false,
      picturePath: "",
      invoiceData: [],
      prodData: []
    };

    this.invoiceId = null;
    this.invoiceNumber = null;
  }

  handleDel(){
    confirm("确定要删除吗?").then(() => {
      this.doDel(this.invoiceId, this.invoiceNumber);
    }, function(){});
  }

  doDel(invoice, number){
    this.setState({
      loaded: false
    });
    fetch.post("delInvoice", {invoice: [invoice], number: [number]}).then(data => {
      this.setState({
        loaded: true
      });
      if( data.success ) {
        this.props.navigation.navigate("InvoiceList");
      } else {
        Toast.show("删除失败: " + (data.message||""));
      }
    }, (errMsg) => {
      Toast.show(errMsg);
    });
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

  fetchData(invoice, number){
    this.setState({
      loaded: false
    });
    let params = {invoice, number};
    fetch.get("invoiceInfo", params).then(data => {
      this.setData(data);
    });
  }

  setData(data){
    let invoiceData = dataSource1.map(item => {
      return Object.assign(item, {content: getValueByKey(data, item.key)})
    });
    let prodData = dataSource2.map(item => {
      return Object.assign(item, {content: getValueByKey(data.sales[0]||{}, item.key)})
    });
    this.setState({
      invoiceData,
      prodData,
      picturePath: data.fp_path,
      loaded: true
    });
  }

  componentDidMount(){
    const {params} = this.props.navigation.state;
    this.invoiceId = params.invoice.id;
    this.invoiceNumber = params.number;
    this.fetchData(this.invoiceId, this.invoiceNumber);
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

          {
            this.state.picturePath ?
            <View style={styles.viewContainer}>
              <Lightbox
                onOpen={this.handleOpen.bind(this)}
                onClose={this.handleClose.bind(this)}
              >
                <Image
                  style={{height: this.state.viewHeight}}
                  resizeMode={this.state.fillMode}
                  source={{uri: FILE_PATH_PREFIX + this.state.picturePath}}
                />
              </Lightbox>
            </View> :
            <Text>
            </Text>
          }

          <ScrollableTabView
            style={styles.tabContainer}
            tabBarBackgroundColor='white'
            tabBarActiveTextColor='#FE566D'
            tabBarInactiveTextColor='#555555'
            tabBarTextStyle={styles.tabBarText}
            tabBarUnderlineStyle={styles.tabBarUnderline}
          >
            <ListTable
              tabLabel="发票信息"
              dataSource={this.state.invoiceData}
              style={[styles.listTable, !this.state.picturePath && styles.noPic]}
            />
            <ListTable
              tabLabel="货物信息"
              dataSource={this.state.prodData}
              style={[styles.listTable, !this.state.picturePath && styles.noPic]}
            />
          </ScrollableTabView>

          {
            !this.state.loaded &&
            <Spinner/>
          }

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
  noPic: {
    height: Dimensions.get('window').height - 180
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