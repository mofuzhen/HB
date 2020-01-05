import React,{Component} from 'react'
import {View,Text,StyleSheet,Dimensions,TextInput,Alert} from 'react-native'
const {width} =Dimensions.get('window')
import {requests} from '../../../http'
import { TouchableOpacity } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default class ComponentInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            // date:"2016-05-15",
            values:'',
            signId:1,
            date: new Date(1598051730000),
            mode: 'date',
            show: false,
        }
        this.submit=this.submit.bind(this)
    }
    onChangeText(text){
        this.setState({
            values:text
        })
    }
    submit(){
        const {signId,values} =this.state;
        requests.post('/gzapi/order/update',{id:`${signId}`,status:2,stime:'2017-9-6',remark:`${values}`}).then(res=>{
            console.log(res);
            const {code}=res
            if(code===0){
                // Alert.alert('请求成功')
                this.props.navigate('details')
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
    //选择时间
    setDate = (event, date) => {
        date = date || this.state.date;
     
        this.setState({
          show: Platform.OS === 'ios' ? true : false,
          date,
        });
      }
     
      show = mode => {
        this.setState({
          show: true,
          mode,
        });
      }
     
      datepicker = () => {
        this.show('date');
      }
    render(){
        const { show, date, mode } = this.state;
        return(
            <View style={styles.container}>
                <View style={styles.times}>
                    <Text style={{fontSize:15,marginTop:13}}>
                        服务时间：
                    </Text>
                    <Text style={{fontSize:15,marginTop:13}}
                        onPress={this.datepicker}
                        testID="dateTimeText"
                        >
                        { mode === 'date' && moment.utc(date).format('YYYY-MM-DD') } 
                    </Text>
                    {   show && <DateTimePicker value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={this.setDate} />
                    }
                </View>
                <View style={styles.remark}>
                    <Text style={{fontSize:15,marginTop:10}}>
                        备注说明：
                    </Text>
                    <TextInput 
                        onChangeText={text =>this.onChangeText(this,text)}
                        style={{ height: 40, borderColor: 'gray',
                            borderWidth: 1,marginLeft:width*0.07,width:width*0.5,
                            textAlign:'right',borderWidth:0,fontSize:14,paddingVertical:0
                        }}
                        placeholder='请提前电话联系'
                        numberOfLines={1}
                    />
                    {/* <Text style={{fontSize:17,marginRight:width*0.02,marginTop:10}}>></Text> */}
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