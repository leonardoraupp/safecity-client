import Config from 'react-native-config';
const API_URL = Config.API_URL;

export async function fetchAdresses() {
  try {
    const response = await fetch(`${API_URL}/adress`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    throw error;
  }
}