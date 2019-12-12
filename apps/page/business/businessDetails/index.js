import React,{Component} from "react"
import {View,Text,StyleSheet,Image,Dimensions,ScrollView,TouchableOpacity} from 'react-native'
import {requests} from '../../../http'

const  {width} =Dimensions.get('window')

export default class BusinessList extends Component{
    constructor(props){
        super(props);
        this.state={
            id:1,
            componentData:{}, //公司信息
            logos:'', //公司logo
            show:true, //点击显示,
        };
        this.handleInputHidden=this.handleInputHidden.bind(this);
        // this.onshow=this.onshow.bind(this)
    }
    //图片预览
    handleClick(componentData){
        console.log(1)
        this.props.navigation.navigate('a',{
            componentData:componentData
        })
    }
    //点击是否显示简介全部内容
    handleShow(){
        this.setState({
            show:!this.state.show
        })
    }
    handleInputHidden(){
        this.setState({
            show:false
        })
    }
    getInfo(id,name){
        console.log(id,name)
        requests.get(`/gzapi/company/get?id=${id}&name=${name}`).then(res=>{
            const componentData=res.data
            this.setState({
                componentData:componentData,
            })
            console.log(componentData)
            // let imgs=[];
            // for(let i=0;i<componentData.length;i++){
            //     console.log(componentData)
            //     imgs.push({
            //         certificate:componentData[i].certificate
            //     })
            //     return imgs
            // }
            // console.log(imgs)
            console.log(res)
        }).catch(err=>{
            console.log(err);   
        })
    }
    componentDidMount(){
        var {id,name,logos}=this.props.navigation.state.params
        console.log(id,name)
        this.setState({
            logos:logos
        })
        this.getInfo(id,name)
    }
    render(){
        const {componentData,logos} =this.state;
        console.log(componentData)
        return(
            <View style={styles.businessDetails}>
                <View style={styles.outcolor}>
                    <View style={styles.header}>
                        <Image 
                            style={styles.img}
                            source={{uri:logos}}
                        />
                        <Text style={styles.name}>{componentData.name}</Text>
                    </View> 
                </View>
                <View style={styles.context}>
                    <View style={styles.info_first}>
                        <Text style={styles.info_item}>企业简介：</Text>
                        {this.state.show==true?
                        <Text 
                            style={styles.info_intro} 
                            numberOfLines={1}
                        >
                            {componentData.introduction}
                        </Text>:
                            <Text 
                                style={styles.intro_show}
                                onPress={this.handleInputHidden} 
                            >
                                {componentData.introduction}
                            </Text>
                        }
                        <Text
                            style={styles.show}
                            onPress={()=>this.handleShow()}
                        >
                            >   
                        </Text>
                    </View>
                    <View style={styles.info_content}>
                        <Text style={styles.info_item}>所在地区：</Text>
                        <Text style={styles.info}>{componentData.p_name}{componentData.c_name}</Text>
                    </View>
                    <View style={styles.info_content}>
                        <Text style={styles.info_item}>注册时间：</Text>
                        <Text style={styles.info}>{componentData.ctime}</Text>
                    </View>
                    <View  style={styles.info_content}>
                        <Text style={styles.info_item}>认证期限：</Text>
                        <Text style={styles.info}>xxxx</Text>
                    </View>
                    <View  style={styles.info_end}>
                        <Text style={[styles.info_item,{marginTop:10}]}>相关资质：</Text>
                        <ScrollView 
                            style={styles.roll}
                            horizontal={true} // 横向
                            showsHorizontalScrollIndicator={false}  // 此属性为true的时候，显示一个水平方向的滚动条。
                        >
                            {   
                                
                                componentData.imgList&&componentData.imgList.map((item,index)=>{
                                    console.log(item)
                                    const url='http://39.104.72.185:7001'+item.url
                                    
                                    return(
                                        <TouchableOpacity key={index} onPress={this.handleClick.bind(this,componentData)}>
                                            
                                            <Image 
                                                style={styles.certificate}  
                                                source={{uri:url}}   
                                            />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                        <Text style={styles.picture_roll}>></Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    businessDetails: {
        flex:1,
        backgroundColor:'rgba(242, 242, 242, 1)'
    },
    outcolor: {
        backgroundColor:'rgba(17, 179, 24, 1)',
        height:152
    },
    header: {
        flexDirection:'row',
        paddingLeft:width*0.08,
        paddingRight:width*0.08,
        paddingTop:width*0.06,
        paddingBottom:width*0.06,
        marginLeft:width*0.05,
        marginRight:width*0.05,
        marginTop:10,
        backgroundColor:'white',
        borderRadius:8,
        // position:'relative'
    },
    img: {
        width:70,
        height:60,
        resizeMode:'cover',
    },
    name: {
        marginLeft:5,
        fontSize:18,
        fontWeight:'bold'
    },
    context: {
        marginLeft:width*0.05,
        marginRight:width*0.05,
        backgroundColor:'white',
        paddingLeft:15,
        paddingRight:30,
        // position:'absolute',
        // top:10
        marginTop:-20,
        paddingBottom:80,
        borderRadius:5,
        //边框阴影
        elevation: 6,  //  设置阴影角度，通过这个设置有无阴影（这个是最重要的，决定有没有阴影）
        shadowColor: 'black',  //  阴影颜色
        shadowOffset: { width: 10, height:5 },  // 阴影偏移
        shadowOpacity: 1,  // 阴影不透明度
        shadowRadius: 10,  //  圆角
        position:'relative',
        zIndex:-1
    },
    info_first: {
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:2,
        borderBottomColor:'#E7E7E7',
        zIndex:999
    },
    info_item: {
        fontSize:15,
    },
    info_content: {
        paddingTop:20,
        paddingBottom:10,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:2,
        borderBottomColor:'#E7E7E7',
    },
    intro_show: {
        fontSize:15,
        marginLeft:18,
        width:width*0.55,
        position:'absolute',
        backgroundColor:'white',
        borderColor:'#E7E7E7',
        borderWidth:1,
        top:30,
        left:70 

    },
    info_intro: {
        fontSize:15,
        marginLeft:18,
        height:18,
        lineHeight:18,
        width:width*0.55,
        // overflow: 'hidden',
    },
    info: {
        fontSize:15,
        marginLeft:18,
        height:18,
        lineHeight:18,
    },
    info_end: {
        paddingTop:20,
        paddingBottom:15,
        flexDirection:'row',
        borderBottomWidth:2,
        borderBottomColor:'#E7E7E7',
    },
    show: {
        position:'absolute',
        right:0,
        bottom:7,
        fontSize:17,
        padding:5
    },
    picture_roll: {
        fontSize:17,
        padding:5,
        paddingLeft:20
    },
    // roll: {
        
    // },
    certificate: {
        width:65,
        height:45,
        marginLeft:15,
        resizeMode:'contain'
    }
})
