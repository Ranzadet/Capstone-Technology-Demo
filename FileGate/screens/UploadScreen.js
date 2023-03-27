// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native'
// import React, { useState } from 'react'
// import * as ImagePicker from 'expo-image-picker'
// import { firebase } from '../config'
// import {doc, setDoc} from 'firebase/firestore'
// import {db} from '../firebase'
// import { stringify } from '@firebase/util'
// ``

// const UploadScreen = () => {
//     const [image, setImage] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [metadata, setMetadata] = useState({})
//     const [uploadTime, setUploadTime] = useState('')
//     const [uploader, setUploader] = useState('')
//     const [filepath, setFilepath] = useState('')

//     const pickImage = async () => {
//         // No permissions request is necessary for launching the image library
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.All,
//             allowsEditing: false,
//             aspect: [4, 3],
//             quality: 1,
//             exif:true
//         });
//         //console.log(result.assets);

//         /* METADATA */
//         const assets = result.assets[0]
//         const duration = assets.duration
//         let filExIndex = assets.uri.search(/\..../);
//         const fileExtension = assets.uri.slice(filExIndex);
//         const date = assets.exif.DateTimeOriginal;
//         const uploadtime = new Date().toDateString();
//         const size = assets.fileSize;
//         const latitude = assets.exif.GPSLatitude;
//         let longitude = assets.exif.GPSLongitude;
//         if (longitude > 0)
//             longitude = -longitude;
        
//         console.log(assets)
//         console.log("RELEVANT METADATA: ")
//         // console.log(duration)
//         // console.log(fileExtension)
//         // console.log(date)
//         // console.log(uploadtime)
//         // console.log(size)
//         // console.log(latitude)
//         // console.log(longitude)

//         // filepath = assets.uri;
//         // metadata.duration = duration;
//         // metadata.fileExtension = fileExtension;
//         // metadata.date = date;
//         // uploadTime = uploadtime;
//         // metadata.size = size;
//         // metadata.latitude = latitude;
//         // metadata.longitude = longitude;
//         setMetadata({duration: duration, fileExtension:fileExtension, date:date, latitude:latitude, longitude:longitude, size:size});
//         setUploadTime(uploadtime);
//         setUploader("");
//         setFilepath(assets.uri);

//         function delay(time) {
//             return new Promise(resolve => setTimeout(resolve, time));
//           }
          
//         delay(1000).then(() => console.log(''));

//         console.log(metadata);
//         console.log("Filepath: ", filepath);
//         console.log("Upload Time: ", uploadTime);
//         console.log("Uploader: ", uploader);


//         const source = {uri: assets.uri}
//         console.log(source);
//         setImage(source);
//     };

//     const uploadImage = async () => {
//         setUploading(true);
//         const response = await fetch(image.uri);
//         const blob = await response.blob();
//         const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
//         var ref = firebase.storage().ref().child(filename).put(blob);

//         try {
//             await ref;
            
//             // await storageRef;
//         } catch (e) {
//             console.log(e);
//         }
//         try{
//             const mseconds = String(Date.now());
//             const name = String(uploadTime + "_" + mseconds);
//             await setDoc(doc(db, "fdu-birds", name), {filepath: filepath, metadata: metadata, 
//                 uploadTime: uploadTime, uploader: uploader, 
//                 weather: {humidity: 0, noiseLevel: 0, precipitationLevel: 0, 
//                     precipitationType: "", temperature: 0, windDirection: 0, windSpeed: 0}});
//         }
//         catch(e){
//             console.log(e);
//         }
//         setUploading(false);
//         Alert.alert('Image/video upload successful!');
//         setImage(null);
//     };

    
//     return (
//         <SafeAreaView style={styles.container}>
//             <TouchableOpacity style={styles.buttonStyle} onPress={pickImage}>
//                 <Text style={styles.textStyle}>
//                     Pick an image
//                 </Text>
//             </TouchableOpacity>
//             <View style={styles.container}>
//                 {image && <Image source={{uri: image.uri}} style={{width: 300, height: 300}}></Image>}
//                 <TouchableOpacity style={styles.buttonStyle} onPress={uploadImage}>
//                     <Text style={styles.textStyle}>
//                         Upload
//                     </Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     )
// }

// export default UploadScreen;

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#fff',
//       padding: 16,
//     },
//     titleText: {
//       fontSize: 22,
//       fontWeight: 'bold',
//       textAlign: 'center',
//       paddingVertical: 20,
//     },
//     textStyle: {
//       backgroundColor: '#fff',
//       fontSize: 15,
//       marginTop: 16,
//       color: 'black',
//     },
//     buttonStyle: {
//       alignItems: 'center',
//       flexDirection: 'row',
//       backgroundColor: '#DDDDDD',
//       padding: 5,
//     },
//     imageIconStyle: {
//       height: 20,
//       width: 20,
//       resizeMode: 'stretch',
//     },
//     input: {
//       backgroundColor: 'white',
//       paddingHorizontal: 15,
//       paddingVertical: 10,
//       borderRadius: 10,
//       marginTop: 5,
//   }
// });  
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { firebase } from '../config'
import {doc, setDoc} from 'firebase/firestore'
import {db} from '../firebase'
import { stringify } from '@firebase/util'

const UploadScreen = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({})
  const [uploadTime, setUploadTime] = useState('')
  const [uploader, setUploader] = useState('')
  const [filepath, setFilepath] = useState('')

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      exif:true
    });

    /* METADATA */
    const assets = result.assets[0]
    const duration = assets.duration
    let filExIndex = assets.uri.search(/\..../);
    const fileExtension = assets.uri.slice(filExIndex);
    const date = assets.exif.DateTimeOriginal;
    const uploadtime = new Date().toDateString();
    const size = assets.fileSize;
    const latitude = assets.exif.GPSLatitude;
    let longitude = assets.exif.GPSLongitude;
    if (longitude > 0)
      longitude = -longitude;

    // Save metadata and other relevant data
    setMetadata({duration, fileExtension, date, latitude, longitude, size});
    setUploadTime(uploadtime);
    setUploader("");
    setFilepath(assets.uri);

    setImage({uri: assets.uri});
  };

  const uploadImage = async () => {
    setUploading(true);
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
    var ref = firebase.storage().ref().child(filename).put(blob);

    try {
      await ref;
    } catch (e) {
      console.log(e);
    }

<<<<<<< Updated upstream
    try{
      const mseconds = String(Date.now());
      const name = String(uploadTime + "_" + mseconds);
      await setDoc(doc(db, "fdu-birds", name), {
        filepath,
        metadata,
        uploadTime,
        uploader,
        weather: {
          humidity: 0,
          noiseLevel: 0,
          precipitationLevel: 0,
          precipitationType: "",
          temperature: 0,
          windDirection: 0,
          windSpeed: 0
=======
    function isDateBetween(dateStr, startStr, endStr) {
      const date = new Date(dateStr);
      const start = new Date(startStr);
      const end = new Date(endStr);
      return date >= start && date <= end;
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });
        if (!result.cancelled) {
          setImage(result);
        }
        //console.log(result.assets);

        /* METADATA */
        console.log("Userid: ", userinfo.userID);
        console.log("Email: ", userinfo.email);
        console.log("Password: ", userinfo.password);
        const assets = result.assets[0]
        const duration = assets.duration
        let filExIndex = assets.uri.search(/\..*/);
        const fileExtension = assets.uri.slice(filExIndex);
        const date = assets.exif.DateTimeOriginal;
        const uploadtime = new Date().toDateString();
        const size = assets.fileSize;
        let latitude = assets.exif.GPSLatitude;
        const latitudeSign = assets.exif.GPSLatitudeRef;
        if (latitudeSign == 'S')
            latitude = -latitude;
        let longitude = assets.exif.GPSLongitude;
        const longitudeSign = assets.exif.GPSLongitudeRef;
        if (longitudeSign == 'W')
            longitude = -longitude;
        
        console.log(assets)
        console.log("RELEVANT METADATA: ")
        // console.log(duration)
        // console.log(fileExtension)
        // console.log(date)
        // console.log(uploadtime)
        // console.log(size)
        // console.log(latitude)
        // console.log(longitude)

        // filepath = assets.uri;
        // metadata.duration = duration;
        // metadata.fileExtension = fileExtension;
        // metadata.date = date;
        // uploadTime = uploadtime;
        // metadata.size = size;
        // metadata.latitude = latitude;
        // metadata.longitude = longitude;
        setMetadata({duration: duration, fileExtension:fileExtension, date:date, latitude:latitude, longitude:longitude, size:size});
        setUploadTime(uploadtime);
        setUploader(userinfo.userID);
        setUserPass(userinfo.password);
        console.log("New uploader: ", uploader)
        setFilepath(assets.uri.substring(assets.uri.lastIndexOf('/') + 1));


        function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
          }
          
        delay(1000).then(() => console.log(''));

        console.log(metadata);
        console.log("Filepath: ", filepath);
        console.log("Upload Time: ", uploadTime);
        console.log("Uploader: ", uploader);


        const source = {uri: assets.uri}
        console.log(source);
        setImage(source);
    };

    const uploadImage = async () => {
      setUploading(true);
      const response = await fetch(media.uri);
      const blob = await response.blob();
      const filename = media.uri.substring(media.uri.lastIndexOf('/') + 1);
      const storageRef = firebase.storage().ref().child(filename);
      await storageRef.put(blob);
      const downloadURL = await storageRef.getDownloadURL();
      console.log('Media uploaded:', downloadURL);

        try {
            await ref;
            console.log("ref: " + ref.snapshot);
            
            // await storageRef;
        } catch (e) {
            console.log(e);
>>>>>>> Stashed changes
        }
      });
    }
    catch(e){
      console.log(e);
    }

    setUploading(false);
    Alert.alert('Image/video upload successful!');
    setImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Upload Screen</Text>
      </View>

      {/* Image Preview */}
      <View style={styles.imagePreviewContainer}>
      {media && (
        media.type === 'image' ? (
          <Image source={{ uri: media.uri }} style={{ width: 300, height: 300 }} />
        ) : (
          <Video source={{ uri: media.uri }} style={{ width: 300, height: 300 }} />
        )
      )}
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerButtonText}>Pick an image</Text>
          </TouchableOpacity>
      </View>

      {/* Upload Button */}
<<<<<<< Updated upstream
      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage} disabled={!image}>
<Text style={styles.uploadButtonText}>Upload</Text>
</TouchableOpacity>
=======
      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage} disabled={!media || uploading}>
      <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
>>>>>>> Stashed changes

 {/* Uploading Indicator */}
  {uploading && (
    <View style={styles.uploadingIndicator}>
      <Text style={styles.uploadingText}>Uploading...</Text>
    </View>
  )}
</SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
alignItems: 'center',
justifyContent: 'center',
},
header: {
width: '100%',
height: 60,
backgroundColor: '#008080',
alignItems: 'center',
justifyContent: 'center',
},
title: {
fontSize: 24,
color: '#fff',
},
imagePreviewContainer: {
width: '90%',
height: '50%',
marginTop: 20,
marginBottom: 20,
borderWidth: 2,
borderColor: '#008080',
alignItems: 'center',
justifyContent: 'center',
},
imagePreview: {
width: '100%',
height: '100%',
resizeMode: 'contain',
},
imagePickerButton: {
width: '100%',
height: '100%',
alignItems: 'center',
justifyContent: 'center',
},
imagePickerButtonText: {
fontSize: 20,
color: '#008080',
},
uploadButton: {
width: '80%',
height: 50,
backgroundColor: '#008080',
alignItems: 'center',
justifyContent: 'center',
marginTop: 20,
borderRadius: 10,
},
uploadButtonText: {
fontSize: 20,
color: '#fff',
},
uploadingIndicator: {
position: 'absolute',
top: 0,
bottom: 0,
left: 0,
right: 0,
backgroundColor: 'rgba(0, 0, 0, 0.5)',
alignItems: 'center',
justifyContent: 'center',
},
uploadingText: {
fontSize: 20,
color: '#fff',
},
});

export default UploadScreen;