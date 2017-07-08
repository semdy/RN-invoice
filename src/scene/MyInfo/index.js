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
import Toast from 'react-native-root-toast';

class MyInfo extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      isEditing: false
    };
  }

  handleSubmit(){

    let customer = this.refs.customer.value;
    let name = this.refs.name.value;
    let email = this.refs.email.value;
    let phone = this.refs.phone.value;
    let password = this.refs.password.value;
    let passwordrm = this.refs.passwordrm.value;

    if(customer.trim() === "") return Toast.show("用户名不能为空");
    if(name.trim() === "") return Toast.show("真实姓名不能为空");
    if(email.trim() === "") return Toast.show("邮箱不能为空");
    if(!/^.+@.+\..+$/.test(email)) return Toast.show("邮箱不合法");
    if(phone.trim() === "") return Toast.show("手机号不能为空");
    if(!/^1(3|4|5|7|8|9)\d{9}$/.test(phone)) return Toast.show("手机号不合法");
    if(password.trim() === "") return Toast.show("密码不能为空");
    if(passwordrm.trim() === "") return Toast.show("请输入确认密码");
    if(password !== passwordrm) return Toast.show("两次输入的密码不一致");

    this.setState({
      isEditing: true
    });

    fetch.post("upCustomer",
      {
        customer,
        name,
        phone,
        email,
        password
      })
      .then(data => {
        if( data.success ){
          Toast.show("修改成功");
        } else {
          Toast.show("修改失败: " + (data.message || ""));
        }
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

  render() {
    let {isEditing} = this.state;
    return (
      <View style={styles.container}>
        <Header
          left={(
            <Icon name="arrow-left-white" onPress={this.props.navigation.navigate.bind(this,'Home')}/>
          )}
        >
          个人信息
        </Header>
        <ScrollView style={styles.scrollview}>
          <View style={styles.myinfo}>
            <FormItem ref="customer" label="用户名" placeholder="请输入用户名"/>
            <FormItem ref="name" label="真实姓名" placeholder="请输入真实姓名"/>
            <FormItem ref="email" label="邮箱" placeholder="请输入邮箱"/>
            <FormItem ref="phone" label="联系电话" placeholder="请输入联系电话"/>
            <FormItem ref="password" label="新密码" placeholder="请输入新密码" password={true}/>
            <FormItem ref="passwordrm" label="确认密码" placeholder="请输入确认密码" password={true}/>
            <View style={styles.formActions}>
              <Button disabled={isEditing} onPress={this.handleSubmit.bind(this)}>修改</Button>
            </View>
          </View>
          <Text style={styles.footer}>阙天票据管理系统</Text>
        </ScrollView>
        {
          isEditing&&
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
    backgroundColor: "#fff"
  },
  scrollview: {
    flex: 1
  },
  myinfo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: "80%",
    left: -15,
    maxWidth: 320,
    minHeight: Dimensions.get('window').height - 75,
    paddingTop: 60
  },
  logo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 35,
    width: 198,
    height: 93
  },
  formActions: {
    marginLeft: 68,
    marginTop: 10
  },
  footer: {
    position: "absolute",
    left: 0,
    bottom: 40,
    width: '100%',
    textAlign: 'center',
    fontSize: 18
  }
});

export default MyInfo;