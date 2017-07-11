import React, {PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import fetch from '../../service/fetch';
import {session} from '../../service/auth';

import Icon from '../../component/icon';
import Header from '../../component/header';
import Button from '../../component/button';
import ButtonGroup from '../../component/buttongroup';
import ProgressCircle from 'react-native-progress-circle';
import Spinner from '../../component/spinner';
import Toast from 'react-native-root-toast';

class Home extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      loaded: false,
      data: {
        statusTotal: []
      }
    };

    this.day = 1;

    this.buttonItems = [
      {
        text: "当天",
        value: 1
      },
      {
        text: "7天",
        value: 7
      },
      {
        text: "30天",
        value: 30
      },
      {
        text: "全部"
      }];
  }

  componentWillMount(){
    //this.props.navigation.navigate("Login");
    this.fetchData(this.day);
  }

  doRefresh(){
    this.fetchData(this.buttonItems[this.state.activeIndex].value);
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

  handleType(i, item){
    this.day = item.value;
    this.setState({
      activeIndex: i
    });
    this.fetchData(item.value);
  }

  handleCamClick(){
    this.props.navigation.navigate('Camera');
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

     return result ? (result.total || 0) : 0
  }

  render() {
    let {activeIndex, data, loaded} = this.state;
    return (
      <View style={styles.container}>
        <Header
          left={(
            <Icon name="setting" onPress={this.handleSetPress.bind(this)}/>
          )}
          right={`欢迎 ${session.get().name}`}
        >
          主页
        </Header>
        <View style={styles.topMain}>
          <Text style={styles.title}>发票上传情况</Text>
          <View style={styles.topWrap}>
            <View style={styles.circle}>
              <ProgressCircle
                percent={data.statusTotal.length/6*100}
                radius={50}
                borderWidth={4}
                color="#38adff"
                shadowColor="#e3e3e3"
                bgColor="#fff"
              >
                <Text style={{fontSize:18}}>{data.statusTotal.length}/6</Text>
              </ProgressCircle>
            </View>
            <View style={styles.buttonGroupWrap}>
              <ButtonGroup
                activeIndex={activeIndex}
                vertical={true}
                items={this.buttonItems}
                size="small"
                onPress={this.handleType.bind(this)}
              />
            </View>
          </View>
        </View>

        <View style={styles.entrance}>
          <Text style={styles.title}>快速入口</Text>
          <View style={styles.buttonItem}>
            <View style={styles.buttonWrap}>
              <Button style={styles.button}
                      onPress={this.handleButtonClick.bind(this, "needChange", this.day)}
              >
                四要素更新({this._getValueByStatus("needChange")})
              </Button>
            </View>
            <View style={styles.buttonWrap}>
              <Button style={styles.button}
                      onPress={this.handleButtonClick.bind(this, "noSales", this.day)}
              >
                补出库单({this._getValueByStatus("noSales")})
              </Button>
            </View>
          </View>
          <View style={styles.buttonItem}>
            <View style={styles.buttonWrap}>
              <Button style={styles.button}
                      onPress={this.handleButtonClick.bind(this, "noInvoice", this.day)}
              >
                无法识别({this._getValueByStatus("noInvoice")})
              </Button>
            </View>
            <View style={styles.buttonWrap}>
              <Button style={styles.button}
                      onPress={this.handleButtonClick.bind(this, "failed", this.day)}
              >
                7天未查到({this._getValueByStatus("failed")})
              </Button>
            </View>
          </View>
          <Button type="warning"
                  style={styles.buttonCenter}
                  numberOfLines={2}
                  onPress={this.handleButtonClick.bind(this, "waiting", this.day)}
          >
            查询中({this._getValueByStatus("waiting")})
          </Button>
        </View>

        <View style={styles.footer}>
          <Button
            style={{width: 100}}
            onPress={this.doRefresh.bind(this)}
          >主页</Button>
          <Icon
            name="camera_1"
            style={{padding: 3}}
            iconStyle={{width: 40, height: 34}}
            onPress={this.handleCamClick.bind(this)}
          />
          <Button
            activeOpacity={1}
            style={{width: 100}}
            onPress={this.handleButtonClick.bind(this, "", "")}
          >
            发票列表
          </Button>
          {/*<Button
            activeOpacity={1}
            onPress={this.props.navigation.navigate.bind(this, 'Camera2')}
          >
            相机
          </Button>*/}
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
    backgroundColor: "#ffffff"
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 14,
    borderLeftWidth: 4,
    borderColor: "#38adff",
    paddingLeft: 8
  },
  topMain: {
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 25
  },
  topWrap: {
    position: "relative"
  },
  circle: {
    width: 120,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  buttonGroupWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 60
  },
  entrance: {
    position: "relative",
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 15
  },
  buttonItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10
  },
  buttonWrap: {
    width: "50%",
    paddingLeft: 10
  },
  button: {
    height: 70
  },
  buttonCenter: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 86,
    height: 86,
    marginLeft: -40,
    marginTop: -20,
    borderWidth: 6,
    borderColor: '#fff',
    borderRadius: 45
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 25,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 35,
    paddingRight: 25,
    justifyContent: 'space-between'
  }
});

export default Home;