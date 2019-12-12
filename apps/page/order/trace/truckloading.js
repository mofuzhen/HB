import React,{Component} from 'react'
import {View,Text,Dimensions,StyleSheet,ScrollView,TextInput} from 'react-native'
const {width}=Dimensions.get('window')

export default class Dispose extends Component{
    constructor(props){
        super(props);
        this.state={
            carNumberIndex:0,
            carTabs:[
                {id:0,title:'车辆一',name:'粤BXB32432'},
                {id:1,title:'车辆二',name:'粤BX445'},
                {id:2,title:'车辆三',name:'粤BX445'},
                {id:3,title:'车辆四',name:'粤BX445'}
            ]
        }
    }
    changeCarTab(item){
        this.setState({
            carNumberIndex:item.id
        })
    }
    render(){
        return(
            <View style={styles.trunloading}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{paddingTop:13,marginLeft:width*0.02,marginRight:width*0.03,
                        borderBottomColor:'#CCCCCC',borderBottomWidth:1
                    }}
                    >
                        {
                            this.state.carTabs.map(item=>{
                            return <Text 
                                key={item.id} 
                                style={this.state.carNumberIndex == item.id ?
                                styles.carTabs:
                                {paddingLeft:width*0.03,
                                    marginLeft:width*0.01,
                                    marginRight:width*0.02, 
                                    fontSize:17,
                                }} 
                                onPress={()=>{this.changeCarTab(item)}}
                                >
                                {item.title}:{item.name}
                            </Text>
                            })
                        }
                </ScrollView>
                <View style={styles.product}>
                    <Text style={{fontSize:16,width:width*0.2,paddingTop:5}}>
                        装车商品：
                    </Text>
                    <Text style={{borderWidth:1,width:width*0.35}}>
                        
                    </Text>
                    <TextInput 
                        placeholder='请输入装车数量'
                        style={styles.input}
                        />
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    carTabs: {
        borderBottomWidth:3,
        borderBottomColor:'rgb(90, 162, 70)',
        paddingBottom:5,
        paddingLeft:width*0.03,
        marginLeft:width*0.01,
        marginRight:width*0.02,
        color:'rgb(90, 162, 70)',
        fontSize:17,
    },
    product: {
        flexDirection:'row',
        paddingLeft:width*0.05,
        paddingRight:width*0.05,
        marginTop:10
    },
    input: {
        width:width*0.3,
        marginLeft:width*0.05,
        height:30
    }
})  