import React,{Component} from 'react'
import {Text,View,StyleSheet,Dimensions,Image,FlatList,TouchableOpacity,DeviceEventEmitter,ScrollView} from 'react-native'
// import { ScrollView } from 'react-native-gesture-handler';

var {width,height}=Dimensions.get('window');
var marginL=width*0.05;
var marginR=width*0.1;

export default class OrderList extends Component{
    constructor(props){
        super(props);
        this.state={
            // status_sign:this.props.status_sign
            show:true //显示No data
        }
        this.handleOrder=this.handleOrder.bind(this)
    }
    //订单列表中每个订单的状态
    handleOrder(status_fixed){
        switch(status_fixed){
            case(1): return(
                <Text 
                    style={{fontSize:14,color:'#333333'}}
                >
                    未开始
                </Text>
                )
            case(2): return(
                <Text 
                    style={{fontSize:14,color:'#333333'}}
                >
                    服务中
                </Text>
                )
            case(3): return(
                <Text 
                    style={{fontSize:14,color:'#333333'}}
                >
                    已派单
                </Text>
                )
            case(4): return(
                <Text 
                    style={{fontSize:14,color:'#333333'}}
                >
                    已完成
                </Text>
                )
        }
    }

    handleChangeInfo(status_fixed,status_sign,signId){
        console.log(status_sign,signId)
        // console.log(category)
        // const {status_sign}=this.state;
        const {detailsData,category} = this.props;
        console.log(status_fixed,detailsData)
        //当category等于1或2进入订单详情页，当等于3或4进入处置跟踪
        // if(category==1||category==2){
            this.props.navigate('details',{
                category:category,
                status_fixed:status_fixed,
                signId:signId,
                detailsData:detailsData,
                status_sign:status_sign
            })
            DeviceEventEmitter.emit('change')
        // } else if(category==3||category==4){
            // this.props.navigation.navigate('trace')
        // }
    }

    renderItem(data){
        const item=data.item
        console.log(item)
        const signId=item.id
        const status_fixed=item.status
        const status_sign=item.auction.status
        console.log(status_fixed,status_sign)
        return(
            <TouchableOpacity style={styles.order} onPress={()=>this.handleChangeInfo(status_fixed,status_sign,signId)}>
                <View style={styles.order_item}>
                    <Text style={{fontSize:14,color:'#333333'}}>
                        订单号:{item.auction.sn}
                    </Text>
                    {this.handleOrder(status_fixed)}
                </View>
                <View style={styles.detail}>
                    <Image 
                        source={require('../common/image/logo.png')}
                        style={styles.img}
                        />
                    <View style={styles.project}>
                        <Text style={styles.project_name}>
                             {item.auction.name}
                        </Text>   
                        <Text style={styles.project_intro}>
                             {item.auction.introduction}
                        </Text>  
                    </View>
                    <Text style={styles.next}>></Text>
                </View>
            </TouchableOpacity>
        )
        
    }
    // this.props.detailsData.length?
    //             <FlatList
    //                 data={this.props.detailsData}
    //                 renderItem={(data)=>this.renderItem(data)}
    //                 keyExtractor={(item,index)=>index.toString()}
    //                 />   
    //                 :
    //                 <Text style={{textAlign:'center',fontSize:20,
    //                     borderTopWidth:7, borderTopColor:'#D7D7D7',
    //                     paddingTop:5
    //                 }}>
    //                     No Data
    //                 </Text> 
    render(){
        // var renderItem=this.renderItem();
        return(  
            this.props.detailsData.length<=0?
                <Text style={{textAlign:'center',fontSize:20,
                    borderTopWidth:7, borderTopColor:'#D7D7D7',
                    paddingTop:5
                }}>
                    No Data
                </Text> 
                :
                <FlatList
                    data={this.props.detailsData}
                    renderItem={(data)=>this.renderItem(data)}
                    keyExtractor={(item,index)=>index.toString()}
                    />             
        )
    }
    componentDidMount(){
        // if(this.props.detailsData!=[]){
        //     this.setState({
        //         show:false
        //     })
        // }
    }
    // renderItem(){
    //     if(this.state.show){
    //         return(     
    //             <Text style={{textAlign:'center',fontSize:20,
    //                 borderTopWidth:7, borderTopColor:'#D7D7D7',
    //                 paddingTop:5
    //             }}>
    //                 No Data
    //             </Text> 
    //         )
    //     }else{
    //         return(
    //             <FlatList
    //                 data={this.props.detailsData}
    //                 renderItem={(data)=>this.renderItem(data)}
    //                 keyExtractor={(item,index)=>index.toString()}
    //                 /> 
    //         )
    //     }  
    // }
}

const styles=StyleSheet.create({
    order: {
        flex:1,
         borderTopColor:'#D7D7D7',
         borderTopWidth:8
    },
    order_item: {
        // flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:marginL,
        paddingRight:marginR,
        paddingTop:height*0.02,
        paddingBottom:height*0.02,
        borderBottomColor:'#D7D7D7',
        borderBottomWidth:1,    
    },
    detail: {
        flex:1,
        flexDirection:'row',
        paddingLeft:marginL,
        paddingRight:marginL,
        marginTop:height*0.03,
        paddingBottom:height*0.032,
        // borderBottomWidth:8,
        // borderBottomColor:'#D7D7D7'
    },
    img: {
        width:width*0.21,
        height:width*0.21,
        // backgroundColor:'#999999'
    },
    project: {
        flex:1,
        flexDirection:'column',
        justifyContent:'space-between',
        paddingLeft:width*0.05,
        position:'relative',
        
    },
    project_name: { 
        color:'#333333',
        fontSize:16,
        fontWeight:'normal',
        // fontFamily: 'System',
    },
    project_intro: {
        color:'#999999',
        fontSize:13,
        width:width*0.5
    },
    next: {
        position:'absolute',
        right:20,
        top:25,
        color:'#999999',
        textAlign:'center',
        fontSize:20
    }
})