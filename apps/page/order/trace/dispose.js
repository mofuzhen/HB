import React,{Component} from 'react'
import {ScrollView,View,Text,Dimensions,TextInput,StyleSheet,Image,TouchableOpacity,ImageBackground} from 'react-native'
import {requests} from '../../../http'
import ModalDropdown from 'react-native-modal-dropdown';
import CheckBox from 'react-native-checkbox';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import ImagePicker from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-crop-picker';
// import Spinner from 'react-native-loading-spinner-overlay';
const {width,height}=Dimensions.get('window')


export default class Dispose extends Component{
    constructor(props){
        super(props);
        this.state={
            title:1,
            content:'', //跟踪流程当前节点的content 传给后台需将JSON对象格式转化为JSON字符串
            form:[], //跟踪流程当前节点的form
            follow_id:1, //处置跟踪id
            data_0:[
                {url:'https://img01.sogoucdn.com/app/a/100520115/8e9410faedeefdf258b9acc6140fed0f'},
                {url:'https://img01.sogoucdn.com/app/a/100520115/8e9410faedeefdf258b9acc6140fed0f'}
            ],
            data_1:[],
            data_2:[],
            data_3:[],
            data_4:[],
            text: [],  //单选
            radio_content:['是','否','是非'],  //单选框选中的值
            isSe:true, //多选
            value:[],  //选中多选框的所有值
            initialPosition: 'unknown', //定位初始值
            latitude:1, //纬度
            longitude:1, //经度
            // Spinner:false,
            // images:[
            //     // {url:'https://img01.sogoucdn.com/app/a/100520115/8e9410faedeefdf258b9acc6140fed0f'},
            //     // {url:'https://img01.sogoucdn.com/app/a/100520115/8e9410faedeefdf258b9acc6140fed0f'}
            // ]
            
        }
        this.onSelect = this.onSelect.bind(this)
    }
    //上传视频
    _renderAddVideoView(){
         //判断state中是否存在图片路径信息，如果没有，就显示添加图片的按钮。
         console.info(this.state.data_1.length==0)  //true
         if(this.state.data_1.length==0){
             // alert(0)
             return (
                 <ImageBackground
                     source={require('../../../common/image/xuxian.webp')}
                     style ={styles.image}>
                     <TouchableOpacity onPress = {this.addOnClickedVideo.bind(this)}>
                         <Image style={{width:30, height:30}} source={require('../../../common/image/tianjia.webp')}></Image>
                     </TouchableOpacity>
                     <Text style ={styles.normalTitle}>上传视频</Text>
                     {/* 这里显示最多可以上传多少张 */}
                     <Text style ={styles.normalText}>(最多能上传5张)</Text>
                 </ImageBackground>
                 )
         }
 
         //pages 变量，用来存储，我们遍历出来的路径，生成的ImageBackground显示节点。
         var pages =[];
         if (this.state.data_1.length>0) {
             this.state.data_1.map(item => {
                 let url=item.url
                 // var imgType=["gif", "jpeg", "jpg", "bmp", "png","webp"];
                 var videoType=["avi","wmv","mkv","mp4","mov","rm","3gp","flv","mpg","rmvb"];
                 // if(RegExp("\.(" + imgType.join("|") + ")$", "i").test(url.toLowerCase())) {
                 if(RegExp("\.(" + videoType.join("|") + ")$", "i").test(url.toLowerCase())) {
                     pages.push(
                         <ImageBackground
                             index = {1}
                             source={require('../../../common/image/xuxian.webp')}
                             style ={styles.image}>
                             <ImageBackground source={{uri:url}} style={styles.uploadImage} />
                             <TouchableOpacity style={styles.rightDelButton} onPress = {()=>this.deleteLoadedVideo(url)}>
                                 <Image style={{width:20, height:20}} onPress = {()=>alert(23)} source={require('../../../common/image/shanchu.webp')}></Image>
                             </TouchableOpacity>
                         </ImageBackground>
                    )
                 }else{
                     return false;
                 }
             })
            
             //注意这里，如果图片数量小于5，那么我们需要显示可以继续添加。
             if(this.state.data_1.length<5){
                 // alert(1)
                 pages.push(
                 <ImageBackground
                     source={require('../../../common/image/xuxian.webp')}
                     style ={styles.image}>
                     <TouchableOpacity onPress = {this.addOnClickedVideo.bind(this)}>
                         <Image style={{width:60, height:60}} source={require('../../../common/image/tianjia.webp')}></Image>
                     </TouchableOpacity>
                     <Text style ={styles.normalTitle}>上传视频</Text>
                     {/* 这里显示最多可以上传多少张 */}
                     <Text style ={styles.normalText}>(最多能上传5张)</Text>
                 </ImageBackground>
                 )
             }
             return (pages)
         }
    }
    //添加视频
    
    addOnClickedVideo(){
        const options = {
            title: 'Video Picker',
            takePhotoButtonTitle: 'Take Video...',
            mediaType: 'video',
            videoQuality: 'medium',
          };
        ImagePicker.showImagePicker(options, response => {
            console.log('Response = ', response);
      
            if (response.didCancel) {
              console.log('User cancelled video picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
            //   let source = {uri: response.uri};
              let data_1=this.state.data_1;
              data_1.push({url: response.uri})
              // You can also display the image using data:
              // let source = { uri: 'data:image/jpeg;base64,' + response.data };
              
              this.setState({
                data_1: data_1,
              });
            }
          });
    //     //这里对应，react-native-image-crop-picker组件
    //     ImagePicker.openPicker({
    //         // multiple: true,
    //         minFiles:3,
    //         maxFiles:5,
    //         cropperChooseText:"确定",
    //         cropperCancelText:"取消",
    //     }).then(image => {
    //         let data_1=this.state.data_1
    //         data_1.push({url:image.path,mine:image.mine})
    //         this.setState({
    //         //   images: images.map(i => {
    //         //     console.log('received image', i);
    //         //     return {url: i.path, width: i.wi dth, height: i.height, mime: i.mime};
    //         //   })
    //         data_1:data_1
    //         });
    //       }).catch(e => alert(e));
    }
    //删除视频
    deleteLoadedVideo(url){
        // console.log(url)
        let imageUrls= new Set();
        imageUrls=this.state.data_1;
        // alert(imageUrls)
        //从set中删除掉url  
        // imageUrls.remove({url:url});
        // imageUrls.splice(imageUrls.indexOf(url).length)
        imageUrls.splice(imageUrls.findIndex(item => item === {url:url}), 1);
        //重新刷新视图
        this.setState({data_1:imageUrls})
    }
    //上传图片
    _renderAddImageView(){
        //判断state中是否存在图片路径信息，如果没有，就显示添加图片的按钮。
        console.info(this.state.data_0.length==0)  //true
        if(this.state.data_0.length==0){
            // alert(0)
            return (
                <ImageBackground
                    source={require('../../../common/image/xuxian.webp')}
                    style ={styles.image}>
                    <TouchableOpacity onPress = {this.addOnClickedImage.bind(this)}>
                        <Image style={{width:30, height:30}} source={require('../../../common/image/tianjia.webp')}></Image>
                    </TouchableOpacity>
                    <Text style ={styles.normalTitle}>上传图片</Text>
                    {/* 这里显示最多可以上传多少张 */}
                    <Text style ={styles.normalText}>(最多能上传5张)</Text>
                </ImageBackground>
                )
        }

        //pages 变量，用来存储，我们遍历出来的路径，生成的ImageBackground显示节点。
        var pages =[];
        if (this.state.data_0.length>0) {
            
            this.state.data_0.map(item => {
                let url=item.url
                var imgType=["gif", "jpeg", "jpg", "bmp", "png","webp"];
                if(RegExp("\.(" + imgType.join("|") + ")$", "i").test(url.toLowerCase())) {
                // if(RegExp("\.(" + videoType.join("|") + ")$", "i").test(url.toLowerCase())) {
                    pages.push(
                        <ImageBackground
                            index = {1}
                            source={require('../../../common/image/xuxian.webp')}
                            style ={styles.image}>
                            <ImageBackground source={{uri:url}} style={styles.uploadImage} />
                            <TouchableOpacity style={styles.rightDelButton} onPress = {()=>this.deleteLoadedImage(url)}>
                                <Image style={{width:20, height:20}} onPress = {()=>alert(23)} source={require('../../../common/image/shanchu.webp')}></Image>
                            </TouchableOpacity>
                        </ImageBackground>
                   )
                }else{
                    return false;
                }
            })
           
            //注意这里，如果图片数量小于5，那么我们需要显示可以继续添加。
            if(this.state.data_0.length<5){
                // alert(1)
                pages.push(
                <ImageBackground
                    source={require('../../../common/image/xuxian.webp')}
                    style ={styles.image}>
                    <TouchableOpacity onPress = {this.addOnClickedImage.bind(this)}>
                        <Image style={{width:60, height:60}} source={require('../../../common/image/tianjia.webp')}></Image>
                    </TouchableOpacity>
                    <Text style ={styles.normalTitle}>上传图片</Text>
                    {/* 这里显示最多可以上传多少张 */}
                    <Text style ={styles.normalText}>(最多能上传5张)</Text>
                </ImageBackground>
                )
            }
            return (pages)
        }
    }
    //添加图片
    addOnClickedImage(){
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
            },
            };
        ImagePicker.showImagePicker(options, response => {
            console.log('Response = ', response);
      
            if (response.didCancel) {
              console.log('User cancelled photo picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
            //   let source = {uri: response.uri};
              let data_0=this.state.data_0;
              data_0.push({url: response.uri})
              // You can also display the image using data:
              // let source = { uri: 'data:image/jpeg;base64,' + response.data };
              
              this.setState({
                data_0: data_0,
              });
            }
          });
        // //这里对应，react-native-image-crop-picker组件
        // ImagePicker.openPicker({
        //     // multiple: true,
        //     minFiles:3,
        //     maxFiles:5,
        //     cropperChooseText:"确定",
        //     cropperCancelText:"取消",
        // }).then(image => {
        //     let data_0=this.state.data_0
        //     data_0.push({url:image.path,mine:image.mine})
        //     this.setState({
        //     //   images: images.map(i => {
        //     //     console.log('received image', i);
        //     //     return {url: i.path, width: i.wi dth, height: i.height, mime: i.mime};
        //     //   })
        //     data_0:data_0
        //     });
        //   }).catch(e => alert(e));
    }
    //删除加载的图片
    deleteLoadedImage(url){
        // console.log(url)
        let imageUrls= new Set();
        imageUrls=this.state.data_0;
        // alert(imageUrls)
        //从set中删除掉url  
        // imageUrls.remove({url:url});
        // imageUrls.splice(imageUrls.indexOf(url).length)
        imageUrls.splice(imageUrls.findIndex(item => item === {url:url}), 1);
        //重新刷新视图
        this.setState({data_0:imageUrls})
    }
    onSelect(index, value){
        let arr=[];
        arr.push(value)
        this.setState({
        text: arr
        })
     }
    onChange(value,bl){
        var old_value = this.state.value;
        if(bl == true){
            //true
            old_value.push(value);
        }else{
            //falce
            //
            var index = old_value.indexOf(value);
            old_value.splice(index,1);
        }
        this.setState({
            value:old_value
        },()=>console.log(this.state.value));
    }
    submit(form,data_0,data_1,data_2,data_3,data_4,text,value){
        const {follow_id}=this.state;
        for(let i=0;i<form.length;i++){
            if(form[i].key=='1'){
                if(form[i].type!="content"){
                    form[i].datas=data_0
                }
            }
            if(form[i].key=='2'){
                form[i].datas=data_1
            }
            if(form[i].key=='3'){
                form[i].datas=data_2
            }
            if(form[i].key=='4'){
                form[i].datas=data_3
            }
            if(form[i].key=='5'){
                form[i].datas=data_4
            }
            if(form[i].key=='6'){
                form[i].datas=text
            }
            if(form[i].key=='7'){
                form[i].datas=value
            }
        }  
        const content=JSON.stringify(form)
        console.log(content) 
        
        requests.post(`/gzapi/follow/update`,{
            content:`${content}`,
            id:`${follow_id}`,
            latitude:`${this.state.latitude}`,
            longitude:`${this.state.longitude}`
        }).then(res=>{
            if(res.code===0){
                this.props.navigation.navigate('details')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    onPress(){

    }
    handleKey_0(form){
        const form_0=form[0]
        const type=form_0.type
        let arr=[];
        switch(type){
            case('text'):
                return(
                    <View style={styles.info}>
                        <Text style={{fontSize:17,width:width*0.2}}>
                            {form_0.filed}：
                        </Text>
                        <TextInput
                            style={[styles.input,{width:width*0.7}]}
                            placeholder={form_0.val[0]}
                            onChangeText={text=>{
                                arr.push(text)
                                this.setState({
                                    data_0:arr
                                })
                            }}
                        />
                    </View>
                );
            case('content'):
                return (
                        <Text style={{fontSize:22,textAlign:'center',marginTop:height*0.1,marginBottom:height*0.1}}>
                        {form_0.datas[0]}
                        </Text>
                    );
            case('image'):
                return (
                    <View style={{marginBottom:height*0.04,flex:1}}>
                        <Text style={{fontSize:17,width:width*0.2}}>
                        {form_0.filed}
                        </Text>
                        <TouchableOpacity onPress={()=>this.onPress}>
                            <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                                {
                                //重点,这个方法负责添加我们的图片。
                                    this._renderAddImageView()
                                }
                            </View>
                        </TouchableOpacity>   
                    </View>
                );
            case('filed'):
                return(
                    <View style={{flexDirection:'row',marginBottom:height*0.04}}>
                        <Text style={{fontSize:17,width:width*0.2,marginTop:height*0.02,textAlign:'right'}}>
                            {form_0.filed}：
                        </Text>
                        <TouchableOpacity onPress={()=>this.onPress}>
                            <Text 
                                style={{width:width*0.2,height:height*0.1,borderColor:'#333333',
                                borderWidth:1,marginLeft:width*0.05
                            }}> 
                            </Text>
                        </TouchableOpacity>   
                    </View>
                );
        }
    }
    handleKey_1(form){
        const form_1=form[1]
        const type=form_1.type
        let arr=[];
        switch(type){
            case('text'):
                return(
                    <View>
                        <View style={styles.info}>
                            <Text style={{fontSize:17,width:width*0.2}}>
                            {form_1.filed}：
                            </Text>
                            <TextInput  
                                placeholder={form_1.val[0]}
                                style={[styles.input,{width:width*0.7}]}
                                onChangeText={text=>{
                                    arr.push(text)
                                    this.setState({
                                        data_1:arr
                                    })
                                }}
                                />
                        </View>
                    </View>    
                );
            case('filed'):
                return(
                    <View style={{marginBottom:25,flex:1}}>
                        <Text style={{fontSize:17,width:width*0.2,marginTop:height*0.02}}>
                            {form_1.filed}
                        </Text>
                        <TouchableOpacity onPress={()=>this.onPress}>
                            <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                                {
                                //重点,这个方法负责添加我们的视频。
                                    this._renderAddVideoView()
                                }
                            </View>
                        </TouchableOpacity>  
                    </View>
                );
        }
    }
    handleKey_2(form){
        const form_2=form[2]
        const type=form_2.type
        let arr=[];
        switch(type){
            case('text'):
                return(
                    <View>
                        <View style={styles.info}>
                            <Text style={{fontSize:17,width:width*0.2}}>
                            {form_2.filed}：
                        </Text>
                        <TextInput  
                            placeholder={form_2.val[0]}
                            style={[styles.input,{width:width*0.7}]}
                            onChangeText={text=>{
                                arr.push(text)
                                this.setState({
                                    data_2:arr
                                })
                            }}
                        />
                        </View>
                    </View>    
                );
            case('textarea'):
                return(
                    <View style={{flex:1}}>
                         <View style={{flex:1,height:200}}>
                            <View>
                                {/* 以下文本框，可以忽略 */}
                                <Text style={{fontSize:17}}>
                                    {form_2.filed}(最多输入100字)
                                </Text>
                            </View>
                            <TextInput style={{marginTop:2,borderWidth:1,borderColor:'#CCCCCC',paddingTop:0,
                                fontSize:18,width:width*0.9,
                                height:150,borderRadius:5,textAlignVertical:'top'}} 
                                placeholder="请输备注"  
                                // autoFocus={true}
                                maxLength={200}
                                multiline={true}
                                onChangeText={
                                (text) => { 
                                    arr.push(text)
                                    this.setState({
                                        data_2:arr
                                    })
                                }
                            }/>
                        </View>
                    </View>                      
                )
        }
    }
    handleKey_3(form){
        const form_3=form[3]
        const type=form_3.type
        let arr=[];
        switch(type){
            case('textarea'):
            return(
                <View>
                    <View style={styles.info}>
                        <Text style={{fontSize:17,width:width*0.2}}>
                            {form_3.filed}：
                        </Text>
                        <TextInput  
                            placeholder={form_3.val[0]}   
                            style={[styles.input,{width:width*0.7}]}
                            onChangeText={text=>{
                                arr.push(text)
                                this.setState({
                                    data_3:arr
                                })
                            }}
                        />
                    </View>
                </View>                      
            )
        }
    }
    handleKey_4(form){
        const form_4=form[4]
        const type=form_4.type
        let arr=[];
        switch(type){
            case('select'):
            return(
                <View>
                    <View style={styles.info,{flexDirection:'row'}}>
                        <Text style={{fontSize:17,width:width*0.2,color:'#333333'}}>
                            {form_4.filed}：
                        </Text>
                        <ModalDropdown 
                            options={form_4.datas} 
                            defaultValue='请选择'
                            dropdownStyle={{width:width*0.7,height:100}}
                            textStyle={{borderWidth:1,fontSize:18,
                                    width:width*0.7,height:30,color:'#CCCCCC',paddingTop:4,
                                    paddingLeft:100,paddingTop:0.8,borderColor:'#333333',
                                    borderRadius:1
                            }}
                            onSelect={(idx,item) => {
                            arr.push(item)
                            this.setState({ 
                                data_4: arr  
                            },()=>console.log(this.state.data_4));
                        }}
                            />
                    </View>
                </View>                      
            )
        }
    }
    handleKey_5(form){
        const {radio_content}=this.state;
        const form_5=form[5]
        const type=form_5.type
        switch(type){
            case('radio'):
            return(
                <View>
                    <View style={styles.info,{flexDirection:'row',marginLeft:width*0.08}}>
                        <Text style={{fontSize:17,paddingTop:30,color:'#333333'}}>
                            {form_5.filed}：
                        </Text> 
                        {
                            radio_content.length>0?
                            <View style={{padding:0}}>
                                <RadioGroup
                                    onSelect = {(index, value) => this.onSelect(index, value)}
                                    style={{flexDirection:'row',paddingTop:23}}
                                >
                                    <RadioButton value={radio_content[0]}>
                                        <Text>{radio_content[0]}</Text>
                                    </RadioButton>
                                    <RadioButton value={radio_content[1]}>
                                        <Text>{radio_content[1]}</Text>
                                    </RadioButton>
                                    <RadioButton value={radio_content[2]}>
                                        <Text>{radio_content[2]}</Text>
                                    </RadioButton>
                                </RadioGroup>
                            </View>:null
                        }
                        </View>
                </View>                      
            )
        }
    }
    handleKey_6(form){
        const form_6=form[6]
        const type=form_6.type
        switch(type){
            case('checkbox'):
            return(
                <View>
                    <View style={styles.info,{marginLeft:width*0.08,flexDirection:'row',marginTop:23}}>
                        <Text style={{fontSize:17}}>
                            {form_6.filed}：
                        </Text> 

                        <View style={
                            {
                                flexDirection:'row',
                                flexWrap:'wrap',
                                flex:1
                            }
                        }>
                
                            <View style={styles.cellView}>
                                <CheckBox
                                    label={'选项一'}
                                    onChange={this.onChange.bind(this,'选项一')}
                                    />
                            </View>
                            <View style={styles.cellView}>
                                <CheckBox
                                    label={'选项二'}
                                    onChange={this.onChange.bind(this,'选项二')}
                                    />
                            </View>
                            <View style={styles.cellView}>
                                <CheckBox
                                    label={'选项三'}
                                    onChange={this.onChange.bind(this,'选项三')}
                                    />
                            </View>
                            <View style={styles.cellView}>
                                <CheckBox
                                    label={'选项四'}
                                    onChange={this.onChange.bind(this,'选项四')}
                                    />
                            </View>
                        </View>

                    </View>
                </View>                      
            )
        }
    }
    componentDidMount(){
        // const {content,form,follow_id}=this.props.navigation.state.params
        const {form,follow_id,longitude,latitude}=this.props.navigation.state.params
        console.log(follow_id)
        console.log(latitude)
        this.setState({
            form:form,
            follow_id:follow_id,
            latitude:latitude,
            longitude:longitude
        })
        // //获取当前定位
        // geolocation.getCurrentPosition(
        //     (position) => {
        //       var initialPosition = JSON.stringify(position);
        //       this.setState({initialPosition});
        //     },
        //     (error) => alert(error.message),
        //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        //   );
    }       
    render(){
        const {form,data_0,data_1,data_2,data_3,data_4,text,value} =this.state;
        console.log(form);
        const form_3=form[3];
        return(
            <ScrollView 
                style={styles.container}
                showsVerticalScrollIndicator={true}
                overScrollMode={'always'}
            >
                    {form[0]?<View style={{flex:1}}>{this.handleKey_0(form)}</View>:null}
                    {form[1]?<View style={{flex:1}}>{this.handleKey_1(form)}</View>:null}
                    {form[2]?<View style={{flex:1}}>{this.handleKey_2(form)}</View>:null}
                    {form[3]?<View>{this.handleKey_3(form)}</View>:null}
                    {form[4]?<View>{this.handleKey_4(form)}</View>:null}
                    {form[5]?<View>{this.handleKey_5(form)}</View>:null}
                    {form[6]?<View>{this.handleKey_6(form)}</View>:null}
                <View style={{paddingTop:60,marginLeft:width*0.07,marginRight:width*0.07,height:200}}>
                    <Text 
                        style={styles.submit}
                        onPress={this.submit.bind(this,form,data_0,data_1,data_2,data_3,data_4,text,value)}
                    >
                        提交
                    </Text>
                    
                </View>
            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        paddingTop:30,
        // height:500,
        flex:1,
        paddingLeft:width*0.05,
        paddingRight:width*0.05,
    },
    info: {
        // borderBottomColor:'#CCCCCC',
        // borderBottomWidth:1,
        flexDirection:'row',
        paddingBottom:5,
        marginBottom:20,
    },
    input: {
        // marginLeft:width*0.4,
        // width:width*0.4,
        textAlign:'right',
        height:30,
        paddingVertical: 0,
        borderColor:'#333333',
        borderWidth:1,
        paddingVertical: 0,
        lineHeight:30,
        textAlign:'left',
        borderRadius:3
    },
    submit: {
        fontSize:16,
        color:'white',
        backgroundColor:'rgb(90, 162, 70)',
        textAlign:'center',
        paddingTop:12,
        paddingBottom:12,
        borderRadius:5,
    },
    cellView:{
        width:width*0.25,
    },
    normalTitle:{
        textAlign:"center"
    },
    normalText:{
        textAlign:"center"
    },
    image:{
        alignItems:"center",
        justifyContent:"center",
        width:width/3-20,
        height:width/3-20,
        marginTop:10,
    },
    uploadImage:{
        borderBottomColor:'red',
        alignItems:"center",
        justifyContent:"center",
        width:width/2-30,
        height:width/2-30,
    },
    rightDelButton:{
        position: 'absolute',
        top: -5,
        left:Platform.OS==="ios"?18:width/2-30,
        margin: -1,
        flexDirection:"row-reverse",
    }
})  