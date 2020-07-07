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
    flexDirection: "row",
    padding: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  claimButton: {
    color: "#FFFFFF",
    fontFamily: "IBMPlexSans-Medium",
    fontSize: 16,
    padding: 12,
    marginTop: 15,
    marginLeft: 80,
  },
  locatorButton: {
    position: "relative",
    color: "#FFFFFF",
    fontFamily: "IBMPlexSans-Medium",
    fontSize: 16,
    padding: 12,
    marginTop: 15,
  },
});

const ShowResource = (props) => {
  let it = JSON.parse(JSON.stringify(props.route.params.item));
  //console.log(it);
  var qt = 1;
  return (
    <View style={styles.outerView}>
      <View>
        <TextInput />
      </View>
      <View style={styles.claimButton}>
        <TouchableOpacity style={{ width: 70 }}>
          <Button
            title="Claim it!"
            onPress={() => {
              var rem = it.quantity - qt;
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
