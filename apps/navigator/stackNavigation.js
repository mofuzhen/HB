import React from 'react'
import {View,Dimensions} from 'react-native'
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import businessList from '../page/business/businessList';
import businessDetails from '../page/business/businessDetails';
import login from '../page/login'
import orderList from '../page/order/orderList'
import details from '../page/order/details/details'
import a from '../page/business/businessDetails/a'
import service from '../page/order/details/service'
import splitOrder from '../page/order/details/splitOrder'   
import splitOrderInfo from '../page/order/details/splitOrderInfo'
import dispose from '../page/order/trace/dispose'
import map from '../page/order/details/map'
import aa from '../page/aa'
var {height}=Dimensions.get('window')

const Initrouter  = createStackNavigator ({
    login:{
        screen:login,
        navigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    }
})
const MainNavigator  = createStackNavigator ({
    // login:{
    //     screen:login,
    //     navigationOptions: {
    //         header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
    //     }
    // }, 
    businessList:{
        screen:businessList,
        navigationOptions: {
            header: null,
        }
    },
    dispose:{
        screen:dispose,
        navigationOptions:({navigation}) => ({
            headerStyle:{
                height:height*0.07
              },
            headerRight: <View/>,
            headerTitle: `${navigation.state.params &&navigation.state.params.title}` ,
            headerTintColor: '#333333',
                headerTitleStyle: { 
                flex:1,
                textAlign:'center',
                fontSize:23
            }
        })
    },
    orderList:{
        screen:orderList,
        navigationOptions: {
            header: null,
        }
    },
    details:{
        screen:details,
        navigationOptions:({navigation}) => ({
            headerRight: <View/>,
            headerTitle: '订单详情' ,
              headerTintColor: '#333333',
              headerStyle:{
                height:height*0.07
              },
              headerTitleStyle: { 
                  flex:1,
                textAlign:'center',
                fontSize:23
              },
        })
    },
    businessDetails:{
        screen:businessDetails,
        navigationOptions:({navigation}) => ({
            headerStyle:{
                height:height*0.07
              },
            headerRight: <View/>,
            headerTitle: '企业信息' ,
            headerStyle: {
                borderBottomWidth: 0,
                elevation: 0,
                backgroundColor: 'rgba(17, 179, 24, 1)',
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                flex:1, 
                // fontWeight: 'bold',
                textAlign:'center',
                fontSize:23,
                paddingTop:8
              },
              
        })
    },
    a:{
        screen:a,
        navigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    },
    service:{
        screen:service,
        navigationOptions: {
            headerStyle:{
                height:height*0.07
              },
            headerRight: <View/>,
            headerTitle: '请求服务' ,
            headerTintColor: '#333333',
              headerTitleStyle: { 
                flex:1,
                textAlign:'center',
                fontSize:23
            }
        }
    },
    splitOrder:{
        screen:splitOrder,
        navigationOptions: {
            headerStyle:{
                height:height*0.07
              },
            headerRight: <View/>,
            headerTitle: '订单拆分' ,
            headerTintColor: '#333333',
              headerTitleStyle: { 
                flex:1,
                textAlign:'center',
                fontSize:23
            }
        }
    },
    splitOrderInfo:{
        screen:splitOrderInfo,
        navigationOptions: {
            headerStyle:{
                height:height*0.07
              },
            headerRight: <View/>,
            headerTitle: '订单拆分服务信息' ,
            headerTintColor: '#333333',
              headerTitleStyle: { 
                flex:1,
                textAlign:'center',
                fontSize:23
            }
        }
    },
    map:{
        screen:map,
        navigationOptions:{
            headerStyle:{
                height:height*0.07
              },
            headerRight: <View/>,
            headerTitle: '地图' ,
            headerTintColor: '#333333',
                headerTitleStyle: { 
                flex:1,
                textAlign:'center',
                fontSize:23
            }
        }
    }
});

export const RootNavigator = createAppContainer(createSwitchNavigator({
    // Init: Initrouter,
    // Main: MainNavigator,
    Auth:{
        screen:Initrouter
    },
    App:MainNavigator
}
));
const App =createAppContainer(RootNavigator)
export default App 
