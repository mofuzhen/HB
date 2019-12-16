import React,{Component} from 'react'
import {View,Text,StyleSheet,Dimensions,TextInput,Alert} from 'react-native'
const {width} =Dimensions.get('window')
import {requests} from '../../../http'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default class ComponentInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            date:"2016-05-15",
            value:'请提前电话联系',
            signId:1
        }
        this.submit=this.submit.bind(this)
    }
    onChangeText(text){
        this.setState({
            value:text
        })
    }
    submit(){
        const {signId} =this.state;
        requests.post('/gzapi/order/update',{id:`${signId}`,status:2,stime:'2017-9-6'}).then(res=>{
            console.log(res);
            const {code}=res
            if(code==0){
                // Alert.alert('请求成功')
                this.props.navigation.navigate('details')
            }else {
                Alert.alert('请求失败')
            }
        }).catch(err=>{
           console.log(err);
        })
    }
    componentDidMount(){
        const {signId} =this.props.navigation.state.params
        this.setState({
            signId:signId
        })
        console.log(signId)
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.times}>
                    <Text style={{fontSize:15,marginTop:13}}>
                        服务时间：
                    </Text>
                    
                </View>
                <View style={styles.remark}>
                    <Text style={{fontSize:15,marginTop:10}}>
                        备注说明：
                    </Text>
                    <TextInput 
                        onChangeText={text =>this.onChangeText(this,text)}
                        style={{ height: 40, borderColor: 'gray',
                            borderWidth: 1,marginLeft:width*0.07,width:width*0.5,
                            textAlign:'right',borderWidth:0,fontSize:14
                        }}
                        value={this.state.value}
                        numberOfLines={1}
                    />
                    <Text style={{fontSize:17,marginRight:width*0.02,marginTop:10}}>></Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={this.submit()}>
                    <Text 
                        style={styles.submit}
                        
                    >提交</Text>
                </TouchableOpacity>  
            </View>
        )
    }
}

const styles=StyleSheet.create({    
    container: {
        marginTop:20,
        paddingLeft:width*0.06,
        paddingRight:width*0.06
    },  
    times:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingTop:20,
        paddingBottom:10,
        borderBottomColor:'#CFCFCF',
        borderBottomWidth:2
    },
    remark: {
        flexDirection:'row',
        justifyContent:'space-between',
        paddingTop:40,
        paddingBottom:10,
        borderBottomColor:'#CFCFCF',
        borderBottomWidth:2,
    
    },
    button: {
        marginTop:80,
        paddingLeft:width*0.05,
        paddingRight:width*0.05
    },
    submit: {
        paddingTop:12,
        paddingBottom:12,
        backgroundColor:"rgb(90, 162, 70)",
        textAlign:'center',
        borderRadius:5,
        color:'white',
        fontSize:16
    }
}) 