import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutScreen({ navigation, route }) {
  const [pagamento, setPagamento] = useState(null);

  // 🔥 valor vindo do carrinho
  const total = route.params?.total || "0,00";

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
        <Text style={styles.headerTitle}>Resumo da compra</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* LOGO / MERCADO PAGO */}
        <View style={styles.paymentHeader}>
          <Image
            source={require("../../assets/images/LogoMercadoPago.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* CARD PRODUTOS */}
        <View style={styles.card}>
          <Text style={styles.label}>Produtos:</Text>
          <Text style={styles.value}>Itens selecionados no carrinho</Text>

          <Text style={[styles.label, { marginTop: 15 }]}>Frete:</Text>
          <Text style={[styles.value, { color: "green" }]}>Grátis</Text>
        </View>

        {/* CARD PAGAMENTO */}
        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Você pagará:</Text>
            <Text style={styles.total}>R$ {total}</Text>
          </View>

          <View style={styles.paymentBox}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => setPagamento("pix")}
            >
              <View style={styles.radio}>
                {pagamento === "pix" && <View style={styles.selected} />}
              </View>
              <Text style={styles.optionText}>Pix</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => setPagamento("boleto")}
            >
              <View style={styles.radio}>
                {pagamento === "boleto" && <View style={styles.selected} />}
              </View>
              <Text style={styles.optionText}>Boleto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => setPagamento("cartao")}
            >
              <View style={styles.radio}>
                {pagamento === "cartao" && <View style={styles.selected} />}
              </View>
              <Text style={styles.optionText}>Cartão de crédito</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View style={styles.footer}>
        <Text style={styles.footerTotal}>R$ {total}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!pagamento) {
              alert("Selecione um método de pagamento");
              return;
            }

            navigation.navigate("OrderConfirmation", {
              total: total,
              pagamento: pagamento,
            });
          }}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
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

  paymentHeader: {
    alignItems: "center",
    marginVertical: 20,
  },

  // 🔥 AQUI VOCÊ CONTROLA O TAMANHO DA LOGO
  logo: {
    width: 200, // aumenta/diminui aqui
    height: 80, // aumenta/diminui aqui
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
  },

  value: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  total: {
    fontSize: 16,
    fontWeight: "bold",
  },

  paymentBox: {
    marginTop: 10,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },

  optionText: {
    fontSize: 14,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#7FA6B6",
    alignItems: "center",
    justifyContent: "center",
  },

  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7FA6B6",
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

  footerTotal: {
    fontSize: 18,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#7FA6B6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
