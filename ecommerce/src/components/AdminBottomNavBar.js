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
  padding-bottom: 24px;
`;

const NavItem = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default function AdminBottomNavBar({ active, navigation }) {
  return (
    <NavBarContainer>
      <NavItem onPress={() => navigation.navigate('AdminDashboard')}>
        <Ionicons 
          name={active === 'home' ? 'home' : 'home-outline'} 
          size={24} 
          color={active === 'home' ? theme.colors.primary : theme.colors.textSecondary} 
        />
      </NavItem>

      <NavItem onPress={() => navigation.navigate('AdminProductList')}>
        <Ionicons 
          name={active === 'document' ? 'document-text' : 'document-text-outline'} 
          size={24} 
          color={active === 'document' ? theme.colors.primary : theme.colors.textSecondary} 
        />
      </NavItem>

      <NavItem onPress={() => navigation.navigate('Profile', { isAdmin: true })}>
        <Ionicons 
          name={active === 'profile' ? 'person' : 'person-outline'} 
          size={24} 
          color={active === 'profile' ? theme.colors.primary : theme.colors.textSecondary} 
        />
      </NavItem>
    </NavBarContainer>
  );
}
