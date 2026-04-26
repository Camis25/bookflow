import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const Wrapper = styled.View`
  background-color: ${theme.colors.primary};
  padding: 14px 4px;
  flex-direction: row;
  align-items: center;
`;

const IconBtn = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
`;

const TitleText = styled.Text`
  flex: 1;
  color: ${theme.colors.white};
  font-size: ${theme.typography.title};
  font-weight: bold;
  margin-left: 4px;
`;

/**
 * Cabeçalho reutilizável BookFlow.
 * - navigation: se fornecido, exibe botão de voltar (← arrow-back)
 * - title: texto do cabeçalho
 * - onAction + actionIcon: botão de ação à direita (ex: "add", "search-outline")
 */
export default function AppHeader({ title, navigation, onAction, actionIcon }) {
  return (
    <Wrapper>
      <IconBtn onPress={navigation ? () => navigation.goBack() : undefined} accessible accessibilityLabel="Voltar">
        {navigation && (
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        )}
      </IconBtn>

      <TitleText numberOfLines={1}>{title}</TitleText>

      <IconBtn onPress={onAction || undefined} accessible accessibilityLabel={actionIcon || ''}>
        {actionIcon && (
          <Ionicons name={actionIcon} size={24} color={theme.colors.white} />
        )}
      </IconBtn>
    </Wrapper>
  );
}
