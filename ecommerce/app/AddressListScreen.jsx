import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
//import { getEnderecosByUsuario } from '../services/database';

// ─── Styled Components ────────────────────────────────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const HeaderGroup = styled.View`
  background-color: ${theme.colors.secondary};
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
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.white};
`;

const ContentContainer = styled.View`
  flex: 1;
  padding-horizontal: 24px;
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-top: 40px;
  margin-bottom: 24px;
`;

const MainTitle = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${theme.colors.primary};
`;

const ActionRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const NovoBtn = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 16px;
  padding-vertical: 8px;
  padding-horizontal: 24px;
`;

const NovoBtnText = styled.Text`
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: bold;
`;

// Endereço Card
const AddressCard = styled.TouchableOpacity`
  background-color: #E2F0D9; /* Verde claro do mock */
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const AddressRow = styled.View`
  flex-direction: row;
  margin-bottom: 6px;
  flex-wrap: wrap;
`;

const Label = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-right: 4px;
`;

const Value = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
`;

const Loader = styled.ActivityIndicator`
  margin-top: 40px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  margin-top: 16px;
  font-weight: 600;
`;

// Mocks
const MOCK_ADDRESSES = [
  {
    id: 1,
    cep: '04567-209',
    rua: 'Cerejeiras',
    bairro: 'Jardim Cecília',
    numero: '9',
    complemento: 'B',
    referencia: 'Sem referência',
  }
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AddressListScreen({ route, navigation }) {
  const usuario_id = route.params?.usuario_id ?? 1;

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEnderecosByUsuario(usuario_id);
      setAddresses(data.length > 0 ? data : MOCK_ADDRESSES);
    } catch (_) {
      setAddresses(MOCK_ADDRESSES);
    } finally {
      setLoading(false);
    }
  }, [usuario_id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAddresses();
    });
    return unsubscribe;
  }, [navigation, loadAddresses]);

  const renderItem = ({ item }) => (
    <AddressCard onPress={() => navigation.navigate('AddressForm', { usuario_id, endereco: item })}>
      <AddressRow>
        <Label>CEP:</Label>
        <Value>{item.cep}</Value>
      </AddressRow>
      <AddressRow>
        <Label>Rua:</Label>
        <Value>{item.rua}</Value>
      </AddressRow>
      <AddressRow>
        <Label>Bairro:</Label>
        <Value>{item.bairro}</Value>
      </AddressRow>
      <AddressRow>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Label>Número:</Label>
          <Value>{item.numero}</Value>
        </View>
        <View style={{ flexDirection: 'row', flex: 1.5 }}>
          <Label>Complemento:</Label>
          <Value>{item.complemento}</Value>
        </View>
      </AddressRow>
      <AddressRow>
        <Label>Referência:</Label>
        <Value>{item.referencia || 'Sem referência'}</Value>
      </AddressRow>
    </AddressCard>
  );

  return (
    <Screen>
      <HeaderGroup>
        <BackBtn onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </BackBtn>
        <HeaderTitleText>Pedidos</HeaderTitleText>
      </HeaderGroup>

      <ContentContainer>
        <TitleContainer>
          <MainTitle>Meus Endereços</MainTitle>
        </TitleContainer>

        <ActionRow>
          <NovoBtn onPress={() => navigation.navigate('AddressForm', { usuario_id })}>
            <NovoBtnText>Novo</NovoBtnText>
          </NovoBtn>
        </ActionRow>

        {loading ? (
          <Loader size="large" color={theme.colors.primary} />
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={addresses.length === 0 ? { flex: 1 } : { paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyContainer>
                <Ionicons name="location-outline" size={64} color={theme.colors.inputBg} />
                <EmptyText>Nenhum endereço cadastrado.</EmptyText>
              </EmptyContainer>
            }
          />
        )}
      </ContentContainer>
    </Screen>
  );
}
