import React, { useState, useEffect } from 'react';

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';

import styled from 'styled-components/native';

import { Ionicons } from '@expo/vector-icons';

import { theme } from '../theme';

import {
  updateUsuario,
  getUsuarioById,
} from '../services/database';

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

const HeaderGroup = styled.View`
  flex-direction: row;
  align-items: center;

  ${(props) =>
    props.isAdmin
      ? `
    background-color: ${theme.colors.primary};
    height: 80px;
    padding-horizontal: 16px;
    padding-top: 20px;
  `
      : `
    padding: 16px;
    margin-top: 8px;
  `}
`;

const BackBtn = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 16px;
`;

const TitleText = styled.Text`
  font-size: 20;
  font-weight: 700;
  color: ${(props) =>
    props.isAdmin
      ? theme.colors.white
      : theme.colors.primary};
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
  background-color: ${theme.colors.primary};
  border-radius: ${theme.metrics.borderRadius};
  min-height: 52px;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  margin-bottom: 40px;
`;

const SaveButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.danger};
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
`;

// ─── SCREEN ───────────────────────────────────────────────────────────────────

export default function EditProfileScreen({ navigation }) {

  const [usuarioId, setUsuarioId] = useState(null);
  const [usuario, setUsuario] = useState(null);

  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // MODAL
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);

    Alert.alert(
      "Conta",
      "Aqui você pode chamar deleteUsuario() e fazer logout"
    );

    // Exemplo real:
    // await deleteUsuario(usuarioId);
    // navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    try {
      setLoading(true);

      const usuarioStorage = await AsyncStorage.getItem("usuarioLogado");

      if (!usuarioStorage) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      const usuarioLogado = JSON.parse(usuarioStorage);

      setUsuarioId(usuarioLogado.id_usuario);

      const data = await getUsuarioById(usuarioLogado.id_usuario);

      if (data) {
        setUsuario(data);
        setNome(data.nome_usuario || "");
        setEmail(data.email_usuario || "");
        setCpf(data.cpf || "");
        setDataNasc(data.data_nascimento || "");
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = usuario?.tipo_usuario === 'admin';

  const validate = () => {
    const errs = {};
    if (!nome.trim()) errs.nome = 'Nome obrigatório';
    if (!email.trim()) errs.email = 'E-mail obrigatório';
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

      await updateUsuario(
        usuarioId,
        nome,
        cpf,
        dataNasc,
        email,
        usuario?.senha_usuario
      );

      Alert.alert("Sucesso", "Atualizado!");
      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>

      <HeaderGroup isAdmin={isAdmin}>
        <BackBtn onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </BackBtn>

        <TitleText isAdmin={isAdmin}>
          Editar Perfil
        </TitleText>
      </HeaderGroup>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Content>

          <InputGroup>
            <Label>Nome</Label>
            <Input value={nome} onChangeText={setNome} />
          </InputGroup>

          <InputGroup>
            <Label>CPF</Label>
            <Input value={cpf} onChangeText={setCpf} />
          </InputGroup>

          <InputGroup>
            <Label>Data de nascimento</Label>
            <Input value={dataNasc} onChangeText={setDataNasc} />
          </InputGroup>

          <InputGroup>
            <Label>E-mail</Label>
            <Input value={email} onChangeText={setEmail} />
          </InputGroup>

          {/* LINK EXCLUSÃO */}
          {!isAdmin && (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text
                onPress={openDeleteModal}
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                Solicitar exclusão da conta
              </Text>
            </View>
          )}

          <SaveButton onPress={handleSave}>
            <SaveButtonText>
              {saving ? "Salvando..." : "Salvar"}
            </SaveButtonText>
          </SaveButton>

        </Content>
      </KeyboardAvoidingView>

      {/* MODAL */}
      {showDeleteModal && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Excluir conta
            </Text>

            <Text style={{ marginVertical: 20 }}>
              Deseja realmente excluir sua conta?
            </Text>

            <View style={{ flexDirection: "row" }}>

              <TouchableOpacity
                onPress={closeDeleteModal}
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: "#ccc",
                  marginRight: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmDelete}
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: "red",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff" }}>
                  Confirmar
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      )}

    </Screen>
  );
}