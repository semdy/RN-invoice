import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Picker,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import Icon from '../../component/icon';
import Header from '../../component/header';
import Button from '../../component/button';
import FormItem from '../../component/formitem';
import CheckBox from '../../component/checkbox';
import Spinner from '../../component/spinner';
import {confirm} from '../../utils';

import Toast from 'react-native-root-toast';

import fetch from '../../service/fetch';
import {session} from '../../service/auth';

const INVOICE_STATUS = {
  "success": {text: "已完成", color: "green"},
  "needChange": {text: "信息需要更新", color: "#f90"},
  "noInvoice": {text: "无法识别", color: "#cc0000"},
  "failed": {text: "查询无结果", color: "#cc0000"},
  "noSales": {text: "销货明细需补充", color: "#f90"},
  "waiting": {text: "查询中", color: "#666"}
};

function padZero(n){
  return n < 10 ? "0" + n : n;
}

function getCurrentDate(){
  let date = new Date();
  return date.getFullYear() + "/" + padZero(date.getMonth() + 1) + "/" + padZero(date.getDate());
}

function object2Array(obj){
  let arr = [];
  for(let i in obj){
    arr.push({
      date: i,
      list: obj[i]
    });
  }

  return arr;
}

class InvoiceList extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      isDeling: false,
      invoiceDay: "",
      invoiceStatus: "",
      data: [],
      total: 0
    };
    this.page = 1;
    this.dataMap = {};
    this.checkedItems = [];
  }

  handleQuery(){
    this.page = 1;
    this.dataMap = {};
    this.checkedItems = [];
    this.fetchData(this.refs.code.value, this.state.invoiceStatus, this.state.invoiceDay, this.page);
  }

  handleDel(){
    if( this.checkedItems.length === 0 )
      return Toast.show("请至少选择一项");

    confirm("确定要删除吗?").then(() => {
      this.doDel(this.checkedItems);
    }, function(){});
  }

  doDel(items){
    let params = {
      invoice: items.map(item => item.invoice.id),
      number: items.map(item => item.number)
    };
    this.setState({
      isDeling: true
    });
    fetch.post("delInvoice", params).then(data => {
      if( data === true ) {
        this.handleQuery();
      } else {
        Toast.show("删除失败: " + (data.message||""));
      }
      this.setState({
        isDeling: false
      });
    }, (errMsg) => {
      Toast.show(errMsg);
    });
  }

  handleCheck(item, isChecked){
    item.checked = isChecked;
    if( isChecked && !this.checkedItems.some(checked => checked.number === item.number) ) {
      this.checkedItems.push(item);
    }
    this.checkedItems = this.checkedItems.filter(item => item.checked === true);
  }

  fetchData(invoiceNumber="", status="", day="", page=1){
    this.setState({
      loaded: false
    });

    let params = {
      customer: session.get().id,
      invoiceNumber,
      status,
      day,
      page
    };

    let data = this.dataMap;

    fetch.get("invoiceList", params).then(res => {
      res.invoiceList.forEach(item => {
        if( data[item.date] === undefined ){
          data[item.date] = [];
        }
        data[item.date].push(item);
      });

      this.setState({
        data: object2Array(data),
        total: res.sum,
        loaded: true
      });
    });
  }

  appendData(){
    if( !this.state.loaded ) return;
    this.fetchData(this.refs.code.value, this.state.invoiceStatus, this.state.invoiceDay, ++this.page);
  }

  keyExtractor(item) {
    return item.date;
  }

  renderHeader(){
    return (
      <View>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.lineNumber, {textAlign: 'left'}]}>序号</Text>
          <Text style={styles.tableCell}>发票号</Text>
          <Text style={[styles.tableCell, styles.cellStatus]}>状态</Text>
        </View>
      </View>
    );
  }

  renderItem(info){
    let data = info.item;
    return (
      <View style={styles.itemPanel}>
        <View style={styles.dateStyle}>
          <Image style={styles.dateLine} source={require('../../img/dash-line.png')} resizeMode="cover"/>
          <Text style={styles.dateTextStyle}>
            {data.date.replace(/\-/g, "/")}
          </Text>
        </View>
        {
          data.list.map(item => {
            return (
              <TouchableOpacity
                key={item.number}
                style={styles.tableRow}
                activeOpacity={0.7}
                onPress={this.props.navigation.navigate.bind(this, 'Detail', item)}
              >
                <View style={[styles.lineNumber, {paddingVertical: 4}]}>
                  <CheckBox
                    style={styles.checkbox}
                    onClick={this.handleCheck.bind(this, item)}
                    isChecked={false}
                  />
                  <Text>{item.number}</Text>
                </View>
                <Text style={styles.tableCell}>{item.invoiceNumber}</Text>
                <Text style={[styles.tableCell, styles.cellStatus, {color: INVOICE_STATUS[item.invoice.status].color}]}>
                  {INVOICE_STATUS[item.invoice.status].text}
                </Text>
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }

  renderFooter(){
    return (
      <View style={styles.queryFooter}>
        <Text style={{fontSize: 12}}>
         查询结果: {this.state.total}条
        </Text>
      </View>
    )
  }

  componentDidMount(){
    let {params} = this.props.navigation.state;
    params = params || {};
    this.setState({
      invoiceStatus: params.status || "",
      invoiceDay: params.day === undefined ? "" : String(params.day)
    }, () => {
      this.handleQuery();
    });
  }

  render() {
    let {loaded, isDeling, data} = this.state;
    return (
      <View style={styles.container}>
        <Header
          left={(
            <Icon name="arrow-left-white" onPress={this.props.navigation.navigate.bind(this,'Home')}/>
          )}
        >
          发票列表
        </Header>
        <View style={styles.queryContainer}>
          <View style={styles.queryItem}>
            <Button
              onPress={this.handleQuery.bind(this)}
              style={[{flex: 1}, styles.button]}
            >
              查询
            </Button>
            <Icon name="delete"
                  onPress={this.handleDel.bind(this)}
                  style={styles.button}
            >
              删除
            </Icon>
          </View>

          <View style={styles.queryItem}>
            <Text style={styles.queryLabel}>
              输入发票号码:
            </Text>
            <FormItem ref="code" placeholder="请输入发票号码" style={styles.code}/>
          </View>
          <View style={styles.queryItem}>
            <Text style={styles.queryLabel}>
              输入查询区间:
            </Text>
            <View style={styles.pickerItem}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.invoiceDay}
                onValueChange={(value) => this.setState({invoiceDay: value})}>
                <Picker.Item label="全部" value="" />
                <Picker.Item label="当天" value="1" />
                <Picker.Item label="7天" value="7" />
                <Picker.Item label="30天" value="30" />
              </Picker>
            </View>
          </View>
          <View style={styles.queryItem}>
            <Text style={styles.queryLabel}>
              选择发票状态:
            </Text>
            <View style={styles.pickerItem}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.invoiceStatus}
                onValueChange={(value) => this.setState({invoiceStatus: value})}>
                <Picker.Item label="全部" value="" />
                <Picker.Item label="查询中" value="waiting" />
                <Picker.Item label="查询无结果" value="failed" />
                <Picker.Item label="销货明细需补充" value="noSales" />
                <Picker.Item label="信息需更新" value="needChange" />
                <Picker.Item label="无法识别" value="noInvoice" />
                <Picker.Item label="成功" value="success" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.listViewContainer}>
          {
            this.renderHeader()
          }
          <FlatList
            style={styles.scrollview}
            data={data}
            keyExtractor={this.keyExtractor}
            onRefresh={this.handleQuery.bind(this)}
            refreshing={!loaded}
            onEndReachedThreshold={0.01}
            //ListHeaderComponent={this.renderHeader}
            renderItem={this.renderItem.bind(this)}
            onEndReached={this.appendData.bind(this)}
          />
          {
            this.renderFooter()
          }
        </View>

        {
          isDeling &&
          <Spinner/>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d3e1fe"
  },
  queryContainer: {
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 4
  },
  formItem: {

  },
  queryItem: {
    flexDirection: 'row',
    marginBottom: 5
  },
  queryLabel: {
    height: 38,
    lineHeight: 29,
    marginRight: 8
  },
  code: {
    flex: 1,
    marginBottom: 0
  },
  pickerItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#008cee',
    borderRadius: 4
  },
  picker: {
    height: 36
  },
  button: {
    marginLeft: 10
  },
  listViewContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginHorizontal: 5,
    height: Dimensions.get('window').height - 282
  },
  scrollview: {
    flex: 1
  },
  dateStyle: {
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  dateLine: {
    position: 'absolute',
    left: '2%',
    top: 11,
    width: '96%'
  },
  dateTextStyle: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: -30,
    backgroundColor: '#fff'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 5,
    borderColor: '#eee',
  },
  tableHeader: {
    borderBottomWidth: 0
  },
  lineNumber: {
    width: 90,
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 12,
  },
  cellStatus: {
    flex: 0,
    width: 120
  },
  checkbox: {
    paddingVertical: 8,
    paddingRight: 8
  },
  queryFooter: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

export default InvoiceList;