import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Picker,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import Icon from '../../component/icon';
import Header from '../../component/header';
import Button from '../../component/button';
import FormItem from '../../component/formitem';
import CheckBox from 'react-native-check-box'
import Spinner from '../../component/spinner';
import {confirm} from '../../utils';

import Toast from 'react-native-root-toast';

import fetch from '../../service/fetch';
import {session} from '../../service/auth';

const INVOICE_STATUS = {
  "success": "成功",
  "needChange": "四要素需更新",
  "noInvoice": "无法识别",
  "failed": "七天未查到",
  "noSales": "补出库单",
  "waiting": "查询中"
};

class InvoiceList extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      invoiceDay: "",
      invoiceStatus: "",
      data: []
    };
  }

  handleQuery(){
    this.fetchData(this.refs.code.value, this.state.invoiceStatus, this.state.invoiceDay, 1);
  }

  handleDel(){
    let checkedItems = this.state.data.filter(item => item.checked === true);
    if( checkedItems.length === 0 ) return Toast.show("请至少选择一项");
    confirm("确定要删除吗?").then(() => {
      this.doDel(checkedItems);
    }, function(){});
  }

  doDel(items){
    let params = {
      invoice: items.map(item => item.invoice.id),
      number: items.map(item => item.number)
    };
    this.setState({
      loaded: false
    });
    fetch.post("delInvoice", params).then(data => {
      if( data.success ) {
        this.handleQuery();
      } else {
        Toast.show("删除失败: " + (data.message||""));
      }
      this.setState({
        loaded: true
      });
    }, (errMsg) => {
      Toast.show(errMsg);
    });
  }

  handleCamClick(){
    this.props.navigation.navigate('Camera');
  }

  handleCheck(i, item, isChecked){
    item.checked = isChecked;
  }

  fetchData(invoiceNumber="", status="", day="", page=1){
    this.setState({
      loaded: false
    });
    let params = {customer: session.get().id, invoiceNumber, status, day, page};
    fetch.get("invoiceList", params).then(data => {
      this.setState({
        data: data
      });
      this.setState({
        loaded: true
      });
    });
  }

  componentDidMount(){
    this.fetchData();
  }

  render() {
    let {loaded, data} = this.state;
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
            <FormItem ref="code" placeholder="请输入发票号码" style={styles.code}/>
            <Button onPress={this.handleQuery.bind(this)} style={styles.button}>查询</Button>
            <Button type="danger" onPress={this.handleDel.bind(this)} style={styles.button}>删除</Button>
          </View>

          <View style={styles.queryItem}>
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
            <View style={[styles.pickerItem, {marginLeft: 10}]}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.invoiceStatus}
                onValueChange={(value) => this.setState({invoiceStatus: value})}>
                <Picker.Item label="全部" value="" />
                <Picker.Item label="查询中" value="waiting" />
                <Picker.Item label="7天未查到" value="failed" />
                <Picker.Item label="补出库单" value="noSales" />
                <Picker.Item label="四要素需更新" value="needChange" />
                <Picker.Item label="无法识别" value="noInvoice" />
                <Picker.Item label="成功" value="success" />
              </Picker>
            </View>
          </View>

          <View style={styles.listViewContainer}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.lineNumber}>序号</Text>
              <Text style={styles.tableCell}>发票号</Text>
              <Text style={styles.tableCell}>状态</Text>
            </View>
            <ScrollView styles={styles.scrollview}>
              {
                data.map((item, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={styles.tableRow}
                      activeOpacity={0.7}
                      onPress={this.props.navigation.navigate.bind(this, 'Detail', item)}>
                      <CheckBox
                        style={styles.checkbox}
                        onClick={this.handleCheck.bind(this, i, item)}
                        isChecked={false}
                      />
                      <Text style={styles.lineNumber}>{item.number}</Text>
                      <Text style={styles.tableCell}>{item.invoiceNumber}</Text>
                      <Text style={styles.tableCell}>{INVOICE_STATUS[item.invoice.status]||"-"}</Text>
                    </TouchableOpacity>
                  )
                })
              }
            </ScrollView>

            {
              !loaded &&
              <Spinner/>
            }

          </View>

        </View>

        <View style={styles.footer}>
          <Button style={{width: 100}}
                  onPress={this.props.navigation.navigate.bind(this, 'Home')}
          >主页</Button>
          <Icon
            name="camera_1"
            style={{padding: 3}}
            iconStyle={{width: 40, height: 34}}
            onPress={this.handleCamClick.bind(this)}
          />
          <Button
            style={{width: 100}}
            onPress={this.handleQuery.bind(this)}
          >发票列表</Button>
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
  queryContainer: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15
  },
  queryItem: {
    flexDirection: 'row',
    marginBottom: 10
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
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    height: Dimensions.get('window').height - 260
  },
  scrollview: {
    flex: 1
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  lineNumber: {
    width: 50,
    paddingVertical: 12,
    paddingHorizontal: 8,
    textAlign: 'center'
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8
  },
  checkbox: {
    width: 25,
    marginTop: 10,
    marginLeft: 5
  },
  footer: {
    marginTop: 15,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'space-between'
  }
});

export default InvoiceList;