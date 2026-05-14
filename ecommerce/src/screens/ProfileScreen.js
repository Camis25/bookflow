import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  height: 250px;
  background-color: #b7dea4;
  align-items: center;
  justify-content: center;
`;

const AvatarContainer = styled.View`
width: 76px;
  height: 76px;
  border-radius: 38px;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const UserName = styled.Text`
  color: #ffffff;
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
  color: #4f789f;
`;
// Mock do usuário autenticado (Você pode testar isAdmin = true / false)
const MOCK_USER = {
  id: 1,
  nome: "Fulano dos Santos",
  email: "fulano@snatos.com",
  isAdmin: false,
};

export default function ProfileScreen({ navigation }) {
  const user = MOCK_USER;

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
          <Ionicons name="person-outline" size={58} color="#b7dea4" />
        </AvatarContainer>

        <UserName>{user.nome}</UserName>
        <UserEmail>{user.email}</UserEmail>
      </Header>

       <MenuContainer showsVerticalScrollIndicator={false}>
        <MenuItem onPress={() => navigation.navigate("EditProfile", { usuario: user })}>
          <IconBox>
            <Ionicons name="person-outline" size={25} color="#4f789f" />
          </IconBox>
          <MenuText>Editar dados pessoais</MenuText>
        </MenuItem>

       <MenuItem onPress={() => navigation.navigate("MyOrders", { usuario_id: user.id })}>
          <IconBox>
            <Ionicons name="book-outline" size={25} color="#4f789f" />
          </IconBox>
          <MenuText>Pedidos</MenuText>
        </MenuItem>

        <MenuItem onPress={() => navigation.navigate("CardList")}>
          <IconBox>
            <Ionicons name="card-outline" size={25} color="#4f789f" />
          </IconBox>
          <MenuText>Cartões</MenuText>
        </MenuItem>

        <MenuItem onPress={() => navigation.navigate("AddressList", { usuario_id: user.id })}>
          <IconBox>
            <Ionicons name="map-outline" size={25} color="#4f789f" />
          </IconBox>
          <MenuText>Endereços</MenuText>
        </MenuItem>

        <MenuItem onPress={handleLogout}>
        <IconBox>
            <Ionicons name="exit-outline" size={25} color="#4f789f" />
          </IconBox>
          <MenuText>Sair</MenuText>
        </MenuItem>
      
</MenuContainer>
      <BottomNavBar active="profile" navigation={navigation} />
    </Screen>
  );
}
