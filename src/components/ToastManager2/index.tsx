import React, { useEffect, useState } from 'react'
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

import { Colors } from '../../config/theme'
import defaultProps from '../../utils/defaultProps'
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

export default function ToastManager2(props: Props) {
  props = {
    animationIn: props.animationIn || defaultProps.animationIn,
    animationStyle: props.animationStyle || defaultProps.animationStyle,
    animationOut: props.animationOut || defaultProps.animationOut,
    animationInTiming:
      props.animationInTiming || defaultProps.animationInTiming,
    animationOutTiming:
      props.animationOutTiming || defaultProps.animationOutTiming,
    backdropTransitionOutTiming:
      props.backdropTransitionOutTiming ||
      defaultProps.backdropTransitionOutTiming,
    backdropTransitionInTiming:
      props.backdropTransitionInTiming ||
      defaultProps.backdropTransitionInTiming,
    backdropColor: props.backdropColor || defaultProps.backdropColor,
    backdropOpacity: props.backdropOpacity || defaultProps.backdropOpacity,
    duration: props.duration || defaultProps.duration,
    end: props.end || defaultProps.end,
    hasBackdrop: props.hasBackdrop || defaultProps.hasBackdrop,
    position: props.position || defaultProps.position,
    positionValue: props.positionValue || defaultProps.positionValue,
    width: props.width || defaultProps.width,
    height: props.height || defaultProps.height,
    theme: props.theme || defaultProps.theme,
  }
  const [state, setState] = useState({
    isShow: false,
    text: '',
    opacityValue: new Animated.Value(1),
    barWidth: new Animated.Value(RFPercentage(32)),
    barColor: Colors.default,
    icon: 'checkmark-circle',
    position: props.position,
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
    duration: defaultProps.duration,
    oldDuration: defaultProps.duration,
  })

  const [timer, setTimer] = useState(0)
  //  @ts-ignore
  function show(
    text = '',
    barColor = Colors.default,
    icon: string,
    position: string
  ) {
    setState({
      ...state,
      //  @ts-ignore
      barWidth: props.width,
      isShow: true,
      duration: props.duration || defaultProps.duration,
      text,
      barColor,
      icon,
    })

    if (position) setState({ ...state, position })

    if (props.duration !== props.end) onClose(props.duration)
  }

  function onTouchEnd() {
    setState({ ...state, duration: state.oldDuration, oldDuration: 0 })
    Animated.timing(state.barWidth, {
      toValue: 0,
      duration: state.duration,
      useNativeDriver: false,
    }).start()
  }

  function onTouchStart() {
    setState({ ...state, oldDuration: state.duration, duration: 10000 })

    Animated.timing(state.barWidth, {
      toValue: 0,
      useNativeDriver: false,
    }).stop()
  }

  function onHandleBar() {
    Animated.timing(state.barWidth, {
      toValue: 0,
      duration: state.duration,
      useNativeDriver: false,
    }).start()
  }

  function onResetAll() {
    clearTimeout(timer)
  }

  function onHideToast() {
    onResetAll()
    setState({ ...state, isShow: false })

    if (!isShow && !state.isShow) return
  }

  function onPosition() {
    if (state.position === 'top') return props.positionValue
    if (state.position === 'center') return height / 2 - RFPercentage(9)
    return height - props.positionValue - RFPercentage(10)
  }

  function onClose(durationProps?: number) {
    if (!state.isShow) return
    onResetAll()

    const timeOut = setTimeout(() => {
      setState({ ...state, isShow: false })
    }, durationProps || state.duration)
    //  @ts-ignore
    setTimer(timeOut)
  }

  const {
    isShow,
    animationStyle: stateAnimationStyle,
    barColor,
    icon,
    text,
    barWidth,
  } = state
  //  @ts-ignore
  useEffect(() => {
    onHandleBar()
  }, [])

  return (
    <Modal
      animationIn={
        props.animationIn ||
        stateAnimationStyle[props.animationStyle].animationIn
      }
      animationOut={
        props.animationOut ||
        stateAnimationStyle[props.animationStyle].animationOut
      }
      backdropTransitionOutTiming={props.backdropTransitionOutTiming}
      backdropTransitionInTiming={props.backdropTransitionInTiming}
      animationInTiming={props.animationInTiming}
      animationOutTiming={props.animationOutTiming}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      swipeDirection={['up', 'down', 'left', 'right']}
      onSwipeComplete={onHideToast}
      onModalHide={onResetAll}
      isVisible={isShow}
      coverScreen={false}
      backdropColor={props.backdropColor}
      backdropOpacity={props.backdropOpacity}
      hasBackdrop={props.hasBackdrop}
      style={styles.modalContainer}
    >
      <View
        style={[
          styles.mainContainer,
          {
            width: props.width,
            height: props.height,
            backgroundColor: Colors[props.theme].back,
            top: onPosition(),
          },
        ]}
      >
        <TouchableOpacity
          onPress={onHideToast}
          activeOpacity={0.9}
          style={styles.hideButton}
        >
          <Icon
            name='ios-close-outline'
            size={22}
            color={Colors[props.theme].text}
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <Icon
            name={icon}
            size={22}
            color={barColor}
            style={styles.iconWrapper}
          />
          <Text style={[styles.textStyle, { color: Colors[props.theme].text }]}>
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
