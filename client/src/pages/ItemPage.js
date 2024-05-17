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
    <section>
      <div className='item-Cointainer'>
        <img src={itemData.picture} alt={itemData.title} />
        <p>{itemData.title}</p>
        <hr />
        <p>{itemData.description}</p>
        </div>
     
    </section>
    
  );
}

export default ItemPage;
