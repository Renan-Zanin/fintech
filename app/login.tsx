import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSignIn, isClerkAPIResponseError } from "@clerk/clerk-expo";

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

export default function Page() {
  const [countryCode, setCountryCode] = useState("+55");
  const [phoneNumber, setPhoneNumber] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 60;
  const platformOs = Platform.OS;
  const router = useRouter();
  const { signIn } = useSignIn();

  async function onSignin(type: SignInType) {
    if (type === SignInType.Phone) {
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;
        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });

        const firstPhoneFactor: any = supportedFirstFactors.find(
          (factor: any) => {
            return factor.strategy === "phone_code";
          }
        );

        const { phoneNumberId } = firstPhoneFactor;

        await signIn!.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });

        router.push({
          pathname: "/verify/[phone]",
          params: { phone: fullPhoneNumber, signin: "true" },
        });
      } catch (err) {
        console.log("error", JSON.stringify(err, null, 2));
        if (isClerkAPIResponseError(err)) {
          if (err.errors[0].code === "form_identifier_not_found") {
            Alert.alert("Error", err.errors[0].message);
          }
        }
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Bem-vindo de volta!</Text>
        <Text style={defaultStyles.descriptionText}>
          Entre com seu número de telefone associado à sua conta
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder=""
            keyboardType="numeric"
            placeholderTextColor={Colors.gray}
            value={countryCode}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Número de Telefone"
            keyboardType="numeric"
            value={phoneNumber}
            placeholderTextColor={Colors.gray}
            onChangeText={setPhoneNumber}
          />
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber !== "" ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={() => onSignin(SignInType.Phone)}
        >
          <Text style={defaultStyles.buttonText}>Continuar</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
          <Text style={{ color: Colors.gray, fontSize: 20 }}>ou</Text>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => onSignin(SignInType.Email)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 10,
              backgroundColor: "#fff",
            },
          ]}
        >
          <Ionicons name="mail" size={24} color={"#000"} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue com email
          </Text>
        </TouchableOpacity>
        {platformOs === "android" ? (
          <TouchableOpacity
            onPress={() => onSignin(SignInType.Google)}
            style={[
              defaultStyles.pillButton,
              {
                flexDirection: "row",
                gap: 16,
                marginTop: 10,
                backgroundColor: "#fff",
              },
            ]}
          >
            <Ionicons name="logo-google" size={24} color={"#000"} />
            <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
              Continue com Google
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onSignin(SignInType.Apple)}
            style={[
              defaultStyles.pillButton,
              {
                flexDirection: "row",
                gap: 16,
                marginTop: 10,
                backgroundColor: "#fff",
              },
            ]}
          >
            <Ionicons name="logo-apple" size={24} color={"#000"} />
            <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
              Continue com Apple
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: "row",
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});
