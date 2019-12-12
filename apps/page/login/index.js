import React, {Component} from 'react';
import {StyleSheet, Text, View,Image,TextInput,TouchableOpacity,Dimensions,ScrollView,AsyncStorage,Alert} from 'react-native';
import {requests} from '../../http'
// import '../globalFontSize'
// import AsyncStorage from '@react-native-community/async-storage';

var {width:ScreenWidth,height:ScreenHeight}=Dimensions.get('window')

export default class App extends Component {
    constructor(props){
        super(props);
        this.state={
            mobile:'', //手机号
            pwd:'', //密码
            token: '',
            verifyLoginMobileCode:'', //验证码
            // timeLeft:60,
            onSwitch:0,  //tab切换标识
            startTime:60,   //开始时间
            isShow:true  //显示密码
        }
        // this.navigation = props.navigation;
        // this.onSwitch = this.onSwitch.bind(this);
        this.onSwitchCodeLayout = this.onSwitchCodeLayout.bind(this);
        this._beginCountDown = this._beginCountDown.bind(this); 
        // this.showPassword =this.showPassword.bind(this);
    }  
    //获取登录验证码
    _beginCountDown() {
        // const {mobile}=this.state
        // console.log(mobile)
        if(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(this.state.mobile)){
            //拿到验证码
            if(this.state.startTime == 60){
                var timer = setInterval(()=>{
                   var newstartTime = this.state.startTime - 1; 
                   this.setState({
                     startTime:newstartTime
                   })    
                   if(this.state.startTime == -1){
                     this.setState({
                         startTime:60
                     })
                     clearInterval(timer);
                   }
                },1000)
             }else {
                 return;
             }
            

            requests.get(`/gzapi/sms/login?mobile=${this.state.mobile}`)
            .then(res => {
                console.log(res)
                const {code} = res
                
                   if(code===0){
                    Alert.alert('发送成功')
                    
                    if(code===10002){
                        Alert.alert('参数错误')
                    }
                } 
            })
            
        }
    }
    // tab切换
    onSwitch(onSwitch){
    //    this.setState({
    //         onSwitch:onSwitch,
    //         mobile:'',
            
    //    })
       if(onSwitch==0){
           this.setState({
             onSwitch:onSwitch,
               mobile:'',
               pwd:'',
               isShow:true
           })
        }else{
            this.setState({
                onSwitch:onSwitch,
                mobile:'',
                verifyLoginMobileCode:""
            })
       }
    }
    // tab布局切换
    onSwitchCodeLayout(){
        return (
            this.state.onSwitch == 0 ? 
            <View style={styles.send}>
                <TextInput 
                    style={styles.sendItem}  
                    placeholder="请输入短信验证码"
                    maxLength={4}
                    onChangeText={(text) => {
                        this.setState({ 
                            verifyLoginMobileCode: text  
                        });
                    }}
                    value={this.state.verifyLoginMobileCode}
                />
                <TouchableOpacity
                    onPress={this._beginCountDown.bind(this)}
                    style={{width:90}}
                >
                    <Text 
                    style={styles.sendcode}
                    >
                        {this.state.startTime===60 ? '发送验证码' : this.state.startTime+'秒后重发'}
                    </Text> 
                </TouchableOpacity>     
            </View>  : 
            <View style={styles.send}>
                <TextInput 
                    style={styles.sendItem}
                    placeholder="请输入密码"
                    maxLength={12}
                    minLength={6}
                    secureTextEntry={this.state.isShow}
                    onChangeText={(text) => {
                        this.setState({
                        pwd: text,  
                        })           
                    }}
                    value={this.state.pwd}
                />   
                <TouchableOpacity>
                    <Text 
                        style={styles.sendcode} onPress={()=>this.setState({isShow:false})}
                        >
                        {this.state.pwd? '显示密码': ''}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        return (
            <ScrollView
                contentContainerStyle={{ flex: 1 }} 
            >
                <View style={styles.container}> 
                    <View style={styles.imgs}>
                        <Image style={styles.img} source={require('../../common/image/logo.png')}/>
                    </View>
                    <View style={styles.containerItem}>
                            {/* <TouchableOpacity 
                                style={styles.text}
                                onPress={this.onSwitch}
                            > */}
                        <View 
                            style={styles.text}
                        >
                                <View style={styles.code} >     
                                    <Text 
                                    style={this.state.onSwitch == 0 ? styles.codeItem : styles.code_Item} onPress={()=>{this.onSwitch(0)}}>验证码登录</Text>
                                </View>
                                <View style={styles.password}> 
                                    <Text 
                                    style={this.state.onSwitch == 1 ? styles.codeItem : styles.code_Item} onPress={()=>{this.onSwitch(1)}}>密码登录</Text>
                                </View>
                            {/* </TouchableOpacity> */}
                        </View>
                        <View style={styles.textInput}>
                        <TextInput 
                            style={styles.input} 
                            placeholder="请输入手机号码" 
                            maxLength={11}
                            onChangeText={(text) => {
                                const newText=text.replace(/[^\d]+/, '');
                                this.setState({
                                    mobile: newText
                                },()=>console.log(this.state.mobile));
                            }}
                            value={this.state.mobile}
                         />
                        </View>
                        {/* 验证码登录或密码登录 */}
                        {this.onSwitchCodeLayout()}
                        
                        <View style={styles.button}>
                            <TouchableOpacity 
                            onPress={this.onPressLogin.bind(this)}
                            >
                                <Text 
                                    style={this.state.mobile===''?
                                        (styles.login_not):(styles.login_can)
                                    }
                                >
                                    登录
                                </Text>
                            </TouchableOpacity> 
                        </View>
                    </View>  
                </View>
            </ScrollView>   
        );
    }
    // //登录
    onPressLogin(){
        // this.props.navigation.navigate('businessList')
            if(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(this.state.mobile)){
                if(this.state.verifyLoginMobileCode){    //验证码登录
                    requests.post('/gzapi/stage/login',{
                        mobile:this.state.mobile,
                        verifyLoginMobileCode:this.state.verifyLoginMobileCode
                    })
                    .then(res=>{
                        const {code,data}=res
                        if(code===0){
                            AsyncStorage.setItem('token',data.token);  //缓存token
                        }
                        if(code===10005){
                            Alert.alert('手机验证码错误')
                        }
                    })
                }else if(this.state.pwd){   //密码登录
                    requests.post('/gzapi/stage/ulogin',{mobile:this.state.mobile,pwd:this.state.pwd}).then(res=>{
                        console.log(res);
                        const {code,data}=res
                        if(code==0){
                            console.log(data.token)
                            var that = this
                            // alert('发送成功')
                            // var keyValuePairs  = [['token',data.token]]
                            // AsyncStorage.setItem('token',data.token,  (error) => {
                            //     if (error) {
                            //         alert('存储失败')
                            //     }else {
                            //         alert('存储完成')
                            //         that.props.navigation.navigate('businessList')
                            //     }
                            // })
                            AsyncStorage.setItem('token',data.token)
                            that.props.navigation.navigate('businessList')
                        }
                        if(code===10005){
                            Alert.alert('请输入正确的密码')
                        }
                    }).catch(err=>{
                       console.log(err);
                    })
                }    
            }else{
                requests.post('/gzapi/stage/login',{ mobile:this.state.mobile})
                .then(res=>{
                    const {code}=res;
                    if(code===10005){
                        Alert.alert('请输入正确的手机号码');
                        this.setState({
                            mobile:''
                        })
                    }
                })
            } 

            // axios.post('http://39.104.72.185:7001/gzapi/stage/ulogin',
            // {mobile:this.state.mobile,pwd:this.state.pwd},
            // {
            //     headers: {
            //         'Content-Type': 'application/json;charset=utf-8',
            //                     // token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiIiLCJtb2JpbGUiOiI1IiwiaWF0IjoxNTYzODY1Mzg5fQ.ZNxv5_GYk-JYYBNT1q4El5qmmz-y-QElAsMtKJjlqEY'
            //     }
            // }
            // ).then(res=>{
            //     console.log(res)
            //     const {code}=res.data;
            //     if(code==0){
            //         alert('发送成功')
            //     }
            //     if(code==10005){
            //         alert('请输入正确的手机号码')
            //     }
            // })  
    }
}    

  
const styles = StyleSheet.create({
container: {
    flex:1,
    flexDirection:'column',
    backgroundColor: '#FFFFFF',
},
imgs: {
    flexDirection:'row',
    justifyContent:'center',
    paddingTop:ScreenHeight*0.08,
    paddingBottom:ScreenHeight*0.12
},
img: {
    width:ScreenWidth*0.4,
    height:ScreenHeight*0.15,
    resizeMode:'contain',
},
text: {
    flexDirection:"row",
    borderColor:'#F1F1F1',
    borderBottomWidth:2,
    paddingBottom:2,
    marginLeft:ScreenWidth*0.06,
    marginRight:ScreenWidth*0.06
},
code: {
    borderRightWidth:2,
    borderRightColor:"#F1F1F1",
    marginRight:ScreenWidth*0.04,
    // marginLeft:ScreenWidth*0.04, 
    paddingRight:ScreenWidth*0.06
},
codeItem: {
    color:'#5AA246',
    fontSize:18,
    fontWeight:'bold',
    paddingTop:8,
    paddingBottom:5,
},
code_Item: {
    color:'#333333',
    fontSize:18,
    fontWeight:'bold',
    paddingTop:8,
    paddingBottom:5,
},
password: {
    color:'#000000'
},
textInput: {
    marginLeft:ScreenWidth*0.06,
    marginRight:ScreenWidth*0.06,
    borderBottomColor:"#F1F1F1",
    borderBottomWidth:2
},
input: {
    justifyContent:'center',
    textAlignVertical:'center',
    height:ScreenHeight*0.09,
    fontSize:13,
    color:'#000000',
    paddingVertical: 0
},
send: {
    flexDirection:'row',
    marginLeft:ScreenWidth*0.06,
    marginRight:ScreenWidth*0.06,
    borderBottomColor:"#F1F1F1",
    borderBottomWidth:2,
    height:ScreenHeight*0.09,
    
    // lineHeight:ScreenHeight*0.09,
},
sendItem: {
    justifyContent:'center',
    alignItems:'center',
    fontSize:13,
    color:'#000000',
    width:(ScreenWidth-ScreenWidth*0.06*2-10-16*5),   
    borderRightWidth:1,
    borderRightColor:"#F1F1F1",
    paddingVertical: 0,
    marginTop:10,
    marginBottom:10,
},
sendcode: {
    // paddingTop:15,
    textAlignVertical:'center',
    color:'rgb(90, 162, 70)',
    fontSize:15,
    marginLeft:10,
    // paddingBottom:20,
    height:ScreenHeight*0.09
},
button: {
    // width:ScreenWith*0.9,
    // height:80,
    marginTop:ScreenHeight*0.09
},
login_not: {
    marginLeft:ScreenWidth*0.03,
    marginRight:ScreenWidth*0.03,
    paddingTop:ScreenHeight*0.02,
    paddingBottom:ScreenHeight*0.02,
    fontSize:16,
    color:'#F1F1F1',
    borderWidth:1,
    borderColor:'#BCBCBC',
    backgroundColor:'#DDDDDD',
    borderRadius:5,
    textAlign:'center'
},
login_can:{
    marginLeft:ScreenWidth*0.02,
    marginRight:ScreenWidth*0.02,
    paddingTop:ScreenHeight*0.02,
    paddingBottom:ScreenHeight*0.02,
    fontSize:16,
    color:'#F1F1F1',
    borderWidth:1,
    borderColor:'#BCBCBC',
    backgroundColor:'rgba(90, 162, 70, 1);',
    borderRadius:5,
    textAlign:'center'
}


});