import React, { Component } from 'react';
import {View,Text,StyleSheet } from 'react-native'
import WebView from 'react-native-webview'
import {requests, _retrieveData} from '../../../http'
// import {} from '../../../http'

export default class Maps extends Component{
    constructor(props){
        super(props);
        this.state={
            Lat:'', //纬度
            Lng:'', //经度
            data:[], //所有坐标集合
            token:'',
            service_Id:''
        }
    }
   
    
    // onMessage = (event) => { 
    //     let data = JSON.parse(event.nativeEvent.data);
    //     console.log("接收到的来自于html5的消息",data);
    //     const Lats=data[0];
    //     const Lngs=data[1];
    //     this.setState({
    //         Lat:Lats,
    //         Lng:Lngs
    //     })
    // }
    getGeolocation(service_Id){
        requests.get(`/gzapi/follow/line?service_id=${service_Id}`).then(res=>{
            console.log(res)
            const data=res.data.rows
            console.log(data)
            this.setState({
                data:data
            })
        }).catch(err=>{
            console.log(err)
        })
    }
    async componentDidMount(){
        const token = await _retrieveData('token')
        const {service_Id}=this.props.navigation.state.params;
        this.setState({
            token:token,
            service_Id:service_Id
        })
        console.log(service_Id)
        this.getGeolocation(service_Id)
    }
     render(){
        // console.log(config)
       const {data}=this.state;
        return(  
            <WebView source={{
                uri:`http://39.104.72.185:7001/gzapi/service/map?id=${this.state.service_Id}&&data=encodeURIComponent(JSON.stringify(data))`,
                headers:{token:this.state.token}
            }}
            ref='webView'
            useWebKit={true}
            onLoadStart={()=>console.log(1)}
            onLoadEnd ={()=>console.log(2)}
            // onLoad={() => {
            //     var data = { token: store.getState().token, id: rwid }
            //      //h5加载完后 向H5发送一些上传图片需要的其它字段比如token  id等等
            //     //  this.refs.webView.postMessage(JSON.stringify(data));
            // }}
            onMessage={this.onMessage}
            javaScriptEnabled={true}
            style={{overflow:'hidden',flex:1}}
            />
        )
    }
};