import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
//import { getAllUsuarios, deleteUsuario } from "../services/database";

export default function UserListScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);

  const carregarUsuarios = async () => {
    try {
      const data = await getAllUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.log("Erro ao carregar usuários:", error);
    }
  };

  const excluirUsuario = async (id) => {
    try {
      await deleteUsuario(id);
      Alert.alert("Sucesso", "Usuário excluído com sucesso.");
      carregarUsuarios();
    } catch (error) {
      console.log("Erro ao excluir usuário:", error);
      Alert.alert("Erro", "Não foi possível excluir.");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregarUsuarios();
    });

    carregarUsuarios();

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários cadastrados</Text>

      <TouchableOpacity
        style={styles.botaoNovo}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.botaoTexto}>Novo cadastro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoJson}
        onPress={() => navigation.navigate("JsonData")}
      >
        <Text style={styles.botaoTexto}>Ver JSON</Text>
      </TouchableOpacity>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>{item.email}</Text>
            <Text>{item.cpf || "Sem CPF"}</Text>
            <Text>{item.data_nascimento || "Sem data de nascimento"}</Text>

            <TouchableOpacity
              style={styles.botaoExcluir}
              onPress={() => excluirUsuario(item.id)}
            >
              <Text style={styles.botaoTexto}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum usuário cadastrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  botaoNovo: {
    backgroundColor: "#2d6cdf",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  botaoJson: {
    backgroundColor: "#5a3ec8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  botaoExcluir: {
    marginTop: 10,
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});