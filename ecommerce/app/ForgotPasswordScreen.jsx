import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Color, Border, FontSize, FontFamily } from "../styles/GlobalStyles";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [cidade, setCidade] = useState("");
  const [escola, setEscola] = useState("");

  const handleAlterarSenha = () => {
    console.log({ email, novaSenha, cidade, escola });

    // Aqui depois você pode validar ou salvar no banco

    navigation.goBack(); // volta pro login
  };

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Recupere sua senha</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Nova senha</Text>
        <TextInput
          style={styles.input}
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
        />

        <Text style={styles.label}>
          Qual o nome da cidade onde você nasceu?
        </Text>
        <TextInput
          style={styles.input}
          value={cidade}
          onChangeText={setCidade}
        />

        <Text style={styles.label}>Nome da última escola que estudou?</Text>
        <TextInput
          style={styles.input}
          value={escola}
          onChangeText={setEscola}
        />

        <TouchableOpacity style={styles.button} onPress={handleAlterarSenha}>
          <Text style={styles.buttonText}>Alterar senha</Text>
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
    fontSize: 26,
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
