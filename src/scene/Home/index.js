import React, {PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import Toast from 'react-native-root-toast';

import fetch from '../../service/fetch';
import api from '../../service/api';

import Icon from '../../component/icon';
import Header from '../../component/header';
import Button from '../../component/button';
import ButtonGroup from '../../component/buttongroup';
import PercentageCircle from '../../component/percentagecircle';

class Home extends PureComponent {

  static navigationOptions = ({navigation}) => ({
    title: "主页",
    headerTintColor: "#fff",
    headerLeft: null,
    headerRight: (
      <Text style={{color: "#fff"}}>欢迎{/*{navigation.state.params.user}*/}</Text>
    ),
    headerStyle: styles.header
  });

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };

    let that = this;

    this.buttonItems = [
      {
        text: "当天",
        handler: function(i) {
          that.setIndex(i);
        }
      },
      {
        text: "7天",
        handler: function(i) {
          that.setIndex(i);
        }
      },
      {
        text: "30天",
        handler: function(i) {
          that.setIndex(i);
        }
      },
      {
        text: "全部",
        handler: function(i) {
          that.setIndex(i);
        }
      }];
  }

  componentWillMount(){
    //this.props.navigation.navigate("Login");
  }

  setIndex(i){
    this.setState({
      activeIndex: i
    });
  }

  handleCamClick(){
    this.props.navigation.navigate('Camera');
  }

  handleSetPress(){
    this.props.navigation.navigate('MyInfo');
  }

  render() {
    let {activeIndex} = this.state;
    return (
      <View style={styles.container}>
        <Header
          left={(
            <Icon name="setting" onPress={this.handleSetPress.bind(this)}/>
          )}
          right="欢迎xxx"
        >
          主页
        </Header>
        <View style={styles.topMain}>
          <Text style={styles.title}>发票上传情况</Text>
          <View style={styles.topWrap}>
            <View style={styles.circle}>
              <PercentageCircle radius={50} percent={85} color={"#3498db"}/>
            </View>
            <View style={styles.buttonGroupWrap}>
              <ButtonGroup activeIndex={activeIndex} vertical={true} items={this.buttonItems} size="small"/>
            </View>
          </View>
        </View>

        <View style={styles.entrance}>
          <Text style={styles.title}>快速入口</Text>
          <View style={styles.buttonItem}>
            <View style={styles.buttonWrap}>
              <Button style={styles.button}>四要素更新</Button>
            </View>
            <View style={styles.buttonWrap}>
              <Button style={styles.button}>补出库单</Button>
            </View>
          </View>
          <View style={styles.buttonItem}>
            <View style={styles.buttonWrap}>
              <Button style={styles.button}>无法识别</Button>
            </View>
            <View style={styles.buttonWrap}>
              <Button style={styles.button}>7天未找到</Button>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button style={{width: 100}}>主页</Button>
          <Icon
            name="camera_1"
            style={{padding: 3}}
            iconStyle={{width: 40, height: 34}}
            onPress={this.handleCamClick.bind(this)}
          />
          <Button
            style={{width: 100}}
            onPress={this.props.navigation.navigate.bind(this, 'InvoiceList')}
          >
            发票列表
          </Button>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  header: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#c00000'
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
    height: 60
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