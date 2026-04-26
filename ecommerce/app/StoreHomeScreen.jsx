import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  FlatList,
  ActivityIndicator,
  View,
  ImageBackground,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";
//import { getAllLivros } from "../services/database";
import BottomNavBar from "../components/BottomNavBar";

// ─── Styled Components ────────────────────────────────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const HeaderGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-top: 8px;
`;

const HamburgerBtn = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  justify-content: center;
`;

const HeaderRightGroup = styled.View`
  flex-direction: row;
  background-color: ${theme.colors.secondary};
  border-radius: 20px;
  padding: 4px 12px;
  align-items: center;
`;

const HeaderIconBtn = styled.TouchableOpacity`
  padding: 8px;
`;

const Greeting = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-left: 16px;
  margin-bottom: 16px;
`;

const BannerScroll = styled.ScrollView`
  padding-left: 16px;
  margin-bottom: 24px;
`;

const BannerImage = styled(ImageBackground)`
  width: 280px;
  height: 140px;
  border-radius: 12px;
  margin-right: 16px;
  overflow: hidden;
  justify-content: center;
`;

// Categorias e Livros
const SectionTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${theme.colors.textSecondary};
  margin-left: 16px;
  margin-bottom: 12px;
`;

const BooksScroll = styled.FlatList`
  padding-left: 16px;
  margin-bottom: 24px;
`;

const BookCoverButton = styled.TouchableOpacity`
  margin-right: 12px;
  width: 120px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${theme.colors.inputBg};
  justify-content: center;
  align-items: center;
`;

const BookCoverImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const FallbackTitle = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  padding: 8px;
  color: ${theme.colors.text};
`;

// Mock
const MOCK_BOOKS = [
  { id: 1, titulo: "A Hipótese do Amor", categoria: "Romance", preco: 49.9 },
  { id: 2, titulo: "Jane Eyre", categoria: "Romance", preco: 34.9 },
  { id: 3, titulo: "Nós Já Moramos Aqui", categoria: "Suspense", preco: 45.0 },
  {
    id: 4,
    titulo: "A Paciente Silenciosa",
    categoria: "Suspense",
    preco: 55.0,
  },
  { id: 5, titulo: "O Poder do Hábito", categoria: "Autoajuda", preco: 39.9 },
  {
    id: 6,
    titulo: "Um Livro de Auto-ajuda",
    categoria: "Autoajuda",
    preco: 29.9,
  },
];

export default function StoreHomeScreen({ navigation }) {
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const books = await getAllLivros();
      setAllBooks(books.length > 0 ? books : MOCK_BOOKS);
    } catch {
      setAllBooks(MOCK_BOOKS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getBooksByCategory = (catName) => {
    return allBooks.filter(
      (b) => b.categoria?.toLowerCase() === catName.toLowerCase(),
    );
  };

  const renderBookGroup = (title, data) => {
    if (data.length === 0) return null;

    return (
      <View>
        <SectionTitle>{title}</SectionTitle>

        <BooksScroll
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingRight: 16 }}
          renderItem={({ item }) => (
            <BookCoverButton
              onPress={() =>
                navigation.navigate("BookDetails", {
                  itens: [
                    {
                      livro_id: item.id,
                      titulo: item.titulo,
                      quantidade: 1,
                      preco_unitario: item.preco,
                    },
                  ],
                })
              }
            >
              {item.imagem_url ? (
                <BookCoverImage
                  source={{ uri: item.imagem_url }}
                  resizeMode="cover"
                />
              ) : (
                <FallbackTitle>{item.titulo}</FallbackTitle>
              )}
            </BookCoverButton>
          )}
        />
      </View>
    );
  };

  return (
    <Screen>
      {/* HEADER */}
      <HeaderGroup>
        <HamburgerBtn>
          <Ionicons name="menu" size={28} color={theme.colors.textSecondary} />
        </HamburgerBtn>

        <HeaderRightGroup>
          <HeaderIconBtn onPress={() => navigation.navigate("Search")}>
            <Ionicons
              name="search-outline"
              size={20}
              color={theme.colors.white}
            />
          </HeaderIconBtn>

          <HeaderIconBtn onPress={() => navigation.navigate("Cart")}>
            <Ionicons
              name="bag-handle-outline"
              size={20}
              color={theme.colors.white}
            />
          </HeaderIconBtn>
        </HeaderRightGroup>
      </HeaderGroup>

      {/* CONTEÚDO */}
      <Content showsVerticalScrollIndicator={false}>
        <Greeting>Olá, Usuário!</Greeting>

        {/* BANNERS COM IMAGEM */}
        <BannerScroll
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <BannerImage
            source={require("../assets/images/NaoFiccao.jpg")}
            imageStyle={{ borderRadius: 12 }}
            resizeMode="cover"
          />

          <BannerImage
            source={require("../assets/images/Terror.jpg")}
            imageStyle={{ borderRadius: 12 }}
            resizeMode="cover"
          />
        </BannerScroll>

        {/* LISTAS */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.secondary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <View>
            {renderBookGroup("Romance", getBooksByCategory("Romance"))}
            {renderBookGroup("Suspense", getBooksByCategory("Suspense"))}
            {renderBookGroup("Autoajuda", getBooksByCategory("Autoajuda"))}
          </View>
        )}
      </Content>

      {/* NAVBAR */}
      <BottomNavBar active="home" navigation={navigation} />
    </Screen>
  );
}
