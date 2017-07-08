import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';

import Button from '../../component/button';
import FormItem from '../../component/formitem';
import {login} from '../../service/auth';

import Toast from 'react-native-root-toast';

class Login extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      isLogining: false
    };
  }

  handleClick(){
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    if( !username ) return Toast.show("请输入用户名");
    if( !password ) return Toast.show("请输入密码");
    this.setState({
      isLogining: true
    });
    login(username, password).then(res => {
      this.props.navigation.navigate('Home', res);
    }, errMsg => {
      Toast.show(errMsg);
      this.setState({
        isLogining: false
      });
    });
  }

  render() {
    let {isLogining} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.loginWrap}>
          <Image source={require('../../img/logo.png')} style={styles.logo}/>
          <FormItem ref="username" label="用户名" placeholder="请输入用户名"/>
          <FormItem ref="password" label="密码" placeholder="请输入密码" password={true}/>
          <View style={styles.formActions}>
            <Button disabled={isLogining} onPress={this.handleClick.bind(this)}>登录</Button>
          </View>
        </View>
        <Text style={styles.footer}>阙天票据管理系统</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    minHeight: Dimensions.get('window').height,
    backgroundColor: "#fff"
  },
  loginWrap: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: "80%",
    left: -15,
    maxWidth: 320,
    paddingTop: 80
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

export default Login;