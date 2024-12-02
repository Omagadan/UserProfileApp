import React from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './queryClient';
import UserProfiles from './components/UserProfiles';

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProfiles />
    </QueryClientProvider>
  );
};

export default App;
