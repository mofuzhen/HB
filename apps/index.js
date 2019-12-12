import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Login from "./login"

// type Props = {};
export default class App extends Component {
    render() {
      return (
        <View style={styles.app}>
          <Login/>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    app: {
        flex:1,
        backgroundColor:'white'
    }
  })
 