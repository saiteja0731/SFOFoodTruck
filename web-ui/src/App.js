import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [searchUrl, setSearchUrl] = useState('');
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (searchUrl) {
      fetch(searchUrl)
        .then((response) => response.json())
        .then((data) => setCards(data))
        .catch((error) => console.log(error));
    }
  }, [searchUrl]);

  const handleSearch = (event) => {
    event.preventDefault();
    const searchText = event.target.search.value;
    const baseUrl = 'http://localhost:3000/api/data'; // Replace with your base URL
    const searchUrl = `${baseUrl}?q=${searchText}`;
    setSearchUrl(searchUrl);
  };

  const openCardDetails = (card) => {
    setSelectedCard(card);
  };

  const closeCardDetails = () => {
    setSelectedCard(null);
  };

  return (
    <div className="App">
      <h1>Welcome to Card App</h1>
      <form onSubmit={handleSearch}>
        <input type="text" name="search"  placeholder="type 'all' to get all data" />
        <button type="submit">Find Food Truck</button>
      </form>
      <div className="card-container">
        {cards.map((card, index) => (
          <div className="card" key={index} onClick={() => openCardDetails(card)}>
            <img src={card.icon} alt={card.Applicant} width="100" height="100" />
            <h2>{card.Applicant}</h2>
            <h5>Facility Id: {card.locationid}</h5>
            <p>{card.LocationDescription}</p>
          </div>
        ))}
      </div>
      {selectedCard && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-button" onClick={closeCardDetails}>
              &times;
            </button>
            <img src={selectedCard.icon} alt={selectedCard.Applicant} width="200" height="200" />
            <h2>{selectedCard.Applicant}</h2>
            <h5>Facility Id: {selectedCard.locationid}</h5>
            <p>{selectedCard.LocationDescription}</p>
            <p><a href={selectedCard.Schedule} download>Schedule </a>&#8594;</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;



// import React, { useState, useEffect } from 'react';
// import './App.css';
// import CardDetails from './CardDetails';

// function App() {
//   const [searchUrl, setSearchUrl] = useState('');
//   const [cards, setCards] = useState([]);
//   const [selectedCard, setSelectedCard] = useState(null);

//   useEffect(() => {
//     if (searchUrl) {
//       fetch(searchUrl)
//         .then((response) => response.json())
//         .then((data) => setCards(data))
//         .catch((error) => console.log(error));
//     }
//   }, [searchUrl]);

//   const handleSearch = (event) => {
//     event.preventDefault();
//     const searchText = event.target.search.value;
//     const baseUrl = 'http://localhost:3000/api/data'; // Replace with your base URL
//     const searchUrl = `${baseUrl}?q=${searchText}`;
//     setSearchUrl(searchUrl);
//   };

//   const handleCardClick = (card) => {
//     setSelectedCard(card);
//   };

//   const handleCloseModal = () => {
//     setSelectedCard(null);
//   };

//   return (
//     <div className="App">
//       <h1>Welcome to Card App</h1>
//       <form onSubmit={handleSearch}>
//         <input type="text" name="search" placeholder="Enter URL" />
//         <button type="submit">Find Food Truck</button>
//       </form>
//       <div className="card-container">
//         {cards.map((card, index) => (
//           <div className="card" key={index} onClick={() => handleCardClick(card)}>
//             <img src={'https://placekitten.com/300/200'} alt={card.Applicant} />
//             <h2>{card.Applicant}</h2>
//             <h5>Facility Id: {card.locationid}</h5>
//             <p>{card.LocationDescription}</p>
//           </div>
//         ))}
//       </div>
//       {selectedCard && <CardDetails card={selectedCard} onClose={handleCloseModal} />}
//     </div>
//   );
// }

// export default App;
