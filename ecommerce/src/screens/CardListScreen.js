import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  height: 52px;
  background-color: #b7dea4;
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
  color: #4f789f;
  font-size: 18px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 34px;
`;

const NewButton = styled.TouchableOpacity`
  align-self: flex-end;
  background-color: #4f789f;
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
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  elevation: 4;
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

const CARDS = [
  {
    id: 1,
    title: "Meu Cartão",
    brand: "Mastercard com final 0000",
  },
];

export default function CardListScreen({ navigation }) {
  return (
    <Screen>
      <Header>
        <HeaderTitle>Cartões</HeaderTitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <PageTitle>Meus Cartões</PageTitle>

        <NewButton onPress={() => navigation.navigate("CardForm")}>
          <NewButtonText>Novo</NewButtonText>
        </NewButton>

        {CARDS.map((card) => (
          <CardBox key={card.id}>
            <CardTitle>{card.title}</CardTitle>

            <CardInfoRow>
              <Ionicons name="card-outline" size={22} color="#777777" />
              <CardText>{card.brand}</CardText>
            </CardInfoRow>

            <ActionsRow>
              <IconButton onPress={() => navigation.navigate("CardForm", { card })}>
                <Ionicons name="create-outline" size={22} color="#777777" />
              </IconButton>

              <IconButton>
                <Ionicons name="trash-outline" size={22} color="#777777" />
              </IconButton>
            </ActionsRow>
          </CardBox>
        ))}
      </Content>
    </Screen>
  );
}