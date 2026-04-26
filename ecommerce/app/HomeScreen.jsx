import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import UsuarioCard from "../components/UsuarioCard";
import UsuarioForm from "../components/UsuarioForm";
import {
  getAllUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  initDatabase,
} from "./database";

export default function HomeScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  useEffect(() => {
    inicializarApp();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, []),
  );

  const inicializarApp = async () => {
    try {
      await initDatabase();
      await carregarUsuarios();
    } catch (error) {
      console.error("Erro ao inicializar app:", error);
      Alert.alert("Erro", "Erro ao inicializar aplicativo");
    }
  };

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const dados = await getAllUsuarios();
      setUsuarios(dados);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      Alert.alert("Erro", "Não foi possível carregar os usuários");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    carregarUsuarios();
  };

  const handleNovoUsuario = () => {
    setUsuarioSelecionado(null);
    setModalVisible(true);
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSelecionado(usuario);
    setModalVisible(true);
  };

  const handleSalvarUsuario = async (dados) => {
    try {
      if (dados.id) {
        // Atualizar usuário existente
        const sucesso = await updateUsuario(
          dados.id,
          dados.nome,
          dados.email,
          dados.idade,
        );
        if (sucesso) {
          Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
          await carregarUsuarios();
        } else {
          throw new Error("Usuário não encontrado");
        }
      } else {
        // Criar novo usuário
        await createUsuario(dados.nome, dados.email, dados.idade);
        Alert.alert("Sucesso", "Usuário criado com sucesso!");
        await carregarUsuarios();
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);

      if (error.message && error.message.includes("UNIQUE constraint failed")) {
        throw new Error("Este email já está cadastrado");
      } else {
        throw new Error("Erro ao salvar usuário");
      }
    }
  };

  const handleDeletarUsuario = async (id) => {
    try {
      const sucesso = await deleteUsuario(id);
      if (sucesso) {
        Alert.alert("Sucesso", "Usuário excluído com sucesso!");
        await carregarUsuarios();
      } else {
        Alert.alert("Erro", "Usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      Alert.alert("Erro", "Não foi possível excluir o usuário");
    }
  };

  const handleVisualizarUsuario = (usuario) => {
    navigation.navigate("UsuarioDetail", { usuario });
  };

  const renderUsuario = ({ item }) => (
    <UsuarioCard
      usuario={item}
      onPress={handleVisualizarUsuario}
      onEdit={handleEditarUsuario}
      onDelete={handleDeletarUsuario}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="person-add-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
      <Text style={styles.emptySubtext}>
        Toque no botão + para adicionar seu primeiro usuário
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.headerTitle}>Usuários</Text>
            <Text style={styles.headerSubtitle}>
              {usuarios.length}{" "}
              {usuarios.length === 1 ? "cadastrado" : "cadastrados"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => navigation.navigate("DatabaseDebug")}
          >
            <Ionicons name="bug-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate("BookDetails")}
        >
          <Ionicons name="book-outline" size={24} color="#fff" />
          <Text style={styles.bookButtonText}>Ver livro</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={usuarios}
        renderItem={renderUsuario}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          usuarios.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#2196F3"]}
          />
        }
      />

      <UsuarioForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSalvarUsuario}
        usuario={usuarioSelecionado}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  debugButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 8,
    textAlign: "center",
  },
});
