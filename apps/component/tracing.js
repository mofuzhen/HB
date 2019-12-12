import React,{Component} from 'react'
import {View,Text,StyleSheet,Dimensions,ScrollView,TouchableOpacity} from 'react-native'
import { Icon, Steps, WingBlank } from '@ant-design/react-native';
import { Geolocation,init,start,stop  } from "react-native-amap-geolocation";
import WebView from 'react-native-webview'
import {requests} from '../http'
const {width,height} =Dimensions.get('window')
const Step = Steps.Step;


export default class Tracing extends Component{
    constructor(props){
        super(props);
        this.state={
            
            service_all:this.props.service_all,
            step:this.props.step,
            step:{},
            serviceTabs:this.props.serviceTabs,
            service_Id:this.props.service_Id, //点击切换服务单tabs即选择的id
            ss_id:this.props.ss_id,//服务单首个id
            // step_all:this.props.step_all,
            // is_finish:1 //某节点是否完成
            step_A:{}, //初次渲染首个服务单id，不是从tabs获取的
            content:[], //当前节点的content内容
            form:[], //当前节点的form内容
            name:'', //节点名称
            latitude:1, //纬度
            longitude:1 //经度
        }
     
    }
    handleMaps(){
        const {service_Id}=this.state
        console.log(service_Id)
        this.props.navigate('map',{
            service_Id:service_Id
        })
    }
    componentWillReceiveProps = (nextProps) => {
        this.setState({
            steps1: nextProps.steps1,
            content:nextProps.content,
            name:nextProps.name,
            form:nextProps.form,
            follow_id:nextProps.follow_id,
            service_Id:nextProps.service_Id
        })    
      }
    geolocationInit = async () => {
        await init({
            ios: "key",
            android: "1037e1ec52892fe447160d638bb64186"
        });
        
        Geolocation.getCurrentPosition(({ coords }) => {
            console.log(coords);
             const latitude=coords.latitude //纬度
            const longitude=coords.longitude //经度
            this.setState({
                latitude:latitude,
                longitude:longitude
            })
          });
        
        Geolocation.addLocationListener(location => {
            console.log(location);
        });
        
        start();
        
        stop();
    }

   

    handleSet(service_all){
        
        console.log(this.props.form)
        console.log(service_all)
        this.props.navigate('dispose',{
            title:this.props.name,
            content:this.props.content,
            form:this.props.form,
            follow_id:this.props.follow_id, //处置跟踪id
            latitude:this.state.latitude,
            longitude:this.state.longitude

        });

    }
    // getCurrentDispose(service_Id){
        
    //         console.log(service_Id)
    //         if(service_Id){
    //                 requests.get(`/gzapi/follow/current?id=${service_Id}`).then(res=>{
    //                     console.log(res)
    //                 const step=res.data.step;
    //                 this.setState({
    //                     step:step
    //                 })
    //             })
    //             .catch(err=>{
    //                 console.log(err)
    //             })
    //         }   
    // }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            service_all:nextProps.service_all
        })
        // this.setState({
        //     service_Id:nextProps.service_Id
        // })
        // const service_Id=this.state.service_Id
        // this.getCurrentDispose(service_Id)
    }
    componentDidMount(){
        this.geolocationInit()
        // Geolocation.start();   //开始定位
        // Geolocation.stop();   //获取到定位后需要手动关闭，持续定位ios审核不过
        // Geolocation.getLastLocation()   //获取最后一次定位的位置
        const service_all=this.state.service_all
        const serviceTabs=this.state.serviceTabs
        // let step_all=[];
        // for(let item of service_all){
        //     console.log(item)
        //     const is_finish=item.is_finish;
        //     if(is_finish==1){
        //         is_finish='wait'
        //     }
        //     if(is_finish==2){
        //         is_finish='finish'
        //     }
        //     this.setState({
        //         is_finish:is_finish
        //     })
        //     const name=item.step.name
        //     console.log(name)
        //     // const form=JSON.parse(item.step.form)
        //     step_all.push({name:name,status:is_finish})
        //     console.log(step_all)
        //     this.setState({
        //         steps1:step_all
        //     })
        // }

        const {ss_id} =this.state;
        console.log(ss_id)
        requests.get(`/gzapi/follow/current?id=${ss_id}`).then(res=>{
            console.log(res)
        const step=res.data.step;
        this.setState({
            step_A:step
        })
    })
    .catch(err=>{
        console.log(err)
    }) 

        
    }  
    render(){
        console.log(this.state.service_Id)
        console.log(this.state.longitude)
        console.log(this.state.latitude)
        const service_all =this.state.service_all;
        console.log(service_all);   
        // const steps1=this.state.step;
        // console.log(steps1);
        console.log(this.props.steps1)
        // const {is_finish}=this.state
        // console.log(is_finish)
        return(
                <View style={styles.tracing}>
                <View style={styles.tracing_context}> 
                    <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:width*0.05}}>
                        <Text style={styles.text}>
                            最新状态：开始处置
                        </Text>
                        <Text 
                            style={styles.button}
                            onPress={()=>this.handleSet(service_all)}
                            >   
                            设置
                        </Text>
                    </View>
                    <Text style={styles.text}>
                        处置企业：
                    </Text>
                    <Text style={styles.text}>
                        处置商品：
                    </Text>
                    <Text style={styles.text}>
                        处置地点：
                    </Text>
                    <Text style={styles.text}>
                        处置方式：
                    </Text>
                </View>
                <View style={{position:'relative'}}>
                    
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={{height:height*0.6}}
                            >
                            <View style={{ marginTop: 30}}>
                                <WingBlank size="lg">
                                    <Steps size="lg">
                                        {this.props.steps1.map((item, index) => (
                                            <Step
                                            key={index}
                                            title={
                                                <View>
                                                <Text>title:{item.name}</Text>
                                                </View>
                                            }
                                            description={
                                                <View>
                                                <Text>desc:</Text>
                                                </View>
                                            }
                                            status={item.status}
                                            />
                                        ))}
                                    </Steps>
                                </WingBlank>
                            </View>
                        </ScrollView>
                        <TouchableOpacity 
                            onPress={this.handleMaps.bind(this)} 
                            style={{position:'absolute',right:width*0.06,top:height*0.05}}>
                            <Text 
                            style={{
                                    fontSize:15,borderWidth:1,padding:5,borderTopLeftRadius:30,
                                    borderBottomLeftRadius:30,borderTopRightRadius:30,
                                    borderBottomRightRadius:30,width:75,textAlign:'center',
                                    
                                }}
                                onPress={this.handleMaps.bind(this)}
                            >
                                处置轨迹
                            </Text>
                        </TouchableOpacity>
                </View>
                    
                    
                </View>
                )   
        
    }
}

const styles=StyleSheet.create({
    tracing: {
        
    },
    tracing_context: {
        paddingBottom:15,
        borderBottomColor:'#CCCCCC',
        borderBottomWidth:1,     
        paddingLeft:width*0.06,
    },
    text: {
        marginTop:10,
        // paddingTop:4,
         marginBottom:-4
    },
    button: {
        marginBottom:-12,
        marginTop:10,
        color:'white',
        paddingLeft:25,
        paddingRight:25,
        paddingTop:3,
        paddingBottom:3,
        backgroundColor:'rgb(90, 162, 70)',
        borderRadius:5,
        fontSize:16
    }
})
