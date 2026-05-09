import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import BottomNavBar from "../components/BottomNavBar";

import { addToCarrinho } from "../services/database";

export default function BookDetailsScreen({
  navigation,
  route,
}) {

  const { livro } = route.params;

  // ─────────────────────────────────────────────
  // 🛒 ADICIONAR AO CARRINHO
  // ─────────────────────────────────────────────
  const handleAddToCart = async () => {

    try {

      // ⚠️ depois pegar do usuário logado
      const usuarioId = 1;

      await addToCarrinho(
        usuarioId,
        livro.id_livro,
        1
      );

      Alert.alert(
        "Carrinho",
        `${livro.titulo_livro} foi adicionado ao carrinho`
      );

    } catch (error) {

      console.error(error);

      Alert.alert(
        "Erro",
        "Não foi possível adicionar ao carrinho"
      );
    }
  };

  // ─────────────────────────────────────────────
  // 💳 COMPRAR AGORA
  // ─────────────────────────────────────────────
  const handleBuyNow = async () => {

    try {

      // ⚠️ depois pegar do usuário logado
      const usuarioId = 1;

      await addToCarrinho(
        usuarioId,
        livro.id_livro,
        1
      );

      navigation.navigate("CartScreen");

    } catch (error) {

      console.error(error);

      Alert.alert(
        "Erro",
        "Não foi possível continuar"
      );
    }
  };

  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={26}
              color="#fff"
            />
          </TouchableOpacity>

        </View>

        {/* IMAGEM */}
        <View style={styles.imageWrapper}>

          {livro.capa_livro ? (

            <Image
              source={{
                uri: livro.capa_livro,
              }}
              style={styles.image}
              resizeMode="cover"
            />

          ) : (

            <View style={styles.imageFallback}>

              <Text style={styles.imageFallbackText}>
                Sem imagem
              </Text>

            </View>
          )}

        </View>

        {/* CARD */}
        <View style={styles.card}>

          {/* CATEGORIA */}
          <Text style={styles.category}>
            {livro.categoria}
          </Text>

          {/* TÍTULO */}
          <Text style={styles.title}>
            {livro.titulo_livro}
          </Text>

          {/* AVALIAÇÃO */}
          <Text style={styles.rating}>
            ★★★★★
          </Text>

          {/* PREÇO */}
          <View style={styles.priceRow}>

            <Text style={styles.price}>
              R$ {Number(livro.preco).toFixed(2)}
            </Text>

            <View style={styles.icons}>

              {/* FAVORITO */}
              <TouchableOpacity>
                <Ionicons
                  name="heart-outline"
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>

              {/* CARRINHO */}
              <TouchableOpacity
                onPress={handleAddToCart}
              >
                <Ionicons
                  name="bag-outline"
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>

            </View>

          </View>

          {/* ENTREGA */}
          <Text style={styles.delivery}>
            Entrega GRÁTIS para sua região
          </Text>

          {/* DESCRIÇÃO */}
          <Text style={styles.sectionTitle}>
            Descrição
          </Text>

          <Text style={styles.description}>
            {
              livro.descricao ||
              "Sem descrição disponível."
            }
          </Text>

          {/* INFO EXTRA */}
          <View style={styles.infoBox}>

            <Text style={styles.infoText}>
              ID do livro: {livro.id_livro}
            </Text>

            <Text style={styles.infoText}>
              Categoria: {livro.categoria}
            </Text>

            <Text style={styles.infoText}>
              Estoque: {livro.estoque}
            </Text>

          </View>

          {/* BOTÃO ADICIONAR */}
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={handleAddToCart}
          >

            <Text style={styles.outlineText}>
              Adicionar ao carrinho
            </Text>

          </TouchableOpacity>

          {/* BOTÃO COMPRAR */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleBuyNow}
          >

            <Text style={styles.primaryText}>
              Comprar agora
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* NAVBAR */}
      <BottomNavBar
        active="home"
        navigation={navigation}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#7FA6B6",
    height: 140,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  imageWrapper: {
    alignItems: "center",
    marginTop: -60,
    zIndex: 10,
  },

  image: {
    width: 170,
    height: 250,
    borderRadius: 12,
    backgroundColor: "#eee",
  },

  imageFallback: {
    width: 170,
    height: 250,
    borderRadius: 12,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

  imageFallbackText: {
    color: "#666",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },

  category: {
    textAlign: "center",
    color: "#7FA6B6",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
  },

  rating: {
    textAlign: "center",
    color: "#f5a623",
    marginTop: 8,
    fontSize: 18,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },

  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
  },

  icons: {
    flexDirection: "row",
    gap: 16,
  },

  delivery: {
    marginTop: 10,
    color: "#666",
    fontSize: 13,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#444",
    textAlign: "justify",
  },

  infoBox: {
    marginTop: 20,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
  },

  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },

  outlineButton: {
    marginTop: 28,
    borderWidth: 2,
    borderColor: "#7FA6B6",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },

  outlineText: {
    color: "#7FA6B6",
    fontWeight: "700",
    fontSize: 16,
  },

  primaryButton: {
    marginTop: 14,
    backgroundColor: "#7FA6B6",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 40,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

});