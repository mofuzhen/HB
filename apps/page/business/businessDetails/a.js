
import ImageViewer from '@dwqs/react-native-image-viewer';
import React, {Component} from 'react'
import { Modal} from 'react-native'; 

export default class A extends Component{
    constructor(props){
        super(props);
        this.state={
            shown:true,
            imgsArr :[],
            curIndex:0,
        }
    }
    componentDidMount(){
        
        const {componentData} =this.props.navigation.state.params;
        console.log(componentData)
        this.getimgs(componentData)
        console.log(this.state.imgsArr) 
    }
    getimgs(componentData){
        let imgs=[];
        for(let i=0;i<componentData.imgList.length;i++){
            const url='http://39.104.72.185:7001'+componentData.imgList[i].url
            console.log(url)
            imgs.push(url) 
            // console.log(imgs) 
            this.setState({
                imgsArr:imgs
            },() => {
                //这里打印的是最新的state值
                console.log(this.state.imgsArr);
            }) 
        }
        
        console.log(this.state.imgsArr)
    }
    closeViewer(){
        this.setState({
            shown:false,
            curIndex:0,  
        })
        this.props.navigation.navigate('businessDetails')
        }
    render(){
        return(
            <Modal
                     visible={this.state.modalVisible}
                     transparent={true}
                     >
        <ImageViewer shown={this.state.shown}
             imageUrls={this.state.imgsArr}
             onClose={this.closeViewer.bind(this)}
             index={this.state.curIndex}>
        </ImageViewer>  
        </Modal>
        )
    }
}
