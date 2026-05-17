import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteCard } from "./cardsStorage";
import { Modal, View, Text, TouchableOpacity } from "react-native";

// ─────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  height: 52px;
  background-color: ${theme.colors.primary};
  justify-content: center;
  padding-left: 24px;
`;

const HeaderTitle = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 56px 28px 20px 28px;
`;

const PageTitle = styled.Text`
  color: ${theme.colors.primary};
  font-size: 18px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 40px;
`;

const NewButton = styled.TouchableOpacity`
  align-self: flex-end;
  background-color: ${theme.colors.primary};
  padding: 8px 26px;
  border-radius: 18px;
  margin-bottom: 18px;
`;

const NewButtonText = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
`;

const CardBox = styled.View`
  background-color: #f4f4f4;
  border-radius: 16px;
  padding: 22px;
  width: 260px;
  min-height: 140px;
  align-self: center;
  elevation: 4;
  margin-bottom: 24px;
`;

const CardTitle = styled.Text`
  color: #666666;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 26px;
`;

const CardInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CardText = styled.Text`
  color: #666666;
  font-size: 13px;
  margin-left: 8px;
`;

const ActionsRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 18px;
`;

const IconButton = styled.TouchableOpacity`
  margin-left: 18px;
`;

// ─────────────────────────────

export default function CardListScreen({ navigation }) {
  const usuarioId = 1;

  const [cards, setCards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  // carregar cartões
  const loadCards = async () => {
    const raw = await AsyncStorage.getItem("@cards_usuario");
    const all = raw ? JSON.parse(raw) : {};
    setCards(all[usuarioId] || []);
  };

  useEffect(() => {
    loadCards();
  }, []);

  // abrir modal
  const confirmDelete = (id) => {
    setSelectedCardId(id);
    setModalVisible(true);
  };

  // deletar
  const handleDelete = async () => {
    await deleteCard(usuarioId, selectedCardId);
    setModalVisible(false);
    setSelectedCardId(null);
    loadCards();
  };

  return (
    <Screen>
      <Header>
        <HeaderTitle>Cartões</HeaderTitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <PageTitle>Meus Cartões</PageTitle>

        <NewButton
          onPress={() =>
            navigation.navigate("CardForm", {
              onSave: loadCards,
            })
          }
        >
          <NewButtonText>Novo</NewButtonText>
        </NewButton>

        {cards.map((card) => (
          <CardBox key={card.id}>
            <CardTitle>{card.name}</CardTitle>

            <CardInfoRow>
              <Ionicons name="card-outline" size={22} color="#777" />
              <CardText>
                {card.brand === "visa"
                  ? "VISA"
                  : card.brand === "master"
                  ? "MASTERCARD"
                  : "ELO"}
              </CardText>
            </CardInfoRow>

            <ActionsRow>
              <IconButton
                onPress={() =>
                  navigation.navigate("CardForm", {
                    card,
                    onSave: loadCards,
                  })
                }
              >
                <Ionicons name="create-outline" size={22} color="#777" />
              </IconButton>

              <IconButton onPress={() => confirmDelete(card.id)}>
                <Ionicons name="trash-outline" size={22} color="#777" />
              </IconButton>
            </ActionsRow>
          </CardBox>
        ))}
      </Content>

      {/* ───── MODAL ───── */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 12,
              width: 280,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 20 }}>
              Tem certeza que deseja excluir este cartão?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  padding: 10,
                  backgroundColor: "#ccc",
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 10,
                  alignItems: "center",
                }}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={{
                  padding: 10,
                  backgroundColor: "red",
                  borderRadius: 8,
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff" }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}