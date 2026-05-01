import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";

export default function BookDetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* IMAGEM SOBREPOSTA */}
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../assets/images/AHipotese.jpg")}
            style={styles.image}
          />
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>A Hipótese do Amor</Text>

          {/* AVALIAÇÃO */}
          <Text style={styles.rating}>★★★★★</Text>

          {/* PREÇO + ÍCONES */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>R$ 43,81</Text>

            <View style={styles.icons}>
              <Ionicons name="bag-outline" size={22} />
              <Ionicons name="heart-outline" size={22} />
            </View>
          </View>

          <Text style={styles.delivery}>
            Entrega GRÁTIS: sexta-feira, 6 de março
          </Text>

          {/* DESCRIÇÃO */}
          <Text style={styles.description}>
            Quando um namoro de mentira entre cientistas encontra a irresistível
            força da atração, todas as teorias cuidadosamente calculadas sobre o
            amor são postas à prova.
          </Text>

          {/* BOTÕES */}
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={styles.outlineText}>Adicionar ao carrinho</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={styles.primaryText}>Comprar agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* NAVBAR FIXA */}
      <BottomNavBar navigation={navigation} />
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
    marginTop: -60, // 🔥 faz a imagem "flutuar"
  },

  image: {
    width: 160,
    height: 230,
    borderRadius: 10,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  rating: {
    textAlign: "center",
    color: "#f5a623",
    marginVertical: 5,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  price: {
    fontSize: 22,
    fontWeight: "bold",
  },

  icons: {
    flexDirection: "row",
    gap: 10,
  },

  delivery: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },

  description: {
    marginTop: 15,
    fontSize: 14,
    color: "#444",
    textAlign: "center",
  },

  outlineButton: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#7FA6B6",
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
  },

  outlineText: {
    color: "#7FA6B6",
    fontWeight: "600",
  },

  primaryButton: {
    marginTop: 10,
    backgroundColor: "#7FA6B6",
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
