import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';

import Button from '../../component/button';
import FormItem from '../../component/formitem';
import LinearGradient from 'react-native-linear-gradient';
import {login, session} from '../../service/auth';

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
    login(username, password).then(userinfo => {
      session.set(userinfo);
      this.props.navigation.navigate('Home', userinfo);
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
        <LinearGradient colors={['#0090ff', '#2d72c4']} style={styles.linearGradient}>
          <KeyboardAvoidingView behavior="position">
            <View style={styles.loginWrap}>
              <Text style={styles.mainText}>FACTURA</Text>
              <FormItem
                ref="username"
                style={styles.formitem}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                labelTextStyle={styles.labelTextStyle}
                placeholderTextColor="#888"
                label="用户名"
                placeholder="请输入用户名"
              />
              <FormItem
                ref="password"
                style={styles.formitem}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                labelTextStyle={styles.labelTextStyle}
                placeholderTextColor="#888"
                label="密码"
                placeholder="请输入密码"
                password={true}
              />
              <View style={styles.formActions}>
                <Button
                  disabled={isLogining}
                  onPress={this.handleClick.bind(this)}
                  style={styles.loginButton}
                  textStyle={{fontSize: 16, fontWeight: 'bold'}}
                >
                  登录
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
          <Text style={styles.footer}>
            上海阙天商务信息咨询有限公司
          </Text>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  linearGradient: {
    flex: 1,
    minHeight: Dimensions.get('window').height
  },
  loginWrap: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: "60%",
    maxWidth: 320,
    paddingTop: 60
  },
  mainText: {
    fontSize: 42,
    color: "#fff",
    fontWeight: 'bold',
    marginVertical: 30,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  formitem: {
    flexDirection: 'column',
    marginBottom: 25
  },
  labelStyle: {
    width: '100%',
    justifyContent: 'center'
  },
  labelTextStyle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold'
  },
  inputStyle: {
    flex: 0,
    backgroundColor: "#b1d2f3",
    borderColor: '#d9d9d9'
  },
  formActions: {
    marginTop: 30
  },
  loginButton: {
    borderColor: "#0090ff",
    borderWidth: 2,
    backgroundColor: "#6ea4dd"
  },
  footer: {
    position: "absolute",
    left: 0,
    bottom: 30,
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    color: "#f0f0f0",
    backgroundColor: 'transparent'
  }
});

export default Login;