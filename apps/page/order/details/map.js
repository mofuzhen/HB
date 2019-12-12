import React, { Component } from 'react';
import {View,Text,StyleSheet } from 'react-native'
import WebView from 'react-native-webview'
import {requests} from '../../../http'

export default class Maps extends Component{
    constructor(props){
        super(props);
        this.state={
            Lat:'', //纬度
            Lng:'', //经度
            data:[], //所有坐标集合
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
            this.setState({
                data:data
            })
        }).catch(err=>{
            console.log(err)
        })
    }
    componentDidMount(){
        const {service_Id}=this.props.navigation.state.params;
        console.log(service_Id)
        this.getGeolocation(service_Id)
    }
    render(){
       const {data}=this.state;
        return(  
            <WebView source={{uri:'http://192.168.0.117:6060/html/rn-maps.html?data=' +  encodeURIComponent(JSON.stringify(data))}}
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