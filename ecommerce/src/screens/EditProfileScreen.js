import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
//import { updateUsuario } from '../services/database';
import BottomNavBar from '../components/BottomNavBar';

// ─── Styled Components ────────────────────────────────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.ScrollView`
  padding: ${theme.metrics.padding};
  flex: 1;
`;

// O Header muda caso seja admin para ficar alinhado com o Blue Dashboard
const HeaderGroup = styled.View`
  flex-direction: row;
  align-items: center;
  ${props => props.isAdmin ? `
    background-color: ${theme.colors.primary};
    height: 80px;
    padding-horizontal: 16px;
    padding-top: 20px;
  ` : `
    padding: 16px;
    margin-top: 8px;
  `}
`;

const BackBtn = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 16px;
`;

const TitleText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.isAdmin ? theme.colors.white : theme.colors.primary};
`;

const InputGroup = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  margin-bottom: 8px;
  margin-left: 4px;
  font-weight: 600;
`;

const Input = styled.TextInput`
  background-color: ${theme.colors.inputBg};
  border-radius: ${theme.metrics.borderRadius};
  min-height: 48px;
  padding: 0 16px;
  font-size: 15px;
  color: ${theme.colors.text};
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${theme.colors.secondary};
  border-radius: ${theme.metrics.borderRadius};
  min-height: 52px;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  margin-bottom: 40px;
`;

const SaveButtonText = styled.Text`
  color: ${theme.colors.white};
  font-size: 16px;
  font-weight: bold;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.danger};
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
`;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EditProfileScreen({ route, navigation }) {
  const { usuario } = route.params || {};

  // Em produção teríamos o AuthContext. Mock caso não tenha prop explícita
  const isAdmin = usuario?.isAdmin || false;

  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [cpf, setCpf] = useState(usuario?.cpf || '');
  const [dataNasc, setDataNasc] = useState(usuario?.data_nascimento || '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!nome.trim()) errs.nome = 'Nome obrigatório';
    if (!email.trim()) errs.email = 'E-mail obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'E-mail inválido';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (!usuario?.id) {
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      navigation.goBack();
      return;
    }

    try {
      setSaving(true);
      await updateUsuario(usuario.id, nome, email, null, cpf, dataNasc);
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <HeaderGroup isAdmin={isAdmin}>
        <BackBtn onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={24} color={isAdmin ? theme.colors.white : theme.colors.secondary} />
        </BackBtn>
        <TitleText isAdmin={isAdmin}>Editar dados pessoais</TitleText>
      </HeaderGroup>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Content showsVerticalScrollIndicator={false}>
          <View style={{marginTop: isAdmin ? 16 : 0}}>
            <TitleText style={{alignSelf: 'center', marginBottom: 24, fontSize: 18, color: theme.colors.primary}}>
              Dados Pessoais
            </TitleText>
          </View>
          
          <InputGroup>
            <Label>Nome</Label>
            <Input
              value={nome}
              onChangeText={v => { setNome(v); setErrors(e => ({ ...e, nome: null })); }}
              placeholder="Seu nome completo"
              placeholderTextColor={theme.colors.textSecondary}
            />
            {errors.nome && <ErrorText>{errors.nome}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>CPF</Label>
            <Input
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
              placeholder="000.000.000-00"
              placeholderTextColor={theme.colors.textSecondary}
              maxLength={14}
            />
          </InputGroup>

          <InputGroup>
            <Label>Data de nascimento</Label>
            <Input
              value={dataNasc}
              onChangeText={setDataNasc}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              maxLength={10}
            />
          </InputGroup>

          <InputGroup>
            <Label>E-mail</Label>
            <Input
              value={email}
              onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: null })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="seu@email.com"
              placeholderTextColor={theme.colors.textSecondary}
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </InputGroup>

          {/* Na foto de Admin tem um botão invisivel de Excluir da Conta. Placeholder */}
          {isAdmin && (
             <View style={{alignItems: 'center', marginTop: 16}}>
                <Label style={{color: theme.colors.primary, textDecorationLine: 'underline'}}>Solicitar exclusão da conta</Label>
             </View>
          )}

          <SaveButton onPress={handleSave} disabled={saving} style={{ backgroundColor: theme.colors.primary, borderRadius: 24 }}>
            <SaveButtonText>{saving ? 'Salvando…' : 'Salvar'}</SaveButtonText>
          </SaveButton>

        </Content>
      </KeyboardAvoidingView>

    </Screen>
  );
}
