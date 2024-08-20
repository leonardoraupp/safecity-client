import Config from 'react-native-config';
const API_URL = Config.API_URL;

export async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }    
}