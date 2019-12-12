// import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStorage} from 'react-native'
// 存储
export const _storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
        console.log('保存成功');
    } catch (error) {
        console.log('保存失败');
    }
}
 
export const _retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            console.log('获取成功');
            return value;
        }else{
            console.log('获取失败');
            return null;
        }
    } catch (error) {
        console.log('获取失败');
    }
}
