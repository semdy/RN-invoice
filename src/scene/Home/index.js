import React, {PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import fetch from '../../service/fetch';
import {session} from '../../service/auth';

import Icon from '../../component/icon';
import Header from '../../component/header';
import Button from '../../component/button';
import ListItem from '../../component/listitem';
import ProgressCircle from 'react-native-progress-circle';
import Spinner from '../../component/spinner';
import Toast from 'react-native-root-toast';

class Home extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      authReady: false,
      activeIndex: 0,
      loaded: false,
      data: {
        sum: 0,
        statusTotal: []
      }
    };
    this.day = 1;
  }

  componentWillMount(){
    session.load().then(res => {
      this.setState({
        authReady: true
      });
      this.doRefresh();
    }, err => {
      this.props.navigation.navigate("Login");
    });
  }

  doRefresh(){
    this.fetchData(this.day);
  }

  fetchData(day){
    this.setState({
      loaded: false
    });
    let params = {customer: session.get().id};
    if( day !== undefined ){
      params.day = day;
    }
    fetch.get("invoiceCount", params).then(data => {
      this.setState({
        data: data,
        loaded: true
      });
    }, err => {
      Toast.show(err);
    });
  }

  handleType(i, value){
    this.day = value;
    this.setState({
      activeIndex: i
    });
    this.fetchData(value);
  }

  handleCamClick(){
    this.props.navigation.navigate('ScanCamera', {mode: 'scanner'});
  }

  handleSetPress(){
    this.props.navigation.navigate('MyInfo');
  }

  handleButtonClick(status, day){
    this.props.navigation.navigate('InvoiceList', {status, day});
  }

  _getValueByStatus(status){
     let result = this.state.data.statusTotal.find((item) => {
       return item.status === status;
     });

     return String(result ? (result.total || 0) : 0);
  }

  _getSuccessCount(data){
    let ret = data.find(item => item.status === 'success');
    if( !ret ) return 0;
    return ret.total;
  }

  render() {
    let {activeIndex, data, loaded, authReady} = this.state;
    return (
      authReady &&
      <View style={styles.container}>
        <Header
          left={(
            <Icon name="setting" onPress={this.handleSetPress.bind(this)}/>
          )}
          right={`欢迎 ${session.get().name}`}
        >
          {session.get().name}
        </Header>
        <View style={styles.page}>
          <View style={styles.topMain}>
            <View style={styles.circle}>
              <ProgressCircle
                percent={data.sum === 0 ? 0 : this._getSuccessCount(data.statusTotal)/data.sum*100}
                radius={50}
                borderWidth={12}
                color="#4472c4"
                shadowColor="#b4c7e7"
                bgColor="#fff"
              >
                <Text style={{fontSize:18}}>{this._getSuccessCount(data.statusTotal) + "/" + data.sum}</Text>
              </ProgressCircle>
            </View>
            <View style={styles.buttonGroupWrap}>
              <Button
                size="small"
                style={[styles.gbutton, activeIndex === 0 && styles.currentButton]}
                onPress={this.handleType.bind(this, 0, 1)}
              >
                当天
              </Button>
              <Button
                size="small"
                style={[styles.gbutton, activeIndex === 1 && styles.currentButton]}
                onPress={this.handleType.bind(this, 1, 7)}
              >
                7天
              </Button>
              <Button
                size="small"
                style={[styles.gbutton, activeIndex === 2 && styles.currentButton]}
                onPress={this.handleType.bind(this, 2, 30)}
              >
                30天
              </Button>
              <Button
                size="small"
                style={[styles.gbutton, activeIndex === 3 && styles.currentButton]}
                onPress={this.handleType.bind(this, 3, "")}
              >
                全部
              </Button>
            </View>
          </View>

          <View style={styles.entrance}>
            <ListItem
              iconName="find"
              text="查询中"
              extraText={this._getValueByStatus("waiting")}
              onPress={this.handleButtonClick.bind(this, "waiting", this.day)}
            />
            <ListItem
              iconName="need-update"
              text="信息需更新"
              extraText={this._getValueByStatus("needChange")}
              onPress={this.handleButtonClick.bind(this, "needChange", this.day)}
            />
            <ListItem
              iconName="list-add"
              text="销货明细需补充"
              extraText={this._getValueByStatus("noSales")}
              onPress={this.handleButtonClick.bind(this, "noSales", this.day)}
            />
            <ListItem
              iconName="file-error"
              text="查询无结果"
              extraText={this._getValueByStatus("failed")}
              onPress={this.handleButtonClick.bind(this, "failed", this.day)}
            />
            <ListItem
              iconName="search-error"
              text="无法识别"
              extraText={this._getValueByStatus("noInvoice")}
              onPress={this.handleButtonClick.bind(this, "noInvoice", this.day)}
            />
          </View>

          <View style={styles.footer}>
            <Icon
              name="refresh"
              size="large"
              style={{marginBottom: 15}}
              onPress={this.doRefresh.bind(this)}
            />
            <TouchableOpacity
              style={styles.cameraWrap}
              onPress={this.handleCamClick.bind(this)}
            >
              <Icon
                name="camera-blue"
                size="large"
              />
            </TouchableOpacity>
            <Icon
              name="detail"
              size="large"
              style={{marginBottom: 15}}
              onPress={this.handleButtonClick.bind(this, "", "")}
            />
          </View>
        </View>
        {
          !loaded &&
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
  page: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 12
  },
  topMain: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 15,
    padding: 15
  },
  circle: {
    width: 120,
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  buttonGroupWrap: {
    width: 70
  },
  gbutton: {
    marginBottom: 2,
    backgroundColor: '#dae3f3'
  },
  currentButton: {
    backgroundColor: "#4472c4"
  },
  entrance: {
    marginBottom: 15
  },
  cameraWrap: {
    width: 80,
    height: 80,
    borderRadius: 150,
    paddingTop: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: -20,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 35,
    paddingRight: 25,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default Home;