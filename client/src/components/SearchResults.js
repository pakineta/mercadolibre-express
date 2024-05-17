import React, { Fragment, useEffect, useState } from 'react';

function SearchResults() {
  const [backendData, setBackendData] = useState({
    items:[],
    categories:[]
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
    <Fragment>
      <div className='category-container'>
          <nav>{backendData.categories[0]?.join(" > ")}</nav>
      </div>
        <div className='article-container'>
            <article>
              {backendData.items.map((item) => (
                <a href={`/items/${item.id}`} key={item.id} >
                  <img alt={item.title} src={item.picture} />
                  <div>
                    <p>
                      {Number(`${item.price.amount}.${item.price.decimals}`).toLocaleString("es-AR", {
                        style: "currency",
                        currency: item.price.currency,
                      })}
                    </p>
                    <p>{item.title}</p>
                    <hr />
                  </div>
                  <span>
                    {item.seller}
                  </span>      
                </a>
              ))}
            </article>
          </div> 
        </Fragment>
  );
}

export default SearchResults;
