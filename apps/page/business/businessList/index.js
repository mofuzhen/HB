import React,{Component} from "react"
import {View,Text,StyleSheet,FlatList,Image,RefreshControl,ActivityIndicator,Dimensions,TouchableOpacity} from 'react-native'
import {requests} from '../../../http'
const {width}=Dimensions.get('window')
const {height}=Dimensions.get('window')
let totalPage=5;
let itemNo=0;//item的个数
export default class BusinessList extends Component{
    constructor(props){
        super(props);
        this.state={
            listData:[], //用户的公司列表
            // id:1,   //公司id
            // category:1, //需求方
            visible:true,
            totalPage:0,  //总页数
            //上拉加载更多 下拉刷新
            page:1,
            isLoading: true,
            //网络请求数据
            error: false,
            errorInfo: "",
            // detailsData:[], //企业订单列表
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing:false,//下拉控制,
            Is_exit:false, //显示退出按钮
            
        }
        this.infomation=this.infomation.bind(this)
        this.orderForm=this.orderForm.bind(this)
        this.handleIs_verify=this.handleIs_verify.bind(this)
        this.handleClick=this.handleClick.bind(this)
    }
    //点击显示退出登录
    handleClick(){
        this.setState({
            Is_exit:!this.state.Is_exit
        })
    }
    orderForm(id,category,name,logos){
        console.log(id,category)
        this.props.navigation.navigate('orderList',{   
            id:id,
            name:name,
            logos:logos,
            category:category,
            refresh:function(){
                // this.init;   
                console.log(1)
            }
        })
    }
    infomation(id,category,name,logos){
        console.log(id,category,name)
        this.props.navigation.navigate('businessDetails',{
            id:id,
            name:name,
            category:category,
            logos:logos
        })
    }
    //公司列表中每个公司的实名认证状态
    handleIs_verify(is_verify){
        switch(is_verify){
            case(1):return (
                <Text 
                    style={[styles.authentication,styles.authentication_black]} 
                >
                    未认证
                </Text>
                );
            case(2):return (
                <Text 
                    style={[styles.authentication,styles.authentication_red]} 
                >
                    待审核
                </Text>
                );
            case(3):return (
                <Text 
                    style={[styles.authentication,styles.authentication_red]} 
                >
                    已通过
                </Text>
                );
            case(4):return (
                <Text 
                    style={[styles.authentication,styles.authentication_red]} 
                >
                    已拒绝
                </Text>
                );
        } 
    }
    renderItem(data){
        // console.log(data)
        const item=data.item;
        console.log(item)
        const {id,category,is_verify,logo,name} =item;
        const logos='http://39.104.72.185:7001'+logo
        // console.log(logos)
        // console.log(logo)
        return  (
            <View style={styles.component}>
                <View style={styles.component_item}>
                    <Image style={{width: width*0.15, height: height*0.065,resizeMode:'contain'}} 
                    source={{uri:logos}}
                    />
                    <Text 
                        style={styles.title}
                        numberOfLines={1}
                        >
                        {item.name}
                    </Text>
                    {this.handleIs_verify(is_verify)}
                </View>
                <View style={styles.component_intro}>   
                    <Text 
                        style={styles.introduction}
                        numberOfLines={3}
                    >
                        {item.introduction}
                    </Text>
                </View>
                <View style={styles.button}>
                        <Text 
                            style={styles.infomation}
                            onPress={()=>this.infomation(id,category,name,logos)}
                            >
                            企业信息
                        </Text>
                        <Text 
                            style={styles.orderForm} 
                            onPress={()=>this.orderForm(id,category,name,logos)}
                            >
                            企业订单
                        </Text> 
                </View>
            </View>
        )
    }
    handleExitLogin(){
        console.log(1)
        this.props.navigation.navigate('login')
    }
    render(){
        return(
            <View style={{flex:1}}>
                <View style={styles.businessList}>
                    <View style={styles.imgs}>
                        <Image 
                            style={styles.img} 
                            source={require('../../../common/image/logo.png')}
                        />
                    </View>  
                    {this.state.listData?
                        <View style={styles.mybusiness}>
                            <Text style={styles.mybusiness_Item}>
                                我的企业    
                            </Text>
                        <TouchableOpacity onPress={this.handleClick}>
                            <Image 
                                style={styles.username} 
                                source={{uri:'http://39.104.72.185:7001/public/upload/img/1571757966042.png'}}
                            />
                        </TouchableOpacity>
                        {this.state.Is_exit?
                            <View 
                            style={{
                            width:width*0.15,height:height*0.04,backgroundColor:'#CCCCCC',position:'absolute',
                            right:width*0.049,top:height*0.065,zIndex:999,borderRadius:5,
                            }}
                            >
                                <Text style={{textAlign:'center',paddingTop:height*0.008}}
                                onPress={this.handleExitLogin.bind(this)}
                                >
                                    退出登录
                                </Text>
                            </View>
                            :
                            null
                        }  
                        
                    </View>
                   
                     :
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingTop:height*0.3}}>
                        <Text style={{fontSize:30}}>No data</Text>
                    </View>
                    }  
                        
                </View>
                {
                    this.loadingData()
                }
            </View>                
        )
    }
    loadingData(){
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView();
        }
        //加载数据
        return (
                <FlatList 
                    data={this.state.listData}
                    renderItem={(data)=>this.renderItem(data)}
                    ListFooterComponent={this._renderFooter.bind(this)}
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={0.1}
                    // ItemSeparatorComponent={this._separator}
                    keyExtractor={(item,index)=>index.toString()}
                    //为刷新设置颜色
                    refreshControl={ 
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.handleRefresh.bind(this)}//因为涉及到this.state
                            colors={['#ff0000', '#00ff00','#0000ff','#3ad564']}
                            progressBackgroundColor="#ffffff"
                        />
                }
                /> 
            )
    }
    getListData(){
        requests.get(`/gzapi/member/company?page=${this.state.page}`).then(res=>{
            console.log(res)
            let data=res.data;
            let dataBlob = [];//这是创建该数组，目的放存在key值的数据，就不会报黄灯了
                let i = itemNo;
                data&&data.map(function (item) {      
                    dataBlob.push({
                        // key: i,
                        logo: item.logo,
                        is_verify: item.is_verify,
                        introduction:item.introduction,
                        name:item.name
                    })
                    i++;
                });
                itemNo = i;
                let foot = 0;
                if(this.state.page>=totalPage){
                    foot = 1;//listView底部显示没有更多数据了
                }
                this.setState({
                    //复制数据源
                  //  dataArray:this.state.dataArray.concat(dataBlob),
                    // dataArray:[...this.state.dataArray,...dataBlob],
                    isLoading: false,
                    showFoot:foot,
                    isRefreshing:false,
                    listData:this.state.listData.concat(data)
                });
                data = null;//重置为空
                dataBlob = null;
            
            // this.setState({
            //     listData:data
            // })
        })
        .catch((error) => {
            this.setState({
                error: true,
                errorInfo: error
            })
        })
    }
    //获取用户信息
    getUserInfo(){
        requests.get('/gzapi/member/get').then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
    }
    componentDidMount(){
        this.getListData()
        this.getUserInfo()
    }
    shouldComponentUpdate() {
        return true
    }
    handleRefresh = () => {
        this.setState({
            page:1,
            isRefreshing:true,//tag,下拉刷新中，加载完全，就设置成flase
            dataArray:[]
        });
        this.getListData()
    }
    //加载等待页
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    color='blue'
                    size="large"
                />
            </View>
        );
    }
    //加载失败view
    renderErrorView() {
        return (
            <View style={styles.container}>
                <Text>
                    {this.state.errorInfo}
                </Text>
            </View>
        );
    }
    // _separator(){
    //     return <View style={{height:1,backgroundColor:'#999999'}}/>;
    // }
    _renderFooter(){
        if (this.state.showFoot === 1) {
            return (
                <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{color:'#999999',fontSize:14,marginTop:5,marginBottom:5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if(this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }
    }
    //当距离底部不足的距离时调用
    _onEndReached(){
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot != 0 ){
            return ;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if((this.state.page!=1) && (this.state.page>=totalPage)){
            return;
        } else {
            this.state.page++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot:2});
        //获取数据，在componentDidMount()已经请求过数据了
    if (this.state.page>1)
        {
            this.getListData();
        }
    }
   
}

const styles = StyleSheet.create({
    businessList: {
        flexDirection:'column',
    }, 
    imgs: {
        // flex:1,
        alignItems:'center',
        paddingTop:height*0.05,
        paddingBottom:height*0.04,
        borderBottomColor:'#D7D7D7',
        borderBottomWidth:0.5
    },
    img: {
        width:width*0.35,
        height:height*0.15,
        resizeMode:'contain'
    },
    mybusiness: {
        // flex:1,
        flexDirection:'row',
        height:height*0.07,
        justifyContent:"space-between",
        paddingLeft:width*0.06, 
        paddingRight:width*0.06,
    },
    mybusiness_Item: {
        fontSize:17,
        color:'#333333',
        paddingTop:15
    },
    username: {
        width:width*0.12,
        height:height*0.065,
        backgroundColor:'yellow',
        resizeMode:'contain'
    },
    component: {
        flex:1,
        marginLeft:width*0.05,
        marginRight:width*0.05,
        backgroundColor:'#F2F2F2',
        paddingLeft:width*0.04,
        marginBottom:height*0.028
    },
    component_item: {
        paddingTop:height*0.02,
        flexDirection:'row',
        position:'relative'
    },
    title: {
        width:width*0.49,
        marginLeft:width*0.05,
        color:'#333333',
        fontSize:17,
        paddingTop:height*0.02,
        fontWeight:'bold'
    },
    authentication: {
        // width:width*0.13,
        position:'absolute',
        top:height*0.038,
        right:width*0.02,
        fontSize:width*0.13/3,
        fontWeight: "400",
        fontStyle: 'normal'
    },
    authentication_black: {
        color:'#999999',
    },
    authentication_red: {
        color:'#FF552E'
    },
    component_intro: {
        paddingTop:height*0.02,
        paddingRight:width*0.2,
    },
    introduction: {
        color:'#333333',
        fontSize:14,
        fontWeight:'100'
    },
    button: {
        marginTop:height*0.03,
        flex:1,
        flexDirection:'row',
        paddingBottom:height*0.015
    },
    infomation: {
        paddingTop:height*0.015,
        paddingBottom:height*0.013,
        paddingLeft:width*0.04,
        paddingRight:width*0.04,
        borderColor:'rgba(215, 215, 215, 1)',
        borderWidth:1,
        borderRadius:5,
        backgroundColor:'white'
    },
    orderForm: {
        paddingTop:height*0.015,
        paddingBottom:height*0.013,
        paddingLeft:width*0.04,
        paddingRight:width*0.04,
        borderColor:'rgba(215, 215, 215, 1)',
        borderWidth:1,  
        borderRadius:5,
        backgroundColor:'white',
        marginLeft:width*0.03
    }

})