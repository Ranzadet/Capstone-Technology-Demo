import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { firebase } from '../config'
import {doc, setDoc, updateDoc, getDoc, getDocs, collection, query, where} from 'firebase/firestore'
import {db} from '../firebase'
import { stringify } from '@firebase/util'
import {userinfo} from './LoginScreen'
import {getStorage, ref} from 'firebase/storage'

``

const DownloadScreen = () => {
    const [images, setImages] = useState([]);
    const [downloading, setDownloading] = useState(false);

    const downloadImage = async () => {
        if (downloading){
            return;
        }
        setDownloading(true);

        const uid = String(userinfo.userID);
        const usrRef = doc(db, "Userinfo", uid);
        const docSnap0 = await getDoc(usrRef);
        const count = docSnap0.data().uploadCount;

        const q = query(collection(db, "fdu-birds"), where("uploader", "==", uid));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.size);
        let i = 1;
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            console.log(i++);
            console.log(doc.id, " => ", doc.data());
            console.log(doc.data().filepath); //fetch(doc.data().filepath);
            const arr = images.map((x) => x);
            arr.push(doc.data().filepath);
            setImages(arr);
        });


        // try{
        //     const docRef = doc(db, "fdu-birds", uid);
        //     const docSnap = await getDoc(docRef);
            
        //     if (docSnap.exists()) {
        //         //console.log("Metadata:", docSnap.data());
        //     } else {
        //     // doc.data() will be undefined in this case
        //     }
        // }
        // catch(e){
        //     console.log(e);
        // }

    };

    
    return (
        <SafeAreaView style={styles.container}>
            {/* <TouchableOpacity style={styles.buttonStyle} onPress={pickImage}>
                <Text style={styles.textStyle}>
                    Pick an image
                </Text>
            </TouchableOpacity> */}
            <View style={styles.container}>
                {/* {image && <Image source={{uri: image.uri}} style={{width: 300, height: 300}}></Image>} */}
                {images.map((images, index) => {
                    return <Image source={{ uri: images[index]}} style={{width: 300, height: 300}} key={images[index]} />;
                })} 
                <TouchableOpacity style={styles.buttonStyle} onPress={downloadImage}>
                    <Text style={styles.textStyle}>
                        See Your Images!
                    </Text>
                </TouchableOpacity>
                
            </View>
        </SafeAreaView>
    )
}

export default DownloadScreen;

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