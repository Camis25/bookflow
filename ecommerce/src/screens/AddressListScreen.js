//import React, { useState, useEffect, useCallback } from 'react';
//import { FlatList, ActivityIndicator, View } from 'react-native';
//import styled from 'styled-components/native';
//import { Ionicons } from '@expo/vector-icons';
//import { theme } from '../theme';
//import { getEnderecosByUsuario } from '../services/database';

// ─── Styled Components ────────────────────────────────────────────────────────
import React from "react";
import styled from "styled-components/native";

const Screen = styled.SafeAreaView`
  flex: 1;
   background-color: #ffffff
`;

const Header = styled.View`
  height: 52px;
  background-color: #b7dea4;
  flex-direction: row;
  align-items: center;
padding-left: 16px;
`;

const BackButton = styled.TouchableOpacity`
  margin-right: 18px;
`;

const BackText = styled.Text`
  color: #ffffff;
  font-size: 26px;
  font-weight: bold;
  
`;

const HeaderTitle = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 34px 0 20px 0;
`;

const PageTitle = styled.Text`
  color: #4f789f;
  font-size: 18px;
  font-weight: 800;
   text-align: center;
    margin-bottom: 22px;
`;



const NewButton = styled.TouchableOpacity`
  align-self: flex-end;
  background-color: #4f789f;
  padding: 8px 22px;
  border-radius: 18px;
  margin-right: 26px;
  margin-bottom: 14px;
`;

const NewButtonText = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
`;

// Endereço Card
const AddressCard = styled.View`
  background-color: #e5f3dd;
  border-radius: 14px;
  padding: 16px;
  margin: 0 18px 18px 18px;
`;

const AddressRow = styled.View`
  flex-direction: row;
 align-items: center;
  margin-bottom: 8px;
`;

const AddressLabel = styled.Text`
  color: #4f789f;
  font-size: 12px;
  margin-right: 4px;
`;

const AddressValue = styled.Text`
  color: #222222;
  font-size: 12px;
`;

// Mocks
const ADDRESSES  = [
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

export default function AddressListScreen({ navigation }) {

  return (
    <Screen>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackText>←</BackText>
        </BackButton>

        <HeaderTitle>Endereços</HeaderTitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <PageTitle>Meus Endereços</PageTitle>

        <NewButton onPress={() => navigation.navigate("AddressForm")}>
          <NewButtonText>Novo</NewButtonText>
        </NewButton>

        {ADDRESSES.map((address) => (
          <AddressCard key={address.id}>
            <AddressRow>
              <AddressLabel>CEP:</AddressLabel>
              <AddressValue>{address.cep}</AddressValue>
            </AddressRow>

            <AddressRow>
              <AddressLabel>Rua:</AddressLabel>
              <AddressValue>{address.rua}</AddressValue>
            </AddressRow>

            <AddressRow>
              <AddressLabel>Bairro:</AddressLabel>
              <AddressValue>{address.bairro}</AddressValue>
            </AddressRow>

            <AddressRow>
              <AddressLabel>Número:</AddressLabel>
              <AddressValue>{address.numero}</AddressValue>
            </AddressRow>

            <AddressRow>
              <AddressLabel>Complemento:</AddressLabel>
              <AddressValue>{address.complemento}</AddressValue>
            </AddressRow>

            <AddressRow>
              <AddressLabel>Referência:</AddressLabel>
              <AddressValue>{address.referencia}</AddressValue>
            </AddressRow>
          </AddressCard>
        ))}
      </Content>
    </Screen>
  );
}
