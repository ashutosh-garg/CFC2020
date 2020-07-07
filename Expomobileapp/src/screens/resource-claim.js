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
import { Value } from "react-native-reanimated";

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    padding: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  claimButton: {
    flexDirection: "row",
    color: "#FFFFFF",
    fontSize: 16,
    padding: 12,
    marginTop: 70,
  },
  locatorButton: {
    flex: 1,
    flexDirection: "column",
    position: "relative",
    color: "#FFFFFF",
    fontSize: 16,
    padding: 12,
    marginTop: 15,
  },
  label: {
    marginLeft: 20,
    marginTop: 30,
    color: "#000",
    fontSize: 25,
    paddingBottom: 5,
  },
  quantityArea: {
    width: "40%",
    height: "17%",
  },
  textInput: {
    flex: 1,
    borderColor: "#D0E2FF",
    borderWidth: 2,
    padding: 14,
    elevation: 2,
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
  const [quantity, setQuantity] = React.useState({});

  return (
    <View style={styles.outerView}>
      <Text style={styles.content}>{props.route.params.item.name}</Text>
      <Text style={styles.content}>{props.route.params.item.quantity}</Text>
      <View style={styles.quantityArea}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.textInput}
          defaultValue={props.route.params.item.quantity.toString()}
          keyboardType="numeric"
          onChangeText={(num) => setQuantity(num)}
        />
      </View>
      <View style={styles.claimButton}>
        <TouchableOpacity style={{ width: 70 }}>
          <Button
            title="Claim it!"
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
        <TouchableOpacity style={{ width: 100 }}>
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
