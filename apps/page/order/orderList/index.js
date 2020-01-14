import React,{Component} from 'react';
import {Text,View,StyleSheet,Image,Dimensions,ScrollView,DeviceEventEmitter,TouchableOpacity} from 'react-native'
import OrderList from "../../../component/orderList"
import {requests} from '../../../http'

const {width} = Dimensions.get('window')
const {height} = Dimensions.get('window')
var cor = 5;
var paddingL=width*0.035;
var text=42;        
var marginL=(width-60-paddingL-text*5)/(cor+2)  //60为订单列表长度
export default class Order extends Component{
    constructor(props){
        super(props);
        this.state={
            id:1, //公司id
            // signId:1, //订单的id
            category:1, //需求方1 处置方2
            isSelect:true,
            tabIndex:0,  //初始值tabs标识
            status:0,   //status 初始值订单类型状态(切换tabs)
            // status_fixed:2, //订单固定状态
            page:1,   //页码
            size:10, // 数量
            detailsData:[], //企业订单列表
            // status_sign:1, //标的状态
            tabsData:[
                {id:0,name:"全部",status:0},
                {id:1,name:"未开始",status:1},
                {id:2,name:"服务中",status:2},
                {id:3,name:"已派单",status:3},
                {id:4,name:'已完成',status:4}
            ],
            listData:[],  //订单内容,
            name:'',    //公司名称
            logos:'',    //公司logo
            icon:''     //个人头像
        }
    }
    // handleChangeInfo(categ ory){
    //     // console.log(category)
    //     const {status_fixed,signId,detailsData} = this.state;
    //     //当category等于1或2进入订单详情页，当等于3或4进入处置跟踪
    //     // if(category==1||category==2){
    //         this.props.navigation.navigate('details',{
    //             category:category,
    //             status_fixed:status_fixed,
    //             signId:signId,
    //             detailsData:detailsData
    //         })
    //     // } else if(category==3||category==4){
    //         // this.props.navigation.navigate('trace')
    //     // }
    // }
    switchTab(item){
        const {id} =this.state
       this.setState({
           tabIndex: item.id,   //修改tabs标识
           status: item.status   //修改订单类型状态
       })
    //    调用请求接口
    if(item.status==0){
        requests.get(`/gzapi/order/list?companyId=${id}`).then(res=>{
            const detailsData=res.data.rows
            this.setState({
                 detailsData:detailsData
            })
        }).catch(err=>{
            console.log(err);   
        })
    }else {
        requests.get(`/gzapi/order/list?status=${item.status}&companyId=${id}`).then(res=>{
            const detailsData=res.data.rows
            console.log(detailsData)
            
            // for(let item of detailsData) {
            //     let status_fixed=item.status;
            //     let status_sign=item.auction.status;
            //     console.log(status_sign)
            //     let signId=item.id
            //     console.log(signId)
            //     this.setState({
            //         detailsData:detailsData,
            //         status_fixed:status_fixed,
            //         signId:signId,
            //         status_sign:status_sign
            //    })
            //    console.log(signId,status_fixed)
            //     // return status_fixed,signId
            // };

            this.setState({
                 detailsData:detailsData
            })
        }).catch(err=>{
            console.log(err);   
        })
    }
    



    }
    // 请求后台数据方法
    getTabListData(){
        this.setState({
            page:1
        })
    }   
    返回上一页
    goHome(){   
        this.props.navigation.state.params.refresh();
        this.props.navigation.navigate('businessList')
    }
    getOrderData(id){
        console.log(id)
        // let token =AsyncStorage.getItem('token')
        // console.log(token)
        requests.get(`/gzapi/order/list?companyId=${id}`).then(res=>{
            console.log(res)
            const detailsData=res.data.rows;
            console.log(detailsData)
            // for(let item of detailsData) {
            //     let status_fixed=item.status;
            //     let status_sign=item.auction.status;
            //     console.log(status_sign)
            //     let signId=item.id
            //     console.log(signId)
            //     this.setState({
            //         detailsData:detailsData,
            //         status_fixed:status_fixed,
            //         signId:signId,
            //         status_sign:status_sign
            //    })
            //    console.log(signId,status_fixed)
            //     // return status_fixed,signId
            // };
            this.setState({
                detailsData:detailsData
            })
            
        }).catch(err=>{
            console.log(err);   
        })
    }
    componentWillUnmount(){
        this.subscription.remove();
    }
    componentDidMount(){
        
        // console.log(this.state.status)
        var {id,category,name,logos,icon}=this.props.navigation.state.params
        console.log(id,category)
        this.setState({
            id:id,
            category:category,
            name:name,
            logos:logos,
            icon:icon
        })
        console.log(category,name,logos,id)
       this.getOrderData(id)
       //监听页面
        this.subscription=DeviceEventEmitter.addListener('change',(params)=>{
            this.getOrderData(id)
        })
    }
    render(){
        // console.log(this.state.status_fixed)
        const {category,name,logos} =this.state
        return(
            <View style={styles.container}>
                                         
                <View style={{flex:1}}>  
                    <View style={styles.header}>
                        <Image 
                            style={styles.logo_img} 
                            source={{uri:logos}}
                        />
                        <Text 
                            style={styles.name}
                            numberOfLines={1}
                        >
                            {name}
                        </Text>
                        <View style={styles.texts}>
                            <Image 
                                style={styles.username} 
                                source={{uri:this.state.icon}}
                            />
                            <View style={{marginBottom:5}}>
                                <Text style={styles.text}>Nick</Text>
                            </View> 
                        </View>
                        <Text onPress={this.goHome.bind(this)} style={{height:50,position:'absolute',top:height*0.02,left:5}}>
                            <Image 
                                source={require('../../../common/image/leftarrow.png')}
                                style={{width:25,height:25,resizeMode:'cover'}}
                            /> 
                        </Text>  
                    </View>
                    <View style={styles.orderList}>
                        <Text style={styles.orderListName}>
                            订单列表
                        </Text>     
                        {
                            this.state.tabsData.map(item=>{
                                return <Text 
                                            key={item.id} 
                                            style={this.state.tabIndex == item.id ?
                                            [styles.orderListItem,styles.orderListName_bottom]:
                                            (styles.orderListItem)} 
                                            onPress={()=>{this.switchTab(item)}}
                                        >
                                            {item.name}
                                        </Text>
                            })
                        }
                    </View>
                        <ScrollView style={{flex:1}}>
                            <OrderList 
                                detailsData={this.state.detailsData}
                                style={{flex:1}}
                                navigate={this.props.navigation.navigate}
                                category={category}
                                />
                        </ScrollView>   
                </View>
            </View>
        )
    }
}
    
const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    header: {
        flexDirection:'row',
        paddingBottom:height*0.04,
        position:'relative',
        borderBottomColor:'#D7D7D7',
        borderBottomWidth:1,
        paddingLeft:width*0.05,
        paddingRight:width*0.05,
        paddingTop:height*0.06,
        textAlign:'center',
        justifyContent:'space-between'
    },
    // goBack: {
    //     paddingLeft:10,
    //     fontSize:30,
    //     color:'#333333',
    // },
    logo_img: {
        width:width*0.18,
        height:height*0.08,
        // marginLeft:width*0.05,
        resizeMode:'contain',
    },
    name: {
        fontSize:19,
        color:'#333333',
        // marginLeft:width*0.05,
        marginTop:height*0.02,
        width:width*0.45,
        fontWeight:'bold',
        textAlign:'center'
    },
    texts: {
        flexDirection:'column',
        alignItems:'center',
        // position:'absolute',
        // right:0,
        // marginRight:width*0.05,
    },
    username: {
        width:width*0.2,
        height:height*0.073,
        resizeMode:'contain'
    },
    text: {
        fontSize:17,
        color:'#333333',
    },
    orderList: {
        flexDirection:'row',
        // borderBottomColor:'#D7D7D7',
        // borderBottomWidth:8,
        paddingTop:10,
        paddingBottom:1,
        paddingLeft:paddingL
    },
    orderListName: {
        color:'#000000',
        fontSize:15,
        marginTop:6,
        fontWeight:'bold',
        paddingBottom:10
    },
    orderListItem: {
        marginLeft:marginL,
        color:'#333333',
        fontSize:14,
        marginTop:7,
        height:30,
        width:45,
        textAlign:'center',
    },
    orderListName_bottom: {
        paddingBottom:5,
        borderBottomWidth:2,
        borderBottomColor:'#797979'
    }
})
