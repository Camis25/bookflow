import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';

import styled from 'styled-components/native';

import { Ionicons } from '@expo/vector-icons';

import { Picker } from '@react-native-picker/picker';

import { theme } from '../theme';

import * as ImagePicker from 'expo-image-picker';

import {
  insertLivro,
  updateLivro,
  getAllCategorias,
} from '../services/database';

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
  font-size: 20px;
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
  border-radius: 12px;
  min-height: 48px;
  padding: 0 16px;
  font-size: 14px;
  color: ${theme.colors.text};
`;

const TextArea = styled.TextInput`
  background-color: ${theme.colors.inputBg};
  border-radius: 12px;
  min-height: 120px;
  padding: 16px;
  font-size: 14px;
  color: ${theme.colors.text};
  text-align-vertical: top;
`;

const ImageAreaBlock = styled.View`
  width: 140px;
  height: 180px;
  background-color: ${theme.colors.inputBg};
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const SelectImageButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  margin-top: 12px;
  border-radius: 12px;
  height: 46px;
  justify-content: center;
  align-items: center;
`;

const SelectImageButtonText = styled.Text`
  color: ${theme.colors.white};
  font-weight: bold;
  font-size: 14px;
`;

const PickerContainer = styled.View`
  background-color: ${theme.colors.inputBg};
  border-radius: 12px;
  overflow: hidden;
  min-height: 48px;
  justify-content: center;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 24px;
  min-height: 48px;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 60px;
  margin-horizontal: 32px;
`;

const SaveButtonText = styled.Text`
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: bold;
`;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AdminProductFormScreen({
  route,
  navigation,
}) {
  const { livro } = route.params || {};

  const isEditing = !!livro;

  const [titulo, setTitulo] = useState(
    livro?.titulo || ''
  );

  const [descricao, setDescricao] = useState(
    livro?.descricao || ''
  );

  const [preco, setPreco] = useState(
    livro ? String(livro.preco) : ''
  );

  const [estoque, setEstoque] = useState(
    livro ? String(livro.estoque) : '0'
  );

  const [categoria, setCategoria] = useState(
    livro?.categoria || ''
  );

  const [categorias, setCategorias] = useState([]);

  const [imagemUrl, setImagemUrl] = useState(
    livro?.imagem_url || ''
  );

  const [saving, setSaving] = useState(false);

  // ─── CARREGAR CATEGORIAS ─────────────────────────

  const loadCategorias = async () => {
    try {
      const data = await getAllCategorias();

      setCategorias(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  // ─── Escolher imagem ─────────────────────────────

  const escolherImagem = async () => {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à galeria.'
        );
        return;
      }

      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });

      if (!resultado.canceled) {
        setImagemUrl(resultado.assets[0].uri);
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível selecionar a imagem.'
      );
    }
  };

  // ─── SALVAR ──────────────────────────────────────

  const handleSave = async () => {
    if (!titulo || !preco || !categoria) {
      Alert.alert(
        'Erro',
        'Preencha Título, Preço e Categoria.'
      );
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await updateLivro(
          livro.id,
          titulo,
          descricao,
          parseFloat(preco),
          parseInt(estoque, 10),
          categoria,
          imagemUrl
        );

        Alert.alert(
          'Sucesso',
          'Produto atualizado!'
        );
      } else {
        await insertLivro(
          titulo,
          descricao,
          parseFloat(preco),
          parseInt(estoque, 10),
          categoria,
          imagemUrl
        );

        Alert.alert(
          'Sucesso',
          'Produto criado!'
        );
      }

      navigation.goBack();
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Erro',
        'Falha ao salvar produto.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <HeaderGroup>
        <BackBtn onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.white}
          />
        </BackBtn>

        <HeaderTitleText>
          {isEditing
            ? 'Editar Produto'
            : 'Novo Produto'}
        </HeaderTitleText>
      </HeaderGroup>

      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        style={{ flex: 1 }}
      >
        <Content showsVerticalScrollIndicator={false}>
          <TitleContainer>
            <MainTitle>
              {isEditing
                ? 'Editar Produto'
                : 'Novo Produto'}
            </MainTitle>
          </TitleContainer>

          {/* IMAGEM */}

          <InputGroup>
            <Label>Imagem</Label>

            <ImageAreaBlock>
              {imagemUrl ? (
                <CoverImage
                  source={{ uri: imagemUrl }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="image-outline"
                  size={32}
                  color={theme.colors.textSecondary}
                />
              )}
            </ImageAreaBlock>

            <Input
              style={{ marginTop: 12 }}
              value={imagemUrl}
              onChangeText={setImagemUrl}
              placeholder="Cole a URL da Imagem aqui"
              placeholderTextColor={
                theme.colors.textSecondary
              }
            />

            <SelectImageButton
              onPress={escolherImagem}
            >
              <SelectImageButtonText>
                Selecionar imagem da galeria
              </SelectImageButtonText>
            </SelectImageButton>
          </InputGroup>

          {/* TÍTULO */}

          <InputGroup>
            <Label>Título</Label>

            <Input
              value={titulo}
              onChangeText={setTitulo}
            />
          </InputGroup>

          {/* DESCRIÇÃO */}

          <InputGroup>
            <Label>Descrição</Label>

            <TextArea
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />
          </InputGroup>

          {/* PREÇO */}

          <InputGroup>
            <Label>Preço</Label>

            <Input
              value={preco}
              onChangeText={setPreco}
              keyboardType="numeric"
            />
          </InputGroup>

          {/* ESTOQUE */}

          <InputGroup>
            <Label>Estoque</Label>

            <Input
              value={estoque}
              onChangeText={setEstoque}
              keyboardType="numeric"
            />
          </InputGroup>

          {/* CATEGORIA */}

          <InputGroup>
            <Label>Categoria</Label>

            <PickerContainer>
              <Picker
                selectedValue={categoria}
                onValueChange={(itemValue) =>
                  setCategoria(itemValue)
                }
              >
                <Picker.Item
                  label="Selecione uma categoria"
                  value=""
                />

                {categorias.map((cat) => (
                  <Picker.Item
                    key={cat.id}
                    label={cat.nome}
                    value={cat.id}
                  />
                ))}
              </Picker>
            </PickerContainer>
          </InputGroup>

          {/* SALVAR */}

          <SaveButton
            onPress={handleSave}
            disabled={saving}
          >
            <SaveButtonText>
              {saving
                ? 'Salvando...'
                : 'Salvar'}
            </SaveButtonText>
          </SaveButton>
        </Content>
      </KeyboardAvoidingView>
    </Screen>
  );
}