import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import AdminBottomNavBar from '../components/AdminBottomNavBar';

// ─── Styled Components ────────────────────────────────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
`;

const HeaderGroup = styled.View`
  background-color: ${theme.colors.primary};
  height: 80px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 16px;
  padding-top: 20px;
`;

const BackBtn = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 16px;
`;

const HeaderTitleText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.white};
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-top: 40px;
  margin-bottom: 32px;
`;

const MainTitle = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${theme.colors.primary};
`;

// Tabela
const TableContainer = styled.View`
  padding-horizontal: 20px;
  flex: 1;
`;

const TableHeader = styled.View`
  background-color: ${theme.colors.primary};
  flex-direction: row;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
`;

const ThData = styled.Text`
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 600;
  flex: ${props => props.flex || 1};
  text-align: ${props => props.align || 'left'};
`;

const TableRow = styled.View`
  background-color: ${theme.colors.inputBg};
  flex-direction: row;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  align-items: center;
`;

const TdData = styled.Text`
  color: ${theme.colors.primary};
  font-size: 12px;
  flex: ${props => props.flex || 1};
  text-align: ${props => props.align || 'left'};
`;

const DetailsBtnText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 12px;
  font-weight: 800;
`;

const DetailsButton = styled.TouchableOpacity`
  flex: 1;
  align-items: flex-end;
`;

const Loader = styled.ActivityIndicator`
  margin-top: 40px;
`;

// Mock
const MOCK_ORDERS = [
  { id: 1, criado_em: '2024-09-01T00:00:00', status: 'Concluído' },
  { id: 2, criado_em: '2024-09-01T00:00:00', status: 'Em Processamento' },
  { id: 3, criado_em: '2024-09-01T00:00:00', status: 'Enviado' },
  { id: 4, criado_em: '2024-08-01T00:00:00', status: 'Concluído' },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AdminOrderListScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const renderItem = ({ item }) => (
    <TableRow>
      <TdData flex={0.5}>{String(item.id).padStart(2, '0')}</TdData>
      <TdData flex={1.2}>{formatDate(item.criado_em)}</TdData>
      <TdData flex={1}>{item.status}</TdData>
      <DetailsButton onPress={() => navigation.navigate('OrderDetail', { order: item, isAdmin: true })}>
        <DetailsBtnText>Detalhes</DetailsBtnText>
      </DetailsButton>
    </TableRow>
  );

  return (
    <Screen>
      <Content>
        <HeaderGroup>
          <BackBtn onPress={() => navigation.goBack()}>
             <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
          </BackBtn>
          <HeaderTitleText>Administrador</HeaderTitleText>
        </HeaderGroup>

        <TitleContainer>
          <MainTitle>Vendas</MainTitle>
        </TitleContainer>

        {loading ? (
          <Loader size="large" color={theme.colors.primary} />
        ) : (
          <TableContainer>
            <TableHeader>
              <ThData flex={0.5}>Número</ThData>
              <ThData flex={1.2}>Data</ThData>
              <ThData flex={1}>Status</ThData>
              <ThData flex={1} align="right"></ThData>
            </TableHeader>

            <FlatList
              data={orders}
              keyExtractor={(item, index) => String(item.id) + index}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </TableContainer>
        )}
      </Content>
      <AdminBottomNavBar active="home" navigation={navigation} />
    </Screen>
  );
}
