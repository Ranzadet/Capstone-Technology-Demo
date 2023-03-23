// // import { useNavigation } from '@react-navigation/native'
// // import React from 'react'
// // import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// // import { auth } from '../firebase'

// // const HomeScreen = () => {
// //     const navigation = useNavigation()

// //     const handleSignOut = () => {
// //         auth
// //             .signOut()
// //             .then(() => {
// //                 navigation.replace("Login")
// //             })
// //             .catch(error => alert(error.message))
// //     }

// //     // const toFileUpload = () => {
// //     //     navigation.navigate("File Upload").catch(error => alert(error.message))
// //     // }

// //     return (
// //         <View style={styles.container}>
// //             <Text>Email: {auth.currentUser?.email}</Text>
// //             <TouchableOpacity 
// //                 onPress={handleSignOut}
// //                 style={styles.button}
// //             >
// //                 <Text style={styles.buttonText}>Sign out</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //                 onPress={() => {navigation.navigate("UploadScreen")}}
// //                 style={styles.button}
// //             >
// //                 <Text style={styles.buttonText}>Upload files</Text>
// //             </TouchableOpacity>
// //         </View>
// //     )
// // }


// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center'
// //     },
// //     inputContainer: {
// //         width: '80%'
// //     },
// //     input: {
// //         backgroundColor: 'white',
// //         paddingHorizontal: 15,
// //         paddingVertical: 10,
// //         borderRadius: 10,
// //         marginTop: 5,
// //     },
// //     buttonContainer: {
// //         width: '60%',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         marginTop: 40,
// //     },
// //     button: {
// //         backgroundColor: '#0782F9',
// //         width: '60%',
// //         padding: 15,
// //         borderRadius: 10,
// //         alignItems: 'center',
// //         marginTop: 40,
// //     },
// //     buttonOutline: {
// //         backgroundColor: 'white',
// //         marginTop: 5,
// //         borderColor: '#0782F9',
// //         borderWidth: 2,
// //     },
// //     buttonText: {
// //         color: 'white',
// //         fontWeight: '700',
// //         fontSize: 16,
// //     }
// // })
// import { useNavigation } from '@react-navigation/native';
// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { auth } from '../firebase';

// const HomeScreen = () => {
//   const navigation = useNavigation();

//   const handleSignOut = () => {
//     auth
//       .signOut()
//       .then(() => {
//         navigation.replace('Login');
//       })
//       .catch((error) => alert(error.message));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.email}>Welcome, {auth.currentUser?.email}!</Text>
//       <View style={styles.buttonsContainer}>
//         <TouchableOpacity onPress={handleSignOut} style={[styles.button, styles.signOutButton]}>
//           <Text style={[styles.buttonText, styles.signOutButtonText]}>Sign Out</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             navigation.navigate('UploadScreen');
//           }}
//           style={[styles.button, styles.uploadButton]}
//         >
//           <Text style={[styles.buttonText, styles.uploadButtonText]}>Upload Files</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {navigation.navigate("DownloadScreen")}}
//           style={styles.button}
//         >
//           <Text style={styles.buttonText}>Download files</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   email: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   buttonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     width: '100%',
//   },
//   button: {
//     borderRadius: 10,
//     paddingVertical: 15,
//     paddingHorizontal: 50,
//     marginTop: 20,
//   },
//   signOutButton: {
//     backgroundColor: '#FF6347',
//   },
//   signOutButtonText: {
//     color: '#fff',
//   },
//   uploadButton: {
//     backgroundColor: '#0782F9',
//   },
//   uploadButtonText: {
//     color: '#fff',
//   },
//   buttonText: {
//     fontWeight: '700',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

// export default HomeScreen;
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';

const HomeScreen = () => {
  const navigation = useNavigation();
  
  const handleSignOut = () => {
  auth
  .signOut()
  .then(() => {
  navigation.replace('Login');
  })
  .catch((error) => alert(error.message));
  };
  
  return (
    <View style={styles.container}>
    <View style={styles.header}>
    <Text style={styles.logo}> FileGate </Text>
    </View>
    <Text style={styles.email}>Welcome, {auth.currentUser?.email}!</Text>
    <View style={styles.buttonsContainer}>
    <TouchableOpacity
          onPress={() => {
            navigation.navigate('UploadScreenManual');
          }}
          style={[styles.button, styles.uploadButton]}
        >
          <Text style={[styles.buttonText, styles.uploadButtonText]}>Upload Files Manual</Text>
        </TouchableOpacity>
    <TouchableOpacity onPress={handleSignOut} style={[styles.button, styles.signOutButton]}>
    <Text style={[styles.buttonText, styles.signOutButtonText]}>Sign Out</Text>
    </TouchableOpacity>
    <TouchableOpacity
    onPress={() => {
    navigation.navigate('UploadScreen');
    }}
    style={[styles.button, styles.uploadButton]}
    >
    <Text style={[styles.buttonText, styles.uploadButtonText]}>Upload Files</Text>
    </TouchableOpacity>
    <TouchableOpacity
    onPress={() => {
    navigation.navigate('DownloadScreen');
    }}
    style={styles.button}
    >
    <Text style={styles.buttonText}>Download Files</Text>
    </TouchableOpacity>
    </View>
    </View>
    );
    };
  
    const styles = StyleSheet.create({
      container: {
      flex: 1,
      backgroundColor: '#fff',
      },
      header: {
      backgroundColor: '#6646ee',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 80,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      },
      logo: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
      },
      email: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30,
      marginBottom: 20,
      textAlign: 'center',
      },
      buttonsContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      },
      button: {
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal: 50,
      marginVertical: 10,
      width: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#0782F9',
      },
      signOutButton: {
      backgroundColor: '#FF6347',
      borderColor: '#FF6347',
      },
      signOutButtonText: {
      color: '#fff',
      },
      uploadButton: {
      backgroundColor: '#0782F9',
      borderColor: '#0782F9',
      },
      uploadButtonText: {
      color: '#fff',
      },
      buttonText: {
      fontWeight: '700',
      fontSize: 16,
      },
      });
      
      export default HomeScreen;