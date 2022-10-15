import React, { Component } from 'react'
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Modal, { ModalProps } from 'react-native-modal'
import { RFPercentage } from 'react-native-responsive-fontsize'
import Icon from 'react-native-vector-icons/Ionicons'

import { Colors } from '../config/theme'
import defaultProps from '../utils/defaultProps'
import styles from './styles'

const { height } = Dimensions.get('window')

interface Props {
  animationIn: ModalProps['animationIn']
  animationStyle: 'upInUpOut' | 'rightInOut' | 'zoomInOut'
  animationOut: ModalProps['animationOut']
  animationInTiming: ModalProps['animationInTiming']
  animationOutTiming: ModalProps['animationOutTiming']
  backdropTransitionOutTiming: ModalProps['backdropTransitionOutTiming']
  backdropTransitionInTiming: ModalProps['backdropTransitionInTiming']
  backdropColor: ModalProps['backdropColor']
  backdropOpacity: ModalProps['backdropOpacity']
  duration?: number
  end?: number
  hasBackdrop: ModalProps['hasBackdrop']
  height: number
  position?: string
  positionValue: number
  theme: 'light' | 'dark'
  style?: {}
  width: number
}

interface State {
  isShow: boolean
  text: string
  opacityValue: Animated.Value
  barWidth: Animated.Value
  barColor: string
  icon: string
  position: string | undefined
  duration?: number
  oldDuration?: number
  animationStyle: {
    upInUpOut: {
      animationIn: string
      animationOut: string
    }
    rightInOut: {
      animationIn: string
      animationOut: string
    }
    zoomInOut: {
      animationIn: string
      animationOut: string
    }
  }
}

class ToastManager extends Component<Props, State> {
  // @ts-ignore
  static __singletonRef: ToastManager

  static defaultProps: {
    animationInTiming: number
    animationOutTiming: number
    backdropTransitionInTiming: number
    backdropTransitionOutTiming: number
    animationIn: string
    animationOut: string
    animationStyle: string
    hasBackdrop: boolean
    backdropColor: string
    backdropOpacity: number
    theme: string
    width: number
    height: number
    style: {}
    position?: string
    positionValue: number
    end: number
    duration: number
  }
  constructor(props: Props) {
    super(props)
    ToastManager.__singletonRef = this
  }

  state = {
    isShow: false,
    text: '',
    opacityValue: new Animated.Value(1),
    barWidth: new Animated.Value(RFPercentage(32)),
    barColor: Colors.default,
    icon: 'checkmark-circle',
    position: this.props.position,
    animationStyle: {
      upInUpOut: {
        animationIn: 'slideInDown',
        animationOut: 'slideOutUp',
      },
      rightInOut: {
        animationIn: 'slideInRight',
        animationOut: 'slideOutRight',
      },
      zoomInOut: {
        animationIn: 'zoomInDown',
        animationOut: 'zoomOutUp',
      },
    },
  }

  static info = (text: string, position?: string) => {
    ToastManager.__singletonRef?.show(
      text,
      Colors.info,
      'ios-information-circle',
      position
    )
  }

  static success = (text: string, position?: string) => {
    ToastManager.__singletonRef?.show(
      text,
      Colors.success,
      'checkmark-circle',
      position
    )
  }

  static warn = (text: string, position: string) => {
    ToastManager.__singletonRef?.show(text, Colors.warn, 'warning', position)
  }

  static error = (text: string, position: string) => {
    ToastManager.__singletonRef?.show(
      text,
      Colors.error,
      'alert-circle',
      position
    )
  }

  show = (
    text = '',
    barColor = Colors.default,
    icon: string,
    position?: string
  ) => {
    const { duration } = this.props

    this.state.barWidth.setValue(this.props.width)

    this.setState({
      isShow: true,
      duration,
      text,
      barColor,
      icon,
    })
    if (position) this.setState({ position })
    //  @ts-ignore
    this.isShow = true
    if (duration !== this.props.end) this.close(duration)
  }

  close = (duration?: number) => {
    //  @ts-ignore
    if (!this.isShow && !this.state.isShow) return
    this.resetAll()
    //  @ts-ignore
    this.timer = setTimeout(() => {
      this.setState({ isShow: false })
      //  @ts-ignore
    }, duration || this.state.duration)
  }

  position = () => {
    const { position } = this.state
    if (position === 'top') return this.props.positionValue
    if (position === 'center') return height / 2 - RFPercentage(9)
    return height - this.props.positionValue - RFPercentage(10)
  }

  handleBar = () => {
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      //  @ts-ignore
      duration: this.state?.duration,
      useNativeDriver: false,
    }).start()
  }

  pause = () => {
    //  @ts-ignore
    this.setState({ oldDuration: this.state.duration, duration: 10000 })
    //  @ts-ignore
    Animated.timing(this.state.barWidth).stop()
  }

  resume = () => {
    //  @ts-ignore
    this.setState({ duration: this.state.oldDuration, oldDuration: 0 })
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      //  @ts-ignore
      duration: this.state.duration,
      useNativeDriver: false,
    }).start()
  }

  hideToast = () => {
    this.resetAll()
    this.setState({ isShow: false })
    //  @ts-ignore
    this.isShow = false
    //  @ts-ignore
    if (!this.isShow && !this.state.isShow) return
  }

  resetAll = () => {
    //  @ts-ignore
    clearTimeout(this.timer)
  }

  render() {
    this.handleBar()
    const {
      animationIn,
      animationStyle,
      animationOut,
      backdropTransitionOutTiming,
      backdropTransitionInTiming,
      animationInTiming,
      animationOutTiming,
      backdropColor,
      backdropOpacity,
      hasBackdrop,
      width,
      height,
      style,
      theme,
    } = this.props

    const {
      isShow,
      animationStyle: stateAnimationStyle,
      barColor,
      icon,
      text,
      barWidth,
    } = this.state

    return (
      <Modal
        animationIn={
          animationIn || stateAnimationStyle[animationStyle].animationIn
        }
        animationOut={
          animationOut || stateAnimationStyle[animationStyle].animationOut
        }
        backdropTransitionOutTiming={backdropTransitionOutTiming}
        backdropTransitionInTiming={backdropTransitionInTiming}
        animationInTiming={animationInTiming}
        animationOutTiming={animationOutTiming}
        onTouchEnd={this.resume}
        onTouchStart={this.pause}
        swipeDirection={['up', 'down', 'left', 'right']}
        onSwipeComplete={this.hideToast}
        onModalHide={this.resetAll}
        isVisible={isShow}
        coverScreen={false}
        backdropColor={backdropColor}
        backdropOpacity={backdropOpacity}
        hasBackdrop={hasBackdrop}
        style={styles.modalContainer}
      >
        <View
          style={[
            styles.mainContainer,
            {
              width,
              height,
              backgroundColor: Colors[theme].back,
              top: this.position(),
              ...style,
            },
          ]}
        >
          <TouchableOpacity
            onPress={this.hideToast}
            activeOpacity={0.9}
            style={styles.hideButton}
          >
            <Icon
              name='ios-close-outline'
              size={22}
              color={Colors[theme].text}
            />
          </TouchableOpacity>
          <View style={styles.content}>
            <Icon
              name={icon}
              size={22}
              color={barColor}
              style={styles.iconWrapper}
            />
            <Text style={[styles.textStyle, { color: Colors[theme].text }]}>
              {text}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[{ width: barWidth, backgroundColor: barColor }]}
            />
          </View>
        </View>
      </Modal>
    )
  }
}

ToastManager.defaultProps = defaultProps

export default ToastManager
