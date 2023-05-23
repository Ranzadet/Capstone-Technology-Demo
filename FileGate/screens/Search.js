import React from 'react'
import {useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, RefreshControl, Pressable, FlatList, TextInput } from 'react-native'


const Search = (props) => {

    /*
    *This component can be imported by any page and be used to implement a search feature.
    *setFilter is a function passed into the Search component which sets the filter state variable in the page to allow dynamic loading of content. 
    *setSearching is a funciton passed into the Search component which sets the boolean state variable "searching", to be used as the condtional for 
    determining if content should be filtered
    */

    const [searchVal, setSearchVal] = useState("");

    const searchVideos = () =>{
        const elem = document.getElementById("searchbox");
        const searchStr = elem.value.toLowerCase();
        console.log(searchStr);
        props.setFilter(searchStr);
        props.setSearching(true);
        elem.value = "";
    }
    
    return (
        <View id="search" style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 2,
            padding: 5,
            width:250,
            marginLeft:"auto",
            marginRight:"auto",
            justifyContent:"center",
            marginTop:50,
            alignItems:"stretch",
      
          }}>
            <TextInput id="searchbox" type="text" value={searchVal} onChangeText={(value) => {setSearchVal(value);console.log("Search: ", value)}}></TextInput>
            <TouchableOpacity id="searchbutton" onPress={searchVideos}><Image source={{uri:"../assets/SearchIcon.png"}}></Image></TouchableOpacity>
            <TouchableOpacity id="resetbutton" onPress={() => {props.setSearching(false)}}><Text>Reset</Text></TouchableOpacity>
        </View>
    )
}

export default Search;