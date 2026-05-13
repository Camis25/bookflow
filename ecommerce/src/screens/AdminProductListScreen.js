import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Alert, View, Dimensions, Modal } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import AdminBottomNavBar from '../components/AdminBottomNavBar';
import { getAllLivros, deleteLivro } from '../services/database';

const { width } = Dimensions.get('window');
// Calcula para 2 colunas, descontando paddings
const cardWidth = (width - 48 - 16) / 2; 

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
  margin-bottom: 24px;
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

// Card de Produto
const ProductCard = styled.View`
  width: ${cardWidth}px;
  background-color: ${theme.colors.inputBg};
  border-radius: 12px;
  padding: 8px;
  align-items: center;
  margin-bottom: 16px;
`;

const BookImage = styled.Image`
  width: 100%;
  height: ${cardWidth * 1.4}px;
  border-radius: 6px;
  margin-bottom: 8px;
`;

const BookFallback = styled.View`
  width: 100%;
  height: ${cardWidth * 1.4}px;
  background-color: #ccc;
  border-radius: 6px;
  margin-bottom: 8px;
  justify-content: center;
  align-items: center;
`;

const ProductTitle = styled.Text`
  font-size: 10px;
  color: ${theme.colors.text};
  text-align: center;
`;

const ProductPrice = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const ActionsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-horizontal: 4px;
`;

const ActionIconBtn = styled.TouchableOpacity`
  padding: 4px;
`;

const Loader = styled.ActivityIndicator`
  margin-top: 40px;
`;

// Modal de Exclusão
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.View`
  width: 300px;
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 32px 24px;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: ${theme.colors.primary};
  margin-bottom: 16px;
`;

const ModalText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 32px;
`;

const ModalButtonsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const ModalBtn = styled.TouchableOpacity`
  padding-vertical: 8px;
  padding-horizontal: 32px;
  border-radius: 16px;
  background-color: ${props => props.primary ? theme.colors.primary : theme.colors.accent};
  margin-horizontal: 8px;
`;

const ModalBtnText = styled.Text`
  color: ${theme.colors.white};
  font-weight: bold;
  font-size: 14px;
`;


export default function AdminProductListScreen({ navigation }) {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal logic
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLivro, setSelectedLivro] = useState(null);

  const loadLivros = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllLivros();
      setLivros(data);
    } catch (_) {
      // Ignora err no DB
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadLivros();
    });
    return unsubscribe;
  }, [navigation, loadLivros]);

  const confirmDelete = (livro) => {
    setSelectedLivro(livro);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedLivro) return;
    try {
      setModalVisible(false);
      await deleteLivro(selectedLivro.id);
      loadLivros();
    } catch (_) {
      Alert.alert('Erro', 'Não foi possível excluir o produto.');
    }
  };

  const renderItem = ({ item }) => (
    <ProductCard>
      {item.imagem_url ? (
        <BookImage source={{ uri: item.imagem_url }} />
      ) : (
        <BookFallback><Ionicons name="image-outline" size={24} color="#999" /></BookFallback>
      )}
      <ProductTitle numberOfLines={1}>{item.titulo || 'Sem Título'}</ProductTitle>
      <ProductPrice>R$ {Number(item.preco).toFixed(2).replace('.', ',')}</ProductPrice>
      <ActionsRow>
        <ActionIconBtn onPress={() => confirmDelete(item)}>
          <Ionicons name="trash" size={14} color={theme.colors.textSecondary} />
        </ActionIconBtn>
        <ActionIconBtn onPress={() => navigation.navigate('AdminProductForm', { livro: item })}>
          <Ionicons name="pencil" size={14} color={theme.colors.textSecondary} />
        </ActionIconBtn>
      </ActionsRow>
    </ProductCard>
  );

  return (
    <Screen>
      <HeaderGroup>
        <BackBtn onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </BackBtn>
        <HeaderTitleText>Produtos</HeaderTitleText>
      </HeaderGroup>

      <Content>
        <TopRow>
          <MainTitle>Produtos</MainTitle>
          <NovoBtn onPress={() => navigation.navigate('AdminProductForm')}>
            <NovoBtnText>Novo</NovoBtnText>
          </NovoBtn>
        </TopRow>

        {loading ? (
          <Loader size="large" color={theme.colors.primary} />
        ) : (
          <FlatList
            data={livros}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Content>

      <Modal transparent visible={modalVisible} animationType="fade">
        <Overlay>
          <ModalBox>
            <ModalTitle>Tem certeza?</ModalTitle>
            <ModalText>Tem certeza que deseja excluir esse produto?</ModalText>
            <ModalButtonsRow>
              <ModalBtn primary onPress={handleDelete}>
                <ModalBtnText>Sim</ModalBtnText>
              </ModalBtn>
              <ModalBtn onPress={() => setModalVisible(false)}>
                <ModalBtnText>Não</ModalBtnText>
              </ModalBtn>
            </ModalButtonsRow>
          </ModalBox>
        </Overlay>
      </Modal>
      <AdminBottomNavBar active="document" navigation={navigation} />
    </Screen>
  );
}
