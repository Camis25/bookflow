import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  Alert,
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import styled from 'styled-components/native';

import { Ionicons } from '@expo/vector-icons';

import { theme } from '../theme';

import AdminBottomNavBar from '../components/AdminBottomNavBar';

import {
  getAllCategorias,
  insertCategoria,
  updateCategoria,
  deleteCategoria,
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
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const CategoryLabel = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const ActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ActionIconBtn = styled.TouchableOpacity`
  padding: 4px;
  margin-left: 8px;
`;

const Loader = styled.ActivityIndicator`
  margin-top: 40px;
`;

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
  padding: 32px 24px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: ${theme.colors.primary};
  margin-bottom: 24px;
`;

const ModalInputGroup = styled.View`
  width: 100%;
  margin-bottom: 24px;
`;

const ModalLabel = styled.Text`
  font-size: 12px;
  color: ${theme.colors.primary};
  margin-bottom: 8px;
  margin-left: 4px;
  font-weight: 700;
`;

const ModalInput = styled.TextInput`
  background-color: ${theme.colors.inputBg};
  border-radius: 12px;
  min-height: 48px;
  padding: 0 16px;
  font-size: 14px;
  color: ${theme.colors.text};
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const ModalActionBtn = styled.TouchableOpacity`
  border-radius: 16px;
  padding-vertical: 10px;
  padding-horizontal: 32px;
  margin-horizontal: 8px;
  background-color: ${props =>
    props.cancel
      ? '#a3d18c'
      : theme.colors.primary};
`;

const ModalActionBtnText = styled.Text`
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: bold;
`;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AdminCategoryListScreen({
  navigation,
}) {
  const [categorias, setCategorias] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [editingCat, setEditingCat] =
    useState(null);

  const [inputValue, setInputValue] =
    useState('');

  // ─── LOAD ───────────────────────────────────────────

  const loadCategorias = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAllCategorias();

      setCategorias(data || []);
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível carregar categorias.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  // ─── NOVA CATEGORIA ────────────────────────────────

  const openNewCategory = () => {
    setEditingCat(null);

    setInputValue('');

    setModalVisible(true);
  };

  // ─── EDITAR ────────────────────────────────────────

  const openEditCategory = (cat) => {
    setEditingCat(cat);

    setInputValue(cat.nome);

    setModalVisible(true);
  };

  // ─── SALVAR ────────────────────────────────────────

  const handleSave = async () => {
    try {
      if (!inputValue.trim()) {
        Alert.alert(
          'Erro',
          'Digite o nome da categoria.'
        );
        return;
      }

      if (editingCat) {
        await updateCategoria(
          editingCat.id,
          inputValue
        );

        Alert.alert(
          'Sucesso',
          'Categoria atualizada!'
        );
      } else {
        await insertCategoria(inputValue);

        Alert.alert(
          'Sucesso',
          'Categoria criada!'
        );
      }

      setModalVisible(false);

      setInputValue('');

      setEditingCat(null);

      // RECARREGA LISTA

      await loadCategorias();
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Erro',
        'Falha ao salvar categoria.'
      );
    }
  };

  // ─── DELETE ────────────────────────────────────────

  const handleDelete = (cat) => {
    Alert.alert(
      'Tem certeza?',
      'Deseja excluir essa categoria?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Excluir',

          style: 'destructive',

          onPress: async () => {
            try {
              await deleteCategoria(cat.id);

              await loadCategorias();

              Alert.alert(
                'Sucesso',
                'Categoria removida.'
              );
            } catch (error) {
              console.log(error);

              Alert.alert(
                'Erro',
                'Falha ao excluir categoria.'
              );
            }
          },
        },
      ]
    );
  };

  // ─── ITEM ──────────────────────────────────────────

  const renderItem = ({ item }) => (
    <CategoryCard>
      <CategoryLabel>
        {item.nome}
      </CategoryLabel>

      <ActionsRow>
        <ActionIconBtn
          onPress={() => handleDelete(item)}
        >
          <Ionicons
            name="trash"
            size={14}
            color={theme.colors.textSecondary}
          />
        </ActionIconBtn>

        <ActionIconBtn
          onPress={() => openEditCategory(item)}
        >
          <Ionicons
            name="pencil"
            size={14}
            color={theme.colors.textSecondary}
          />
        </ActionIconBtn>
      </ActionsRow>
    </CategoryCard>
  );

  return (
    <Screen>
      <HeaderGroup>
        <BackBtn
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.white}
          />
        </BackBtn>

        <HeaderTitleText>
          Categorias
        </HeaderTitleText>
      </HeaderGroup>

      <Content>
        <TopRow>
          <MainTitle>
            Categorias
          </MainTitle>

          <NovoBtn onPress={openNewCategory}>
            <NovoBtnText>
              Novo
            </NovoBtnText>
          </NovoBtn>
        </TopRow>

        {loading ? (
          <Loader
            size="large"
            color={theme.colors.primary}
          />
        ) : (
          <FlatList
            data={categorias}
            keyExtractor={(item) =>
              String(item.id)
            }
            extraData={categorias}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent:
                'space-between',
              gap: 16,
            }}
            style={{ width: '100%' }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Content>

      {/* MODAL */}

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
      >
        <Overlay>
          <KeyboardAvoidingView
            behavior={
              Platform.OS === 'ios'
                ? 'padding'
                : undefined
            }
          >
            <ModalBox>
              <ModalTitle>
                {editingCat
                  ? 'Editar Categoria'
                  : 'Nova Categoria'}
              </ModalTitle>

              <ModalInputGroup>
                <ModalLabel>
                  Categoria
                </ModalLabel>

                <ModalInput
                  value={inputValue}
                  onChangeText={setInputValue}
                />
              </ModalInputGroup>

              <ButtonsRow>
                <ModalActionBtn
                  onPress={handleSave}
                >
                  <ModalActionBtnText>
                    Salvar
                  </ModalActionBtnText>
                </ModalActionBtn>

                <ModalActionBtn
                  cancel
                  onPress={() =>
                    setModalVisible(false)
                  }
                >
                  <ModalActionBtnText>
                    Cancelar
                  </ModalActionBtnText>
                </ModalActionBtn>
              </ButtonsRow>
            </ModalBox>
          </KeyboardAvoidingView>
        </Overlay>
      </Modal>

      <AdminBottomNavBar
        active="document"
        navigation={navigation}
      />
    </Screen>
  );
}