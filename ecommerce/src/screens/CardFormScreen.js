import React, { useEffect, useState } from "react";
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

const SaveButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 14px;
  border-radius: 24px;
  align-items: center;
  margin-top: 20px;
`;

const SaveText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

// ─────────────────────────────

export default function CardFormScreen({ navigation, route }) {
  const usuarioId = 1;

  const editingCard = route?.params?.card;
  const mode = route?.params?.mode;
  const onSave = route?.params?.onSave;

  const [brand, setBrand] = useState("visa");
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const [errors, setErrors] = useState({});

  // ───────── preencher edição
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

  // ───────── máscara cartão
  const maskCard = (v) =>
    v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

  const maskMonth = (v) => v.replace(/\D/g, "").slice(0, 2);
  const maskYear = (v) => v.replace(/\D/g, "").slice(0, 2);
  const maskCVV = (v) => v.replace(/\D/g, "").slice(0, 4);

  // ───────── detectar bandeira
  const detectBrand = (number) => {
    const clean = number.replace(/\s/g, "");

    if (clean.startsWith("4")) return "visa";

    if (/^5[1-5]/.test(clean) || clean.startsWith("2"))
      return "master";

    const elo = [
      "636368",
      "438935",
      "504175",
      "451416",
      "636297",
      "5067",
      "5090",
    ];

    if (elo.some((p) => clean.startsWith(p))) return "elo";

    return "unknown";
  };

  // ───────── validação
  const validate = () => {
    let err = {};

    const cleanNumber = number.replace(/\s/g, "");

    if (!cleanNumber || cleanNumber.length < 13)
      err.number = "Número inválido";

    const detected = detectBrand(number);

    if (detected === "unknown") {
      err.brand = "Bandeira não reconhecida";
    } else if (detected !== brand) {
      err.brand = `Cartão é ${detected.toUpperCase()}, não ${brand.toUpperCase()}`;
    }

    if (!holder) err.holder = "Nome obrigatório";

    if (!month || month.length !== 2)
      err.month = "Mês inválido";

    if (!year || year.length !== 2)
      err.year = "Ano inválido";

    if (!cvv || cvv.length < 3)
      err.cvv = "CVV inválido";

    if (!name) err.name = "Nome do cartão obrigatório";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // ───────── salvar
  const handleSave = async () => {
    if (!validate()) {
      Alert.alert("Erro", "Preencha corretamente os campos");
      return;
    }

    const raw = await AsyncStorage.getItem("@cards_usuario");
    const all = raw ? JSON.parse(raw) : {};
    const userCards = all[usuarioId] || [];

    const card = {
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

    if (mode === "edit") {
      updated = userCards.map((c) =>
        c.id === editingCard.id ? card : c
      );
    } else {
      updated = [...userCards, card];
    }

    all[usuarioId] = updated;

    await AsyncStorage.setItem(
      "@cards_usuario",
      JSON.stringify(all)
    );

    if (onSave) onSave();

    navigation.goBack();
  };

  return (
    <Screen>
      <Header>
        <HeaderTitle>
          {mode === "edit" ? "Editar cartão" : "Novo cartão"}
        </HeaderTitle>
      </Header>

      <Content>
        <Title>
          {mode === "edit" ? "Editar Cartão" : "Novo Cartão"}
        </Title>

        {/* BANDEIRA */}
        <Label>Bandeira</Label>

        <Row>
          <BrandButton
            bg="#1e5bb8"
            active={brand === "visa"}
            onPress={() => setBrand("visa")}
          >
            <BrandText active={brand === "visa"}>VISA</BrandText>
          </BrandButton>

          <BrandButton
            bg="#111"
            active={brand === "master"}
            onPress={() => setBrand("master")}
          >
            <BrandText active={brand === "master"}>MC</BrandText>
          </BrandButton>

          <BrandButton
            bg="#000"
            active={brand === "elo"}
            onPress={() => setBrand("elo")}
          >
            <BrandText active={brand === "elo"}>ELO</BrandText>
          </BrandButton>
        </Row>

        {errors.brand && <ErrorText>{errors.brand}</ErrorText>}

        {/* NÚMERO */}
        <Label>Número</Label>
        <Input
          value={number}
          onChangeText={(v) => setNumber(maskCard(v))}
          keyboardType="numeric"
        />
        {errors.number && <ErrorText>{errors.number}</ErrorText>}

        {/* TITULAR */}
        <Label>Nome titular</Label>
        <Input value={holder} onChangeText={setHolder} />
        {errors.holder && <ErrorText>{errors.holder}</ErrorText>}

        {/* VALIDADE */}
        <Row>
          <Input
            style={{ flex: 1 }}
            placeholder="MM"
            value={month}
            onChangeText={(v) => setMonth(maskMonth(v))}
          />

          <Input
            style={{ flex: 1 }}
            placeholder="AA"
            value={year}
            onChangeText={(v) => setYear(maskYear(v))}
          />
        </Row>

        {errors.month && <ErrorText>{errors.month}</ErrorText>}
        {errors.year && <ErrorText>{errors.year}</ErrorText>}

        {/* CVV */}
        <Label>CVV</Label>
        <Input
          value={cvv}
          onChangeText={(v) => setCvv(maskCVV(v))}
          keyboardType="numeric"
        />
        {errors.cvv && <ErrorText>{errors.cvv}</ErrorText>}

        {/* NOME CARTÃO */}
        <Label>Nome do cartão</Label>
        <Input value={name} onChangeText={setName} />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}

        <SaveButton onPress={handleSave}>
          <SaveText>
            {mode === "edit" ? "Atualizar" : "Salvar"}
          </SaveText>
        </SaveButton>
      </Content>
    </Screen>
  );
}