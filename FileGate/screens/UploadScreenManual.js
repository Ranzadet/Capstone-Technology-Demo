import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { firebase } from '../config'
import {doc, setDoc} from 'firebase/firestore'
import {db} from '../firebase'
import { stringify } from '@firebase/util'
import datetimepicker from '@react-native-community/datetimepicker'
import RNDateTimePicker from '@react-native-community/datetimepicker'
``

const UploadScreenManual = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [metadata, setMetadata] = useState({})
    const [uploadTime, setUploadTime] = useState('')
    const [uploader, setUploader] = useState('')
    const [filepath, setFilepath] = useState('')
    
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

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
        setUploader("");
        setFilepath(assets.uri);

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
            
            // await storageRef;
        } catch (e) {
            console.log(e);
        }
        try{
            const mseconds = String(Date.now());
            const name = String(uploadTime + "_" + mseconds);
            await setDoc(doc(db, "fdu-birds", name), {filepath: filepath, metadata: metadata, 
                uploadTime: uploadTime, uploader: uploader, 
                weather: {humidity: 0, noiseLevel: 0, precipitationLevel: 0, 
                    precipitationType: "", temperature: 0, windDirection: 0, windSpeed: 0}});
        }
        catch(e){
            console.log(e);
        }
        setUploading(false);
        Alert.alert('Image/video upload successful!');
        setImage(null);
    };

    const datetimeChanged = (event, datetimeChoice) => {
        console.log(datetimeChoice);
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.buttonStyle} onPress={pickImage}>
                <Text style={styles.textStyle}>
                    Pick an image
                </Text>
            </TouchableOpacity>
            <View style={styles.container}>
                {image && <Image source={{uri: image.uri}} style={{width: 200, height: 200}}></Image>}
                <TouchableOpacity style={styles.buttonStyle} onPress={uploadImage}>
                    <Text style={styles.textStyle}>
                        Upload
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <TextInput
                    placeholder="Latitude"
                    value={latitude}
                    onChangeText={text => setLatitude(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Longitude"
                    value={longitude}
                    onChangeText={text => setLongitude(text)}
                    style={styles.input}
                />
            </View>
            <View>
                <RNDateTimePicker 
                    value={date}
                    mode="datetime"
                    onChange={datetimeChanged}
                />
                <Text>Selected: {date.toLocaleString()}</Text>
                {/* {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                    />
                )} */}
            </View>
        </SafeAreaView>
    )
}

export default UploadScreenManual;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    titleText: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingVertical: 20,
    },
    textStyle: {
      backgroundColor: '#fff',
      fontSize: 15,
      marginTop: 16,
      color: 'black',
    },
    buttonStyle: {
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: '#DDDDDD',
      padding: 5,
    },
    imageIconStyle: {
      height: 20,
      width: 20,
      resizeMode: 'stretch',
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
  }
});  