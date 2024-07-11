import { API_URL } from "@env"

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