import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';
//import { getPedidoItens } from '../services/database';

// ─── Styled Components ────────────────────────────────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const HeaderGroup = styled.View`
  background-color: ${theme.colors.primary};
  height: 80px;
  justify-content: center;
  align-items: flex-start;
  padding-horizontal: 16px;
  padding-top: 20px;
`;

const HeaderTitleText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.white};
  margin-left: 16px;
`;

const Content = styled.ScrollView`
  padding: 24px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const MainTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: ${theme.colors.primary};
`;

const SaveBtn = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 8px 16px;
  border-radius: 12px;
`;

const SaveBtnText = styled.Text`
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: bold;
`;

// Grades de Informações
const InfoGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const InfoCol = styled.View`
  width: 50%;
  margin-bottom: 16px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 4px;
`;

const InfoValue = styled.Text`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`;

const StatusPill = styled.View`
  background-color: ${theme.colors.inputBg};
  align-self: flex-start;
  padding: 4px 16px;
  border-radius: 12px;
`;

// Endereço
const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: ${theme.colors.primary};
  margin-bottom: 16px;
`;

const AddressRow = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const AddressLabel = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-right: 4px;
`;

const AddressValue = styled.Text`
  font-size: 13px;
  color: ${theme.colors.text};
`;

// Produtos
const ProductHeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ProductHeaderLabel = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

const ProductItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const BookCoverFallback = styled.View`
  width: 50px;
  height: 70px;
  background-color: ${theme.colors.inputBg};
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
  elevation: 2;
  justify-content: center;
  align-items: center;
`;

const BookImage = styled.Image`
  width: 50px;
  height: 70px;
  border-radius: 4px;
`;

const ProductCenter = styled.View`
  flex: 1;
  align-items: center;
`;

const ProductRight = styled.View`
  width: 80px;
  align-items: flex-end;
`;

// Valor Final
const FinalTotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 40px;
`;

const FinalTotalLabel = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${theme.colors.primary};
`;

const FinalTotalValue = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.text};
`;


// Mocks
const MOCK_ITENS = [
  { id: 1, titulo: 'O Senhor dos Anéis', quantidade: 1, preco_unitario: 30.00, imagem_url: null },
  { id: 2, titulo: 'O Hobbit', quantidade: 1, preco_unitario: 30.00, imagem_url: null },
  { id: 3, titulo: 'A Hipótese', quantidade: 1, preco_unitario: 30.00, imagem_url: null },
];

export default function OrderDetailScreen({ route, navigation }) {
  const { order } = route.params || { order: { id: 1, status: 'Concluído', total: 90, criado_em: null } };

  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItens = useCallback(async () => {
    try {
      const data = await getPedidoItens(order.id);
      setItens(data.length > 0 ? data : MOCK_ITENS);
    } catch (_) {
      setItens(MOCK_ITENS);
    } finally {
      setLoading(false);
    }
  }, [order.id]);

  useEffect(() => { loadItens(); }, [loadItens]);

  const totalCalculado = itens.reduce((s, i) => s + i.quantidade * i.preco_unitario, 0);
  const finalTotal = order.total ?? totalCalculado;

  return (
    <Screen>
      <HeaderGroup>
        <HeaderTitleText onPress={() => navigation.goBack()}>Detalhes</HeaderTitleText>
      </HeaderGroup>

      <Content showsVerticalScrollIndicator={false}>
        <TopRow>
          <MainTitle>Pedido {String(order.id).padStart(2, '0')}</MainTitle>
          <SaveBtn>
            <SaveBtnText>Salvar</SaveBtnText>
          </SaveBtn>
        </TopRow>

        <InfoGrid>
          <InfoCol>
            <InfoLabel>Nome</InfoLabel>
            <InfoValue>Fulano dos Santos</InfoValue>
          </InfoCol>
          <InfoCol>
            <InfoLabel>CPF</InfoLabel>
            <InfoValue>000.000.000-00</InfoValue>
          </InfoCol>
          <InfoCol>
            <InfoLabel>Pagamento</InfoLabel>
            <InfoValue>Cartão de Crédito</InfoValue>
          </InfoCol>
          <InfoCol>
            <InfoLabel>Status</InfoLabel>
            <StatusPill>
              <View style={{ width: 40, height: 8 }} />{/* O design não tem texto de status claro na pill da foto, simula um shape vazio cinza claro, mas podemos deixar dinâmico: */}
            </StatusPill>
          </InfoCol>
        </InfoGrid>

        <SectionTitle>Endereço</SectionTitle>
        <View style={{ marginBottom: 32 }}>
          <AddressRow>
            <AddressLabel>CEP:</AddressLabel>
            <AddressValue>04567-209</AddressValue>
          </AddressRow>
          <AddressRow>
            <AddressLabel>Rua:</AddressLabel>
            <AddressValue>Cerejeiras</AddressValue>
          </AddressRow>
          <AddressRow>
            <AddressLabel>Bairro:</AddressLabel>
            <AddressValue>Jardim Cecília</AddressValue>
          </AddressRow>
          <AddressRow>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <AddressLabel>Número:</AddressLabel>
              <AddressValue>9</AddressValue>
            </View>
            <View style={{ flexDirection: 'row', flex: 1.5 }}>
              <AddressLabel>Complemento:</AddressLabel>
              <AddressValue>B</AddressValue>
            </View>
          </AddressRow>
          <AddressRow>
            <AddressLabel>Referência:</AddressLabel>
            <AddressValue>Sem referência</AddressValue>
          </AddressRow>
        </View>

        <SectionTitle>Pedido</SectionTitle>
        <ProductHeaderRow>
           <ProductHeaderLabel style={{flex: 1}}>Produtos</ProductHeaderLabel>
           <ProductHeaderLabel style={{flex: 1, textAlign: 'center'}}>Quantidade</ProductHeaderLabel>
           <ProductHeaderLabel style={{width: 80, textAlign: 'right'}}>Valor</ProductHeaderLabel>
        </ProductHeaderRow>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          itens.map((prod, index) => (
            <ProductItem key={String(prod.id) + index}>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                {prod.imagem_url ? (
                  <BookImage source={{ uri: prod.imagem_url }} />
                ) : (
                  <BookCoverFallback />
                )}
              </View>
              
              <ProductCenter>
                <AddressValue>{prod.quantidade}</AddressValue>
              </ProductCenter>
              
              <ProductRight>
                <AddressValue style={{fontSize: 12}}>
                  <AddressLabel style={{fontSize: 10, color: theme.colors.text}}>R$</AddressLabel> {(prod.quantidade * prod.preco_unitario).toFixed(2).replace('.', ',')}
                </AddressValue>
              </ProductRight>
            </ProductItem>
          ))
        )}

        <FinalTotalRow>
          <FinalTotalLabel>Valor</FinalTotalLabel>
          <FinalTotalValue>R$ {finalTotal.toFixed(2).replace('.', ',')}</FinalTotalValue>
        </FinalTotalRow>

      </Content>
    </Screen>
  );
}
