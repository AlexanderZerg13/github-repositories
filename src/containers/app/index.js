import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import CssBaseline from '@material-ui/core/CssBaseline';
import MainPage from '../pages/main';
import client from '../../api';

function App() {
  return (
      <ApolloProvider client={client}>
        <CssBaseline />
        <div className="App">
            <MainPage />
        </div>
    </ApolloProvider>
  );
}

export default App;
