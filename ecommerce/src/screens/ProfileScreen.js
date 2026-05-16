import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";
import { theme } from "../theme";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  height: 250px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const AvatarContainer = styled.View`
  width: 76px;
  height: 76px;
  border-radius: 38px;
  background-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const UserName = styled.Text`
  color: ${theme.colors.white};
  font-size: 15px;
  font-weight: 800;
`;

const UserEmail = styled.Text`
  color: #ffffff;
  font-size: 14px;
  margin-top: 4px;
  text-decoration-line: underline;
`;

const MenuContainer = styled.ScrollView`
  flex: 1;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 20px 24px;
`;

const IconBox = styled.View`
  width: 28px;
  align-items: center;
  margin-right: 12px;
`;

const MenuText = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: ${theme.colors.primary};
`;

const MOCK_USER = {
  id: 1,
  nome: "Fulano dos Santos",
  email: "fulano@snatos.com",
  isAdmin: false,
};

export default function ProfileScreen({ route, navigation }) {
  const isRouteAdmin = route?.params?.isAdmin || false;
  
  const user = {
    ...MOCK_USER,
    isAdmin: isRouteAdmin
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <Screen>
      <Header>
        <AvatarContainer>
          <Ionicons name="person-outline" size={58} color={theme.colors.primary} />
        </AvatarContainer>

        <UserName>{user.nome}</UserName>
        <UserEmail>{user.email}</UserEmail>
      </Header>

      <MenuContainer showsVerticalScrollIndicator={false}>
        <MenuItem onPress={() => navigation.navigate("EditProfile", { usuario: user })}>
          <IconBox>
            <Ionicons name="person-outline" size={25} color={theme.colors.primary} />
          </IconBox>
          <MenuText>Editar dados pessoais</MenuText>
        </MenuItem>

        {user.isAdmin ? (
          <>
            <MenuItem onPress={() => navigation.navigate("AdminOrderList")}>
              <IconBox>
                <Ionicons name="book-outline" size={25} color={theme.colors.primary} />
              </IconBox>
              <MenuText>Pedidos</MenuText>
            </MenuItem>

            <MenuItem onPress={() => navigation.navigate("AdminProductList")}>
              <IconBox>
                <Ionicons name="document-text-outline" size={25} color={theme.colors.primary} />
              </IconBox>
              <MenuText>Produtos</MenuText>
            </MenuItem>

            <MenuItem onPress={() => navigation.navigate("AdminCategoryList")}>
              <IconBox>
                <Ionicons name="pricetags-outline" size={25} color={theme.colors.primary} />
              </IconBox>
              <MenuText>Categorias</MenuText>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onPress={() => navigation.navigate("MyOrders", { usuario_id: user.id })}>
              <IconBox>
                <Ionicons name="book-outline" size={25} color={theme.colors.primary} />
              </IconBox>
              <MenuText>Pedidos</MenuText>
            </MenuItem>

            <MenuItem onPress={() => navigation.navigate("CardList")}>
              <IconBox>
                <Ionicons name="card-outline" size={25} color={theme.colors.primary} />
              </IconBox>
              <MenuText>Cartões</MenuText>
            </MenuItem>

            <MenuItem onPress={() => navigation.navigate("AddressList", { usuario_id: user.id })}>
              <IconBox>
                <Ionicons name="map-outline" size={25} color={theme.colors.primary} />
              </IconBox>
              <MenuText>Endereços</MenuText>
            </MenuItem>
          </>
        )}

        <MenuItem onPress={handleLogout}>
          <IconBox>
            <Ionicons name="exit-outline" size={25} color={theme.colors.primary} />
          </IconBox>
          <MenuText>Sair</MenuText>
        </MenuItem>
      </MenuContainer>

      <BottomNavBar active="profile" navigation={navigation} />
    </Screen>
  );
}