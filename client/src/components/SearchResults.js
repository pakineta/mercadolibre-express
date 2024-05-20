import React, { Fragment, useEffect, useState } from 'react';

function SearchResults() {
  const [backendData, setBackendData] = useState({
    items: [],
    categories: []
  });
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    fetch(`/api/items?q=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        setBackendData(data);
      });
  }, [searchQuery]);

  return (
    <section className='results-wrapper'>
      <div className='results-container'>
        <div className='category-container'>
          <nav>{backendData.categories[0]?.join(" > ")}</nav>
        </div>
        <div className='items-container'>
          {backendData.items.map((item) => (
            <>
              <a href={`/items/${item.id}`} key={item.id} >
                <div className='item'>
                  <img alt={item.title} src={item.picture} />
                  <div className='item-info'>
                    <p>
                      {Number(`${item.price.amount}.${item.price.decimals}`).toLocaleString("es-AR", {
                        style: "currency",
                        currency: item.price.currency,
                      })}
                    </p>
                    <p>{item.title}</p>

                  </div>
                  <div className='item-seller'>
                    {item.seller}
                  </div>
                </div>
              </a>
              <hr />
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SearchResults;
