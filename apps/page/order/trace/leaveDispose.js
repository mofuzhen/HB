import React,{Component} from 'react'
import {View,Text,Dimensions,StyleSheet} from 'react-native'
const {width}=Dimensions.get('window')

export default class Dispose extends Component{
    submit(){
        console.log(1)
    }
    render(){
        return(
            <View style={styles.arrive}>
                <Text style={styles.arrive_context}>
                    相关车辆已离开处置点
                </Text>
                <View style={{marginLeft:width*0.1,marginRight:width*0.1}}>
                    <Text style={styles.button}>
                        确定
                    </Text> 
                </View>
                
            </View>
        )
    }
}

const styles=StyleSheet.create({
    arrive: {
        flex:1
    },
    arrive_context: {
        fontSize:20,
        paddingTop:110,
        paddingBottom:110,
        textAlign:'center'
    },
    button: {
        paddingTop:12,
        paddingBottom:12,
        textAlign:'center',
        fontSize:17,
        backgroundColor:'rgb(90, 162, 70)',
        borderRadius:7,
        color:'white'
    }
})  