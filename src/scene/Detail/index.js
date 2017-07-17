import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';

import Icon from '../../component/icon';
import Header from '../../component/header';
import Button from '../../component/button';
import ImageViewer from 'react-native-image-zoom-viewer';
import Spinner from '../../component/spinner';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ButtonGroup from '../../component/buttongroup';
import {session} from '../../service/auth';

import ListTable from './ListTable';
import ListTableSales from './ListTableSales';
import fetch, {serverUrl} from '../../service/fetch';
import {confirm} from '../../utils';
import Toast from 'react-native-root-toast';

const dataSource = [
  {
    label: "发票代码",
    content: '',
    key: "invoiceCode",
    paramKey: "invoiceCode",
    editableKey: "codeMark"
  },
  {
    label: "发票号码",
    content: '',
    key: "invoiceNumber",
    paramKey: "invoiceNumber",
    editableKey: "numberMark"
  },
  {
    label: "开票日期",
    content: '',
    key: "issueDate",
    paramKey: "issueDate",
    editableKey: "issueDateMark"
  },
  {
    label: "税前金额",
    content: '',
    key: "total.total",
    paramKey: "invoicePrice",
    editableKey: "totalMark"
  },
  {
    label: "校验码后六位",
    content: '',
    key: "correctCode",
    paramKey: "correctCode",
    editableKey: "correctMark"
  },
  {
    label: "购买方名称",
    content: '',
    key: "payer.payerName"
  },
  {
    label: "销售方名称",
    content: '',
    key: "seller.sellerName"
  }
];

function getValueByKey(data, keys){
  let result = data;
  keys.split(".").forEach(key => {
    result = result[key];
  });
  return result;
}

function getItemEditable(data, key){
  return String(data[key]) === "1";
}

class Detail extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      activeIndex: 0,
      picturePath: "xxx",
      invoiceData: [],
      prodData: [],
      canUpdate: false
    };

    this.invoiceId = null;
    this.invoiceNumber = null;
    this.isInit = true;
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
      if( data === true ) {
        this.props.navigation.navigate("InvoiceList");
      } else {
        Toast.show("删除失败: " + (data.message||""));
      }
    }, (errMsg) => {
      Toast.show(errMsg);
    });
  }

  handleGoBack(){
    //this.props.navigation.goBack();
    this.props.navigation.navigate("InvoiceList");
  }

  showPhoto(){
    this.props.navigation.navigate('ImageViewer', {images: [{url: serverUrl + this.state.picturePath}]});
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
    let invoiceData = dataSource.map(item => {
      return Object.assign(item, {
        content: getValueByKey(data, item.key),
        editable: getItemEditable(data, item.editableKey)
      })
    });

    let prodData = data.sales||[];
    let state = {
      invoiceData,
      prodData,
      picturePath: data.fp_path,
      canUpdate: invoiceData.some(item => item.editable === true) || false,
      loaded: true
    };

    if( this.isInit ){
      state.activeIndex = data.status === "noSales" ? 1 : 0; //无销货明细，跳转至销货明细tab页
    }

    this.setState(state);
  }

  handleTabChangle(e){
    this.setState({
      activeIndex: e.i
    });
  }

  handleTabClick(i){
    this.isInit = false;
    this.refresh();
    this.setState({
      activeIndex: i
    });
  }

  handleUpdate(){
    if( !this.state.canUpdate ) return;

    let params = {
      customer: session.get().id,
      invoice: this.invoiceId,
      number: this.invoiceNumber
    };

    this.state.invoiceData.forEach(item => {
      if( item.editable ){
        params[item.paramKey] = this.refs.invoicetable.getValueByKey(item.key);
      }
    });

    if(params.invoiceCode !== undefined && !/^\d{10}$/.test(params.invoiceCode)){
      return Toast.show("请输入10位数字的发票代码");
    }
    else if(params.invoiceNumber !== undefined && !/^\d{8}$/.test(params.invoiceNumber)){
      return Toast.show("请输入8位数字的发票号码");
    }
    else if(params.correctCode !== undefined && !/^\d{6}$/.test(params.correctCode)){
      return Toast.show("请输入后6位的校验码");
    }

    fetch.post("upInvoice", params).then(data => {
      if (data === true) {
        Toast.show("更新成功");
        this.refresh();
      } else {
        Toast.show("更新失败");
      }
    }, errMsg => {
      Toast.show("服务器响应出错");
    })
  }

  handleUploadSales(){
    let navParams = {
      mode: 'camera',
      uploadType: "uploadSales",
      invoiceInfo: {
        id: this.invoiceId,
        number: this.invoiceNumber
      }
    };
    this.props.navigation.navigate("ScanCamera", navParams);
  }

  captureDone(){
    this.setState({
      activeIndex: 0
    });
    this.refresh();
  }

  refresh(){
    this.fetchData(this.invoiceId, this.invoiceNumber);
  }

  componentDidMount(){
    const {params} = this.props.navigation.state;
    this.invoiceId = params.invoice.id;
    this.invoiceNumber = params.number;
    this.subscription = DeviceEventEmitter.addListener('salesCaptureDone', this.captureDone.bind(this));
    this.refresh();
  }

  componentWillUnmount(){
    this.subscription.remove();
  };

  render() {
    let {activeIndex, invoiceData, prodData, picturePath, canUpdate, loaded} = this.state;

    return (
      <View style={styles.container}>
        <Header
          left={(
            <Icon name="arrow-left-white" onPress={this.handleGoBack.bind(this)}/>
          )}
          right={(
            <Icon name="delete-white" onPress={this.handleDel.bind(this)}/>
          )}
        >
          发票详情
        </Header>
        <View style={styles.page}>

          <View style={styles.viewContainer}>
            {
              picturePath ?
              <TouchableOpacity
                activeOpacity={0.7}
                style={{flex: 1}}
                onPress={this.showPhoto.bind(this)}
              >
                <Image
                  style={styles.invoiceImg}
                  source={{uri: serverUrl + picturePath}}
                />
              </TouchableOpacity>
              :
              <View style={styles.qrcodeHintContainer}>
                <Text style={styles.qrcodeHintText}>此发票通过二维码识别</Text>
              </View>
            }
          </View>

          <ScrollableTabView
            renderTabBar={() =>
              <View style={styles.tabBar}>
                <ButtonGroup
                  items={[{text: '发票信息'}, {text: '销货明细'}]}
                  activeIndex={activeIndex}
                  onPress={this.handleTabClick.bind(this)}
                />
              </View>}
            style={styles.tabContainer}
            tabBarActiveTextColor='#FE566D'
            tabBarInactiveTextColor='#555555'
            tabBarTextStyle={styles.tabBarText}
            tabBarUnderlineStyle={styles.tabBarUnderline}
            initialPage={activeIndex}
            page={activeIndex}
            onChangeTab={this.handleTabChangle.bind(this)}
          >
            <ListTable
              ref="invoicetable"
              tabLabel="发票信息"
              dataSource={invoiceData}
              style={[styles.listTable, {backgroundColor: '#fff'}, !picturePath && styles.noPic]}
              renderFooter={() =>
                <View style={styles.buttonField}>
                  <Button
                    size="small"
                    style={{width: 100}}
                    disabled={!canUpdate}
                    onPress={this.handleUpdate.bind(this)}
                  >
                    更新
                  </Button>
                </View>
              }
            />
            <ListTableSales
              tabLabel="销货明细"
              dataSource={prodData}
              style={[styles.listTable, !prodData.length ? styles.noData : {paddingVertical: 0}, !picturePath && styles.noPic]}
              renderEmpty={() =>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={this.handleUploadSales.bind(this)}
                >
                  <Icon name="plus" size="large" style={{opacity: 0.5}}/>
                  <Text style={styles.uploadHintText}>请拍摄销货清单</Text>
                </TouchableOpacity>
              }
              renderFooter={() =>
                <View style={[styles.queryFooter, !prodData.length && styles.queryFooterEmpty]}>
                  <Text style={{fontSize: 12}}>
                    查询结果: {prodData.length}条
                  </Text>
                </View>
              }
            />
          </ScrollableTabView>

          {
            !loaded &&
            <Spinner/>
          }

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d3e1fe"
  },
  page: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    flex: 1
  },
  viewContainer: {
    height: 140
  },
  tabContainer: {

  },
  invoiceImg: {
    width: '100%',
    height: Dimensions.get("window").width,
    transform: [
      {
        rotate: '-90deg'
      }
    ]
  },
  tabBar: {
    paddingVertical: 8
  },
  listTable: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    height: Dimensions.get('window').height - 278
  },
  noPic: {
    //height: Dimensions.get('window').height - 143
  },
  tabBarText: {
    fontSize: 14,
    marginTop: 13,
  },
  qrcodeHintContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qrcodeHintText: {
    fontSize: 18
  },
  buttonField: {
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tabBarUnderline: {
    backgroundColor: '#FE566D'
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  uploadButton: {
    width: 120,
    height: 120,
    borderRadius: 120,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -50,
    marginTop: -60
  },
  uploadHintText: {
    fontSize: 12
  },
  noData: {
    backgroundColor: '#fff',
    borderRadius: 4
  },
  queryFooter: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  queryFooterEmpty: {
    position: "absolute",
    right: 10,
    bottom: 0
  }
});

export default Detail;