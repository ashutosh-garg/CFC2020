import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PickerSelect from "react-native-picker-select";
import { CheckedIcon, UncheckedIcon } from "../images/svg-icons";
import * as Location from "expo-location";
import { updateRequest, remove, userID } from "../lib/utils";

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    padding: 22,
    backgroundColor: "#FFF",
  },
  splitView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeArea: {
    width: "40%",
  },
  label: {
    color: "#000",
    fontSize: 14,
    paddingBottom: 5,
  },
  selector: {
    borderColor: "#D0E2FF",
    borderWidth: 2,
    padding: 16,
    marginBottom: 25,
  },
  quantityArea: {
    width: "40%",
  },
  textInput: {
    flex: 1,
    borderColor: "#D0E2FF",
    borderWidth: 2,
    padding: 14,
    elevation: 2,
    marginBottom: 25,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 13,
  },
  textInputDisabled: {
    backgroundColor: "#f4f4f4",
    color: "#999",
    flex: 1,
    padding: 16,
    elevation: 2,
    marginBottom: 25,
  },
  updateButton: {
    backgroundColor: "#1062FE",
    color: "#FFFFFF",

    fontSize: 16,
    overflow: "hidden",
    padding: 12,
    textAlign: "center",
    marginTop: 15,
  },
  deleteButton: {
    backgroundColor: "#da1e28",
    color: "#FFFFFF",

    fontSize: 16,
    overflow: "hidden",
    padding: 12,
    textAlign: "center",
    marginTop: 15,
  },
});

const EditRequest = (props) => {
  const clearItem = {
    userID: userID(),
    e: "Other",
    name: "",
    description: "",
    location: "",
    contact: "",
    quantity: "1",
    tag: "",
  };
  const [item, setItem] = React.useState(clearItem);
  const [useLocation, setUseLocation] = React.useState(false);
  const [position, setPosition] = React.useState({});
  const getlfu = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
    }
    let pos = await Location.getCurrentPositionAsync({});
    return pos;
  };
  React.useEffect(() => {
    props.navigation.addListener("focus", async () => {
      const item = props.route.params.item;
      setItem({
        ...item,
        quantity: item.quantity,
      });
      let pos = await getlfu();
      setPosition(pos);
    });
  }, []);

  const toggleUseLocation = () => {
    if (!useLocation && position) {
      setItem({
        ...item,
        location: `${position.coords.latitude},${position.coords.longitude}`,
      });
    }
    setUseLocation(!useLocation);
  };

  const updateItem = () => {
    const payload = {
      ...item,
      quantity: isNaN(item.quantity) ? 1 : item.quantity,
      id: item.id || item["_id"],
    };

    updateRequest(payload)
      .then(() => {
        Alert.alert("Done", "Your item has been updated.", [{ text: "OK" }]);
        props.navigation.goBack();
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("ERROR", err.message, [{ text: "OK" }]);
      });
  };

  const confirmDelete = () => {
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => deleteItem() },
    ]);
  };

  const deleteItem = () => {
    const payload = {
      ...item,
      id: item.id || item["_id"],
    };

    remove(payload)
      .then(() => {
        Alert.alert("Done", "Your item has been deleted.", [{ text: "OK" }]);
        props.navigation.goBack();
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("ERROR", err.message, [{ text: "OK" }]);
      });
  };

  return (
    <ScrollView style={styles.outerView}>
      <View style={styles.splitView}>
        <View style={styles.typeArea}>
          <Text style={styles.label}>Category</Text>
          <PickerSelect
            style={{ inputIOS: styles.selector }}
            value={item.type}
            onValueChange={(t) => setItem({ ...item, type: t })}
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
        </View>
        <View style={styles.quantityArea}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.textInput}
            value={item.quantity}
            onChangeText={(t) => setItem({ ...item, quantity: t })}
            onSubmitEditing={updateItem}
            returnKeyType="send"
            enablesReturnKeyAutomatically={true}
            placeholder="e.g., 10"
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.textInput}
        value={item.name}
        onChangeText={(t) => setItem({ ...item, name: t })}
        onSubmitEditing={updateItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="e.g., Tomotatoes"
        blurOnSubmit={false}
      />
      <Text style={styles.label}>Tag</Text>
      <TextInput
        style={styles.textInput}
        value={item.tag}
        onChangeText={(t) => setItem({ ...item, tag: t })}
        onSubmitEditing={updateItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="e.g., Corona Pandemic"
        blurOnSubmit={false}
      />
      <Text style={styles.label}>Contact</Text>
      <TextInput
        style={styles.textInput}
        value={item.contact}
        onChangeText={(t) => setItem({ ...item, contact: t })}
        onSubmitEditing={updateItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="user@domain.com"
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textInput}
        value={item.description}
        onChangeText={(t) => setItem({ ...item, description: t })}
        onSubmitEditing={updateItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="e.g., small baskets of cherry tomatoes"
      />
      <Text style={styles.label}>Location</Text>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={toggleUseLocation}>
          {useLocation ? (
            <CheckedIcon height="18" width="18" />
          ) : (
            <UncheckedIcon height="18" width="18" />
          )}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}> Use my current location </Text>
      </View>
      <TextInput
        style={useLocation ? styles.textInputDisabled : styles.textInput}
        value={item.location}
        onChangeText={(t) => setItem({ ...item, location: t })}
        onSubmitEditing={updateItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="street address, city, state"
      />

      {item.type !== "" &&
        item.name.trim() !== "" &&
        item.contact.trim() !== "" && (
          <TouchableOpacity onPress={updateItem}>
            <Text style={styles.updateButton}>Update</Text>
          </TouchableOpacity>
        )}

      <TouchableOpacity onPress={confirmDelete}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditRequest;
