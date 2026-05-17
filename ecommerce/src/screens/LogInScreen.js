import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  Color,
  Border,
  FontSize,
  FontFamily,
} from "../styles/GlobalStyles";

import { theme } from "../theme";

import {
  loginUser,
} from "../services/database";

export default function LogInScreen({
  navigation,
}) {

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ─────────────────────────────
  // 🔐 LOGIN
  // ─────────────────────────────
  const handleLogin = async () => {
    try {

      const usuario = await loginUser(
        email,
        senha
      );

      if (!usuario) {

        Alert.alert(
          "Erro",
          "E-mail ou senha inválidos"
        );

        return;
      }

      // SALVA USUÁRIO LOGADO
      await AsyncStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
      );

      // REDIRECIONA
      if (
        usuario.tipo_usuario === "admin"
      ) {

        navigation.replace(
          "AdminDashboard"
        );

      } else {

        navigation.replace(
          "Home"
        );
      }

    } catch (error) {

      console.error(error);

      Alert.alert(
        "Erro",
        "Erro ao fazer login"
      );
    }
  };

  return (

    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
    >

      <View style={styles.card}>

        <Text style={styles.title}>
          Faça seu login
        </Text>

        {/* EMAIL */}
        <Text style={styles.label}>
          E-mail
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* SENHA */}
        <Text style={styles.label}>
          Senha
        </Text>

        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        {/* BOTÃO */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >

          <Text style={styles.buttonText}>

            {loading
              ? "Entrando..."
              : "Entrar"}

          </Text>

        </TouchableOpacity>

        {/* ESQUECI SENHA */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              "ForgotPassword"
            )
          }
        >
          <Text
            style={styles.forgot}
          >
            Esqueci minha senha
          </Text>
        </TouchableOpacity>

        {/* CADASTRO */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              "SignIn"
            )
          }
        >
          <Text style={styles.link}>

            Não possui uma conta?{" "}

            <Text
              style={styles.linkBold}
            >
              Cadastre-se
            </Text>

          </Text>
        </TouchableOpacity>

      </View>

    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor:
      theme.colors.primary,
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
    borderRadius:
      Border.br_30,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontFamily:
      FontFamily.poppinsBold,
    color:
      theme.colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize:
      FontSize.fs_16,
    fontFamily:
      FontFamily.poppinsSemiBold,
    marginBottom: 5,
  },

  input: {
    backgroundColor:
      theme.colors.inputBg,
    borderRadius:
      Border.br_15,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor:
      theme.colors.primary,
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontFamily:
      FontFamily.poppinsSemiBold,
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
    color:
      theme.colors.primary,
    fontWeight: "bold",
  },
});