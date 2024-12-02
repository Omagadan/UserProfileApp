import React, {useState, useEffect, useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  fetchUsers,
  saveUsersToCache,
  getUsersFromCache,
} from '../services/ApiService';
import debounce from 'lodash.debounce';
import {View, Text, TextInput, FlatList, StyleSheet} from 'react-native';

const UserProfiles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedTerm, setDebouncedTerm] = useState<string>('');

  // Cargar datos del caché antes de hacer llamadas a la API
  useEffect(() => {
    const loadCachedUsers = async () => {
      const cachedUsers = await getUsersFromCache();
      if (cachedUsers) {
        setDebouncedTerm(''); // Para evitar la sobreescritura de búsqueda
      }
    };
    loadCachedUsers();
  }, []);

  const {
    data: users,
    error,
    isLoading,
    isError,
  } = useQuery(
    ['users', debouncedTerm],
    async () => {
      const data = await fetchUsers(debouncedTerm);
      await saveUsersToCache(data); // Cachear datos tras la llamada a la API
      return data;
    },
    {
      retry: 3, // Reintentar en caso de fallo
    },
  );

  // Manejo de debounce para reducir llamadas a la API
  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedTerm(value);
      }, 300),
    [],
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearchChange(value);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return (
      <Text style={styles.errorText}>Error: {(error as Error).message}</Text>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={onSearchChange}
        placeholder="Search by name..."
      />
      {users && users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={user => user.id.toString()}
          renderItem={({item}) => (
            <View style={styles.userCard}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text>{item.email}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No users found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  userCard: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  userName: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
  },
});

export default UserProfiles;
