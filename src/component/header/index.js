import React, {PropTypes, PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

class Header extends PureComponent {
  render() {
    let {left, right, children, textStyle} = this.props;
    return (
      <View style={styles.header}>
        {
          typeof children === 'string' ?
            <Text style={styles.center}>
              {
                children
              }
            </Text> :
            <View>
              {children}
            </View>
        }
        <View style={styles.left}>
          {
            typeof left === 'string' ?
              <Text style={[styles.text, textStyle]}>{left}</Text> :
              left
          }
        </View>
        <View style={styles.right}>
          {
            typeof right === 'string' ?
              <Text style={[styles.text, textStyle]}>{right}</Text> :
              right
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    paddingLeft: 12,
    paddingRight: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c00000',
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOpacity: 0.25,
    elevation: 6,
    shadowOffset: {width: 0, height: 0}
  },
  center: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff'
  },
  text: {
    color: "#fff"
  },
  left: {
    position: 'absolute',
    left: 8,
    top: 8
  },
  right: {
    position: 'absolute',
    right: 10,
    top: 8
  }
});

Header.defaultProps = {
  left: "",
  right: "",
  textStyle: {}
};

Header.propTypes = {
  left: PropTypes.any,
  right: PropTypes.any,
  textStyle: PropTypes.any
};

export default Header;