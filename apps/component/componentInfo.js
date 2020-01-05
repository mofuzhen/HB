import React,{Component} from 'react'
import {View,Text,StyleSheet,Dimensions,Image} from 'react-native'
const {width} =Dimensions.get('window')

export default class ComponentInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            category:1, //需求1 处置2,
            status_fixed:1, //订单固定状态
            signId:1 //订单id
        }
        // this.changeEvent=this.changeEvent.bind(this);
        this.startService=this.startService.bind(this);  

    }
    //是否发起服务
    startService(signId,status_fixed,category){
        if(category==2&&status_fixed==1){
            return  <Text style={styles.service}>
                        (需求方未发起服务请求)
                    </Text> 
        }
        if(category==2&&status_fixed==2){
            return  <Text style={styles.service}>
                        (已发起服务请求)
                    </Text> 
        }
        if(category==2&&status_fixed==2){
            return  <Text style={styles.service}>
                        (等待处置方回应)
                    </Text> 
        }
        if(category==2&&status_fixed==3){
            return  <Text style={styles.service}>
                        (已派单)
                    </Text> 
        }
        // if(category==1&&status_fixed==1){
        //     return  <Text 
        //                 onPress={()=>this.changeEvent(signId)}
        //                 style={styles.first_button}
        //             >
        //                 请求服务
        //             </Text> 
        // }
        if(category==1&&status_fixed==2){
            return  <Text style={styles.service}>
                        (等待处置方回应)
                    </Text> 
        }
        if(category==1&&status_fixed==3){
            return  <Text style={styles.service}>
                        (已派单)
                    </Text> 
        }
        
        //若需求方在服务中、已派单、已完成,则进入追踪页 //但不是在该页面跳转
        // if(category==1&&status_fixed!=1){
        //     this.props.navigation.navigate('trace')
        // }
    }
    // //进入请求服务页
    // changeEvent(signId){
    //     // console.log(signId)
    //     this.props.navigate('service',{signId:signId})
    // }
    render(){
        const {signId,status_fixed,category}=this.props
        console.log(status_fixed)
        const InfoData=this.props.data
        const order_allData=this.props.order_allData;
        console.log(order_allData)
        console.log(this.props.data)
        return (
            <View style={styles.dispose_Info}>
                <View style={{flexDirection:'row'}}>
                    {category==1?
                        <Text style={styles.componentName}>
                            处置企业：
                        </Text>
                        :
                        <Text style={styles.componentName}>
                            需求企业：
                        </Text>
                    }
                    <Text 
                        style={styles.componentItem}
                        numberOfLines={1}
                    >
                        {InfoData.name}
                    </Text>
                    {this.startService(signId,status_fixed,category)}
                </View>
                <Text style={styles.infomation_item}>
                    成交价格：￥{order_allData.price}
                </Text>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>
                        联系方式：{InfoData.person}
                    </Text>
                    <Text style={styles.call}>
                        {InfoData.contact} 
                    </Text>
                </View>
                <View style={styles.itemDetails}>
                    <Text style={{fontSize:15}}>
                        项目详情：
                    </Text>
                    <Text 
                        style={styles.infomation}
                        numberOfLines={2}
                    >
                        {InfoData.introduction}
                    </Text>
                </View>  
                
                <View style={styles.infomation_item,{flexDirection:'row',marginTop:16}}>
                    <Text style={{fontSize:15}}>
                        相关图片：
                    </Text>
                    <View style={{flex:1,flexDirection:'row',flexWrap:"wrap"}}>
                        {/* {imageArr.map((item,index)=>{
                            const  image_item='http://39.104.72.185:7001'+item
                            return(
                                <View style={{marginLeft:5,marginTop:4}} key={index}>
                                    <Image 
                                        style={{width:width*0.135,height:width*0.135,borderWidth:1}}
                                        source={{uri:image_item}}
                                        />
                                </View>
                            )
                         })
                        } */}
                        <View style={{marginLeft:5,marginTop:4}}>
                            <Image style={{width:width*0.135,height:width*0.135,borderWidth:1}}/>
                        </View>
                        {/* <View style={{marginLeft:5,marginTop:4}}>
                            <Image style={{width:width*0.135,height:width*0.135,borderWidth:1}}/>
                        </View> */}
                    </View>
                    
                </View>
            </View> 
        )
    }
}

const styles=StyleSheet.create({
    dispose_Info: {
        marginTop:30,
        paddingLeft:width*0.05
    },
    componentName: {
        fontSize:16,
        color:'#333333',
        fontWeight:'bold'
    },
    componentItem: {
        width:width*0.4,
        fontSize:16,
        color:'#333333',
        fontWeight:'bold',
    },
    service: {
        position:'absolute',
        right:0,
        fontSize:15,
        color:'#333333',
        fontWeight:'bold',
        marginLeft:2,
        width:(width-width*0.05*2-width*0.4-70)
    },
    first_button: {
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:7,
        paddingRight:7,
        backgroundColor:"#5AA246",
        position:'absolute',
        right:width*0.06,
        borderRadius:5,
        color:'white'
    },
    itemDetails: {
        flexDirection:'row',
        marginTop:13,
        paddingRight:width*0.05
    },
    infomation_item: {
        fontSize:15,
        marginTop:13, 
    },
    userInfo: {
        flexDirection:'row',
        marginTop:10,
    },  
    infomation: {
        fontSize:15,
        width:width*0.7
    },
    username: {
        fontSize:15
    },
    call: {
        fontSize:15,
        marginLeft:15
    }
})