import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { firebase } from '../config'
``
const UploadScreen = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1
        });

        const source = {uri: result.uri};
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
        setUploading(false);
        Alert.alert('Image/video upload successful!');
        setImage(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.buttonStyle} onPress={pickImage}>
                <Text style={styles.textStyle}>
                    Pick an image
                </Text>
            </TouchableOpacity>
            <View style={styles.container}>
                {image && <Image source={{uri: image.uri}} style={{width: 300, height: 300}}></Image>}
                <TouchableOpacity style={styles.buttonStyle} onPress={uploadImage}>
                    <Text style={styles.textStyle}>
                        Upload
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default UploadScreen;

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