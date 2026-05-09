import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Color, Border, FontSize, FontFamily } from "../styles/GlobalStyles";

export default function SecurityQuestionsScreen({ navigation }) {
  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Perguntas de segurança</Text>

        {/* Pergunta 1 */}
        <Text style={styles.label}>
          Qual o nome da cidade em que você nasceu?
        </Text>
        <TextInput style={styles.input} />

        {/* Pergunta 2 */}
        <Text style={styles.label}>
          Nome da última escola que você estudou?
        </Text>
        <TextInput style={styles.input} />

        {/* Botão */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("StoreHome")}
        >
          <Text style={styles.buttonText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Color.colorSteelblue,
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: Border.br_30,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  title: {
    fontSize: 24,
    fontFamily: FontFamily.poppinsBold,
    color: Color.colorSteelblue,
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize: FontSize.fs_16,
    fontFamily: FontFamily.poppinsSemiBold,
    marginBottom: 5,
  },

  input: {
    backgroundColor: Color.colorWhitesmoke,
    borderRadius: Border.br_15,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: Color.colorSteelblue,
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontFamily: FontFamily.poppinsSemiBold,
  },
});
