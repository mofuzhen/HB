// import React,{Component} from 'react'
// import {View,Text,TouchableOpacity,ScrollView,Image} from 'react-native'
// import ImagePicker from 'react-native-image-crop-picker';
// import Video from 'react-native-video'

// export default class extends Component{
//     constructor(props){
//         super(props);
//         this.state={
//             image:null,
//             images:null
//         }

//     }
//     pickSingle(cropit, circular=false, mediaType) {
//         ImagePicker.openPicker({
//           width: 500,
//           height: 500,
//           cropping: cropit,
//           cropperCircleOverlay: circular,
//           compressImageMaxWidth: 1000,
//           compressImageMaxHeight: 1000,
//           compressImageQuality: 1,
//           compressVideoPreset: 'MediumQuality',
//           includeExif: true,
//         }).then(image => {
//           console.log('received image', image);
//           this.setState({
//             image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
//             images: null
//           });
//         }).catch(e => {
//           console.log(e);
//           Alert.alert(e.message ? e.message : e);
//         });
//       }
//     pickSingleBase64(cropit) {
//         ImagePicker.openPicker({
//           width: 300,
//           height: 300,
//           cropping: cropit,
//           includeBase64: true,
//           includeExif: true,
//         }).then(image => {
//           console.log('received base64 image');
//           this.setState({
//             image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height},
//             images: null
//           });
//         }).catch(e => alert(e));
//       }
//     cleanupSingleImage() {
//         let image = this.state.image || (this.state.images && this.state.images.length ? this.state.images[0] : null);
//         console.log('will cleanup image', image);

//         ImagePicker.cleanSingle(image ? image.uri : null).then(() => {
//         console.log(`removed tmp image ${image.uri} from tmp directory`);
//         }).catch(e => {
//         alert(e);
//         })
//     }
//     pickMultiple() {
//         ImagePicker.openPicker({
//           multiple: true,
//           waitAnimationEnd: false,
//           includeExif: true,
//           forceJpg: true,
//         }).then(images => {
//           this.setState({
//             image: null,
//             images: images.map(i => {
//               console.log('received image', i);
//               return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
//             })
//           });
//         }).catch(e => alert(e));
//       }
//     renderVideo(video) {
//         console.log('rendering video');
//         return (<View style={{height: 300, width: 300}}>
//           <Video source={{uri: video.uri, type: video.mime}}
//              style={{position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 bottom: 0,
//                 right: 0
//               }}
//              rate={1}
//              paused={false}
//              volume={1}
//              muted={false}
//              resizeMode={'cover'}
//              onError={e => console.log(e)}   
//              onLoad={load => console.log(load)}
//              repeat={true} />
//          </View>);
//       }
    
//       renderImage(image) {
//         return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
//       }
    
//       renderAsset(image) {
//         if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
//           return this.renderVideo(image);
//         }
    
//         return this.renderImage(image);
//       }

//     render(){
//         console.log(this.state.image)
//         console.log(this.state.images)
//         return(
//             <View>  
//                 <ScrollView>
//                     {this.state.image ? this.renderAsset(this.state.image) : null}
//                     {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
//                 </ScrollView>
//                 <TouchableOpacity onPress={() => this.pickSingle(true)}>
//                     <Text>Select Single With Cropping</Text>
//                 </TouchableOpacity>
//                <TouchableOpacity onPress={() => this.pickSingleBase64(false)}>
//                     <Text>Select Single Returning Base64</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={this.cleanupSingleImage.bind(this)}>
//                     <Text>Cleanup Single Image</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={this.pickMultiple.bind(this)} >
//                     <Text>Select Multiple</Text>
//                 </TouchableOpacity>
//             </View>
//         )
//     }
// }  

// import React, {Component} from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, Alert,
//   Image, TouchableOpacity, NativeModules, Dimensions
// } from 'react-native';

// import Video from 'react-native-video';

// var ImagePicker = NativeModules.ImageCropPicker;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   button: {
//     backgroundColor: 'blue',
//     marginBottom: 10
//   },
//   text: {
//     color: 'white',
//     fontSize: 20,
//     textAlign: 'center'
//   }
// });

// export default class App extends Component {

//   constructor() {
//     super();
//     this.state = {
//       image: null,
//       images: null
//     };
//   }

//   pickSingleWithCamera(cropping, mediaType='photo') {
//     ImagePicker.openCamera({
//       cropping: cropping,
//       width: 500,
//       height: 500,
//       includeExif: true,
//       mediaType,
//     }).then(image => {
//       console.log('received image', image);
//       this.setState({
//         image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
//         images: null
//       });
//     }).catch(e => alert(e));
//   }

//   pickSingleBase64(cropit) {
//     ImagePicker.openPicker({
//       width: 300,
//       height: 300,
//       cropping: cropit,
//       includeBase64: true,
//       includeExif: true,
//     }).then(image => {
//       console.log('received base64 image');
//       this.setState({
//         image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height},
//         images: null
//       });
//     }).catch(e => alert(e));
//   }

//   cleanupImages() {
//     ImagePicker.clean().then(() => {
//       console.log('removed tmp images from tmp directory');
//     }).catch(e => {
//       alert(e);
//     });
//   }

//   cleanupSingleImage() {
//     let image = this.state.image || (this.state.images && this.state.images.length ? this.state.images[0] : null);
//     console.log('will cleanup image', image);

//     ImagePicker.cleanSingle(image ? image.uri : null).then(() => {
//       console.log(`removed tmp image ${image.uri} from tmp directory`);
//     }).catch(e => {
//       alert(e);
//     })
//   }

//   cropLast() {
//     if (!this.state.image) {
//       return Alert.alert('No image', 'Before open cropping only, please select image');
//     }

//     ImagePicker.openCropper({
//       path: this.state.image.uri,
//       width: 200,
//       height: 200
//     }).then(image => {
//       console.log('received cropped image', image);
//       this.setState({
//         image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
//         images: null
//       });
//     }).catch(e => {
//       console.log(e);
//       Alert.alert(e.message ? e.message : e);
//     });
//   }

//   pickSingle(cropit, circular=false, mediaType) {
//     ImagePicker.openPicker({
//       width: 500,
//       height: 500,
//       cropping: cropit,
//       cropperCircleOverlay: circular,
//       compressImageMaxWidth: 1000,
//       compressImageMaxHeight: 1000,
//       compressImageQuality: 1,
//       compressVideoPreset: 'MediumQuality',
//       includeExif: true,
//     }).then(image => {
//       console.log('received image', image);
//       this.setState({
//         image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
//         images: null
//       });
//     }).catch(e => {
//       console.log(e);
//       Alert.alert(e.message ? e.message : e);
//     });
//   }

//   pickMultiple() {
//     ImagePicker.openPicker({
//       multiple: true,
//       waitAnimationEnd: false,
//       includeExif: true,
//       forceJpg: true,
//     }).then(images => {
//       this.setState({
//         image: null,
//         images: images.map(i => {
//           console.log('received image', i);
//           return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
//         })
//       });
//     }).catch(e => alert(e));
//   }

//   scaledHeight(oldW, oldH, newW) {
//     return (oldH / oldW) * newW;
//   }

//   renderVideo(video) {
//     console.log('rendering video');
//     return (<View style={{height: 300, width: 300}}>
//       <Video source={{uri: video.uri, type: video.mime}}
//          style={{position: 'absolute',
//             top: 0,
//             left: 0,
//             bottom: 0,
//             right: 0
//           }}
//          rate={1}
//          paused={false}
//          volume={1}
//          muted={false}
//          resizeMode={'cover'}
//          onError={e => console.log(e)}
//          onLoad={load => console.log(load)}
//          repeat={true} />
//      </View>);
//   }

//   renderImage(image) {
//     return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
//   }

//   renderAsset(image) {
//     if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
//       return this.renderVideo(image);
//     }

//     return this.renderImage(image);
//   }

//   render() {
//     console.log(this.state.images)
//     console.log(this.state.image)
//     return (<View style={styles.container}>
//       <ScrollView>
//         {this.state.image ? this.renderAsset(this.state.image) : null}
//         {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
//       </ScrollView>

//       <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)} style={styles.button}>
//         <Text style={styles.text}>Select Single Image With Camera</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingleWithCamera(false, mediaType='video')} style={styles.button}>
//         <Text style={styles.text}>Select Single Video With Camera</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingleWithCamera(true)} style={styles.button}>
//         <Text style={styles.text}>Select Single With Camera With Cropping</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingle(false)} style={styles.button}>
//         <Text style={styles.text}>Select Single</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.cropLast()} style={styles.button}>
//         <Text style={styles.text}>Crop Last Selected Image</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingleBase64(false)} style={styles.button}>
//         <Text style={styles.text}>Select Single Returning Base64</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingle(true)} style={styles.button}>
//         <Text style={styles.text}>Select Single With Cropping</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingle(true, true)} style={styles.button}>
//         <Text style={styles.text}>Select Single With Circular Cropping</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={this.pickMultiple.bind(this)} style={styles.button}>
//         <Text style={styles.text}>Select Multiple</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={this.cleanupImages.bind(this)} style={styles.button}>
//         <Text style={styles.text}>Cleanup All Images</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={this.cleanupSingleImage.bind(this)} style={styles.button}>
//         <Text style={styles.text}>Cleanup Single Image</Text>
//       </TouchableOpacity>
//     </View>);
//   }
// }

//react-native-image-picker
import React from 'react';
import {
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video'
import ImagePicker from 'react-native-image-picker';

export default class App extends React.Component {
  state = {
    avatarSource: null,
    videoSource: null,
    // isPlaying:false
    
  };

  constructor(props) {
    super(props);
    this.state={
      paused:false,
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.selectVideoTapped = this.selectVideoTapped.bind(this);
  }

  selectPhotoTapped() {
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
        let source = {uri: response.uri};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  selectVideoTapped() {
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
        this.setState({
          videoSource: response.uri,
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View
            style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            {this.state.avatarSource === null ? (
              <Text>Select a Photo</Text>
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer]}>
          {this.state.videoSource === null ? (
               <Text>Select a Video</Text>
            ) : (
              <Video source={{uri:this.state.videoSource}} 
                style={{width: 150, height: 150}} 
                ref={(ref) => {
                  this.player = ref
                }}                                      // Store reference
                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                onError={this.videoError}  
                resizeMode  ={'cover'}
                paused={this.state.paused}//暂停
                // rate={1.0}
                // volume={1.0}
                // paused={!this.state.isPlaying}
              />
            )}
          
          </View>
        </TouchableOpacity>
          <TouchableOpacity onPress={this.changeVideo}>    
            <Video source={{uri:this.state.videoSource}} 
                style={{width: 150, height: 150,  
                }} 
                ref={(ref) => {
                  this.player = ref
                }}                                      // Store reference
                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                onError={this.videoError}  
                resizeMode  ={'cover'}
                paused={this.state.paused}//暂停
                // rate={1.0}
                // volume={1.0}
                // paused={!this.state.isPlaying}
                repeat={true}
              />
            </TouchableOpacity>
      </View>
    );
  }
  changeVideo=()=>{
    alert(1)
    this.setState({
      paused:!this.state.paused
    },()=>console.log(this.state.paused))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 100,
    height: 80,
    resizeMode:'cover'
  },
});