import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import PickerSelect from "react-native-picker-select";
import { createOpenLink } from "react-native-open-maps";
import * as Location from "expo-location";
import { search } from "../lib/utils";

const styles = StyleSheet.create({
  outerView: {
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
  },
  inputsView: {
    backgroundColor: "#F1F0EE",
    padding: 16,
    padding: 22,
  },
  label: {
    color: "#000",
    fontSize: 14,
    paddingBottom: 5,
  },
  selector: {
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1062FE",
    color: "#FFFFFF",

    fontSize: 16,
    overflow: "hidden",
    padding: 12,
    textAlign: "center",
    marginTop: 15,
  },
  searchResultText: {
    padding: 10,
    color: "#1062FE",
  },
  flatListView: {
    backgroundColor: "#FFF",
  },
  itemTouchable: {
    flexDirection: "column",
    padding: 15,
    justifyContent: "flex-start",
    alignItems: "stretch",
    borderBottomColor: "#dddddd",
    borderBottomWidth: 0.25,
  },
  itemView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 24,
  },
  itemQuantity: {
    fontSize: 14,

    color: "gray",
  },
  itemDescription: {
    fontSize: 14,

    color: "gray",
  },
});

var quantityAsked;
var tagAsked;
var currentUserLocationLatitude;
var currentUserLocationLongitude;
const SearchResources = function ({ route, navigation }) {
  const [query, setQuery] = React.useState({
    type: "Other",
    name: "",
    quantity: "1",
    tag: "",
  });
  const [items, setItems] = React.useState([]);
  const [info, setInfo] = React.useState("");

  const Item = (props) => {
    return (
      <TouchableOpacity
        style={styles.itemTouchable}
        //onPress={() => { navigation.navigate('Map', { item: props }); }}
        onPress={createOpenLink({
          query: props.location,
          provider: "google",
          zoom: 10,
        })}
      >
        <View style={styles.itemView}>
          <Text style={styles.itemName}>{props.name}</Text>
          <Text style={styles.itemQuantity}> ( {props.quantity} ) </Text>
        </View>
        <Text style={styles.itemDescription}>{props.description}</Text>
      </TouchableOpacity>
    );
  };
  const getlfu = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
    }
    let pos = await Location.getCurrentPositionAsync({});
    return pos;
  };

  const searchItem = () => {
    quantityAsked = parseInt(query.quantity, 10) || 1;
    tagAsked = query.tag;
    const payload = {
      ...query,
    };

    search(payload)
      .then(async (results) => {
        var arrayLength = results.length;
        for (var i = arrayLength - 1; i >= 0; i--) {
          if (results[i].quantity < quantityAsked) {
            results.splice(i, 1);
          } else if (
            tagAsked != null &&
            tagAsked != "" &&
            tagAsked != results[i].tag
          ) {
            results.splice(i, 1);
          }
        }
        let pos = await getlfu();
        currentUserLocationLatitude = `${pos.coords.latitude}`;
        currentUserLocationLongitude = `${pos.coords.longitude}`;
        if (
          currentUserLocationLatitude != null &&
          currentUserLocationLatitude != "" &&
          currentUserLocationLongitude != null &&
          currentUserLocationLongitude != ""
        ) {
          for (var i = 0; i < results.length; i++) {
            if (results[i].location != null && results[i].location != "") {
              var coords = results[i].location.split(",");
              results[i].distance = distance(
                currentUserLocationLatitude,
                currentUserLocationLongitude,
                coords[0],
                coords[1]
              );
            } else {
              results[i].distance = 0;
            }
          }
          results.sort((a, b) => (a.distance > b.distance ? 1 : -1));
        }
        setInfo(`${results.length} result(s)`);
        setItems(results);
      })
      .catch((err) => {
        Alert.alert(
          "ERROR",
          "Please try again. If the problem persists contact an administrator.",
          [{ text: "OK" }]
        );
      });
  };

  function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
    return 12742 * Math.asin(Math.sqrt(a));
  }
  return (
    <View style={styles.outerView}>
      <View style={styles.inputsView}>
        <Text style={styles.label}>Category</Text>
        <PickerSelect
          style={{ inputIOS: styles.selector }}
          value={query.type}
          onValueChange={(t) => setQuery({ ...query, type: t })}
          items={[
            { label: "Other", value: "Other" },
            { label: "Water", value: "Water" },
            { label: "Food", value: "Food" },
            { label: "Grocery", value: "Grocery" },
            { label: "Dairy Products", value: "Dairy" },
            { label: "Medical Needs", value: "Medical" },
            { label: "Stationary Needs", value: "Stationary" },
            { label: "Shelter Needs", value: "Shelter" },
            { label: "Help", value: "Help" },
          ]}
        />
        <Text style={styles.label}>Tag</Text>
        <TextInput
          style={styles.textInput}
          value={query.tag}
          onChangeText={(t) => setQuery({ ...query, tag: t })}
          onSubmitEditing={searchItem}
          returnKeyType="send"
          enablesReturnKeyAutomatically={true}
          placeholder="e.g., Tomatoes"
          blurOnSubmit={false}
        />
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.textInput}
          value={query.quantity}
          onChangeText={(t) => setQuery({ ...query, quantity: t })}
          onSubmitEditing={searchItem}
          returnKeyType="send"
          enablesReturnKeyAutomatically={true}
          placeholder="e.g., 1"
          blurOnSubmit={false}
        />
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.textInput}
          value={query.name}
          onChangeText={(t) => setQuery({ ...query, name: t })}
          onSubmitEditing={searchItem}
          returnKeyType="send"
          enablesReturnKeyAutomatically={true}
          placeholder="e.g., Tomatoes"
          blurOnSubmit={false}
        />
        <TouchableOpacity onPress={searchItem}>
          <Text style={styles.button}>Search</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.searchResultText}>{info}</Text>

      <FlatList
        style={styles.flatListView}
        data={items}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id || item["_id"]}
      />

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Add Request");
        }}
      >
        <Text style={styles.button}>Add Request</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchResources;
