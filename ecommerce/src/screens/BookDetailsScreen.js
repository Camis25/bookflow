import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";
import { theme } from "../theme";

export default function BookDetailsScreen({
  navigation,
  route,
}) {
  const [modalVisible, setModalVisible] =
    React.useState(false);

  // 📚 Livro recebido da navegação
  const livro = route.params?.livro;

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
          <Image
            source={
              livro?.imagem_url
                ? { uri: livro.imagem_url }
                : require("../../assets/images/AHipotese.jpg")
            }
            style={styles.image}
          />
        </View>

        {/* CARD */}
        <View style={styles.card}>
          {/* TÍTULO */}
          <Text style={styles.title}>
            {livro?.titulo}
          </Text>

          {/* AVALIAÇÃO */}
          <TouchableOpacity
            onPress={() =>
              setModalVisible(true)
            }
          >
            <Text style={styles.rating}>
              ★★★★★{" "}
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.primary,
                }}
              >
                (Ver avaliações)
              </Text>
            </Text>
          </TouchableOpacity>

          {/* PREÇO + ÍCONES */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              R${" "}
              {Number(
                livro?.preco || 0
              ).toFixed(2)}
            </Text>

            <View style={styles.icons}>
              <Ionicons
                name="bag-outline"
                size={22}
              />

              <Ionicons
                name="heart-outline"
                size={22}
              />
            </View>
          </View>

          {/* ENTREGA */}
          <Text style={styles.delivery}>
            Entrega GRÁTIS:
            sexta-feira, 6 de março
          </Text>

          {/* DESCRIÇÃO */}
          <Text style={styles.description}>
            {livro?.descricao ||
              "Descrição não disponível."}
          </Text>

          {/* BOTÃO CARRINHO */}
          <TouchableOpacity
            style={[
              styles.outlineButton,
              {
                borderColor:
                  theme.colors.primary,
              },
            ]}
            onPress={() =>
              navigation.navigate("Cart", {
                livro,
              })
            }
          >
            <Text
              style={[
                styles.outlineText,
                {
                  color:
                    theme.colors.primary,
                },
              ]}
            >
              Adicionar ao carrinho
            </Text>
          </TouchableOpacity>

          {/* BOTÃO COMPRAR */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor:
                  theme.colors.primary,
              },
            ]}
            onPress={() =>
              navigation.navigate("Cart", {
                livro,
              })
            }
          >
            <Text style={styles.primaryText}>
              Comprar agora
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL AVALIAÇÕES */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Avaliações
            </Text>

            <ScrollView
              style={{ maxHeight: 300 }}
            >
              <Text
                style={{
                  marginBottom: 10,
                  fontStyle: "italic",
                }}
              >
                "Livro excelente!
                Recomendo a todos." -
                João
              </Text>

              <Text
                style={{
                  marginBottom: 10,
                  fontStyle: "italic",
                }}
              >
                "Muito envolvente desde
                a primeira página." -
                Maria
              </Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() =>
                setModalVisible(false)
              }
              style={[
                styles.primaryButton,
                {
                  backgroundColor:
                    theme.colors.primary,
                },
              ]}
            >
              <Text
                style={styles.primaryText}
              >
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* NAVBAR */}
      <BottomNavBar
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
    backgroundColor:
      theme.colors.primary,
    height: 140,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  imageWrapper: {
    alignItems: "center",
    marginTop: -60,
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
    justifyContent:
      "space-between",
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
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
  },

  outlineText: {
    fontWeight: "600",
  },

  primaryButton: {
    marginTop: 10,
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
});