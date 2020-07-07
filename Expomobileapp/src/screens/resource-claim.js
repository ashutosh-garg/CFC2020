import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { createOpenLink } from "react-native-open-maps";

import { update, remove } from "../lib/utils";

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    padding: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  claimButton: {
    flex: 1,
    position: "relative",
    flexDirection: "column",
    color: "#FFFFFF",
    fontSize: 16,
    padding: 12,
  },
  locatorButton: {
    flex: 1,
    flexDirection: "column",
    color: "#FFFFFF",
    fontSize: 16,
    padding: 12,
    marginBottom: 200,
  },
  label: {
    marginLeft: 20,
    marginTop: 70,
    color: "#000",
    fontSize: 25,
    paddingBottom: 5,
  },
  textInput: {
    borderColor: "#D0E2FF",
    borderWidth: 2,
    padding: 6,
    elevation: 2,
    width: "50%",
    height: "7%",
  },
  content: {
    color: "#323232",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 25,
  },
});

const ShowResource = (props) => {
  let it = JSON.parse(JSON.stringify(props.route.params.item));
  it.id = it._id;
  const [quantity, setQuantity] = React.useState(Number);

  return (
    <View style={styles.outerView}>
      <Text style={styles.content}>Item : {props.route.params.item.name}</Text>
      <Text style={styles.content}>
        Quantity available : {props.route.params.item.quantity}
      </Text>
      <Text style={styles.label}>How many do you want?</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter quantity"
        //value={props.route.params.item.quantity}
        keyboardType="numeric"
        onChangeText={(num) => setQuantity(num)}
      />
      <View style={styles.claimButton}>
        <TouchableOpacity style={{ width: "100%" }}>
          <Button
            title="Claim"
            onPress={() => {
              console.log(quantity);
              var rem = it.quantity - quantity;
              if (rem < 0) {
                Alert.alert(
                  "Not allowed",
                  "You can not claim more than the quantity available.",
                  [{ text: "OK" }]
                );
              } else if (rem == 0) {
                remove(it)
                  .then(() => {
                    Alert.alert("Done", "Your have claimed all of it.", [
                      { text: "OK" },
                    ]);
                    props.navigation.goBack();
                  })
                  .catch((err) => {
                    console.log(err);
                    Alert.alert("ERROR", err.message, [{ text: "OK" }]);
                  });
              } else {
                it.quantity = rem;
                {
                  update(it)
                    .then(() => {
                      Alert.alert("Done", "item has been updated.", [
                        { text: "OK" },
                      ]);
                      props.navigation.goBack();
                    })
                    .catch((err) => {
                      console.log(err);
                      Alert.alert("ERROR", err.message, [{ text: "OK" }]);
                    });
                }
              }
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.locatorButton}>
        <TouchableOpacity style={{ width: "100%" }}>
          <Button
            title="Go to location"
            onPress={createOpenLink({
              query: it.location,
              provider: "google",
              zoom: 10,
            })}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShowResource;
