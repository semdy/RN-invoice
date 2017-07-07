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

import fetch from '../../service/fetch';
import api from '../../service/api';

import Toast from 'react-native-root-toast';

class InvoiceList extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      isEditing: false,
      language: 'java'
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

  handleQuery(){

  }

  handleDel(){

  }

  handleCamClick(){
    this.props.navigation.navigate('Camera');
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
                selectedValue={this.state.language}
                onValueChange={(lang) => this.setState({language: lang})}>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
              </Picker>
            </View>
            <View style={[styles.pickerItem, {marginLeft: 10}]}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.language}
                onValueChange={(lang) => this.setState({language: lang})}>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
              </Picker>
            </View>
          </View>

          <View style={styles.listViewContainer}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.lineNumber}>序号</Text>
              <Text style={styles.tableCell}>发票</Text>
              <Text style={styles.tableCell}>状态</Text>
            </View>
            <ScrollView styles={styles.scrollview}>
              <TouchableOpacity
                style={styles.tableRow}
                activeOpacity={0.7}
                onPress={this.props.navigation.navigate.bind(this, 'Detail')}>
                <CheckBox
                  style={styles.checkbox}
                  onClick={()=>{}}
                  isChecked={true}
                />
                <Text style={styles.lineNumber}>1</Text>
                <Text style={styles.tableCell}>887988278</Text>
                <Text style={styles.tableCell}>查询中</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tableRow}
                activeOpacity={0.7}
                onPress={this.props.navigation.navigate.bind(this, 'Detail')}>
                <CheckBox
                  style={styles.checkbox}
                  onClick={()=>{}}
                  isChecked={false}
                />
                <Text style={styles.lineNumber}>1</Text>
                <Text style={styles.tableCell}>887988278</Text>
                <Text style={styles.tableCell}>查询中</Text>
              </TouchableOpacity>
            </ScrollView>
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
          <Button style={{width: 100}}>发票列表</Button>
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