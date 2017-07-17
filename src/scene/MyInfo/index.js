import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';

import Icon from '../../component/icon';
import Header from '../../component/header';
import Button from '../../component/button';
import FormItem from '../../component/formitem';
import Spinner from '../../component/spinner';

import fetch from '../../service/fetch';
import {session, logout} from '../../service/auth';
import {confirm} from '../../utils';
import Toast from 'react-native-root-toast';

class MyInfo extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      isEditing: false,
      loaded: false,
      data: {}
    };
  }

  handleSubmit(){

    let name = this.refs.name.value;
    let username = this.refs.username.value;
    let email = this.refs.email.value;
    let phone = this.refs.phone.value;
    let password = this.refs.password.value;
    let passwordrm = this.refs.passwordrm.value;

   /* if(company.trim() === "") return Toast.show("公司名不能为空");
    if(customer.trim() === "") return Toast.show("用户名不能为空");*/
    /*if(email.trim() === "") return Toast.show("邮箱不能为空");*/
    if(email.trim() !== "" && !/^.+@.+\..+$/.test(email)) return Toast.show("邮箱不合法");
    /*if(phone.trim() === "") return Toast.show("手机号不能为空");*/
    if(phone.trim() !== "" && !/^1[345789]\d{9}$/.test(phone)) return Toast.show("手机号不合法");
    /*if(password.trim() === "") return Toast.show("密码不能为空");
    if(passwordrm.trim() === "") return Toast.show("请输入确认密码");*/
    if(password !== passwordrm) return Toast.show("两次输入的密码不一致");

    this.setState({
      isEditing: true
    });

    fetch.post("upCustomer",
      {
        customer: session.get().id,
        name,
        username,
        phone,
        email,
        password
      })
      .then(data => {
        Toast.show(data.message);
        this.setState({
          isEditing: false
        });
    }, err => {
      this.setState({
        isEditing: false
      });
      Toast.show("修改失败: " + err);
    });
  }

  handleLogout(){
    confirm("确定退出并重新登录吗?").then(() => {
      logout().then(() => {
        this.props.navigation.navigate('Login');
      });
    }, () => {});
  }

  componentDidMount(){
    fetch.get("getCustomer", {customer: session.get().id}).then(res => {
      if( res.success ){
        this.setState({
          data: res.data,
          loaded: true
        });
      } else {
        Toast.show("用户信息获取失败");
        this.setState({
          loaded: true
        });
      }
    })
  }

  render() {
    let {isEditing, loaded, data} = this.state;
    return (
      <View style={styles.container}>
        <Header
          left={(
            <Icon name="arrow-left-white" onPress={this.props.navigation.navigate.bind(this,'Home')}/>
          )}
          right={(
              <Text
                style={{color: '#fff'}}
                onPress={this.handleLogout.bind(this)}
              >
                退出
              </Text>
          )}
        >
          用户信息
        </Header>
        <ScrollView style={styles.scrollview}>
          <View style={styles.myinfo}>
            <View style={styles.formWrap}>
              <FormItem
                ref="name"
                label="公司名称"
                placeholder="请输入公司名称"
                style={styles.formitem}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                defaultValue={data.name}
              />
              <FormItem
                ref="username"
                label="用户名"
                placeholder="请输入用户名"
                style={styles.formitem}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                defaultValue={data.username}
              />
              <FormItem
                ref="email"
                label="邮箱"
                placeholder="请输入邮箱"
                style={styles.formitem}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                defaultValue={data.email}
              />
              <FormItem
                ref="phone"
                label="联系电话"
                placeholder="请输入联系电话"
                style={styles.formitem}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                defaultValue={data.phone}
              />
              <FormItem
                ref="password"
                label="新密码"
                placeholder="请输入新密码"
                password={true}
                style={styles.formitem}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
              />
              <FormItem
                ref="passwordrm"
                label="确认密码"
                placeholder="请输入确认密码"
                password={true}
                style={[styles.formitem, styles.noborder]}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
              />
            </View>
            <View style={styles.formActions}>
              <Button
                style={styles.button}
                disabled={isEditing}
                onPress={this.handleSubmit.bind(this)}
              >
                修改信息
              </Button>
            </View>
          </View>
          {/*<Text style={styles.footer}>阙天票据管理系统</Text>*/}
        </ScrollView>
        {
          (isEditing || !loaded)&&
          <Spinner/>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#d3e1fe"
  },
  scrollview: {
    flex: 1
  },
  myinfo: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    minHeight: Dimensions.get('window').height - 85
  },
  formWrap: {
    backgroundColor: '#fff',
    borderRadius: 4
  },
  formitem: {
    marginBottom: 0,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  noborder: {
    borderColor: 'transparent'
  },
  labelStyle: {
    height: 42
  },
  inputStyle: {
    height: 42,
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
  formActions: {
    marginTop: 20
  },
  button: {
    width: '70%',
    maxWidth: 280,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  footer: {
    position: "absolute",
    left: 0,
    bottom: 20,
    width: '100%',
    textAlign: 'center',
    fontSize: 18
  }
});

export default MyInfo;