import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchUsers = async (searchTerm: string = ''): Promise<any[]> => {
  const response = await axios.get(API_URL);
  const users = response.data;

  if (searchTerm) {
    return users.filter((user: {name: string}) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  return users;
};

export const saveUsersToCache = async (users: any[]): Promise<void> => {
  await AsyncStorage.setItem('cachedUsers', JSON.stringify(users));
};

export const getUsersFromCache = async (): Promise<any[] | null> => {
  const cachedData = await AsyncStorage.getItem('cachedUsers');
  return cachedData ? JSON.parse(cachedData) : null;
};
