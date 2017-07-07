import React, {PropTypes, PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';

class ButtonGroup extends PureComponent {
  constructor(props){
    super(props);
  }
  render() {
    let {activeIndex, items, size, vertical} = this.props;
    return (
        <View
          style={[styles.buttonWrap, vertical ? {} : {flexDirection: 'row',}]}
        >
          {
            items.map((item, i) => {
              return (
                <TouchableWithoutFeedback
                  key={i}
                  style={{width: vertical ? "100%" : 1/items.length*100 + "%"}}
                  onPress={item.handler.bind(this, i, item)}
                >
                  <View
                    style={[styles.button, styles[size], activeIndex === i && styles.selected, i !== 0 && (vertical ? styles.nextButtonsV : styles.nextButtonsH), i === 0 && (vertical ? styles.firstButtonV : styles.firstButtonH), (i === items.length - 1) && (vertical ? styles.lastButtonV : styles.lastButtonH) ]}
                  >
                    <Text style={[styles.text, activeIndex === i && styles.textSelected]}>
                      {
                        item.text
                      }
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrap: {
    justifyContent: 'center'
  },
  button: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: '#38adff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  normal: {
    height: 38
  },
  large: {
    height: 42
  },
  small: {
    height: 26
  },
  nextButtonsH: {
    marginLeft: -1
  },
  nextButtonsV: {
    marginTop: -1
  },
  firstButtonH: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  },
  lastButtonH: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },
  firstButtonV: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  lastButtonV: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  disabled: {
    backgroundColor: '#ccc'
  },
  selected: {
    backgroundColor: '#38adff'
  },
  text: {
    color: '#444',
    fontSize: 14
  },
  textSelected: {
    color: "#fff"
  }
});

ButtonGroup.defaultProps = {
  activeIndex: 0,
  items: [],
  size: 'normal',
  vertical: false
};

ButtonGroup.propTypes = {
  activeIndex: PropTypes.number,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      handler: PropTypes.func
    })
  ),
  size: PropTypes.string,
  vertical: PropTypes.bool
};

export default ButtonGroup;