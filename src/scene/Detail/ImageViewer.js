import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import Icon from '../../component/icon';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class InvoiceImage extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      images: null
    };
  }
  componentDidMount(){
    const {params} = this.props.navigation.state;
    this.setState({
      images: params.images
    });
  }
  handleClose(){
    this.props.navigation.goBack();
  }
  render(){
    let {images} = this.state;
    return (
      images ?
      <View style={styles.container}>
        <ImageViewer imageUrls={images}/>
        <Icon name="close"
              size="large"
              style={styles.close}
              onPress={this.handleClose.bind(this)}
        />
      </View> :
      <Text></Text>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  close: {
    position: 'absolute',
    left: 10,
    top: 10
  }
});