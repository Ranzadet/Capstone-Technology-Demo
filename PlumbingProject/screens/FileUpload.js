import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import DocumentPicker from "react-native-document-picker"
import React, {useState} from 'react';
import * as ImagePicker from 'expo-image-picker'

/*
IMPORTANT: If imagepicker is changed to documentpicker for appstore launch, change the following:
singleFile.fileName -> singleFile.name
singleFile.fileSize -> singleFile.size
*/

import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Container,
  Platform,
} from 'react-native'; 

 
const FileUpload = () => {
  const [singleFile, setSingleFile] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('')
 
  async function chooseFile() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
    });
 
    async function normalizePath(path) {
        const prefix = 'file://';
        if (path.startsWith(prefix)){
            path = path.substring(prefix.length);
            try{
                path = decodeURI(path);
            } catch(e){}
        }
        return path;
    }
    const path = await normalizePath(result.assets[0].uri);
    console.log(path);

    if (!result.canceled) {
        setSingleFile(result.assets[0]);
    }

    //Opening Document Picker for selection of one file
    // try {
    //   const file = await DocumentPicker.pick({ //DocumentPicker.pick()
    //     type: [DocumentPicker.types.allFiles]
    //   });

    //   console.log(file.uri);

    //   setSingleFile(file);
    // } catch (err) {
    //   //Handling any exception (If any)
    //   if (DocumentPicker.isCancel(err)) {
    //   } else {
    //     throw err;
    //   }
  };
 
  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Example of File Picker in React Native
      </Text>
      <View style={styles.container}>
        {/*To show single file attribute*/}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={chooseFile}>
          {/*Single file selection button*/}
          <Text style={{marginRight: 10, fontSize: 19}}>
            Click here to pick one file
          </Text>
        </TouchableOpacity>
        {/*Showing the data of selected Single file*/}
        <Text style={styles.textStyle}>
          File Name: {singleFile.fileName ? singleFile.fileName : ''} 
          {'\n'}
          Type: {singleFile.type ? singleFile.type : ''}
          {'\n'}
          File Size: {singleFile.fileSize ? singleFile.fileSize : ''}
          {'\n'}
          URI: {singleFile.uri ? singleFile.uri : ''}
          {'\n'}
        </Text>
        <Image source={{ uri: singleFile.uri }} style={{ width: 200, height: 200 }} />
      </View>
      <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Location"
                    value={location}
                    onChangeText={text => setLocation(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="date"
                    value={date}
                    onChangeText={text => setDate(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>
    </SafeAreaView>
  );
};
 
export default FileUpload;
 

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
