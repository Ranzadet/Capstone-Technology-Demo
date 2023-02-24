import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { firebase } from '../config'
import {doc, setDoc} from 'firebase/firestore'
import {db} from '../firebase'
import { stringify } from '@firebase/util'
import datetimepicker from '@react-native-community/datetimepicker'
import RNDateTimePicker from '@react-native-community/datetimepicker'
// import { get } from 'jquery'
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
    const [date, setDate] = useState(new Date(new Date().toLocaleDateString()));
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
        setDate(datetimeChoice);
    }

    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    const latitudeChanged = (text) => {
        if (isNumeric(text)) {
            setLatitude(Number(text));
            console.log(latitude);
        }
    }

    const longitudeChanged = (text) => {
        if (isNumeric(text)) {
            setLongitude(Number(text));
            console.log(longitude);
        }
    }

    const submitForWeather = async () => {
        // const latMin = latitude;
        // const latMax = latitude;
        // const longMin = longitude;
        // const longMax = longitude;
        const lat = latitude;
        const long = longitude;
        let variance = 0;

        // get date in format yyyy-mm-dd
        const today = date;
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        // console.log(formattedDate);

        // let station1id = "";
        // let station2id = "";
        // let station3id = "";
        let stationids = ["", "", ""];
        let index = 0;
        let weatherLists = ["", "", ""];

        console.log("1: beginning");

        // while (index < 3) {
        //     // https://www.ncei.noaa.gov/cdo-web/api/v2/stations?extent=latitude-x,longitude-x,latitude+x,longitude+x
        //     fetch('https://www.ncei.noaa.gov/cdo-web/api/v2/stations?extent=' + String(lat-variance) + ',' + String(long-variance) + ',' + String(lat+variance) + ',' + String(long+variance), {
        //         method: 'GET',
        //         headers: {
        //             token: 'nOAusqiwSpCeUaFDUlOtljxvxWeAxQdF',
        //         },
        //     })
        //     .then(response => response.json())
        //     .then(json => {
        //         for (let i = 0; i < json["results"].length; i++) {
        //             let stationid = json["results"][i]["id"];
        //             //https://www.ncei.noaa.gov/cdo-web/api/v2/datasets?stationid=insertstationidhere
        //             fetch('https://www.ncei.noaa.gov/cdo-web/api/v2/datasets?stationid=' + String(stationid), {
        //                 method: 'GET',
        //                 headers: {
        //                     token: 'nOAusqiwSpCeUaFDUlOtljxvxWeAxQdF',
        //                 },
        //             })
        //             .then(response2 => response2.json())
        //             .then(json2 => {
        //                 for (let j = 0; j < json2["results"].length; j++) {
        //                     if (json2["results"][j]["id"] === "GHCND") {
        //                         stationids[index] = stationid;
        //                         index++;
        //                     }
        //                     if (index >= 3) {
        //                         break;
        //                     }
        //                 }
        //             })
        //         }
        //     })
        //     variance += 0.0005;
        // }

        // for (let i = 0; i < stationids.length; i++) {
        //     //https://www.ncei.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=insertstationidhere&startdate=insertdatehere&enddate=insertdatehere
        //     fetch('https://www.ncei.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=' + stationids[i]  + '&startdate=' + formattedDate + '&enddate=' + formattedDate, {
        //         method: 'GET',
        //         headers: {
        //             token: 'nOAusqiwSpCeUaFDUlOtljxvxWeAxQdF',
        //         },
        //     })
        //     .then(response3 => response3.json())
        //     .then(json3 => {
        //         const weatherList = json3["results"];
        //         console.log(String(i) + ": " + weatherList.toString());
        //         weatherLists[i] = weatherList;
        //     })
        // }
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
                    onChangeText={latitudeChanged}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Longitude"
                    value={longitude}
                    onChangeText={longitudeChanged}
                    style={styles.input}
                />
            {/* </View>
            <View> */}
                <RNDateTimePicker 
                    value={date}
                    mode="date"
                    onChange={datetimeChanged}
                />
                <Text>Selected: {date.toLocaleDateString()}</Text>
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
            <View style={styles.container}>
                <TouchableOpacity style={styles.buttonStyle} onPress={submitForWeather}>
                    <Text style={styles.textStyle}>
                        Submit for weather
                    </Text>
                </TouchableOpacity>
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