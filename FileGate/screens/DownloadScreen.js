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
    const [imageCheck, setImageCheck] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [updateData, setUpdateData] = useState(false);
    const [metaView, setMetaView] = useState({});
    const [helpInput, setHelpInput] = useState({});
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
        const newImageCheck = [];
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
                    newImageCheck.push(doc.data().filepath);
                    console.log(url);
                    // Insert url into an <img> tag to "download"
                })
                .catch((error) => {console.log(error)})
            }
        });
        console.log("New Images 2: ", newImages2);
        setImages2(newImages2);
        setImageCheck(newImageCheck);
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
        metadata.forEach((data) => {
            if (data.filepath == imageCheck[index]){
                console.log("Data found: ", data);
                setMetaView(data);
                setUpdateData(!updateData);
            }
        });

        console.log("Metaview: ", metaView);
        //return <Text></Text>;
    }

    const renderMeta = (data) => {
        return <TextInput value={data}></TextInput>;
    }

    const uploadImage = async () =>{
        const uid = String(userinfo.userID);
        const q = query(collection(db, "fdu-birds"), where("uploader", "==", uid));
        const querySnapshot = await getDocs(q);
        let docRef;
        querySnapshot.forEach((doc) => {
            if (doc.data().filepath == metaView.filepath){
                console.log(doc.data().filepath);
                docRef = doc.id;
                console.log("ID: ", doc.id);
            }
        });

        if (docRef){
            console.log("Updating Document...");
            await updateDoc(doc(db, "fdu-birds", docRef), {
                filepath: metaView.filepath, 
                uploadTime: metaView.uploadTime,
                uploader: metaView.uploader,
                weather: metaView.weather,
                metadata: metaView.metadata
            });
            console.log("Document Update Successful!");
            Alert.alert('Document update successful!');
        }
        else{
            console.log("Error updating document! Could not find doc in list. ");
            console.log("Current MetaView: ", metaView);
        }
        
        return;
    }

    const textChangeMeta = (text, key)=> {
        console.log("Text is changing!: ", text);
        for (let i = 0;i<Object.keys(metaView).length;i++){
            if (metaView[Object.keys(metaView)[i]] == key){
                metaView[Object.keys(metaView)[i]] = text;
                console.log(metaView[Object.keys(metaView)[i]]);
                console.log("New: ", text);
                setMetaView(metaView);
                // helpInput[Object.keys(helpInput)[i]] = text;
                // setHelpInput(helpInput);
            }
        }
    }
    
    const textChangeSub = (text, key, subObj)=> {
        console.log("Text is changing!: ", text);
        for (let i = 0;i<Object.keys(metaView[key]).length;i++){
            let bigObj = metaView[Object.keys(metaView)[i]];
            if(typeof bigObj == "object"){
                if (Object.keys(bigObj).includes(subObj)){
                    bigObj[subObj] = text;
                    console.log(bigObj[subObj]);
                    console.log("New: ", text);
                    setMetaView(metaView);
                    // helpInput[Object.keys(helpInput)[i]] = text;
                    // setHelpInput(helpInput);
                }
            }
        }
    }

    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            {/* {(metaView != null) ? Object.keys(metaView).forEach((key) => {console.log("key: ", key);return <TextInput key={key} style={styles.input} value={String(key) + " : "+ String(metaView[key])}></TextInput>}) : null} */}
                <View>
                    {Object.keys(metaView).map(key => 
                        <View>
                        <Text>{key}:</Text>
                        {typeof metaView[key] != 'object' ? <TextInput key={key} style={styles.input} defaultValue={String(metaView[key])} 
                        onSubmitEditing={(value) => {textChangeMeta(value.nativeEvent.text, key)}}></TextInput>
                        : Object.keys(metaView[key]).map(subObj => 
                            <View>
                                <Text>{subObj}</Text>
                            <TextInput key={subObj} style={styles.input} defaultValue={String(metaView[key][subObj])} 
                            onSubmitEditing={(value) => {textChangeSub(value.nativeEvent.text, key, subObj)}}></TextInput>
                            </View>
                        )}
                        {/*Current issue is that key is set as the first metaView value, but never changes to match new typed input values unless the component is re-rendered */}
                        </View>
                    )}

                {/* {Object.keys(metaView).map(key => (
                    <View style={styles.container} key={key}>
                        <Text>{key}: {String(metaView[key])}</Text>
                    </View>
                ))} */}
                    
                    <TouchableOpacity style={styles.buttonStyle2} onPress={() => {uploadImage();}}><Text>Update Metadata</Text></TouchableOpacity>
                </View> 
                
                {/* <TouchableOpacity style={styles.buttonStyle} onPress={pickImage}>
                    <Text style={styles.textStyle}>
                        Pick an image
                    </Text>
                </TouchableOpacity> */}
                <View style={styles.container}>
                    {/* {image && <Image source={{uri: image.uri}} style={{width: 300, height: 300}}></Image>} */}
                    {console.log("Images count: ", images2)}
                    {console.log("Metaview (after):", metaView)}
                    {images2.map(image => 
                       <View key={image}><Pressable onPress={() => {updateMeta(images2.indexOf(image));}}><Image source={{ uri: image}} style={{width: 300, height: 300}} key={image} /></Pressable></View>)
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
      position:'relative',
      flexDirection: 'row',
      backgroundColor: '#DDDDDD',
      padding: 5,
    },
    buttonStyle2: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#8D08EF',
        padding: 10,
        width: 200,
        position: "relative",
        left:'15%'
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