import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNavBar from "../components/BottomNavBar";

import {
  getCarrinhoByUsuario,
  updateQuantidadeCarrinho,
  removeItemCarrinho,
} from "../services/database";

export default function CartScreen({ navigation, route }) {
  // ⚠️ depois pegar do usuário logado
  const usuarioId = 1;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────────
  // 📦 CARREGAR CARRINHO
  // ─────────────────────────────────────────────
  const loadCarrinho = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getCarrinhoByUsuario(usuarioId);

      setCartItems(
        data.map((item) => ({
          ...item,
          selecionado: true,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCarrinho();
  }, [loadCarrinho]);

  // ─────────────────────────────────────────────
  // ➕➖ QUANTIDADE
  // ─────────────────────────────────────────────
  const alterarQuantidade = async (idItemCarrinho, tipo) => {
    try {
      const item = cartItems.find(
        (i) => i.id_item_carrinho === idItemCarrinho
      );

      if (!item) return;

      let novaQuantidade =
        tipo === "mais"
          ? item.quantidade + 1
          : item.quantidade - 1;

      if (novaQuantidade < 1) {
        await removeItemCarrinho(idItemCarrinho);
      } else {
        await updateQuantidadeCarrinho(
          idItemCarrinho,
          novaQuantidade
        );
      }

      loadCarrinho();
    } catch (error) {
      console.error(error);
    }
  };

  // ─────────────────────────────────────────────
  // ☑️ CHECKBOX ITEM
  // ─────────────────────────────────────────────
  const toggleItem = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id_item_carrinho === id
          ? {
              ...item,
              selecionado: !item.selecionado,
            }
          : item
      )
    );
  };

  // ─────────────────────────────────────────────
  // ☑️ CHECKBOX GLOBAL
  // ─────────────────────────────────────────────
  const todosSelecionados = cartItems.every(
    (item) => item.selecionado
  );

  const toggleSelecionarTodos = () => {
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        selecionado: !todosSelecionados,
      }))
    );
  };

  // ─────────────────────────────────────────────
  // 💰 TOTAL
  // ─────────────────────────────────────────────
  const total = cartItems
    .filter((item) => item.selecionado)
    .reduce(
      (acc, item) =>
        acc + item.preco_unitario * item.quantidade,
      0
    )
    .toFixed(2);

  // ─────────────────────────────────────────────
  // 🧾 ITENS SELECIONADOS
  // ─────────────────────────────────────────────
  const itensSelecionados = cartItems.filter(
    (item) => item.selecionado
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right", "bottom"]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />

        <Text style={styles.headerTitle}>
          Carrinho
        </Text>
      </View>

      {/* LOADING */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#7FA6B6"
          style={{ marginTop: 40 }}
        />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 140,
            }}
          >
            {/* SUBTOTAL */}
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>
                Subtotal:
              </Text>

              <Text style={styles.subtotalValue}>
                R$ {total}
              </Text>
            </View>

            {/* CARRINHO VAZIO */}
            {cartItems.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="cart-outline"
                  size={90}
                  color="#ccc"
                />

                <Text style={styles.emptyText}>
                  Seu carrinho está vazio
                </Text>
              </View>
            )}

            {/* LISTA */}
            {cartItems.map((produto) => (
              <View
                key={produto.id_item_carrinho}
                style={styles.card}
              >
                {/* CHECK */}
                <TouchableOpacity
                  onPress={() =>
                    toggleItem(
                      produto.id_item_carrinho
                    )
                  }
                >
                  <Ionicons
                    name={
                      produto.selecionado
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={24}
                    color="#7FA6B6"
                  />
                </TouchableOpacity>

                {/* CAPA */}
                <Image
                  source={{
                    uri: produto.capa_livro,
                  }}
                  style={styles.bookImage}
                />

                {/* INFO */}
                <View style={styles.info}>
                  <Text style={styles.bookTitle}>
                    {produto.titulo_livro}
                  </Text>

                  <Text style={styles.autor}>
                    {produto.autor_livro}
                  </Text>

                  <View style={styles.row}>
                    {/* QUANTIDADE */}
                    <View style={styles.quantityBox}>
                      <TouchableOpacity
                        onPress={() =>
                          alterarQuantidade(
                            produto.id_item_carrinho,
                            "menos"
                          )
                        }
                      >
                        <Text style={styles.qtyButton}>
                          -
                        </Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyText}>
                        {produto.quantidade}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          alterarQuantidade(
                            produto.id_item_carrinho,
                            "mais"
                          )
                        }
                      >
                        <Text style={styles.qtyButton}>
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* PREÇO */}
                    <Text style={styles.price}>
                      R${" "}
                      {(
                        produto.preco_unitario *
                        produto.quantidade
                      ).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* FOOTER */}
          {cartItems.length > 0 && (
            <View style={styles.footer}>
              {/* SELECIONAR TODOS */}
              <TouchableOpacity
                style={styles.selectAll}
                onPress={toggleSelecionarTodos}
              >
                <Ionicons
                  name={
                    todosSelecionados
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={22}
                  color="#7FA6B6"
                />

                <Text style={{ fontSize: 16 }}>
                  Tudo
                </Text>
              </TouchableOpacity>

              {/* TOTAL */}
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.total}>
                  R$ {total}
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate(
                      "CheckoutScreen",
                      {
                        itens: itensSelecionados,
                        total,
                      }
                    )
                  }
                >
                  <Text style={styles.buttonText}>
                    Continuar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}

      <BottomNavBar
        navigation={navigation}
      />
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
    backgroundColor: "#ddd",
  },

  info: {
    flex: 1,
    justifyContent: "space-between",
  },

  bookTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  autor: {
    color: "#666",
    marginTop: 4,
    marginBottom: 10,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#7FA6B6",
  },

  qtyText: {
    fontSize: 16,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    position: "absolute",
    bottom: 70,
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#7FA6B6",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#999",
  },
});