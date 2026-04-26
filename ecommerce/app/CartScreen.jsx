import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      titulo: "A hipótese do amor",
      preco: 43.81,
      quantidade: 1,
      selecionado: true,
      imagem: require("../assets/images/AHipotese.jpg"),
    },
    {
      id: "2",
      titulo: "Nós já moramos aqui",
      preco: 64.8,
      quantidade: 1,
      selecionado: true,
      imagem: require("../assets/images/images (2).jpg"),
    },
  ]);

  const recomendados = [
    { id: "1", imagem: require("../assets/images/AHipotese.jpg") },
    { id: "2", imagem: require("../assets/images/images (2).jpg") },
    { id: "3", imagem: require("../assets/images/AHipotese.jpg") },
  ];

  // ✅ TOTAL DINÂMICO
  const total = cartItems
    .filter((item) => item.selecionado)
    .reduce((acc, item) => acc + item.preco * item.quantidade, 0)
    .toFixed(2);

  // ✅ ALTERAR QUANTIDADE
  const alterarQuantidade = (id, tipo) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (tipo === "mais") {
            return { ...item, quantidade: item.quantidade + 1 };
          } else {
            return {
              ...item,
              quantidade: item.quantidade > 1 ? item.quantidade - 1 : 1,
            };
          }
        }
        return item;
      }),
    );
  };

  // ✅ CHECKBOX INDIVIDUAL
  const toggleItem = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selecionado: !item.selecionado } : item,
      ),
    );
  };

  // ✅ CHECKBOX GLOBAL
  const todosSelecionados = cartItems.every((item) => item.selecionado);

  const toggleSelecionarTodos = () => {
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        selecionado: !todosSelecionados,
      })),
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Carrinho</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* SUBTOTAL */}
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>Subtotal:</Text>
          <Text style={styles.subtotalValue}>R$ {total}</Text>
        </View>

        {/* LISTA DE PRODUTOS */}
        {cartItems.map((produto) => (
          <View key={produto.id} style={styles.card}>
            {/* CHECKBOX */}
            <TouchableOpacity onPress={() => toggleItem(produto.id)}>
              <Ionicons
                name={produto.selecionado ? "checkbox" : "square-outline"}
                size={22}
                color="#7FA6B6"
              />
            </TouchableOpacity>

            <Image source={produto.imagem} style={styles.bookImage} />

            <View style={styles.info}>
              <Text style={styles.bookTitle}>{produto.titulo}</Text>

              <View style={styles.row}>
                <View style={styles.quantityBox}>
                  <TouchableOpacity
                    onPress={() => alterarQuantidade(produto.id, "menos")}
                  >
                    <Text style={styles.qtyButton}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyText}>{produto.quantidade}</Text>

                  <TouchableOpacity
                    onPress={() => alterarQuantidade(produto.id, "mais")}
                  >
                    <Text style={styles.qtyButton}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.price}>
                  R$ {(produto.preco * produto.quantidade).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* DIVISOR */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>você também pode gostar</Text>
          <View style={styles.line} />
        </View>

        {/* RECOMENDADOS */}
        <FlatList
          data={recomendados}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image source={item.imagem} style={styles.recommendImage} />
          )}
          keyExtractor={(item) => item.id}
          style={{ marginVertical: 20 }}
        />
      </ScrollView>

      {/* FOOTER FIXO */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.selectAll}
          onPress={toggleSelecionarTodos}
        >
          <Ionicons
            name={todosSelecionados ? "checkbox" : "square-outline"}
            size={22}
            color="#7FA6B6"
          />
          <Text style={{ fontSize: 16 }}>Tudo</Text>
        </TouchableOpacity>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.total}>R$ {total}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("Checkout", {
                total: total, // ✅ agora sim
              })
            }
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    gap: 15,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  subtotalContainer: {
    flexDirection: "row",
    padding: 20,
  },

  subtotalText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5A7D8A",
  },

  subtotalValue: {
    fontSize: 22,
    marginLeft: 10,
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 16,
    padding: 15,
    gap: 20,
  },

  bookImage: {
    width: 90,
    height: 130,
    borderRadius: 10,
  },

  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },

  bookTitle: {
    fontSize: 14,
    fontWeight: "500",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7FA6B6",
    borderRadius: 8,
    paddingHorizontal: 10,
    gap: 10,
  },

  qtyButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7FA6B6",
  },

  qtyText: {
    fontSize: 16,
  },

  price: {
    fontSize: 16,
    fontWeight: "600",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: "#777",
  },

  recommendImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginLeft: 15,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  selectAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  button: {
    backgroundColor: "#7FA6B6",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
