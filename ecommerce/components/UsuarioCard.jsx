import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UsuarioCard({ usuario, onPress, onEdit, onDelete }) {
  const confirmarDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir ${usuario.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => onDelete(usuario.id)
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(usuario)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
          {usuario.idade && (
            <Text style={styles.idade}>Idade: {usuario.idade} anos</Text>
          )}
          <Text style={styles.data}>
            Criado em: {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={(e) => {
              e.stopPropagation();
              onEdit(usuario);
            }}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={(e) => {
              e.stopPropagation();
              confirmarDelete();
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  infoContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  idade: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  data: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
});
