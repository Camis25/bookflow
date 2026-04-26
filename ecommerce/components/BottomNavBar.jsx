import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const NavBarContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: ${theme.colors.white};
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
  padding-top: 12px;
  padding-bottom: 24px; /* padding extra para iPhone/SafeArea se necessário, mas SafeAreaView contorna isso, usaremos 12px base */
`;

const NavItem = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default function BottomNavBar({ active, navigation }) {
  // active pode ser: 'home', 'book', 'profile'
  
  return (
    <NavBarContainer>
      <NavItem onPress={() => navigation.navigate('StoreHome')}>
        <Ionicons 
          name={active === 'home' ? 'home' : 'home-outline'} 
          size={24} 
          color={active === 'home' ? theme.colors.secondary : theme.colors.textSecondary} 
        />
      </NavItem>

      <NavItem onPress={() => navigation.navigate('Search')} /* Temporário: a lupa tá em cima, o meio parece 'livros', futuramente MyOrders/Library */>
        <Ionicons 
          name={active === 'book' ? 'book' : 'book-outline'} 
          size={24} 
          color={active === 'book' ? theme.colors.secondary : theme.colors.textSecondary} 
        />
      </NavItem>

      <NavItem onPress={() => navigation.navigate('Profile')}>
        <Ionicons 
          name={active === 'profile' ? 'person' : 'person-outline'} 
          size={24} 
          color={active === 'profile' ? theme.colors.secondary : theme.colors.textSecondary} 
        />
      </NavItem>
    </NavBarContainer>
  );
}
