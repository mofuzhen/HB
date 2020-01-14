import axios from 'axios';
// import AsyncStorage from '@react-native-community/async-storage';
// import {_retrieveData} from './AsyncStorage'
import {AsyncStorage} from 'react-native'

  
// const instance = axios.create({
//     baseURL: 'http://39.104.72.185:7001',
//     timeout: 20000,
//     headers: { 
//         'Content-Type': 'application/json;charset=utf-8',
//         // 'token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiIiLCJtb2JpbGUiOiI1IiwiaWF0IjoxNTYzODY1MjMyfQ.vV6a-gNRtFmjeWV-Azq130YOJv5R2VLy6VF-eoOg-2g'
//     }
// });

// axios.defaults.baseURL = 'http://39.104.72.185:7001'  //测试IP
axios.defaults.baseURL = 'http://39.100.51.78:7001'      //UAT IP
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'


export const _retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        // if (value !== null) {
            console.log('AsyncStorage:', key + '=>' + value);
            return value;
        // }else{
        //     console.log('获取失败');
        //     return Promise.reject('');
    } catch (error) {
        console.log('获取失败');
        // return false
        return Promise.reject(error);
    }
}


//请求拦截处理
axios.interceptors.request.use(async function (config) {

    const token = await _retrieveData('token')
    console.log(config)
    config.headers.token = token
    // .then((token)=>{
    //     // if (error) {
    //     //             alert('读取失败')
    //     //         }else {
    //     //             // console.log(result)
    //     //             alert('读取完成')
    //     //         }
    // }).catch(error => {
    //                 console.log(error)

    // })

    // AsyncStorage.getItem('token',function (error, result) {
    //     if (error) {
    //         alert('读取失败')
    //     }else {
    //         // console.log(result)
    //         alert('读取完成')
    //     }
           
    // })
    // AsyncStorage.getItem('token')
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 响应
axios.interceptors.response.use(response => {
    // 根据状态码做相应的事情
    const res = response.data
    if (res.code === 10005) { // 没有token
        // showToast(res.message,1500);
        // alert('没有token')
    }
    console.log(res);
    return res
}, (error) => {
    alert('出错了！请稍后再试！');
    return Promise.reject(error);
})

export const requests = {
    "post":(api, params= {})=>{
    //    return new Promise((resolve, reject) => {
    //     axios.post(api, params)
    //             .then(res => {
    //                 resolve(res.data)
    //             })
    //             .catch(error => {
    //                 reject(error)
    //             })
    //     })
    
        return axios.post(api, params).then(res => {
            console.log('res', res)
            return res
        })
    },
    "get":(api, querys = {})=>{
        // return new Promise((resolve, reject) => {
        //     axios.get(api)
        //         .then(res => {
        //             console.log('res', res)
        //             resolve(res.data)
        //         })
        //         .catch(error => {
        //             reject(error)
        //         })
        // })
        return axios.get(api, { params: querys }).then(res => {
            console.log('res', res)
            return res
        })
    }
}