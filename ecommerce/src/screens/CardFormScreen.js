import React, { useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  height: 52px;
  background-color: ${theme.colors.primary};
  justify-content: center;
  padding-left: 24px;
`;

const HeaderTitle = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 38px 20px 20px 20px;
`;

const Title = styled.Text`
  color: ${theme.colors.primary};
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 30px;
`;

const Label = styled.Text`
  color: ${theme.colors.primary};
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const BrandRow = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
  gap: 10px;
`;

const BrandButton = styled.TouchableOpacity`
  width: 44px;
  height: 28px;
  border-radius: 4px;
  background-color: ${(props) => props.bg || theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const BrandText = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
`;

const RadioRow = styled.View`
  flex-direction: row;
  margin-bottom: 22px;
  gap: 26px;
  padding-left: 10px;
`;

const Radio = styled.TouchableOpacity`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: ${(props) => (props.active ? theme.colors.primary : "#eeeeee")};
`;

const Input = styled.TextInput`
  height: 44px;
  background-color: #f1f1f1;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: #333333;
  margin-bottom: 18px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 18px;
`;

const SmallSelect = styled.TouchableOpacity`
  width: 88px;
  height: 34px;
  background-color: #f1f1f1;
  border-radius: 8px;
  margin-right: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const SelectText = styled.Text`
  color: #777777;
  font-size: 12px;
`;

const SmallInput = styled.TextInput`
  width: 100px;
  height: 38px;
  background-color: #f1f1f1;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
`;

const SaveButton = styled.TouchableOpacity`
  height: 48px;
  background-color: ${theme.colors.primary};
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  margin: 34px 28px 0 28px;
`;

const SaveText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
`;

export default function CardFormScreen({ navigation }) {
  const [brand, setBrand] = useState("visa");

  return (
    <Screen>
      <Header>
        <HeaderTitle>Novo cartão</HeaderTitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <Title>Novo Cartão</Title>

        <Label>Selecione a bandeira do cartão:</Label>

        <BrandRow>
          <BrandButton bg="#0b5eb8" onPress={() => setBrand("visa")}>
            <BrandText>VISA</BrandText>
          </BrandButton>

          <BrandButton bg="#2e74b5" onPress={() => setBrand("amex")}>
            <BrandText>AMEX</BrandText>
          </BrandButton>

          <BrandButton bg="#f28c28" onPress={() => setBrand("master")}>
            <BrandText>MC</BrandText>
          </BrandButton>

          <BrandButton bg="#111111" onPress={() => setBrand("elo")}>
            <BrandText>elo</BrandText>
          </BrandButton>
        </BrandRow>

        <RadioRow>
          <Radio active={brand === "visa"} onPress={() => setBrand("visa")} />
          <Radio active={brand === "amex"} onPress={() => setBrand("amex")} />
          <Radio active={brand === "master"} onPress={() => setBrand("master")} />
          <Radio active={brand === "elo"} onPress={() => setBrand("elo")} />
        </RadioRow>

        <Label>Número do cartão</Label>
        <Input keyboardType="numeric" />

        <Label>Nome do Titular</Label>
        <Input />

        <Label>Validade</Label>
        <Row>
          <SmallSelect>
            <SelectText>Mês</SelectText>
            <Ionicons name="chevron-down" size={18} color="#555555" />
          </SmallSelect>

          <SmallSelect>
            <SelectText>Ano</SelectText>
            <Ionicons name="chevron-down" size={18} color="#555555" />
          </SmallSelect>
        </Row>

        <Label>Código de Segurança</Label>
        <SmallInput keyboardType="numeric" />

        <Label style={{ marginTop: 18 }}>Nome do Cartão</Label>
        <Input />

        <SaveButton onPress={() => navigation.goBack()}>
          <SaveText>Salvar</SaveText>
        </SaveButton>
      </Content>
    </Screen>
  );
}