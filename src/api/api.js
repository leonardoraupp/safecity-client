import { API_URL } from "@env"

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