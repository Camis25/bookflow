import React, { useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // ✅ necessário
import { theme } from '../theme';
import { getAllLivros, insertLivro, updateLivro, getAllCategorias } from '../services/database';

// ─── Styled ─────────────────────────────────

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

// ─── SCREEN ─────────────────────────────────

export default function AdminProductFormScreen({ route, navigation }) {
  const { livro } = route.params || {};
  const isEditing = !!livro;

  const [titulo, setTitulo] = useState(livro?.titulo_livro || '');
  const [descricao, setDescricao] = useState(livro?.descricao || '');
  const [preco, setPreco] = useState(livro ? String(livro.preco) : '');
  const [estoque, setEstoque] = useState(livro ? String(livro.estoque) : '0');
  const [categoria, setCategoria] = useState(livro?.id_categoria || '');
  const [imagem, setImagem] = useState(livro?.capa_livro || '');

  const [categorias, setCategorias] = useState([]);
  const [livros, setLivros] = useState([]);
  const [saving, setSaving] = useState(false);

  // 🔥 carregar categorias
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const data = await getAllCategorias();
        setCategorias(data);
      } catch (error) {
        console.log("Erro categorias:", error);
      }
    };

    carregarCategorias();
  }, []);

  // escolher imagem da galeria
  const escolherImagem = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permissão necessária");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImagem(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validarCategoria = () => {
    if (categorias.length === 0) {
      Alert.alert("Nenhuma categoria cadastrada");
      return;
    }

    Alert.alert(
      "Selecionar Categoria",
      "",
      categorias.map(cat => ({
        text: cat.nome_categoria,
        onPress: () => setCategoria(cat.id_categoria)
      }))
    );
  }


  const handleSave = async () => {
    if (!titulo || !preco || !categoria) {
      Alert.alert('Erro', 'Preencha Título, Preço e Categoria.');
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await updateLivro(
          livro.id_livro,
          titulo,
          parseFloat(preco),
          parseInt(estoque),
          categoria,
          imagem
        );
        Alert.alert('Sucesso', 'Produto atualizado!');
      } else {
        await insertLivro(
          titulo,
          parseFloat(preco),
          parseInt(estoque),
          categoria,
          imagem
        );
        Alert.alert('Sucesso', 'Produto criado!');
      }

      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao salvar.');
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
        <HeaderTitleText>
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </HeaderTitleText>
      </HeaderGroup>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Content>

          <TitleContainer>
            <MainTitle>
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </MainTitle>
          </TitleContainer>

          <InputGroup>
            <Label>Imagem (URL ou Galeria)</Label>

            <ImageAreaBlock>
              {imagem ? (
                <CoverImage
                  source={{ uri: imagem }}
                  onError={() => {
                    console.log("Erro ao carregar imagem");
                    setImagem('');
                  }}
                />
              ) : (
                <Ionicons name="image-outline" size={32} color="#999" />
              )}
            </ImageAreaBlock>

            <Input
              style={{ marginTop: 12 }}
              value={imagem}
              onChangeText={setImagem}
              placeholder="Cole a URL da imagem"
            />

            <TouchableOpacity onPress={escolherImagem}>
              <Label style={{ marginTop: 10 }}>
                Selecionar da galeria
              </Label>
            </TouchableOpacity>
          </InputGroup>

          <InputGroup>
            <Label>Título</Label>
            <Input value={titulo} onChangeText={setTitulo} />
          </InputGroup>

          <InputGroup>
            <Label>Descrição</Label>
            <TextArea value={descricao} onChangeText={setDescricao} multiline />
          </InputGroup>

          <InputGroup>
            <Label>Preço</Label>
            <Input value={preco} onChangeText={setPreco} keyboardType="numeric" />
          </InputGroup>

          <InputGroup>
          <TouchableOpacity activeOpacity={0.8} onPress={validarCategoria}>
            <Label>Categoria</Label>
            <Input
              pointerEvents="none"
              placeholder="Selecione uma categoria"
              value={
                categorias.find(c => c.id_categoria === categoria)?.nome_categoria || ''
              }
              editable={false}
            />
          </TouchableOpacity>
          </InputGroup>

          <InputGroup>
            <Label>Estoque</Label>
            <Input value={estoque} onChangeText={setEstoque} keyboardType="numeric" />
          </InputGroup>

        <SaveButton onPress={handleSave} disabled={saving}>
          <SaveButtonText>
            {saving ? 'Salvando...' : 'Salvar'}
          </SaveButtonText>
        </SaveButton>

      </Content>
    </KeyboardAvoidingView>
    </Screen >
  );
}