import React from "react";
import { createOpenLink } from "react-native-open-maps";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Linking,
} from "react-native";

import { session, message } from "../lib/utils";

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
  },
  innerContainer: {
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 5,
  },
  messageContainer: {
    flexDirection: "column",
    marginTop: 10,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  waText: {
    backgroundColor: "#D0E2FF",
    padding: 10,
    alignSelf: "flex-start",
    maxWidth: "85%",
  },
  myText: {
    backgroundColor: "#F1F0EE",
    padding: 10,
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  inputContainer: {
    backgroundColor: "#F1F0EE",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 6,
    elevation: 2,
    paddingRight: 70,
    marginBottom: 10,
  },
  submitButton: {
    position: "relative",
    flex: 1,
    flexDirection: "column",
    marginBottom: 10,
    marginLeft: 5,
  },
  anchorLink: {
    color: "#1062FE",
    padding: 2.5,
  },
  chatText: {},
});

const Chat = function ({ navigation }) {
  const [input, setInput] = React.useState("");
  const [sessionId, setSessionId] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  const MapLink = (props) => {
    let locationText = "";
    const loc =
      typeof props.location === "string"
        ? props.location.split(",")
        : props.location;
    if (loc.length !== 2 || isNaN(loc[0]) || isNaN(loc[1])) {
      locationText = loc;
    } else {
      locationText = "this location";
    }

    return (
      <TouchableOpacity
        onPress={createOpenLink({
          query: props.location,
          provider: "google",
          zoom: 10,
        })}
      >
        <Text style={styles.chatText}>
          {" "}
          {props.quantity} at{" "}
          <Text style={styles.anchorLink}>{locationText}</Text>{" "}
        </Text>
      </TouchableOpacity>
    );
  };

  const MailLink = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(`mailto:${props.contact}?subject=${props.name}`);
        }}
      >
        <Text style={styles.chatText}>
          {" "}
          {props.quantity} from{" "}
          <Text style={styles.anchorLink}>{props.contact}</Text>{" "}
        </Text>
      </TouchableOpacity>
    );
  };

  const Resource = (props) => {
    if (props.location) {
      return <MapLink {...props} />;
    } else {
      return <MailLink {...props} />;
    }
  };

  const Message = (props) => {
    const style = props.fromInput ? styles.myText : styles.waText;
    return (
      <View style={styles.messageContainer}>
        <View style={style}>
          <Text style={styles.chatText}>{props.text}</Text>
          {props.resources.map((resource, i) => {
            resource.key = `sup-${new Date().getTime()}-${i}`;
            return <Resource {...resource} />;
          })}
        </View>
      </View>
    );
  };

  const getSession = () => {
    return session().then((sid) => {
      setSessionId(sid);
      return sid;
    });
  };

  const handleMessageResponse = (response) => {
    if (!response.ok) {
      throw new Error(
        response.statusText || response.message || response.status
      );
    } else {
      return response.json().then((response) => {
        addMessages(response.generic, false, response.resources);
      });
    }
  };

  const sendMessage = () => {
    const payload = {
      text: input.trim(),
      sessionid: sessionId,
    };

    addMessages([{ text: input }], true);

    setInput("");

    message(payload)
      .then(handleMessageResponse)
      .catch((e) => {
        getSession()
          .then((sid) => {
            return message({
              text: payload.text,
              sessionid: sid,
            });
          })
          .then(handleMessageResponse)
          .catch((err) => {
            console.log(err);
            addMessages([
              {
                text:
                  "ERROR: Please try again. If the problem persists contact an administrator.",
              },
            ]);
          });
      });
  };

  const addMessages = (msgs, fromInput, resources) => {
    const date = new Date().getTime();
    const result = msgs.map((r, i) => {
      return {
        text: r.text,
        fromInput: fromInput,
        resources: resources || [],
      };
    });

    setMessages((msgs) => [...msgs, ...result]);
  };

  React.useEffect(() => {
    navigation.addListener("focus", () => {
      getSession();
    });
  }, []);

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {messages.map((msg, i) => {
          msg.key = `msg-${new Date().getTime()}-${i}`;
          return <Message {...msg} />;
        })}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={{ width: 300 }}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            enablesReturnKeyAutomatically={true}
            placeholder="Ask a question..."
            blurOnSubmit={false}
          />
        </TouchableOpacity>
        <View style={styles.submitButton}>
          <TouchableOpacity style={{ width: 70 }}>
            <Button title="Ask" onPress={sendMessage} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Chat;
