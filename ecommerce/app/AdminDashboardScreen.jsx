import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useRouter } from "expo-router";

export default function AdminDashboardScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>
      <Text style={styles.subtitle}>
        Área geral de gerenciamento do sistema Bookflow
      </Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/UserListScreen")}
      >
        <Text style={styles.cardTitle}>Usuários</Text>
        <Text style={styles.cardText}>
          Visualizar, acompanhar e excluir usuários cadastrados.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/AdminProductListScreen")}
      >
        <Text style={styles.cardTitle}>Produtos / Livros</Text>
        <Text style={styles.cardText}>
          Gerenciar livros cadastrados no sistema.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/AdminCategoryListScreen")}
      >
        <Text style={styles.cardTitle}>Categorias</Text>
        <Text style={styles.cardText}>
          Cadastrar, editar e organizar categorias dos livros.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/JsonDataScreen")}
      >
        <Text style={styles.cardTitle}>Dashboard JSON</Text>
        <Text style={styles.cardText}>
          Visualizar os dados consolidados em formato JSON.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f7fb",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1f3c88",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d9e2f2",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f3c88",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});