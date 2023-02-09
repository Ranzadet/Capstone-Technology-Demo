// import React, { useContext, useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import { AuthContext } from './AuthProv';
// import ModalD from './ModalD';
// export default function Routes() {
//     const { user, setUser } = useContext(AuthContext);
//     const [initializing, setInitializing] = useState(true);
//     // Handle user state changes
//     function onAuthStateChanged(user) {
//       setUser(user);
//       if (initializing) setInitializing(false);
//     }
//     useEffect(() => {
//       const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//       return subscriber; // unsubscribe on unmount
//     }, []);
//     return (
//       <NavigationContainer>
//         {user ?     <Stack.Navigator>
//       <Stack.Screen name='Home' component={HomeScreen} />
//     </Stack.Navigator> : <Stack.Navigator>
//       <Stack.Screen name='ModalD' component={ModalD} />
//     </Stack.Navigator>}
//       </NavigationContainer>
//     );
//   }