import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@cards_usuario";

export const getCards = async (userId) => {
  const data = await AsyncStorage.getItem(KEY);

  const all = data ? JSON.parse(data) : {};

  return all[userId] || [];
};

export const saveCard = async (userId, card) => {
  const data = await AsyncStorage.getItem(KEY);
  const all = data ? JSON.parse(data) : {};

  const userCards = all[userId] || [];

  const updated = [...userCards, card];

  all[userId] = updated;

  await AsyncStorage.setItem(KEY, JSON.stringify(all));
};

export const deleteCard = async (userId, cardId) => {
  const data = await AsyncStorage.getItem(KEY);
  const all = data ? JSON.parse(data) : {};

  const userCards = all[userId] || [];

  all[userId] = userCards.filter((c) => c.id !== cardId);

  await AsyncStorage.setItem(KEY, JSON.stringify(all));
};