import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, RefreshControl, Pressable, FlatList, TextInput } from 'react-native'
import React, { useState, useCallback } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { firebase } from '../config'
import {doc, setDoc, updateDoc, getDoc, getDocs, collection, query, where, deleteDoc} from 'firebase/firestore'
import {db, storage} from '../firebase'
import { stringify } from '@firebase/util'
import {userinfo} from './LoginScreen'
import {getStorage, ref, getDownloadURL, deleteObject} from 'firebase/storage'
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

    const deleteImage = async () => {
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
            console.log("Deleting Document From Database...");
            await deleteDoc(doc(db, "fdu-birds", docRef));
            console.log("Deleting Image From Storage...");
            const imageRef = ref(storage, metaView.filepath);
            deleteObject(imageRef);
            console.log("Document deletion Successful!");
            Alert.alert('Document deletion successful!');
        }
        else{
            console.log("Error deleting document! Could not find doc in list. ");
            console.log("Current MetaView: ", metaView);
        }
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
          <View style={styles.header}>
            <Text style={styles.title}>Download Screen</Text>
          </View>
    
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.metaViewContainer}>
              {Object.keys(metaView).map((key) => {
                if (typeof metaView[key] === 'object') {
                  return Object.keys(metaView[key]).map((subObj) => (
                    <View key={subObj}>
                      <Text style={styles.labelText}>{subObj}</Text>
                      <TextInput
                        key={subObj}
                        style={styles.input}
                        defaultValue={String(metaView[key][subObj])}
                        onSubmitEditing={(value) =>
                          textChangeSub(value.nativeEvent.text, key, subObj)
                        }
                      />
                    </View>
                  ));
                }
                return (
                  <View key={key}>
                    <Text style={styles.labelText}>{key}:</Text>
                    <TextInput
                      key={key}
                      style={styles.input}
                      defaultValue={String(metaView[key])}
                      onSubmitEditing={(value) =>
                        textChangeMeta(value.nativeEvent.text, key)
                      }
                    />
                  </View>
                );
              })}
    
              {metaView && userinfo.admin && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={deleteImage}>
                  <Text style={styles.buttonText}>Delete Image</Text>
                </TouchableOpacity>
              )}
    
              <TouchableOpacity
                style={styles.updateButton}
                onPress={uploadImage}>
                <Text style={styles.buttonText}>Update Metadata</Text>
              </TouchableOpacity>
            </View>
    
            <View style={styles.imageContainer}>
              {images2.map((image) => (
                <View key={image} style={styles.imageBox}>
                  <Pressable onPress={() => updateMeta(images2.indexOf(image))}>
                    <Image
                      source={{ uri: image }}
                      style={styles.image}
                      key={image}
                    />
                  </Pressable>
                </View>
              ))}
    
              <Text style={styles.pullToRefreshText}>
                Pull to refresh after pressing button
              </Text>
    
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={downloadImage}>
                <Text style={styles.buttonText}>See Your Images!</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    };
    
    export default DownloadScreen;



    const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        header: {
            width: '100%',
            height: 80,
            backgroundColor: '#6646ee',
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
          color: 'white',
          fontSize: 24,

        },
        metaViewContainer: {
          padding: 20,
        },
        labelText: {

          marginBottom: 5,
        },
        input: {
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
        deleteButton: {
          backgroundColor: 'red',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        },
        updateButton: {
          backgroundColor: '#6646ee',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        },
        buttonText: {
          color: 'white',
          textAlign: 'center',
        },
        imageContainer: {
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        },
        imageBox: {
          width: 100,
          height: 100,
          margin: 5,
          borderWidth: 1,
          borderColor: 'gray',
          alignItems: 'center',
          justifyContent: 'center',
        },
        image: {
          width: 100,
          height: 100,
        },
        pullToRefreshText: {
          textAlign: 'center',
          margin: 10,
        },
        downloadButton: {
          backgroundColor: '#6646ee',
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        },
      });
      
    