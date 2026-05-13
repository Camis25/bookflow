import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

import { Color, Border, FontSize, FontFamily } from "../styles/GlobalStyles";
import { theme } from "../theme";

export default function LogInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    console.log({ email, senha });

    if (email.toLowerCase().includes("admin")) {
      navigation.replace("AdminDashboard");
    } else {
      navigation.replace("Home");
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
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.link}>
            Não possui uma conta?{" "}
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
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize: FontSize.fs_16,
    fontFamily: FontFamily.poppinsSemiBold,
    marginBottom: 5,
  },

  input: {
    backgroundColor: theme.colors.inputBg,
    borderRadius: Border.br_15,
    padding: 12,
    marginBottom: 15,
  },


  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontFamily: FontFamily.poppinsSemiBold,
  },

  forgot: {
    textAlign: "right",
    marginTop: 10,
    color: "#666",
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },

  linkBold: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
