import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MyLibraryScreen({ navigation }) {
  const livros = [
    {
      id: "1",
      titulo: "A hipótese do amor",
      preco: "R$43,81",
      imagem: require("../../assets/images/AHipotese.jpg"),
    },
    {
      id: "2",
      titulo: "Nós já moramos aqui",
      preco: "R$64,80",
      imagem: require("../../assets/images/images (2).jpg"),
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("BookDetails")}
    >
      <Image source={item.imagem} style={styles.image} />
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.price}>{item.preco}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Minha Biblioteca</Text>
      </View>

      {/* CONTEÚDO */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Livros favoritados</Text>

        <FlatList
          data={livros}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Ionicons name="home-outline" size={24} color="#999" />
        <Ionicons name="book-outline" size={24} color="#6DBE45" />
        <Ionicons name="person-outline" size={24} color="#999" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7FA6B6",
    padding: 20,
    gap: 15,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },

  card: {
    width: "48%",
    alignItems: "center",
    marginBottom: 20,
  },

  image: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 12,
    textAlign: "center",
  },

  price: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
});
