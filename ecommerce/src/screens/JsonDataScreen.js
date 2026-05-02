import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import { getDashboardData } from '../services/database';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #1f3c88;
`;

const JsonText = styled.Text`
  font-size: 13px;
  color: #222;
`;

export default function JsonDataScreen() {
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState('');

  useEffect(() => {
    const carregarJson = async () => {
      try {
        const data = await getDashboardData();
        setJsonData(JSON.stringify(data, null, 2));
      } catch (error) {
        console.log(error);
        Alert.alert('Erro', 'Não foi possível gerar o JSON.');
      } finally {
        setLoading(false);
      }
    };

    carregarJson();
  }, []);

  return (
    <Container>
      <Content>
        <Title>Dados em JSON</Title>

        {loading ? (
          <ActivityIndicator size="large" color="#1f3c88" />
        ) : (
          <JsonText>{jsonData}</JsonText>
        )}
      </Content>
    </Container>
  );
}