import React, { useEffect, useState } from 'react';

function ItemPage({ id }) {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    const fetchItemData = async () => {
      const itemResponse = await fetch(`/api/items/${id}`)
      const item = await itemResponse.json();
      setItemData(item);
    };
    fetchItemData();
  }, [id]);

  if (!itemData) {
    return <div>Loading...</div>;
  }

  return (
    <section className='item-wrapper'>
      <div className='result-container'>
        <div className='category-container'>
          <nav>{itemData.categories?.join(" > ")}</nav>
        </div>
        <div className='item-container'>
          <div className='item-image'><img src={itemData.picture} alt={itemData.title} /></div>
          <div className='item-data'>
            <h1>{itemData.title}</h1>
            <h1 className='item-price'>
              {Number(`${itemData.price.amount}.${itemData.price.decimals}`).toLocaleString("es-AR", {
                style: "currency",
                currency: itemData.price.currency,
              })}
            </h1>
            <button className='buy-button'>COMPRAR</button>
          </div>
          <div className='item-description'>
            <h1>Descripción del producto</h1>
            <p>{itemData.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ItemPage;
