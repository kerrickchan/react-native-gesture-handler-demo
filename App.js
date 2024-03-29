import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  YellowBox,
  Platform,
} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBrowserApp } from '@react-navigation/web';
import { createStackNavigator } from 'react-navigation-stack';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import SwipeableTable from './swipeable'; 
import Rows from './rows';
import Multitap from './multitap';
import Draggable from './draggable';
import ScaleAndRotate from './scaleAndRotate';
import PagerAndDrawer from './pagerAndDrawer';
import PanAndScroll from './panAndScroll';
import PanResponder from './panResponder';
import Bouncing from './bouncing';
import HorizontalDrawer from './horizontalDrawer'; 
// import Fling from './fling/index'; // czy ma tak dzialac?
import doubleDraggable from './doubleDraggable';
import ChatHeads from './chatHeads';
import { ComboWithGHScroll, ComboWithRNScroll } from './combo'; 
import BottomSheet from './bottomSheet/index';
import doubleScalePinchAndRotate from './doubleScalePinchAndRotate';
import forceTouch from './forcetouch';
import { TouchablesIndex, TouchableExample } from './touchables';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
]);
// // refers to bug in React Navigation which should be fixed soon
// // https://github.com/react-navigation/react-navigation/issues/3956

const SCREENS = {
  Rows: { screen: Rows, title: 'Table rows & buttons' },
  Multitap: { screen: Multitap },
  Draggable: { screen: Draggable },
  ScaleAndRotate: { screen: ScaleAndRotate, title: 'Scale, rotate & tilt' },
  ScaleAndRotateSimultaneously: {
    screen: doubleScalePinchAndRotate,
    title: 'Scale, rotate & tilt & more',
  },
  PagerAndDrawer: { screen: PagerAndDrawer, title: 'Android pager & drawer' },
  HorizontalDrawer: {
    screen: HorizontalDrawer,
    title: 'Gesture handler based DrawerLayout',
  },
  SwipeableTable: {
    screen: SwipeableTable,
    title: 'Gesture handler based SwipeableRow',
  },
  PanAndScroll: {
    screen: PanAndScroll,
    title: 'Horizontal pan or tap in ScrollView',
  },
  // Fling: {
  //   screen: Fling,
  //   title: 'Flinghandler',
  // },
  PanResponder: { screen: PanResponder },
  Bouncing: { screen: Bouncing, title: 'Twist & bounce back animation' },
  ChatHeads: {
    screen: ChatHeads,
    title: 'Chat Heads (no native animated support yet)',
  },
  Combo: { screen: ComboWithGHScroll },
  BottomSheet: {
    title: 'BottomSheet gestures interactions',
    screen: BottomSheet,
  },
  ComboWithRNScroll: {
    screen: ComboWithRNScroll,
    title: "Combo with RN's ScrollView",
  },
  doubleDraggable: {
    screen: doubleDraggable,
    title: 'Two handlers simultaneously',
  },
  touchables: {
    screen: TouchablesIndex,
    title: 'Touchables',
  },
  forceTouch: {
    screen: forceTouch,
    title: 'Force touch',
  },
};

class MainScreen extends React.Component {
  static navigationOptions = {
    title: '✌️ Gesture Handler Demo',
  };
  render() {
    const data = Object.keys(SCREENS)
      .map(key => {
        const item = SCREENS[key];
        const isDisabled = item.screen.platforms
          ? !item.screen.platforms.includes(Platform.OS)
          : false;
        return { key, title: item.title || key, isDisabled };
      })
      .sort((a, b) => !!a.isDisabled - !!b.isDisabled);

    return (
      <FlatList
        style={styles.list}
        data={data}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={props => (
          <MainScreenItem
            {...props}
            onPressItem={({ key }) => this.props.navigation.navigate(key)}
          />
        )}
        renderScrollComponent={props => <ScrollView {...props} />}
      />
    );
  }
}

const ItemSeparator = () => <View style={styles.separator} />;

class MainScreenItem extends React.Component {
  _onPress = () => this.props.onPressItem(this.props.item);
  render() {
    const { title, isDisabled } = this.props.item;
    return (
      <RectButton
        {...(isDisabled && { pointerEvents: 'none' })}
        style={[styles.button, isDisabled && { opacity: 0.5 }]}
        onPress={this._onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </RectButton>
    );
  }
}

const ExampleApp = createStackNavigator(
  {
    Main: { screen: MainScreen, path: '' },
    ...SCREENS,
    TouchableExample: {
      screen: TouchableExample,
      title: 'Touchables',
    },
  },
  {
    ...Platform.select({
      web: {
        headerMode: 'screen',
      },
      default: {},
    }),
    initialRouteName: 'Main',
  }
);

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#EFEFF4',
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBE0',
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const createApp = Platform.select({
  web: input => createBrowserApp(input, { history: 'hash' }),
  default: input => createAppContainer(input),
});

const defaultNavigator = createSwitchNavigator({
  main: { screen: ExampleApp, path: '' },
});
defaultNavigator.path = '';

export default createApp(defaultNavigator);
