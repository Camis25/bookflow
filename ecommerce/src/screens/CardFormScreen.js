import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { theme } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// ─────────────────────────────

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
  margin-bottom: 6px;
`;

const Input = styled.TextInput`
  height: 44px;
  background-color: #f1f1f1;
  border-radius: 8px;
  padding: 0 12px;
  margin-bottom: 6px;
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
`;

const Row = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-bottom: 18px;
`;

const BrandButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  background-color: ${(props) =>
    props.active ? props.bg : "#e5e5e5"};
`;

const BrandText = styled.Text`
  color: ${(props) => (props.active ? "#fff" : "#666")};
  font-weight: bold;
`;

const SelectedInfo = styled.Text`
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const SaveButton = styled.TouchableOpacity`
  background: ${theme.colors.primary};
  padding: 14px;
  border-radius: 24px;
  align-items: center;
  margin-top: 10px;
`;

const SaveText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

// ─────────────────────────────

export default function CardFormScreen({ navigation, route }) {
  const usuarioId = 1;

  const editingCard = route?.params?.card;

  const [brand, setBrand] = useState("visa");
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCard) {
      setBrand(editingCard.brand);
      setNumber(editingCard.number);
      setHolder(editingCard.holder);
      setMonth(editingCard.month);
      setYear(editingCard.year);
      setCvv(editingCard.cvv);
      setName(editingCard.name);
    }
  }, []);

  // ──────────────── MÁSCARAS ────────────────

  const maskCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const maskMonth = (value) => {
    return value.replace(/\D/g, "").slice(0, 2);
  };

  const maskYear = (value) => {
    return value.replace(/\D/g, "").slice(0, 2);
  };

  const maskCVV = (value) => {
    return value.replace(/\D/g, "").slice(0, 4);
  };

  // ──────────────── VALIDAÇÃO ────────────────

  const validate = () => {
    let errs = {};

    if (!number || number.replace(/\s/g, "").length !== 16)
      errs.number = "Número do cartão inválido";

    if (!holder) errs.holder = "Nome obrigatório";

    if (!month || month.length !== 2)
      errs.month = "Mês inválido";

    if (!year || year.length !== 2)
      errs.year = "Ano inválido";

    if (!cvv || cvv.length < 3)
      errs.cvv = "CVV inválido";

    if (!name) errs.name = "Nome do cartão obrigatório";

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  // ──────────────── SALVAR ────────────────

  const handleSave = async () => {
    if (!validate()) {
      Alert.alert("Erro", "Preencha todos os campos corretamente");
      return;
    }

    const raw = await AsyncStorage.getItem("@cards_usuario");
    const all = raw ? JSON.parse(raw) : {};

    const userCards = all[usuarioId] || [];

    const newCard = {
      id: editingCard?.id || Date.now().toString(),
      brand,
      number,
      holder,
      month,
      year,
      cvv,
      name,
    };

    let updated;

    if (editingCard) {
      updated = userCards.map((c) =>
        c.id === editingCard.id ? newCard : c
      );
    } else {
      updated = [...userCards, newCard];
    }

    all[usuarioId] = updated;

    await AsyncStorage.setItem(
      "@cards_usuario",
      JSON.stringify(all)
    );

    navigation.goBack();
  };

  // ──────────────── UI ────────────────

  return (
    <Screen>
      <Header>
        <HeaderTitle>Novo cartão</HeaderTitle>
      </Header>

      <Content>

        <Title>Novo Cartão</Title>

        <Label>Bandeira: {brand.toUpperCase()}</Label>

        <Row>
          <BrandButton active={brand === "visa"} bg="#1e5bb8" onPress={() => setBrand("visa")}>
            <BrandText active={brand === "visa"}>VISA</BrandText>
          </BrandButton>

          <BrandButton active={brand === "master"} bg="#111" onPress={() => setBrand("master")}>
            <BrandText active={brand === "master"}>MC</BrandText>
          </BrandButton>

          <BrandButton active={brand === "elo"} bg="#000" onPress={() => setBrand("elo")}>
            <BrandText active={brand === "elo"}>ELO</BrandText>
          </BrandButton>
        </Row>

        <Label>Número do cartão</Label>
        <Input
          value={number}
          onChangeText={(v) => setNumber(maskCardNumber(v))}
          keyboardType="numeric"
        />
        {errors.number && <ErrorText>{errors.number}</ErrorText>}

        <Label>Nome titular</Label>
        <Input value={holder} onChangeText={setHolder} />
        {errors.holder && <ErrorText>{errors.holder}</ErrorText>}

        <Row>
          <Input
            style={{ flex: 1 }}
            placeholder="MM"
            value={month}
            onChangeText={(v) => setMonth(maskMonth(v))}
            keyboardType="numeric"
          />

          <Input
            style={{ flex: 1 }}
            placeholder="AA"
            value={year}
            onChangeText={(v) => setYear(maskYear(v))}
            keyboardType="numeric"
          />
        </Row>

        {(errors.month || errors.year) && (
          <ErrorText>Validade inválida</ErrorText>
        )}

        <Label>CVV</Label>
        <Input
          value={cvv}
          onChangeText={(v) => setCvv(maskCVV(v))}
          keyboardType="numeric"
        />
        {errors.cvv && <ErrorText>{errors.cvv}</ErrorText>}

        <Label>Nome do cartão</Label>
        <Input value={name} onChangeText={setName} />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}

        <SaveButton onPress={handleSave}>
          <SaveText>Salvar cartão</SaveText>
        </SaveButton>

      </Content>
    </Screen>
  );
}