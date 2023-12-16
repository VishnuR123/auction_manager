import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import React, { useState } from 'react';
import './App.css';

interface Player {
  id: number;
  name: string;
  role: string;
  price: number;
}

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Player>({ id: 0, name: '', role: '', price: 0 });
  const [remainingPurse, setRemainingPurse] = useState<number>(80); // 80 crores
  const [selectedImage, setSelectedImage] = useState('image1.jpg');
  
  function handleOnDragEnd(result:any){
    if(!result.destination) return;
    const items=Array.from(players);
    const [reorderedItem]=items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlayers(items);
    console.log(result);
    console.log('Updated Players:', items);
  }


  const addPlayer = () => {
    if (newPlayer.name.trim() === '' || newPlayer.role.trim() === '' || newPlayer.price <= 0) {
      return;
    }

    const updatedPlayers = [...players, { ...newPlayer, id: Date.now() }];
    const totalSpent = updatedPlayers.reduce((total, player) => total + player.price, 0);
    const newRemainingPurse = 80 - totalSpent;
    console.log('Total Spent:', totalSpent);
    console.log('New Remaining Purse:', newRemainingPurse);
    if (newRemainingPurse >= 0) {
      setPlayers(updatedPlayers);
      setRemainingPurse(newRemainingPurse);
      setNewPlayer({ id: 0, name: '', role: '', price: 0 });
    } else {
      alert('Exceeded purse limit! Please adjust player prices.');
    }
  };

  const removePlayer = (id: number) => {
    const playerToRemove = players.find((player) => player.id === id);
  
    if (playerToRemove) {
      const updatedPlayers = players.filter((player) => player.id !== id);
      setPlayers(updatedPlayers);
  
      // Calculate the total spent by summing up prices of all players
      const totalSpent = updatedPlayers.reduce((total, player) => total + player.price, 0);
      
      // Calculate the remaining purse by subtracting the total spent from the initial purse (80)
      const newRemainingPurse = 80 - totalSpent;
  
      setRemainingPurse(newRemainingPurse);
    }
  };
  
  

  return (
    <div className='App'>
      <div className='formContainer'>            
            <input
              type="text"
              value={newPlayer.name}
              placeholder='Enter Name'
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            />


            <select 
              value={newPlayer.role} 
              onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value })}>
                <option>Select</option>
                <option>Batsman</option>
                <option>Bowler</option>
                <option>AllRounder</option>
                <option>WicketKeeper</option>
              </select>
       
          <label>
            Player Price (in crores):
            <input
              type="number"
              className='crores'
              value={newPlayer.price}
              placeholder="Enter Price"
              onChange={(e) => setNewPlayer({ ...newPlayer, price: parseFloat(e.target.value) || 0 })}
            />
          </label>
          <button onClick={addPlayer}>Sold</button>
          <p className="remainingPurse">Remaining Purse: {remainingPurse} crores</p>
          <select id="imageSelector" onChange={(e) => setSelectedImage(e.target.value)}>
                {/* <option value="src/assets/IPL.png">Team</option> */}
                <option value="src/assets/CSK.png">CSK</option>
                <option value="src/assets/DC.png">DC</option>
                <option value="src/assets/GT.png">GT</option>
                <option value="src/assets/KKR.png">KKR</option>
                <option value="src/assets/MI.png">MI</option>
                <option value="src/assets/RCB.png">RCB</option>
                <option value="src/assets/RR.png">RR</option>
                <option value="src/assets/SRH.png">SRH</option>
          </select>
      </div>
      
      <div className="mainContainer">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId='playerContainer'>
            {(provided)=>(            
          <ul className='playerContainer' {...provided.droppableProps} ref={provided.innerRef}>

            {players.map((player,index) => (
              <Draggable key={player.id} draggableId={player.id.toString()} index={index}>
                {(provided)=>(

                
                <li  className={`player ${player.role}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                  <span>{`${player.name} - ${player.price} cr`}</span>
                  <button onClick={() => removePlayer(player.id)}><span className="material-symbols-outlined">remove</span></button>
                </li>
                
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
          )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="imageContainer">
        <img src={selectedImage} alt="" />
      </div>
    </div>
  );
};

export default App;
