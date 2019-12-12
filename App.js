/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {TextInput,Text} from 'react-native'
import  StackNavigation from "./apps/navigator/stackNavigation"

//字体不随系统字体变化
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {allowFontScaling: false})
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false})

export default class App extends Component{
  constructor(props){
    super(props);
    
  }  
  render() {
    // console.log("react")
    return (
          <StackNavigation/>
    );
  }
}

