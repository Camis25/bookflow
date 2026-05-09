import React from 'react';
import { Alert, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import BottomNavBar from '../components/BottomNavBar';

// ─── Styled Components ────────────────────────────────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Header = styled.View`
  background-color: ${props => props.isAdmin ? theme.colors.primary : theme.colors.secondary};
  padding: 40px 20px 32px 20px;
  align-items: center;
`;

const AvatarContainer = styled.View`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  background-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const UserName = styled.Text`
  color: ${theme.colors.white};
  font-size: 16px;
  font-weight: 800;
`;

const UserEmail = styled.Text`
  color: ${theme.colors.white};
  font-size: 14px;
  margin-top: 4px;
`;

const MenuList = styled.ScrollView`
  flex: 1;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const MenuText = styled.Text`
  flex: 1;
  margin-left: 16px;
  font-size: 14px;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

// ─── Screen ───────────────────────────────────────────────────────────────────

// Mock do usuário autenticado (Você pode testar isAdmin = true / false)
const MOCK_USER = { id: 1, nome: 'Fulano dos Santos', email: 'fulano@santos.com', isAdmin: true };

export default function ProfileScreen({ navigation }) {
  const user = MOCK_USER;

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => navigation.replace('StoreHome') },
    ]);
  };

  return (
    <Screen>
      <Header isAdmin={user.isAdmin}>
        <AvatarContainer>
          <Ionicons name="person-outline" size={48} color={user.isAdmin ? theme.colors.primary : theme.colors.secondary} />
        </AvatarContainer>
        <UserName>{user.nome}</UserName>
        <UserEmail>{user.email}</UserEmail>
      </Header>

      <MenuList showsVerticalScrollIndicator={false}>
        <MenuItem onPress={() => navigation.navigate('EditProfile', { usuario: user })}>
          <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
          <MenuText>Editar dados pessoais</MenuText>
        </MenuItem>

        <MenuItem onPress={() => navigation.navigate('MyOrders', { usuario_id: user.id })}>
          <Ionicons name="receipt-outline" size={24} color={theme.colors.primary} />
          <MenuText>Pedidos</MenuText>
        </MenuItem>

        {user.isAdmin ? (
          <>
            <MenuItem onPress={() => navigation.navigate('AdminProductList')}>
              <Ionicons name="cube-outline" size={24} color={theme.colors.primary} />
              <MenuText>Produtos</MenuText>
            </MenuItem>

            <MenuItem onPress={() => navigation.navigate('AdminCategoryList')}>
              <Ionicons name="list-outline" size={24} color={theme.colors.primary} />
              <MenuText>Categorias</MenuText>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onPress={() => Alert.alert('Aviso', 'Cartões não implementado.')}>
              <Ionicons name="card-outline" size={24} color={theme.colors.primary} />
              <MenuText>Cartões</MenuText>
            </MenuItem>

            <MenuItem onPress={() => navigation.navigate('AddressList', { usuario_id: user.id })}>
              <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
              <MenuText>Endereços</MenuText>
            </MenuItem>
          </>
        )}

        <MenuItem onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={theme.colors.primary} />
          <MenuText>Sair</MenuText>
        </MenuItem>
      </MenuList>

      <BottomNavBar active="profile" navigation={navigation} />
    </Screen>
  );
}
