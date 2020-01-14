import React,{Component} from 'react';
import {View,Text,StyleSheet,Dimensions,DeviceEventEmitter} from 'react-native'
import {requests} from '../../../http'
import ComponentInfo from '../../../component/componentInfo';
import { ScrollView } from 'react-native-gesture-handler';
import Tracing from '../../../component/tracing';
import moment from 'moment';

const {width,height} =Dimensions.get('window')
export  default class Details extends Component{
    constructor(props){
        super(props);
        this.state={
            status_sign:1, //标的状态
            signId:1, //订单id
            auction:{}, //企业列表item(订单列表)
            order_allData:{}, //单个订单的整体数据
            auctions:{},  //单个订单的auction
            detailsData:[], //企业列表
            dispose_company:{}, //处置方公司信息
            product_company:{}, //需求方公司信息
            status_fixed:1,  //订单状态
            is_change:0,
            tabIndex:0,  //初始值tabs标识
            tabs:[
                {id:0,name:'需求详情'},
                {id:1,name:'处置跟踪'}
            ],
            serviceNumberIndex:0, //服务单号tabs标识
            serviceTabs:[
                // {id:0,serviceNumber:'F11112222'},
                // {id:1,serviceNumber:'F111122'},
                // {id:2,serviceNumber:'F111122222'}
            ],
            category:1, //1需求方公司 2处置方公司
            service_all:[],//处置跟踪数据列表
            step_all:{}, //跟踪列表的step
            step:{}, //每个节点的step
            service_Id:1, //服务单Id
            steps1:[], //服务列表的名字、是否完成
            is_finish_A:'', //流程的当前节点是否完成
            content:[], //当前节点的content内容
            form:[], //当前节点的form内容
            name:'', //节点名称
            follow_id:'', //处置跟踪id
            shop_name:'', //处置商品
            point:{}, //获取处置地点
            service_status:1,
            service_data:'', //gzapi/follow/list里的服务单数据
            item:null //
        };
    this.changeEvent=this.changeEvent.bind(this);
    this.handleDetails=this.handleDetails.bind(this)   
    this.getComponentInfo=this.getComponentInfo.bind(this)
    this.getStatus=this.getStatus.bind(this)
    this.getSplitOrder=this.getSplitOrder.bind(this)
    // this.changeService=this.changeService.bind(this)
    // this.checkTracking=this.checkTracking.bind(this)
    }
    //订单拆分或查看处置跟踪
    getSplitOrder(){
        const {status_fixed,category,signId}=this.state;
        if(category==1&&status_fixed==2){
            return(
                <Text 
                    onPress={()=>this.checkTracking(this)}
                    style={styles.first_button}
                >
                    查看处置跟踪
                </Text> 
            )
        }
        if(category==1&&status_fixed==3){
            return(
                <Text 
                    onPress={this.changeService.bind(this,signId)}
                    style={styles.first_button}
                >
                    请求服务    
                </Text> 
            )
        }
        // if(category==2&&status_fixed==2){
        //     return(
        //         <Text 
        //             onPress={this.changeEvent}
        //             style={styles.first_button}
        //         >
        //             订单拆分
        //         </Text> 
        //     )
        // }
        if(category==2&&status_fixed==2){
            return(
                <Text 
                    onPress={this.changeEvent}
                    style={styles.first_button}
                >
                    订单拆分
                </Text> 
            )
        }
        if(category==2&&status_fixed==3){
            return(
                <Text 
                    onPress={this.changeEvent}
                    style={styles.first_button}
                >
                    订单拆分
                </Text> 
            )
        }   
        // if(category==2&&status_fixed==4){
        //     return(
        //         <Text 
        //             onPress={this.changeEvent}
        //             style={styles.first_button}
        //         >
        //             订单拆分    
        //         </Text> 
        //     )
        // }
    }
    //进入请求服务页
    changeService(signId){
        // console.log(signId)
        this.props.navigation.navigate('service',{signId:signId})
    }
    //订单状态   
    getStatus(){
        
        const {status_sign}=this.state;
        console.log(status_sign)
        switch(status_sign){
            case(1): return '待发布'
            case(2): return '审核中'
            case(3): return '审核不通过'
            case(4): return '招标中'
            case(5): return '选标中'
            case(6): return '流标'
            case(7): return '招标完成'
            case(8): return '服务中'
            case(9): return '服务完成'
            case(10): return '订单关闭'
        }
    }
    //tabs切换
    changeTab(item){
        this.setState({
            tabIndex:item.id,
        })
    }   
    //切换服务单tabs
    changeServiceTab(item){
        console.log(1)
        
        this.setState({
            serviceNumberIndex:item.id,
            item:item
        })
        // this.setState({
        //     service_Id:serviceIds
        // })
        // this.setState((preState,props)=>{
        //     service_Id:service_Id,
        //     // serviceNumberIndex:item.id
        // },console.log(this.state.service_Id,this.state.serviceNumberIndex))
        const service_Id=item.serviceId
        this.setState({
            service_Id:service_Id //之所以更新 是要用于获取跟踪流程所有坐标
        })
        requests.get(`/gzapi/service/get?id=${service_Id}`).then(res=>{
            console.log(res)
            const shop_name=res.data.detail.product.name;
            const service_status=res.data.status
            console.log(service_status)
            this.setState({
                shop_name:shop_name,
                service_status:service_status
            },()=>console.log(this.state.service_status))
        }).catch(err=>{
            console.log(err)
        })
        requests.get(`/gzapi/follow/list?id=${service_Id}`).then(res=>{
            console.log(res)
            let service_all=res.data.rows;
            const service_data=res.data.service;
            const order_time=service_data.order; //订单生成时间
            const service_time=service_data.ctime; //服务单生成时间
            // this.setState({
            //     service_data:service_data
            // })
            // const id=service_all[0].id;
            // this.setState({
            //     follow_id:id
            // })

        let step_all=[];
        for(let item of service_all){
            // console.log(item)   
            const is_finish=item.is_finish;
            if(is_finish==1){
                is_finish='wait'
            }
            if(is_finish==2){
                is_finish='finish'
            }
            this.setState({
                is_finish:is_finish
            })
            const name=item.step.name
            
            console.log(name)
            // const form=JSON.parse(item.step.form)
            step_all.push({name:name,status:is_finish})
            // step_all[0]['desc']=moment.utc(order_time).format('YYYY-MM-DD');
            // step_all[1]['desc']=moment.utc(service_time).format('YYYY-MM-DD');
            // console.log(step_all)    
        }
            let c=[]
            c = c.concat([{name:'订单生成',status:'finish'},{name:'生成服务单',status:'finish'}],step_all)
            console.log(c)
            c[0]['desc']=moment.utc(order_time).format('YYYY-MM-DD');
            c[1]['desc']=moment.utc(service_time).format('YYYY-MM-DD');
        // console.log(step_all)
        // step_all.splice(0,0,{name:'订单生成',status:'finish'})
        // step_all.splice(1,1,{name:'生成服务单',status:'finish'})
        // step_all[0]['desc']=moment.utc(order_time).format('YYYY-MM-DD');
        // step_all[1]['desc']=moment.utc(service_time).format('YYYY-MM-DD');
        this.setState({
            steps1:c
        },()=>console.log(this.state.steps1))
        //     let steps_all=[];
        //     for(let item of service_all){
        //         steps_all.push({
        //             step:item.step
        //         })
        //     }
        //     this.setState({
        //         service_all:service_all,
        //         step_all:steps_all
        //     })
        })
        .catch(err=>{
            console.log(err)
        })

        // const service_Id=item.serviceId
        // console.log(service_Id)
        requests.get(`/gzapi/follow/current?id=${service_Id}`).then(res=>{
            console.log(res)
            const id=res.data.id
            let is_finish=res.data.is_finish;
            console.log(is_finish)
            const name=res.data.step.name
            const content=JSON.parse(res.data.content)
            const form=JSON.parse(res.data.step.form)
            this.setState({
                content:content,
                name:name,
                form:form,
                follow_id:id
            },()=>console.log(this.state.content,this.state.form))
            if(is_finish==1){
                is_finish= 'wait'
                this.setState({
                    is_finish_A:is_finish
                },()=>console.log(this.state.is_finish_A))
            }
            if(is_finish==2){
                is_finish= 'finish'
                this.setState({
                    is_finish_A:is_finish
                },()=>console.log(this.state.is_finish_A))
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    //订单拆分
    changeEvent(){
        const {signId,auctions} =this.state
        console.log(signId,auctions)
        this.props.navigation.navigate('splitOrder',{
            signId:signId,
            auctions:auctions,
            refresh:()=>{alert(1)}
        })
    }
    // refresh(){
    //     let that =this;
    //     that.init();
    //     // alert(1)
    //     // this.handleDetails()
    //     // this.getServiceList()
    //     // this.getDisposeList()  
    // }
    //查看处置跟踪
    checkTracking(){
        this.setState({
            tabIndex:1
        })
    }
    //公司信息
    getComponentInfo(){
        const {category,dispose_company,product_company,status_fixed,order_allData,auctions} =this.state
        if(category==1){    
            return <ComponentInfo 
                        data={dispose_company} 
                        category={category}
                        status_fixed={status_fixed}
                        signId={this.state.signId}
                        navigate={this.props.navigation.navigate}
                        order_allData={order_allData}
                        auctions={auctions}
                    />
        }
        if(category==2){
            return <ComponentInfo 
                        data={product_company}
                        category={category}
                        status_fixed={status_fixed}
                        signId={this.state.signId}
                        navigate={this.props.navigation.navigate}
                        order_allData={order_allData}
                        auctions={auctions}
                    />
        }
    }
    handleDetails(){
        const {category,status_fixed,signId}=this.props.navigation.state.params;
        console.log(signId)
        console.log(status_fixed)
        this.setState({
            status_fixed:status_fixed,
            category:category,
            signId:signId
        })
        //  console.log(category)
        requests.get(`/gzapi/order/get?id=${signId}`).then(res=>{
            const order_allData=res.data //单个订单的整体数据
            const auctions =res.data.auction;              //从单个订单接口拿的auction
            this.setState({
                auctions:auctions,
                order_allData:order_allData
            })
            console.log(res.data)
            if(category==2){
                const product_company=res.data.product_company;
                this.setState({
                    product_company:product_company
                },()=>{
                    console.log(this.state.product_company)
                })
            }
            if(category==1){
                const dispose_company=res.data.dispose_company;
                this.setState({
                    dispose_company:dispose_company
                })
            }
        }).catch(err=>{
            console.log(err)
        })
        
        
    }
    //需求详情
    getRequireInfo(){
        const {auctions}=this.state;
        console.log(auctions)   
        if(auctions.pointMap){
            const {p_name,c_name,a_name}=auctions.pointMap[0].point;
            return(
                <ScrollView>
                     <View style={styles.infomation}>
                         <View style={styles.header}>
                             <Text style={styles.infomation_header}>
                                 项目基本信息：({this.getStatus()})
                             </Text>
                             {this.getSplitOrder()}
                         </View>
                         <Text style={styles.infomation_item}>
                             订单编号：{auctions.sn}
                         </Text>
                         <Text style={styles.infomation_item}>
                             处置地点：{p_name} {c_name} {a_name}
                         </Text>
                     </View>
                     {this.renderItem()}
                    {this.getComponentInfo()} 
                </ScrollView> 
            )
        }
    }
    //期望完成时间、请求服务时间
    renderItem(){
        const date=this.state.auctions.rtime;
        return(
            <View style={{paddingLeft:width*0.05}}>
                <Text style={styles.infomation_item}>
                    期望完成时间：{moment.utc(date).format('YYYY-MM-DD')}
                </Text>
                <Text style={styles.infomation_item}>
                    备注：请提前三天电话联系
                </Text>
            </View>
        )
    }
    //服务单列表请求
    getServiceList(){
        const {signId}=this.props.navigation.state.params;
        console.log(signId)
        requests.get(`/gzapi/service/list?orderId=${signId}&isExport=1`).then(res=>{
            console.log(res)
            const rows=res.data.rows;
            //第一个服务单id
            if(rows[0]){
                const service_Id=rows[0].id   
                this.setState({
                    service_Id:service_Id
                })
                requests.get(`/gzapi/service/get?id=${service_Id}`).then(res=>{
                    console.log(res)
                    const shop_name=res.data.detail.product.name;
                    const service_status=res.data.status
                    this.setState({
                        shop_name:shop_name,
                        service_status:service_status
                    },()=>console.log(this.state.service_status))
                }).catch(err=>{
                    console.log(err)
                })
                //首次渲染的整个跟踪流程
                requests.get(`/gzapi/follow/list?id=${service_Id}`).then(res=>{
                    console.log(res)
                    const rows=res.data.rows;
                    const service_data=res.data.service;
                    // this.setState({
                    //     service_data:service_data
                    // })
                    const order_time=service_data.order; //订单生成时间
                    const service_time=service_data.ctime; //服务单生成时间 
                    let step_all=[];
                    for(let item of rows){
                        console.log(item)   
                        const is_finish=item.is_finish;
                        if(is_finish==1){
                            is_finish='wait'
                        }
                        if(is_finish==2){
                            is_finish='finish'
                        }
                        this.setState({
                            is_finish:is_finish
                        })
                        const name=item.step.name
                        console.log(name)
                        // const form=JSON.parse(item.step.form)
                        step_all.push({name:name,status:is_finish})
                        // console.log(step_all) 
                    }
                    let c=[]
                    c = c.concat([{name:'订单生成',status:'finish'},{name:'生成服务单',status:'finish'}],step_all)
                    console.log(c)
                    c[0]['desc']=moment.utc(order_time).format('YYYY-MM-DD');
                    c[1]['desc']=moment.utc(service_time).format('YYYY-MM-DD');
                    this.setState({
                        steps1:c
                    },()=>console.log(this.state.steps1))
                })
                .catch(err=>{
                    console.log(err)
                })
                //首次渲染的当前跟踪流程
                requests.get(`/gzapi/follow/current?id=${service_Id}`).then(res=>{
                    console.log(res)
                    const id=res.data.id  //跟踪流程id
                    let is_finish=res.data.is_finish;
                    console.log(is_finish)
                    const name=res.data.step.name
                    const content=JSON.parse(res.data.content)
                    const form =JSON.parse(res.data.step.form)
                    this.setState({
                        content:content,
                        name:name,
                        form:form,
                        follow_id:id
                    },()=>console.log(this.state.content))
                    if(is_finish==1){
                        is_finish= 'wait'
                        this.setState({
                            is_finish_A:is_finish
                        },()=>console.log(this.state.is_finish_A))
                    }
                    if(is_finish==2){
                        is_finish= 'finish'
                        this.setState({
                            is_finish_A:is_finish
                        },()=>console.log(this.state.is_finish_A))
                    }
            })
            .catch(err=>{
                console.log(err)
            })

            let flow_id_all=[];
            for(let i=0;i<rows.length;i++){
                console.log(rows)
                const item=rows[i]
                flow_id_all.push({serviceNumber:item.sn,id:i,serviceId:item.id})
                this.setState({
                    serviceTabs:flow_id_all
                })   
            }
            console.log(flow_id_all)
            // for(let _item of flow_id_all){
            //     const service_Id=_item.serviceId;
            //     console.log(service_Id)
            //     this.setState({
            //         service_Id:service_Id
            //     },console.log(this.state.service_Id))
            // }
            }
            
        }).catch(err=>{
            console.log(err)
        })
    }
    //处置跟踪
    getTracing(){
        
        console.log(this.state.serviceTabs)
        // const steps1=this.state.step;
        // console.log(steps1);
        return(
            this.state.serviceTabs.length!=''?
            <View>
                {/* <View> */}
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={{paddingTop:height*0.01,marginLeft:width*0.02,marginRight:width*0.03,fontSize:16,
                            borderBottomColor:'#333333',borderBottomWidth:1
                        }}
                        >
                            {
                                this.state.serviceTabs.map(item=>{
                                return <Text 
                                    key={item.serviceNumber} 
                                    style={this.state.serviceNumberIndex == item.id ?
                                    styles.serviceTabs:
                                    {paddingLeft:width*0.03,
                                        marginRight:width*0.01,
                                        marginLeft:width*0.01,
                                    }} 
                                    onPress={this.changeServiceTab.bind(this,item)}
                                    >
                                    服务单号：{item.serviceNumber}
                                </Text>
                                })
                            }
                    </ScrollView> 
                {/* </View> */}
                
                <Tracing 
                    navigate={this.props.navigation.navigate} 
                    service_all={this.state.service_all}
                    // step={this.state.step}
                    serviceTabs={this.state.serviceTabs}
                    step_all={this.state.step_all}
                    service_Id={this.state.service_Id}
                    // ss_id={ss_id}
                    steps1={this.state.steps1}
                    style={{flex:1}}
                    content={this.state.content}
                    form={this.state.form}
                    name={this.state.name}
                    follow_id={this.state.follow_id}
                    shop_name={this.state.shop_name}
                    auctions={this.state.auctions}
                    service_status={this.state.service_status}
                    service_data={this.state.service_data}
                    />
                {/* <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                <View style={{ marginTop: 30 }}>
                <WingBlank size="lg">
                    <Steps current={1}>
                    {this.state.steps1.map((item, index) => (
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
                </ScrollView> */}
            </View>
            :
            <Text style={{fontSize:22,paddingLeft:width*0.05}}>暂无处置跟踪</Text>
            
        )
    }
    //获取处置跟踪流程列表
    getDisposeList(){
        console.log(this.state.serviceTabs)

        //首个服务单号
        if(this.state.serviceTabs.length>0){
            const ss_id=this.state.serviceTabs[0].serviceId;
            requests.get(`/gzapi/follow/list?id=${ss_id}`).then(res=>{
                console.log(res)
                // const content=JSON.parse(res.data.rows[0].content)
                const service_all=res.data.rows
                console.log(service_all)   
                // let steps_all=[];
                // for(let item of service_all){
                //     console.log(item)
                //     steps_all.push({
                //         step:item.step
                //     })
                // }
                // this.setState({
                //     service_all:service_all,
                //     step_all:steps_all
                // }) 
                // // const data
            })
            .catch(err=>{
                console.log(err)
            })
        } 

        
    }
    //获取流程当前节点处置跟踪信息
    // getCurrentDispose(){
    //     // const id=rows[0].id
    //     //     console.log(serviceId)
    //         requests.get('/gzapi/follow/current?id=30').then(res=>{
    //         const step=res.data.step;
    //         this.setState({
    //             step:step
    //         })
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    // }
    componentWillUnmount(){
        this.subscription.remove();
        this.subscription_item.remove();
    }
    componentDidMount(){
        //监听页面
        this.subscription=DeviceEventEmitter.addListener('key',(params)=>{
            this.handleDetails()
            this.getServiceList()
            this.getDisposeList() 
        })
        this.subscription_item=DeviceEventEmitter.addListener('name',(params)=>{
            // this.handleDetails()
            // this.getServiceList()
            // this.getDisposeList() 
            const item=this.state.item;
            if(item!=null){
                this.changeServiceTab(item)
            }else{
                this.getServiceList()
            }
        })

        const {detailsData,status_sign,status_fixed} =this.props.navigation.state.params
        console.log(detailsData,status_sign)
        this.setState({
            detailsData:detailsData,
            status_sign:status_sign
        })
        for(let item of detailsData) {
            let auction=item.auction  //从订单列表接口拿的auction
            this.setState({
                auction:auction
           })
        }
        // console.log(detailsData)
        this.handleDetails()
        this.getServiceList()
        this.getDisposeList()   
        // this.getCurrentDispose()

        // //获取整个流程的节点名称，描述
        // const service_all=this.state.service_all
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

        // const serviceTabs=this.state.serviceTabs;
        // console.log(serviceTabs)
        // // const serviceId_I=serviceTabs[0].serviceId;
        // //     console.log(serviceId_I)
        //     requests.get('/gzapi/follow/current?id=30').then(res=>{
        //         console.log(res)
        //     const step=res.data.step;
        //     this.setState({
        //         step:step
        //     })
        // })
        // .catch(err=>{
        //     console.log(err)
        // })
    }
    // //首次加载的第一个服务单数据
    // getId(id_all){
    //     const ss_id=id_all[0]
    //     console.log(ss_id)
    //     this.setState({
    //         ss_id:ss_id
    //     })
    // }

    // componentWillReceiveProps(){
    //     //首次加载的第一个服务单数据
    //     const {serviceTabs} =this.state;
    //     console.log(serviceTabs)
    //     //所有服务单id的集合
    //     let id_all=[]
    //     for(let item of serviceTabs){
    //         const serviceId=item.serviceId
    //         console.log(serviceId)
    //         id_all.push(serviceId)
    //         this.getId(id_all)
    //     }
    // }
    render(){
        console.log(this.state.service_status)
        // console.log(this.state.is_finish_A)
        
        // 首次加载的第一个服务单数据
        const {serviceTabs} =this.state;
        // console.log(serviceTabs)

        
        const {auction,detailsData}=this.state;
        // console.log(pointMap)
        // for(var i=0;i<pointMap.length;i++){
        //     var item=pointMap[i]
        //     console.log(item)
        // }
        // console.log(item)
        return (
            <View style={styles.detailsWrapper}>
            <View style={styles.wrapper_Item}>
            {
                this.state.tabs.map(item=>{
                    return <Text 
                                key={item.id} 
                                style={this.state.tabIndex == item.id ?
                                [styles.tabs_normal,styles.tabs_bottom]:
                                [styles.tabs_change,styles.tabs]} 
                                onPress={()=>{this.changeTab(item)}}
                            >
                                {item.name}
                            </Text>
                })
            }
            </View>
                <View style={{flex:1}}>
                    {   this.state.tabIndex==0?
                        this.getRequireInfo()
                        :
                        this.getTracing()
                    }
                 </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    detailsWrapper: {
        flex:1
    },
    wrapper_Item: {
        flexDirection:'row',
        paddingLeft:width*0.08,
        borderBottomColor:'#D7D7D7',
        borderBottomWidth:1.5
    },
    tabs_normal: {
        color:'rgb(90, 162, 70)',
        fontSize:18,
        paddingTop:height*0.015,
        marginRight:width*0.07
    },
    tabs_change: {
        paddingTop:height*0.015,
        fontSize:18,
        fontWeight:'100',
        marginRight:width*0.07
    },
    tabs_bottom: {
        paddingBottom:5,
        borderBottomWidth:3,
        borderBottomColor:'rgb(90, 162, 70)'
    },
    infomation: {
        paddingLeft:width*0.05
    },
    header: {
        flexDirection:'row',
        position:'relative'    
    },  
    infomation_header: {
        fontSize:16,
        color:'#333333',
        paddingTop:height*0.015,
        fontWeight:'bold'
    },  
    first_button: {
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:7,
        paddingRight:7,
        backgroundColor:"#5AA246",
        color:'white',
        position:'absolute',
        right:width*0.06,
        top:height*0.017,
        borderRadius:5
    },
    infomation_item: {
        fontSize:15,
        marginTop:height*0.016,
    },
    // dispose_Info: {
    //     marginTop:15,
    //     paddingLeft:width*0.05
    // },
    // componentName: {
    //     fontSize:16,
    //     color:'#333333',
    //     fontWeight:'bold'
    // },
    serviceTabs: {
        borderBottomWidth:3,
        borderBottomColor:'rgb(90, 162, 70)',
        paddingBottom:5,
        paddingLeft:width*0.03,
        marginLeft:width*0.01,
        marginRight:width*0.01,
        color:'rgb(90, 162, 70)'
    }
})