var elementCount_PlayerTracker=0;

function PlayerTracker(props={}){

  const thisId="PlayerTracker_"+elementCount_PlayerTracker;
  elementCount_PlayerTracker++;

  let addingPlayer=false;

  setTimeout(()=>{

    const addPlayerElem=document.querySelector(`#${thisId} #adding_player`)
    const addPlayerButton=document.querySelector(`#${thisId} #players #actions #agregar`)
    
    addPlayerButton
    .addEventListener("click",(e)=>{

      function acceptHandler(playerFreeDays){
        setAdding(false);
      }

      function setAdding(isAdding=false){
        addingPlayer=isAdding;
        addPlayerButton.innerHTML=isAdding?"Cancelar":"Agregar Jugador";
        addPlayerElem.innerHTML=`${
            addingPlayer&&(
              `<input type="text" id="player_name"/>${PlayerInput({onAccept:acceptHandler})}`
            )||""
          }
        `;
      }

      setAdding(!addingPlayer);
    })

  },1);

  return `<div class="player_tracker" id="${thisId}">
    <section id="players">
      <div id="actions" class="actions">
        <button id="agregar">Agregar Jugador</button>
      </div>
    </section>
    <section id="adding_player"></section>
  </div>`;
}