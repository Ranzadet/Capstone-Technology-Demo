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
                helpInput[Object.keys(helpInput)[i]] = text;
                setHelpInput(helpInput);
            }
        }
    }

    
    return (
        <SafeAreaView style={styles.container}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.metaViewContainer}>
              {Object.entries(metaView).map(([key, value]) => (
                <View style={styles.metaViewRow} key={key}>
                  <Text style={styles.metaViewLabel}>{key}:</Text>
                  <TextInput
                    style={styles.metaViewInput}
                    defaultValue={String(value)}
                    onSubmitEditing={(event) =>
                      textChangeMeta(event.nativeEvent.text, key)
                    }
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.metaViewButton}
                onPress={uploadImage}>
                <Text style={styles.metaViewButtonText}>Update Metadata</Text>
              </TouchableOpacity>
            </View>
    
            <View style={styles.imagesContainer}>
              <Text style={styles.imagesTitle}>Your Images:</Text>
              {images2.map((uri, index) => (
                <Pressable
                  key={uri}
                  onPress={() => updateMeta(index)}
                  style={({ pressed }) => [
                    styles.imageContainer,
                    pressed && styles.imageContainerPressed,
                  ]}>
                  <Image source={{ uri }} style={styles.image} />
                </Pressable>
              ))}
              <Text style={styles.imagesDescription}>
                Pull to refresh after pressing the button
              </Text>
              <TouchableOpacity style={styles.imagesButton} onPress={downloadImage}>
                <Text style={styles.imagesButtonText}>See Your Images!</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      metaViewContainer: {
        padding: 16,
      },
      metaViewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      metaViewLabel: {
        fontWeight: 'bold',
        marginRight: 8,
      },
      metaViewInput: {
        flex: 1,
        backgroundColor: '#e8e8e8',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
      },
      metaViewButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#8D08EF',
        padding: 10,
        borderRadius: 8,
        marginTop: 16,
      },
      metaViewButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      imagesContainer: {
        padding: 16,
        alignItems: 'center',
      },
      imagesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      imageContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        margin: 8,
      },
      imageContainerPressed: {
        opacity: 0.6,
      },
      image: {
        width: 300,
        height: 300,
      },
      imagesDescription: {
        marginTop: 16,
        color: '#666',
      },
      imagesButton: {
        backgroundColor: '#8D08EF',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    },
    imagesButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    },
    });
    
    export default DownloadScreen;