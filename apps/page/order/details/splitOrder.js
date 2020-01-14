import React,{Component} from 'react'
import {View,Text,StyleSheet,Dimensions,TextInput, Alert,DeviceEventEmitter} from 'react-native'
import { Table, Row, Rows } from 'react-native-table-component';
import ModalDropdown from 'react-native-modal-dropdown';
import { requests } from '../../../http';
import { TouchableOpacity } from 'react-native-gesture-handler';
const {width} =Dimensions.get('window')

export default class ComponentInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            flow_names:[], //拆分服务中的处置流程名称
            flow_id:[], //流程Id
            signId:1, //订单id
            tableHead: ['处置商品', '数量', '可拆分', '已拆分','单位'],
            tableData: [],  //下拉框流程选择
            product_item:[], //下拉框商品选择 里面是对象，目的拿对应的key值即商品id
            product_items:[],  //下拉框商品选择 里面是数组,渲染商品
            indexs:0, //商品对应下标
            number:0,//数量 
            units:'请输入单位', //单位
            flow:null,//流程
            key:null, //选择下拉框商品时对应的id
            // auctions:{} //从里面拿到productList商品的内容
            flow_items:[] //获取处置流程和流程id对象
        }
    }
    

    //获取商品列表
    getProductList(){
        const {signId} =this.state
        requests.get(`/gzapi/product/list?id=${signId}`).then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    //获取流程列表的处置流程名称和流程id
    getFlowName(){
        requests.get('/gzapi/flow/list').then(res=>{
            const rows=res.data.rows;
            let flow_names=[];
            let flow_item=[];
            //获取处置流程名称
            for(let item of rows){
                flow_names.push(item.name)
                console.log(flow_names)
                this.setState({
                    flow_names:flow_names
                })
            }
            //获取处置流程和流程id对象
            for(let item of rows){
                flow_item.push({name:item.name,flow_id:item.id})
                console.log(flow_item)
                this.setState({
                    flow_items:flow_item
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    // //获取流程
    // getFlow(){
    //     const {signId} =this.state
    //     requests.get(`/gzapi/service/list?id=${signId}`).then(res=>{
    //         const rows=res.data.rows
    //         let flow_ids=[]
    //         for(let item of rows){
    //             flow_ids.push(item.flow_id)
    //             console.log(flow_ids)
    //             this.setState({
    //                 flow_id:flow_ids
    //             })
    //         }
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    // }
    //生成服务
    getService=()=>{
        const {signId,number,units,key,flow} =this.state
        // if(number!=null&&key!=null&&flow!=null){
            requests.post(`/gzapi/service/add`,{
                order_id:`${signId}`,
                num:`${number}`,
                unit:`${units}`,
                product_id:`${key}`,
                flow_id:`${flow}`
            }).then(res=>{
                console.log(res)
                if(res.code==0){
                    Alert.alert('服务单成功生成')
                    this.props.navigation.goBack();
                    DeviceEventEmitter.emit('key');
                }
            })
            .catch(err=>{
                console.log(err)
            })
        // }
        // if(flow==null){
        //     Alert.alert('请选择处置流程')
        // }
        // if(flow!=null&&key!=null&&number==0){
        //     Alert.alert('请填写数量')
        // }
        // if(flow!=null&&key==null&&number==0){
        //     Alert.alert('请选择处置商品')
        // }
    }

    componentDidMount(){
        console.log(this.state.product_item)
        const {signId,auctions} =this.props.navigation.state.params;
        console.log(auctions)
        this.setState({
            signId:signId,
        })
        const {productList}=auctions;
        console.log(productList)
        var products=[];
        for(let item of productList){
            console.log(item)
            products.push([
                item.product.name,item.l_num,item.num,item.s_num,item.unit
            ]) 
            // console.log(products)
            this.setState({
                tableData:products
            })
        }
        var product_item=[];
        var product_items=[];
        for(let items of productList){
            product_item.push({
                key:items.product.id,name:items.product.name,units:items.unit
            })
            this.setState({
                product_item:product_item
            },()=>console.log(this.state.product_item));
            product_items.push([items.product.name])
            this.setState({
                product_items:product_items
            },()=>console.log(product_items))
        }
        // console.log(signId)
        this.getProductList()
        // this.getFlow()
        this.getFlowName()
        // this.getKeys()
    }
    //取消按钮
    getServiceOrder(){
        console.log(1)
        this.props.navigation.navigate('details')
    }
    render(){
        console.log(this.state.number,this.state.units,this.state.flow)
        // console.log(this.state.key)
        const {product_item,flow_items}=this.state 
        return (
            <View style={styles.container}>
                <Text style={styles.info}>
                    处置品信息
                </Text>
                <Table borderStyle={{borderWidth: 1,borderColor:'#CCCCCC'}}>
                <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                {/* { 
                   this.state.tableData.length>0?  */}
                    <Rows data={this.state.tableData} textStyle={styles.texts}/>
                    {/* :
                    <Text>No data</Text>
                } */}
                
                </Table>
                {/*拆分服务单 */}
                <View style={{marginTop:50,paddingBottom:50,borderBottomColor:'#DDDDDD',borderBottomWidth:1}}>
                    <Text style={{fontSize:16,marginBottom:6}}>拆分服务单</Text>
                    <View style={{flexDirection:'column'}}>
                       <View style={{flexDirection:'row'}}>
                            <View>
                                <Text style={{fontSize:14,marginBottom:3,color:'#444444'}}>处置流程:</Text>
                                <ModalDropdown 
                                options={this.state.flow_names} 
                                defaultValue='请选择'
                                dropdownStyle={{width:width*0.35,height:100,backgroundColor:'rgba(0,0,0,.65)'}}
                                textStyle={{borderWidth:1,borderColor:'#CCCCCC',fontSize:13,
                                        width:width*0.35,height:25,color:'#CCCCCC',paddingLeft:0,paddingTop:4 
                                }}
                                onSelect={(idx,item) => {
                                    const items=item;
                                    for(var item of flow_items){
                                        if(item.name==items){ //item 表示Json串中的属性，如'name'
                                        const flow_id=item.flow_id;
                                        this.setState({ 
                                            flow_id: flow_id  
                                            });
                                        }
                                    }
                                }}
                                    />
                            </View>
                            <View >
                                <Text style={{marginLeft:10,fontSize:14,marginBottom:3,color:'#444444'}}>处置商品:</Text>
                                <ModalDropdown 
                                options={this.state.product_items}
                                defaultValue='请选择'
                                dropdownStyle={{width:width*0.35,height:100,marginLeft:10}}
                                textStyle={{borderWidth:1,borderColor:'#CCCCCC',fontSize:13,
                                width:width*0.35,height:25,color:'#CCCCCC',paddingTop:4,
                                        marginLeft:10    
                                        
                                }}
                                onSelect={(idx,item)=>{   //idx必须放前面，表示下标
                                    const items=item
                                        for(var item of product_item){ 
                                            if(item.name==items){ //item 表示Json串中的属性，如'name' 
                                            console.log(item)
                                            const key=item.key;
                                            this.setState({
                                                key:key,
                                                units:item.units
                                            })
                                            } 
                                        }   
                                }}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:'row',marginTop:10}}>
                            <View>
                                <Text style={{fontSize:14,marginBottom:3,color:'#444444'}}>数量:</Text>
                                <TextInput style={{width:100,borderWidth:1,borderColor:"#CCCCCC",paddingVertical:0,height:25,
                                            width:width*0.35,marginRight:10,textAlign:'left'
                                    }}
                                    placeholder='0'
                                    onChangeText={(text) => {
                                        this.setState({ 
                                            number: text  
                                        });
                                    }}
                                    value={this.state.number}
                                    /> 
                            </View>
                            <View> 
                            <Text style={{fontSize:14,marginBottom:3,color:'#444444'}}>单位:</Text>
                            <Text style={{width:100,borderWidth:1,borderColor:"#CCCCCC",paddingVertical:0,height:25,
                                            width:width*0.35,backgroundColor:'#F5F5F5',color:'#999999',
                                            paddingTop:3
                                            }}>
                                {this.state.units}
                            </Text>
                            </View>
                        </View>   
                        {/* <View>
                            <Text style={{fontSize:14,marginBottom:3}}>单位:</Text>
                            <TextInput style={{width:100,borderWidth:1,borderColor:"#CCCCCC",paddingVertical:0,height:25,
                                        paddingLeft:10,paddingRight:10,backgroundColor:'#F5F5F5'
                                }}
                                placeholder={this.state.units}
                                onChangeText={(text) => {
                                    this.setState({ 
                                    units: text  
                                    });
                                }}
                                value={this.state.units}
                                />
                        </View>  */}
                    </View>
                </View>    
                
                <View style={{flexDirection:'row',flexDirection:'row-reverse'}}>
                    <TouchableOpacity style={{marginTop:5,marginLeft:5}}>
                        <Text
                            style={styles.button}
                            onPress={this.getService}
                        >
                            确定生成服务单
                        </Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop:5}}>
                        <Text 
                            style={styles.button_two}
                            onPress={this.getServiceOrder.bind(this)}
                        >
                            取消
                        </Text> 
                    </TouchableOpacity>
                </View>
                  
               
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        flex:1,
        paddingLeft:width*0.05,
        paddingRight:width*0.05,

    },
    info: {
        paddingTop:30,
        paddingBottom:15,
        fontSize:16
    },
    button: {
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#5AA246',
        color:'white',
        width:110,
        textAlign:'center',
        marginTop:20,
        borderRadius:5,
        flexDirection:'row-reverse',
    },
    button_two: {
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#DDDDDD',
        color:'white',
        width:50,
        textAlign:'center',
        marginTop:20,
        borderRadius:5,
        flexDirection:'row-reverse',
        borderColor:'#333333'
    },
    head: { 
        justifyContent:'center',
        height: 40,
        padding:0,
        fontSize:22,
        
        
    },
    text: { 
        fontSize:14,
        textAlign: 'center',
    },
    texts:  {
        // margin: 8, 
        paddingTop:8,
        paddingBottom:8,
        paddingLeft:1,
        paddingRight:1,
        textAlign: 'center',
        fontSize:13
    }
})