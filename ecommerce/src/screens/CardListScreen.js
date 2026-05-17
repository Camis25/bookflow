import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  margin-bottom: 200px;
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

  const loadCards = async () => {
    const raw = await AsyncStorage.getItem("@cards_usuario");
    const all = raw ? JSON.parse(raw) : {};

    setCards(all[usuarioId] || []);
  };

  useEffect(() => {
    loadCards();
  }, []);

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
              onSave: loadCards, // 🔥 atualização imediata
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

              <IconButton>
                <Ionicons name="trash-outline" size={22} color="#777" />
              </IconButton>
            </ActionsRow>
          </CardBox>
        ))}
      </Content>
    </Screen>
  );
}