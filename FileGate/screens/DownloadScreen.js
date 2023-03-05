import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, RefreshControl, Pressable, FlatList, TextInput } from 'react-native'
import React, { useState, useCallback } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { firebase } from '../config'
import {doc, setDoc, updateDoc, getDoc, getDocs, collection, query, where} from 'firebase/firestore'
import {db} from '../firebase'
import { stringify } from '@firebase/util'
import {userinfo} from './LoginScreen'
import {getStorage, ref, getDownloadURL} from 'firebase/storage'
import { ScrollView } from 'react-native';


``

const DownloadScreen = () => {
    const [metadata, setMetadata] = useState([]);
    const [images2, setImages2] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const images3 = []; 
    const [refreshing, setRefreshing] = useState(false);
    const [updateData, setUpdateData] = useState(false);
    const [metaView, setMetaView] = useState(null);
    const [uploadData, setUploadData] = useState({});
    let renderCount = 0;

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);


    const downloadImage = async () => {
        if (downloading){
            return;
        }
        //setDownloading(true);

        const uid = String(userinfo.userID);
        const usrRef = doc(db, "Userinfo", uid);
        const docSnap0 = await getDoc(usrRef);
        const storage = getStorage();
        const count = docSnap0.data().uploadCount;
        

        const q = query(collection(db, "fdu-birds"), where("uploader", "==", uid));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.size);
        let i = 1;
        const newMeta = [];
        const newImages2 = [];
        let checkCount = 0;
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            if(!doc.data().filepath.startsWith("file:")){
                checkCount++;
                console.log(i++);
                console.log(doc.id, " => ", doc.data());
                console.log(doc.data().filepath); //fetch(doc.data().filepath);
                newMeta.push(doc.data());

                const birdRef = ref(storage, doc.data().filepath);
                // Get the download URL
                getDownloadURL(birdRef)
                .then((url) => {
                    //const arr2 = images2.slice();
                    //console.log("old arr2", images2);
                    //arr2.push(url);
                    //console.log("New arr2: ", arr2);
                    //setImages2(arr2);
                    newImages2.push(url);
                    images3.push(url);
                    console.log(url);
                    // Insert url into an <img> tag to "download"
                })
                .catch((error) => {console.log(error)})
            }
        });
        console.log("New Images 2: ", newImages2);
        setImages2(newImages2);
        setMetadata(newMeta);

        console.log("Database count: ", count);
        console.log("Actual Count: ", checkCount);

        if (checkCount != count){
            await updateDoc(usrRef, {uploadCount:checkCount});
            console.log("updating doc");
        }

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

    const updateMeta = (index) => {
        console.log("Index received: ", index);
        let count = 0;
        metadata.forEach((data) => {
            if (count == index){
                console.log("Data found: ", data);
                setMetaView(data);
                setUpdateData(!updateData);
            }
            count++;
        });

        console.log("Metaview: ", metaView);
        //return <Text></Text>;
    }

    const renderMeta = (data) => {
        return <TextInput value={data}></TextInput>;
    }

    const uploadImage = () =>{
        return;
    }

    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            {/* {(metaView != null) ? Object.keys(metaView).forEach((key) => {console.log("key: ", key);return <TextInput key={key} style={styles.input} value={String(key) + " : "+ String(metaView[key])}></TextInput>}) : null} */}
                {metaView != null ? 
                <View>
                    {Object.values(metaView).map(key => 
                        <View>
                        <Text>Current value: {typeof key != 'object' && key}</Text>
                        <TextInput key={key} style={styles.input} defaultValue={String(key)}></TextInput>
                        </View>
                    )}
                    <TouchableOpacity style={styles.buttonStyle2} onPress={() => {uploadImage();}}><Text>Update Metadata</Text></TouchableOpacity>
                </View> : null}
                
                {/* <TouchableOpacity style={styles.buttonStyle} onPress={pickImage}>
                    <Text style={styles.textStyle}>
                        Pick an image
                    </Text>
                </TouchableOpacity> */}
                <View style={styles.container}>
                    {/* {image && <Image source={{uri: image.uri}} style={{width: 300, height: 300}}></Image>} */}
                    {console.log("Images count: ", images3)}
                    {images2.map((image, index) => {
                        console.log("Image index: ", index);
                        return <Pressable onPress={() => {updateMeta(index);}}><Image source={{ uri: image}} style={{width: 300, height: 300}} key={index} /></Pressable>;})
                    }
                    {/* <TextInput
                        placeholder="Image Name"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                    /> */}
                    <Text>Pull to refresh after pressing button</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => {downloadImage();}}>
                        <Text style={styles.textStyle}>
                            See Your Images!
                        </Text>
                    </TouchableOpacity>

                    
                </View>
            </ScrollView>
            
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
    buttonStyle2: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 200,
        position: "relative",
        left:'90%',
      },
    imageIconStyle: {
      height: 20,
      width: 20,
      resizeMode: 'stretch',
    },
    input: {
      backgroundColor: 'blue',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
      color:'white'
  }
});  