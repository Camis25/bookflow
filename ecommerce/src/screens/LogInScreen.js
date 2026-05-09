import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";

import { loginUser } from "../services/database";
import { Color, Border, FontSize, FontFamily } from "../styles/GlobalStyles";

export default function LogInScreen() {
  const navigation = useNavigation(); 

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    console.log({ email, senha });

    const user = await loginUser(email, senha);

    if (!user) {
      alert("Email ou senha inválidos");
      return;
    }

    console.log("LOGIN OK:", user);

    if (user.tipo_usuario === "admin") {
      navigation.replace("AdminDashboard"); 
    } else {
      navigation.replace("StoreHome"); 
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Faça seu login</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.link}>
            Já possui uma conta?{" "}
            <Text style={styles.linkBold}>Cadastre-se</Text>
          </Text>
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
    width: "90%",
    borderRadius: Border.br_30,
    padding: 20,
  },

  title: {
    fontSize: 28,
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

  link: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },

  linkBold: {
    color: Color.colorSteelblue,
    fontWeight: "bold",
  },
});