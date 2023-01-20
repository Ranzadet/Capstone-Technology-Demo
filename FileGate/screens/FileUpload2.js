import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { app, storage } from '../firebase'
import { ref } from '@firebase/storage'

const FileUpload2 = () => {

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            //aspect: [4, 3],
            quality: 1
        });

        const source = {uri: result.assets[0].uri};
        console.log(source);
        setImage(source);
    };

    const uploadImage = async () => {
        setUploading(true);
        const response = await fetch(image.uri);
        // const blob = await response.blob();
        const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
        // let ref = app.storage().ref().child(filename);
        const storageRef = ref(storage);

        try {
            // await ref;
            await storageRef;
        } catch (e) {
            console.log(e);
        }
        setUploading(false);
        Alert.alert('Image/video upload successful!');
        setImage(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonContainer}>
                    Pick an image
                </Text>
            </TouchableOpacity>
            <View style={styles.container}>
                {image && <Image source={{uri: image.uri}} style={{width: 300, height: 300}}></Image>}
                <TouchableOpacity style={styles.button} onPress={uploadImage}>
                    <Text style={styles.buttonContainer}>
                        Upload
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}

export default FileUpload2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    }
})