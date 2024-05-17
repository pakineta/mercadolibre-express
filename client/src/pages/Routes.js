import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import ItemPage from './ItemPage';

function Routes() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const renderRoute = () => {
    if (path.startsWith('/items/')) {
      const id = path.split('/items/')[1];
      return (
        <>
          <SearchForm />
          <ItemPage id={id} />
        </>
      );
    } else if (path === '/items') {
      return (
        <>
          <SearchForm />
         
            <SearchResults />
          
        </>
      );
    } else {
      return <SearchForm />;
    }
  };

  return renderRoute();
}

export default Routes;