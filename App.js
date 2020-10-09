/* This is an Access Contact List example from https://aboutreact.com/ */
/* https://aboutreact.com/access-contact-list-react-native/ */

//Import React
import React, { useState, useEffect } from "react";

//Import all required component
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Picker,
  ActivityIndicator
} from "react-native";

import ListItem from "./component/ListItem";
import axios from "axios"

// let SERVER_URL = 'http://192.168.1.2:5000/api';
let SERVER_URL = 'http://3.131.100.54:5000/api';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [whichMode, setWhichMode] = useState("contact")
  const [imageData, setImageData] = useState(undefined);
  const [devices_Id, setDevices_Id] = useState(undefined);
  const [activeId, setActiveId] = useState(undefined);

  const get_device_info = () => {
    axios.get(`${SERVER_URL}/client`)
      .then(function (response) {
        setDevices_Id(response.data)
      })
      .catch(function (error) {
        setDevices_Id(undefined)
      });
  }


  const get_contacts_vai_id = (id) => {
    const options = {
      headers: {
        "device_id": id
      }
    };

    axios.get(`${SERVER_URL}/contacts`, options)
      .then(function (response) {
        setContacts(response.data)

      })
      .catch(function (error) {
        setContacts(undefined)
      });
  }

  useEffect(() => {
    get_device_info()
  }, [])


  useEffect(() => {
    if (activeId) {
      get_contacts_vai_id(activeId)
    }
  }, [activeId])


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>
          Access Contact and Device Information
        </Text>
        <Picker
          selectedValue={activeId}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => {
            setActiveId(itemValue)
            setContacts(undefined)
          }}
        >
          {devices_Id && devices_Id.length > 0 && devices_Id.map((item, index) => {
            return (
              <Picker.Item label={item.brand + " - " + item.device_id} value={item.device_id} key={"item" + index} />
            )
          })}

        </Picker>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: 10 }}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setWhichMode("contact")}>
            <Text style={{ color: "#fff" }}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => setWhichMode("gallery")}>
            <Text style={{ color: "#fff" }}>gallery</Text>
          </TouchableOpacity>
        </View>


        {whichMode === "gallery" && (
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {imageData && imageData.length > 0 && imageData.map((image, index) => {
              return (
                <TouchableOpacity key={"img" + index} style={{ borderWidth: 2, margin: 5, borderColor: '#ccc', width: '30%', }}>
                  <Image
                    style={{
                      width: '100%',
                      height: 150,
                    }}
                    source={{ uri: image.node.image.uri }}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
        )}


        {contacts === undefined ? <ActivityIndicator size="large" color="green" /> : null}

        {whichMode === "contact" && (
          <View>
            <FlatList
              data={contacts}
              renderItem={(contact) => {
                return (<ListItem
                  key={contact.item.recordID}
                  item={contact.item}
                />)
              }}
              keyExtractor={item => item.recordID}
            />
          </View>
        )}
      </View>
    </SafeAreaView>

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
    fontSize: 20,
    textAlign: 'center'
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