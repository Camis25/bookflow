import React, { useState } from "react";
import styled from "styled-components/native";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  height: 65px;
  background-color: #b7dea4;
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
  padding: 32px 20px 0 20px;
`;

const Title = styled.Text`
  color: #4f789f;
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 26px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 35px;
`;

const InfoItem = styled.View`
  align-items: center;
`;

const InfoLabel = styled.Text`
  color: #4f789f;
  font-size: 16px;
  font-weight: bold;
`;

const InfoValue = styled.Text`
  color: #111111;
  font-size: 14px;
  margin-top: 4px;
`;

const Card = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 22px 20px;
  margin-bottom: 16px;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.25);
  elevation: 5;
`;

const ProductTop = styled.View`
  flex-direction: row;
  margin-bottom: 26px;
`;

const BookImage = styled.Image`
  width: 48px;
  height: 65px;
  border-radius: 5px;
  margin-right: 28px;
`;

const ProductInfo = styled.View`
  flex: 1;
`;

const ProductTitle = styled.Text`
  color: #555555;
  font-size: 14px;
  font-weight: bold;
`;

const ProductText = styled.Text`
  color: #555555;
  font-size: 13px;
  font-weight: bold;
  margin-top: 4px;
`;

const ReviewBox = styled.View`
  background-color: #eeeeee;
  border-radius: 10px;
  padding: 20px;
`;

const Input = styled.TextInput`
  background-color: #ffffff;
  height: 62px;
  border-radius: 10px;
  padding: 12px;
  font-size: 13px;
  color: #333333;
  margin-bottom: 18px;
`;

const ReviewBottom = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StarsRow = styled.View`
  flex-direction: row;
`;

const Star = styled.TouchableOpacity``;

const StarText = styled.Text`
  font-size: 36px;
  color: #ffffff;
`;

const SendButton = styled.TouchableOpacity`
  background-color: #4f789f;
  padding: 14px 28px;
  border-radius: 22px;
`;

const SendText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const SummaryBox = styled.View`
  border-width: 3px;
  border-color: #aaaaaa;
  border-radius: 26px;
  padding: 12px 14px 14px 14px;
  margin-bottom: 122px;
`;

const SummaryTitle = styled.Text`
  color: #aaaaaa;
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const SummaryText = styled.Text`
  color: #999999;
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
  color: #4f789f;
  font-size: 28px;
  font-weight: 800;
`;

const BottomValue = styled.Text`
  color: #222222;
  font-size: 28px;
  font-weight: 500;
`;

export default function ReviewScreen({ route, navigation }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const product = route.params?.product || {
    titulo: "Harry Potter - Capa Sonserina - Preto - G",
    quantidade: 2,
    preco_unitario: 12,
    imagem_url: "https://m.media-amazon.com/images/I/81LTEfXYgcL._SY522_.jpg",
  };

  const formatMoney = (value) => {
    return `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`;
  };

  return (
    <Screen>
      <Header>
        <HeaderTitle onPress={() => navigation.goBack()}>Pedidos</HeaderTitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <Title>Pedido 01</Title>

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
            <InfoValue>Concluído</InfoValue>
          </InfoItem>
        </InfoRow>

        <Card>
          <ProductTop>
            <BookImage source={{ uri: product.imagem_url }} />

            <ProductInfo>
              <ProductTitle>{product.titulo}</ProductTitle>
              <ProductText>
                Valor unitário: {formatMoney(product.preco_unitario)}
              </ProductText>
              <ProductText>Quantidade: {product.quantidade}</ProductText>
            </ProductInfo>
          </ProductTop>

          <ReviewBox>
            <Input
              placeholder="DIGITE SUA AVALIAÇÃO"
              placeholderTextColor="#888888"
              value={review}
              onChangeText={setReview}
              multiline
            />

            <ReviewBottom>
              <StarsRow>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} onPress={() => setRating(star)}>
                    <StarText>{star <= rating ? "★" : "☆"}</StarText>
                  </Star>
                ))}
              </StarsRow>

              <SendButton>
                <SendText>Enviar</SendText>
              </SendButton>
            </ReviewBottom>
          </ReviewBox>
        </Card>

        <SummaryBox>
          <SummaryTitle>Resumo do Pedido</SummaryTitle>

          <SummaryRow>
            <SummaryText>Subtotal:</SummaryText>
            <SummaryText>R$ 24,00</SummaryText>
          </SummaryRow>

          <SummaryRow>
            <SummaryText>Frete:</SummaryText>
            <SummaryText>R$ 7,00</SummaryText>
          </SummaryRow>

          <SummaryRow>
            <SummaryText>Descontos:</SummaryText>
            <SummaryText>R$ 0,00</SummaryText>
          </SummaryRow>

          <SummaryRow>
            <SummaryText>Total:</SummaryText>
            <SummaryText>R$ 31,00</SummaryText>
          </SummaryRow>
        </SummaryBox>
      </Content>

      <BottomTotal>
        <BottomLabel>Valor</BottomLabel>
        <BottomValue>R$ 97,00</BottomValue>
      </BottomTotal>
    </Screen>
  );
}