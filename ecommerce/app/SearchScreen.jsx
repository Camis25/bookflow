import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
//import { searchLivros } from '../services/database';
import BottomNavBar from '../components/BottomNavBar';

// ─── Styled Components ────────────────────────────────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding-top: 16px;
`;

const SearchHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 24px;
`;

const BackBtn = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const SearchInputWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.secondary};
  border-radius: 24px;
  padding: 0 16px;
  min-height: 48px;
`;

const SearchInputText = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: bold;
`;

const SearchIconBtn = styled.TouchableOpacity`
  padding: 4px;
`;

const ResultsCountText = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  padding-horizontal: 32px;
  margin-bottom: 24px;
`;

const ResultItem = styled.TouchableOpacity`
  flex-direction: row;
  padding: 0 24px;
  margin-bottom: 24px;
  align-items: center;
`;

const ResultCoverContainer = styled.View`
  width: 110px;
  height: 165px;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${theme.colors.inputBg};
  margin-right: 16px;
  justify-content: center;
  align-items: center;
`;

const ResultCoverImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ResultInfoContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const ResultTitleText = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const ResultPriceText = styled.Text`
  font-size: 14px;
  font-weight: 800;
  color: ${theme.colors.text};
`;

const FallbackTitle = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  padding: 4px;
  color: ${theme.colors.text};
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
`;


// Mock temporário para dar uma visualização idêntica se a DB estiver vazia.
// No DB original ele pega do `searchLivros`, mas colocaremos um mock se estiver digitando e não achar nada apenas pro teste das cores.
const MOCK_RESULTS = [
  { id: 101, titulo: 'Mais Sombrio - Stephen King', preco: 50.00, imagem_url: null },
  { id: 102, titulo: 'Carrie, a estranha - Stephen King', preco: 78.90, imagem_url: null },
  { id: 103, titulo: 'O Iluminado - Stephen King', preco: 48.90, imagem_url: null },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { 
      setResults([]); 
      return; 
    }
    
    try {
      setLoading(true);
      const data = await searchLivros(q.trim());
      // Pra simular a imagem do usuário pro 'Stephen King' se não houver dados no banco
      if (data.length === 0 && q.toLowerCase().includes('stephen')) {
        setResults(MOCK_RESULTS);
      } else {
        setResults(data);
      }
    } catch (_) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, doSearch]);

  const handleBuy = (book) => {
    navigation.navigate('OrderConfirmation', {
      itens: [{ livro_id: book.id, titulo: book.titulo, quantidade: 1, preco_unitario: book.preco }],
    });
  };

  const renderItem = ({ item }) => (
    <ResultItem onPress={() => handleBuy(item)}>
      <ResultCoverContainer>
        {item.imagem_url ? (
          <ResultCoverImage source={{ uri: item.imagem_url }} resizeMode="cover" />
        ) : (
          <FallbackTitle>{item.titulo}</FallbackTitle>
        )}
      </ResultCoverContainer>
      <ResultInfoContainer>
        <ResultTitleText>{item.titulo}</ResultTitleText>
        <ResultPriceText>R${Number(item.preco).toFixed(2).replace('.', ',')}</ResultPriceText>
      </ResultInfoContainer>
    </ResultItem>
  );

  return (
    <Screen>
      <Content>
        <SearchHeader>
          <BackBtn onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.secondary} />
          </BackBtn>

          <SearchInputWrapper>
            <SearchInputText
              value={query}
              onChangeText={setQuery}
              placeholder="Digite o título do livro..."
              placeholderTextColor={theme.colors.textSecondary}
              autoFocus
              returnKeyType="search"
            />
            <SearchIconBtn>
              <Ionicons name="search-outline" size={20} color={theme.colors.secondary} />
            </SearchIconBtn>
          </SearchInputWrapper>
        </SearchHeader>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.secondary} style={{ marginTop: 40 }} />
        ) : query.trim().length > 0 ? (
          <>
            <ResultsCountText>
              Encontrados {results.length} resultados para "{query}"
            </ResultsCountText>

            <FlatList
              data={results}
              keyExtractor={item => String(item.id)}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <EmptyContainer>
                  <EmptyText>Nenhum resultado encontrado.</EmptyText>
                </EmptyContainer>
              }
            />
          </>
        ) : (
           <EmptyContainer>
             <Ionicons name="search" size={64} color={theme.colors.inputBg} />
             <EmptyText style={{marginTop: 16}}>Comece a digitar para pesquisar...</EmptyText>
           </EmptyContainer>
        )}

      </Content>
      <BottomNavBar active="book" navigation={navigation} />
    </Screen>
  );
}
