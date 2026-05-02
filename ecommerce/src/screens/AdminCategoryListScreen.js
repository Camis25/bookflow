import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Alert, View, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { 
  getAllCategorias,
  insertCategoria,
  updateCategoria,
  deleteCategoria
} from '../services/database';

// ─── Styled Components ────────────────────────────────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.white};
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

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 32px;
  position: relative;
`;

const MainTitle = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${theme.colors.primary};
`;

const NovoBtn = styled.TouchableOpacity`
  background-color: ${theme.colors.secondary};
  border-radius: 12px;
  padding-vertical: 6px;
  padding-horizontal: 16px;
  position: absolute;
  right: 0;
`;

const NovoBtnText = styled.Text`
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: bold;
`;

const CategoryCard = styled.View`
  background-color: ${theme.colors.inputBg};
  border-radius: 16px;
  padding-vertical: 12px;
  padding-horizontal: 16px;
  margin-bottom: 16px;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CategoryLabel = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const ActionsRow = styled.View`
  flex-direction: row;
`;

const ActionIconBtn = styled.TouchableOpacity`
  margin-left: 10px;
`;

const Loader = styled.ActivityIndicator`
  margin-top: 40px;
`;

// Modal
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.4);
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.View`
  width: 320px;
  background-color: ${theme.colors.white};
  border-radius: 16px;
  padding: 24px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const ModalInput = styled.TextInput`
  background-color: ${theme.colors.inputBg};
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 20px;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Btn = styled.TouchableOpacity`
  background-color: ${props => props.cancel ? '#ccc' : theme.colors.primary};
  padding: 10px 20px;
  border-radius: 10px;
`;

const BtnText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

// ─── SCREEN ───────────────────────────────────────────────────────────────────

export default function AdminCategoryListScreen({ navigation }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const loadCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCategorias();
      setCategorias(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategorias();
  }, []);

  const openNew = () => {
    setEditingCat(null);
    setInputValue('');
    setModalVisible(true);
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setInputValue(cat.nome_categoria);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!inputValue.trim()) {
      Alert.alert("Erro", "Digite um nome");
      return;
    }

    try {
      if (editingCat) {
        await updateCategoria(editingCat.id_categoria, inputValue);
      } else {
        await insertCategoria(inputValue);
      }

      setModalVisible(false);
      loadCategorias();

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha ao salvar");
    }
  };

  const handleDelete = (cat) => {
    Alert.alert(
      "Confirmar",
      "Deseja excluir?",
      [
        { text: "Cancelar" },
        {
          text: "Excluir",
          onPress: async () => {
            await deleteCategoria(cat.id_categoria);
            loadCategorias();
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <CategoryCard>
      <CategoryLabel>{item.nome_categoria}</CategoryLabel>

      <ActionsRow>
        <ActionIconBtn onPress={() => handleDelete(item)}>
          <Ionicons name="trash" size={16} />
        </ActionIconBtn>

        <ActionIconBtn onPress={() => openEdit(item)}>
          <Ionicons name="pencil" size={16} />
        </ActionIconBtn>
      </ActionsRow>
    </CategoryCard>
  );

  return (
    <Screen>
      <HeaderGroup>
        <BackBtn onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </BackBtn>
        <HeaderTitleText>Categorias</HeaderTitleText>
      </HeaderGroup>

      <Content>
        <TopRow>
          <MainTitle>Categorias</MainTitle>
          <NovoBtn onPress={openNew}>
            <NovoBtnText>Novo</NovoBtnText>
          </NovoBtn>
        </TopRow>

        {loading ? (
          <Loader size="large" />
        ) : (
          <FlatList
            data={categorias}
            keyExtractor={(item) => String(item.id_categoria)}
            renderItem={renderItem}
          />
        )}
      </Content>

      <Modal visible={modalVisible} transparent>
        <Overlay>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ModalBox>
              <ModalTitle>
                {editingCat ? "Editar" : "Nova"} Categoria
              </ModalTitle>

              <ModalInput
                value={inputValue}
                onChangeText={setInputValue}
              />

              <ButtonsRow>
                <Btn onPress={handleSave}>
                  <BtnText>Salvar</BtnText>
                </Btn>

                <Btn cancel onPress={() => setModalVisible(false)}>
                  <BtnText>Cancelar</BtnText>
                </Btn>
              </ButtonsRow>
            </ModalBox>
          </KeyboardAvoidingView>
        </Overlay>
      </Modal>
    </Screen>
  );
}