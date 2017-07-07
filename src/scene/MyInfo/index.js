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

import fetch from '../../service/fetch';
import api from '../../service/api';

import Toast from 'react-native-root-toast';

class MyInfo extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      isEditing: false
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
            <FormItem ref="username" label="用户名" placeholder="请输入用户名"/>
            <FormItem ref="realname" label="真实姓名" placeholder="请输入真实姓名"/>
            <FormItem ref="email" label="邮箱" placeholder="请输入邮箱"/>
            <FormItem ref="tel" label="联系电话" placeholder="请输入联系电话"/>
            <FormItem ref="password" label="新密码" placeholder="请输入新密码" password={true}/>
            <FormItem ref="passwordrm" label="确认密码" placeholder="请输入确认密码" password={true}/>
            <View style={styles.formActions}>
              <Button disabled={isEditing} onPress={this.handleClick.bind(this)}>修改</Button>
            </View>
          </View>
          <Text style={styles.footer}>阙天票据管理系统</Text>
        </ScrollView>
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