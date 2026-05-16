import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { getPedidoItens } from "../services/database";
import { theme } from "../theme";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  height: 65px;
  background-color: ${theme.colors.primary};
  justify-content: center;
  padding-left: 52px;
`;

const HeaderTitle = styled.Text`
  color: #ffffff;
  font-size: 22px;
  font-weight: bold;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 32px 22px 0 22px;
`;

const Title = styled.Text`
  color: ${theme.colors.primary};
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 34px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 44px;
`;

const InfoItem = styled.View`
  align-items: center;
`;

const InfoLabel = styled.Text`
  color: ${theme.colors.primary};
  font-size: 16px;
  font-weight: bold;
`;

const InfoValue = styled.Text`
  color: #111111;
  font-size: 14px;
  margin-top: 4px;
`;

const ProductBox = styled.View`
  background-color: #f8f8f8;
  border-radius: 18px;
  padding: 20px 12px 10px 12px;
  margin-bottom: 18px;
`;

const TableHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const HeaderProduct = styled.Text`
  flex: 1.2;
  color: ${theme.colors.primary};
  font-size: 15px;
  font-weight: bold;
`;

const HeaderQuantity = styled.Text`
  flex: 1;
  color: ${theme.colors.primary};
  font-size: 15px;
  font-weight: bold;
  text-align: center;
`;

const HeaderValue = styled.Text`
  flex: 1.3;
  color: ${theme.colors.primary};
  font-size: 15px;
  font-weight: bold;
  text-align: center;
`;

const ProductRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 18px;
`;

const ProductLeft = styled.View`
  flex: 1.2;
  align-items: flex-start;
`;

const ProductImage = styled.Image`
  width: 46px;
  height: 60px;
  border-radius: 5px;
`;

const ProductQuantity = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 15px;
  color: #111111;
`;

const ProductRight = styled.View`
  flex: 1.3;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ProductPrice = styled.Text`
  color: #111111;
  font-size: 14px;
`;

const ReviewButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const ReviewText = styled.Text`
  color: #000000;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
`;

const SummaryBox = styled.View`
  border-width: 3px;
  border-color: #777777;
  border-radius: 26px;
  padding: 12px 14px 14px 14px;
  margin-bottom: 122px;
`;

const SummaryTitle = styled.Text`
  text-align: center;
  color: #777777;
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 12px;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const SummaryLabel = styled.Text`
  color: #666666;
  font-size: 15px;
  font-weight: bold;
`;

const SummaryValue = styled.Text`
  color: #666666;
  font-size: 15px;
  font-weight: bold;
`;

const BottomTotal = styled.View`
  height: 90px;
  background-color: #d9d9d9;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 30px;
`;

const BottomLabel = styled.Text`
  color: ${theme.colors.primary};
  font-size: 28px;
  font-weight: 800;
`;

const BottomValue = styled.Text`
  color: #222222;
  font-size: 28px;
  font-weight: 500;
`;

const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.View`
  width: 80%;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 20px;
  text-align: center;
`;

const StatusOption = styled.TouchableOpacity`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const StatusText = styled.Text`
  font-size: 16px;
  text-align: center;
  color: ${props => props.active ? theme.colors.primary : '#333'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const MOCK_ITENS = [
  {
    id: 1,
    titulo: "A Hipótese do Amor",
    quantidade: 1,
    preco_unitario: 30,
    imagem_url: "https://m.media-amazon.com/images/I/81LTEfXYgcL._SY522_.jpg",
  },
  {
    id: 2,
    titulo: "A Biblioteca da Meia-Noite",
    quantidade: 1,
    preco_unitario: 30,
    imagem_url: "https://m.media-amazon.com/images/I/81iqH8dpjuL._SY522_.jpg",
  },
  {
    id: 3,
    titulo: "É Assim que Acaba",
    quantidade: 1,
    preco_unitario: 30,
    imagem_url: "https://m.media-amazon.com/images/I/81s0B6NYXML._SY522_.jpg",
  },
];

export default function OrderDetailScreen({ route, navigation }) {
  const { order, isAdmin } =
    route.params || {
      order: {
        id: 1,
        status: "Concluído",
        total: 97,
        criado_em: "01/09/2024",
      },
      isAdmin: false
    };

  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(order.status || "Concluído");
  const [modalVisible, setModalVisible] = useState(false);
  const statusList = ["Pendente", "Em Processamento", "Enviado", "Concluído"];

  const loadItens = useCallback(async () => {
    try {
      const data = await getPedidoItens(order.id);
      setItens(data && data.length > 0 ? data : MOCK_ITENS);
    } catch (error) {
      setItens(MOCK_ITENS);
    } finally {
      setLoading(false);
    }
  }, [order.id]);

  useEffect(() => {
    loadItens();
  }, [loadItens]);

  const subtotal = 24;
  const frete = 7;
  const descontos = 0;
  const totalResumo = subtotal + frete - descontos;
  const totalFinal = order.total ?? 97;

  const formatMoney = (value) => {
    return `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`;
  };

  return (
    <Screen>
      <Header>
        <HeaderTitle onPress={() => navigation.goBack()}>
          Pedidos
        </HeaderTitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <Title>Pedido {String(order.id).padStart(2, "0")}</Title>

        <InfoRow>
          <InfoItem>
            <InfoLabel>Data</InfoLabel>
            <InfoValue>01/09/2024</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Pagamento</InfoLabel>
            <InfoValue>PIX</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Status</InfoLabel>
            {isAdmin ? (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <InfoValue style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}>{status}</InfoValue>
              </TouchableOpacity>
            ) : (
              <InfoValue>{status}</InfoValue>
            )}
          </InfoItem>
        </InfoRow>

        <ProductBox>
          <TableHeader>
            <HeaderProduct>Produtos</HeaderProduct>
            <HeaderQuantity>Quantidade</HeaderQuantity>
            <HeaderValue>Valor</HeaderValue>
          </TableHeader>

          {loading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            itens.map((item, index) => (
              <ProductRow key={`${item.id}-${index}`}>
                <ProductLeft>
                  <ProductImage
                    source={{
                      uri:
                        item.imagem_url ||
                        MOCK_ITENS[index]?.imagem_url ||
                        "https://m.media-amazon.com/images/I/81LTEfXYgcL._SY522_.jpg",
                    }}
                  />
                </ProductLeft>

                <ProductQuantity>
                  {item.quantidade || 1}
                </ProductQuantity>

                <ProductRight>
                  <ProductPrice>
                    {formatMoney(
                      Number(item.quantidade || 1) *
                        Number(item.preco_unitario || 30)
                    )}
                  </ProductPrice>

                  <ReviewButton
                    onPress={() => navigation.navigate("Review", { product: item })}
                  >
                    <ReviewText>
                      fazer{"\n"}avaliação
                    </ReviewText>
                  </ReviewButton>
                </ProductRight>
              </ProductRow>
            ))
          )}
        </ProductBox>

        <SummaryBox>
          <SummaryTitle>Resumo do Pedido</SummaryTitle>

          <SummaryRow>
            <SummaryLabel>Subtotal:</SummaryLabel>
            <SummaryValue>{formatMoney(subtotal)}</SummaryValue>
          </SummaryRow>

          <SummaryRow>
            <SummaryLabel>Frete:</SummaryLabel>
            <SummaryValue>{formatMoney(frete)}</SummaryValue>
          </SummaryRow>

          <SummaryRow>
            <SummaryLabel>Descontos:</SummaryLabel>
            <SummaryValue>{formatMoney(descontos)}</SummaryValue>
          </SummaryRow>

          <SummaryRow>
            <SummaryLabel>Total:</SummaryLabel>
            <SummaryValue>{formatMoney(totalResumo)}</SummaryValue>
          </SummaryRow>
        </SummaryBox>
      </Content>

      <BottomTotal>
        <BottomLabel>Valor</BottomLabel>
        <BottomValue>{formatMoney(totalFinal)}</BottomValue>
      </BottomTotal>

      <Modal visible={modalVisible} transparent animationType="fade">
        <ModalOverlay activeOpacity={1} onPress={() => setModalVisible(false)}>
          <ModalBox onStartShouldSetResponder={() => true}>
            <ModalTitle>Alterar Status</ModalTitle>
            {statusList.map((s) => (
              <StatusOption key={s} onPress={() => { setStatus(s); setModalVisible(false); }}>
                <StatusText active={status === s}>{s}</StatusText>
              </StatusOption>
            ))}
          </ModalBox>
        </ModalOverlay>
      </Modal>

    </Screen>
  );
}