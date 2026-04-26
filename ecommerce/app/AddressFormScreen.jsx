import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
//import { insertEndereco, updateEndereco } from '../services/database';

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

const Content = styled.ScrollView`
  padding: 24px;
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-top: 16px;
  margin-bottom: 32px;
`;

const MainTitle = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${theme.colors.primary};
`;

const InputGroup = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 13px;
  color: ${theme.colors.primary};
  margin-bottom: 8px;
  margin-left: 4px;
  font-weight: 700;
`;

const Input = styled.TextInput`
  background-color: ${theme.colors.inputBg};
  border-radius: ${theme.metrics.borderRadius};
  min-height: 48px;
  padding: 0 16px;
  font-size: 14px;
  color: ${theme.colors.text};
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 24px;
  min-height: 48px;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 60px;
  margin-horizontal: 32px;
`;

const SaveButtonText = styled.Text`
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: bold;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.danger};
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
`;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AddressFormScreen({ route, navigation }) {
  const { usuario_id, endereco } = route.params || {};

  const isEditing = !!endereco;

  const [cep, setCep] = useState(endereco?.cep || '');
  const [rua, setRua] = useState(endereco?.rua || '');
  const [bairro, setBairro] = useState(endereco?.bairro || '');
  const [numero, setNumero] = useState(endereco?.numero || '');
  const [complemento, setComplemento] = useState(endereco?.complemento || '');
  const [referencia, setReferencia] = useState(endereco?.referencia || '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!cep.trim()) errs.cep = 'Campo obrigatório';
    if (!rua.trim()) errs.rua = 'Campo obrigatório';
    if (!bairro.trim()) errs.bairro = 'Campo obrigatório';
    if (!numero.trim()) errs.numero = 'Campo obrigatório';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await updateEndereco(endereco.id, cep, rua, bairro, numero, complemento, referencia);
      } else {
        await insertEndereco(usuario_id, cep, rua, bairro, numero, complemento, referencia);
      }
      navigation.goBack();
    } catch (_) {
      Alert.alert('Erro', 'Não foi possível salvar o endereço.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <HeaderGroup>
        <BackBtn onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </BackBtn>
        <HeaderTitleText>{isEditing ? 'Editar endereço' : 'Novo endereço'}</HeaderTitleText>
      </HeaderGroup>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Content showsVerticalScrollIndicator={false}>
          <TitleContainer>
             <MainTitle>{isEditing ? 'Editar Endereço' : 'Endereço'}</MainTitle>
          </TitleContainer>

          <InputGroup>
            <Label>CEP</Label>
            <Input
              value={cep}
              onChangeText={v => { setCep(v); setErrors(e => ({ ...e, cep: null })); }}
              keyboardType="numeric"
            />
            {errors.cep && <ErrorText>{errors.cep}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>Rua</Label>
            <Input
              value={rua}
              onChangeText={v => { setRua(v); setErrors(e => ({ ...e, rua: null })); }}
            />
            {errors.rua && <ErrorText>{errors.rua}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>Bairro</Label>
            <Input
              value={bairro}
              onChangeText={v => { setBairro(v); setErrors(e => ({ ...e, bairro: null })); }}
            />
            {errors.bairro && <ErrorText>{errors.bairro}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>Número</Label>
            <Input
              value={numero}
              onChangeText={v => { setNumero(v); setErrors(e => ({ ...e, numero: null })); }}
            />
            {errors.numero && <ErrorText>{errors.numero}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>Complemento</Label>
            <Input
              value={complemento}
              onChangeText={setComplemento}
            />
          </InputGroup>

          <InputGroup>
            <Label>Referência</Label>
            <Input
              value={referencia}
              onChangeText={setReferencia}
            />
          </InputGroup>

          <SaveButton onPress={handleSave} disabled={saving}>
            <SaveButtonText>{saving ? 'Salvando…' : 'Salvar'}</SaveButtonText>
          </SaveButton>
        </Content>
      </KeyboardAvoidingView>
    </Screen>
  );
}
