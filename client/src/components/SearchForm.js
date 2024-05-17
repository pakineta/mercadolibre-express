import React, { useState } from 'react';

function SearchForm() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = `/items?search=${searchQuery}`;
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="search-cointainer">
      <header>
        <form onSubmit={handleSubmit}>
          <span onClick={handleLogoClick}><img src='../logo.png'  alt='logo'/></span>
          <input
            placeholder='Nunca dejes de buscar'
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button  type="submit"><img src='../search.svg'  alt='search-icon' /></button>
        </form>
      </header>
    </div>
  );
}

export default SearchForm;
