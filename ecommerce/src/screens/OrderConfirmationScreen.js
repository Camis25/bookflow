import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import BottomNavBar from '../components/BottomNavBar';

// ─── Styled Components ────────────────────────────────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.ScrollView`
  padding: 24px;
`;

const TopHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 60px;
`;

const BackBtn = styled.TouchableOpacity`
  padding: 8px;
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const MainTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: ${theme.colors.primary};
`;

const BoxOutline = styled.View`
  border-width: 1.5px;
  border-color: ${theme.colors.primary};
  border-radius: 8px;
  background-color: ${theme.colors.white};
  padding: 40px 24px;
  align-items: center;
  elevation: 1;
  shadow-color: ${theme.colors.primary};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const OrderNumber = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: ${theme.colors.text};
  margin-bottom: 24px;
`;

const InfoText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.text};
  text-align: center;
  line-height: 18px;
`;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OrderConfirmationScreen({ route, navigation }) {
  // Número aleatório se não tiver vindo pelo route params (ex: finalizou a compra)
  const orderNumber = route.params?.pedidoId ? String(route.params.pedidoId).padStart(2, '0') : '0559286359';

  return (
    <Screen>
      <Content showsVerticalScrollIndicator={false}>
        <TopHeaderRow>
           <BackBtn onPress={() => navigation.navigate('Home')}>
             <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
           </BackBtn>
        </TopHeaderRow>

        <TitleContainer>
          <MainTitle>Pedido confirmado!</MainTitle>
        </TitleContainer>

        <BoxOutline>
          <OrderNumber>{orderNumber}</OrderNumber>
          <InfoText>
            Seu pedido já está sendo prepado!{'\n'}Você pode acompanhá-lo em "Meus pedidos" no menu lateral.
          </InfoText>
        </BoxOutline>
      </Content>

      <BottomNavBar active="home" navigation={navigation} />
    </Screen>
  );
}
