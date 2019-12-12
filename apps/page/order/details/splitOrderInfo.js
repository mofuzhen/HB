import React,{Component} from 'react'
import {View,Text,StyleSheet,Dimensions} from 'react-native'
const {width} =Dimensions.get('window')

export default class ComponentInfo extends Component{
    constructor(props){
        super(props);
        this.state={

        }
        // this.getServiceNumber=this.getServiceNumber.bind(this)
    }
    // getServiceNumber(){
        
    // }
    //跳转到处置方回应页面
    handleInfo(){

    }
    render(){
        return (
            <View style={{marginTop:25,flex:1}}>
                <View style={styles.infomation}>
                    <Text style={[styles.infomation_item,{fontWeight:'bold',fontSize:16}]}>
                        {/* 服务单号: {this.getServiceNumber()} */}
                        服务单号：SN201910231034347023
                    </Text>
                    <Text style={styles.infomation_item}>
                        订单编号：2
                    </Text>
                    <Text style={styles.infomation_item}>
                        处置信息：负责组装生成配套
                    </Text>
                    <Text style={styles.infomation_item}>
                        需求企业：国顺废金属回收有限公司
                    </Text>
                    <Text style={styles.infomation_item}>
                        处置地点：江西省赣州市章贡区
                    </Text>
                    <Text style={styles.infomation_item}>
                        请求服务时间：2019-10-09
                    </Text>
                </View>
                <View style={{flex:1,margin:15,alignItems:'center'}}>
                    <Text
                        onPress={()=>this.handleInfo(this)}
                        style={styles.button}
                    >确定</Text>
                </View>
            </View>
            
        )
    }
}

const styles=StyleSheet.create({
    infomation: {
        marginLeft:width*0.04,
        marginRight:width*0.04,
        paddingBottom:15,
        borderBottomWidth:1,
        borderBottomColor:'#333333'
    },
    infomation_item: {
        fontSize:15,
        marginTop:13,
    },
    button: {
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#5AA246',
        color:'white',
        width:100,
        textAlign:'center',
        marginTop:20,
        borderRadius:5,
        flexDirection:'row-reverse',
    }
})