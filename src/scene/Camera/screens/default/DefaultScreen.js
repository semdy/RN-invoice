/**
 * Created by marno on 2017/4/13
 * Function:
 * Desc:
 */
import React, {Component} from "react";
import {Text} from "react-native";
import Toast from 'react-native-root-toast';
import {QRScannerView} from '../../../../component/qrscanner';

export default class DefaultScreen extends Component {
    render() {
        return (

            < QRScannerView
                onScanResultReceived={this.barcodeReceived.bind(this)}
                renderTopBarView={() => this._renderTitleBar()}
                renderBottomMenuView={() => this._renderMenu()}
            />
        )
    }

    _renderTitleBar(){
        return(
            <Text
                style={{color:'white',textAlignVertical:'center', textAlign:'center',font:20,padding:12}}
            >这里添加标题</Text>
        );
    }

    _renderMenu() {
        return (
            <Text
                style={{color:'white',textAlignVertical:'center', textAlign:'center',font:20,padding:12}}
            >这里添加底部菜单</Text>
        )
    }

    barcodeReceived(e) {
        Toast.show('Type: ' + e.type + '\nData: ' + e.data);
        //console.log(e)
    }
}
