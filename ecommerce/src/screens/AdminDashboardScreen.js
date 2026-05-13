import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { theme } from "../theme";
import AdminBottomNavBar from "../components/AdminBottomNavBar";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const HeaderImage = styled.View`
  height: 60px;
  background-color: ${theme.colors.primary};
  margin-bottom: 24px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const LogoText = styled.Text`
  color: ${theme.colors.white};
  font-size: 20px;
  font-weight: bold;
`;

const Greeting = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.secondary};
  margin-bottom: 24px;
`;

const SalesCard = styled.View`
  background-color: ${theme.colors.inputBg};
  border-radius: 16px;
  padding: 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const SalesTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.primary};
  width: 100px;
`;

const SalesCount = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.secondary};
  margin-bottom: 16px;
`;

const TableHeader = styled.View`
  flex-direction: row;
  background-color: ${theme.colors.primary};
  padding: 12px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const TableHeaderText = styled.Text`
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: bold;
  flex: 1;
  text-align: center;
`;

const TableRow = styled.View`
  flex-direction: row;
  background-color: ${theme.colors.inputBg};
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  align-items: center;
`;

const TableCell = styled.Text`
  color: ${theme.colors.text};
  font-size: 12px;
  flex: 1;
  text-align: center;
`;

const DetailsButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
`;

const DetailsButtonText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 12px;
  font-weight: bold;
`;

const MOCK_ORDERS = [
  { id: "01", data: "01/09/2024", status: "Concluído" },
  { id: "02", data: "01/09/2024", status: "Concluído" },
  { id: "03", data: "01/09/2024", status: "Concluído" },
  { id: "04", data: "01/09/2024", status: "Concluído" },
];

export default function AdminDashboardScreen({ navigation }) {
  return (
    <Screen>
      <Content>
        <HeaderImage>
          <LogoText>BookFlow</LogoText>
        </HeaderImage>

        <Greeting>Olá, admin!</Greeting>

        <SalesCard>
          <SalesTitle>Quantidade de Vendas</SalesTitle>
          <SalesCount>01</SalesCount>
        </SalesCard>

        <SectionTitle>Pedidos recentes</SectionTitle>

        <TableHeader>
          <TableHeaderText>Número</TableHeaderText>
          <TableHeaderText>Data</TableHeaderText>
          <TableHeaderText>Status</TableHeaderText>
          <TableHeaderText></TableHeaderText>
        </TableHeader>

        <FlatList
          data={MOCK_ORDERS}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <TableRow>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.data}</TableCell>
              <TableCell>{item.status}</TableCell>
              <DetailsButton onPress={() => navigation.navigate("OrderDetail", { order: item, isAdmin: true })}>
                <DetailsButtonText>Detalhes</DetailsButtonText>
              </DetailsButton>
            </TableRow>
          )}
          showsVerticalScrollIndicator={false}
        />
      </Content>
      <AdminBottomNavBar active="home" navigation={navigation} />
    </Screen>
  );
}