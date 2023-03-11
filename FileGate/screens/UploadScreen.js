import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { firebase } from '../config'
import {doc, setDoc, updateDoc, getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import { stringify } from '@firebase/util'
import {userinfo} from './LoginScreen'

const UploadScreen = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [metadata, setMetadata] = useState({})
    const [uploadTime, setUploadTime] = useState('')
    const [uploader, setUploader] = useState('')
    const [filepath, setFilepath] = useState('')
    const [userPass, setUserPass] = useState('')

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
            exif:true
        });
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
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
        var ref = firebase.storage().ref().child(filename).put(blob);

        try {
            await ref;
            console.log("ref: " + ref.snapshot);
            
            // await storageRef;
        } catch (e) {
            console.log(e);
        }
        try{
            console.log(metadata);
            console.log(filepath);
            const mseconds = String(Date.now());
            const name = String(uploadTime + "_" + mseconds);
            
            await setDoc(doc(db, "fdu-birds", name), {filepath: filepath, metadata: metadata, 
                uploadTime: uploadTime, uploader: uploader, 
                weather: {humidity: 0, noiseLevel: 0, precipitationLevel: 0, 
                    precipitationType: "", temperature: 0, windDirection: 0, windSpeed: 0}});

            const uid = String(userinfo.userID);
            const docRef = doc(db, "Userinfo", uid);
            const docSnap = await getDoc(docRef);
            let count = 0;
            
            if (docSnap.exists()) {
                console.log("Upload count (previous):", docSnap.data().uploadCount);
                count = docSnap.data().uploadCount;
            } else {
            // doc.data() will be undefined in this case
            }
            //Update the uploaded document counter for user
            await updateDoc(docRef, {
                uploadCount: count + 1
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
        {image ? (
          <Image source={image} style={styles.imagePreview} />
        ) : (
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerButtonText}>Pick an image</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage} disabled={!image}>
<Text style={styles.uploadButtonText}>Upload</Text>
</TouchableOpacity>

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