import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { createUsuario } from "../services/database";
import { Color, Border, FontSize, FontFamily } from "../styles/GlobalStyles";
import { theme } from "../theme";

export default function SignInScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleCpfChange = (text) => {
    let value = text.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(value);
  };

  const handleDateChange = (text) => {
    let value = text.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/(\d{2})(\d)/, "$1/$2");
    value = value.replace(/(\d{2})(\d)/, "$1/$2");
    setDataNascimento(value);
  };

  const handleCadastro = async () => {
    try {
      if (!nome || !email || !senha) {
        Alert.alert("Atenção", "Preencha nome, e-mail e senha.");
        return;
      }
      if (senha.length < 8) {
        Alert.alert("Atenção", "A senha deve ter no mínimo 8 caracteres.");
        return;
      }

      await createUsuario(nome, email, cpf, dataNascimento);

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      navigation.navigate("UserList");
    } catch (error) {
      console.log("Erro ao salvar usuário:", error);
      Alert.alert("Erro", "Não foi possível salvar o usuário.");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Crie sua conta!</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>CPF</Text>
        <TextInput 
          style={styles.input} 
          value={cpf} 
          onChangeText={handleCpfChange} 
          keyboardType="numeric"
          maxLength={14}
        />

        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput
          style={styles.input}
          value={dataNascimento}
          onChangeText={handleDateChange}
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar-se</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
          <Text style={[styles.label, { textAlign: "center", marginTop: 20, color: "#666" }]}>
            Já possui uma conta?{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>Entrar</Text>
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
    width: "100%",
    borderRadius: Border.br_30,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
});