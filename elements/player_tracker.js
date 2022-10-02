var elementCount_PlayerTracker=0;

function PlayerTracker(props={}){

  const thisId="PlayerTracker_"+elementCount_PlayerTracker;
  elementCount_PlayerTracker++;

  let addingPlayer=false;

  let playersSchedules={};

  function renderPlayers(){

    //genera elementos HTML que pasarian a se rlos nombres de los jugadores
    document.querySelector(`#${thisId} #players #player_list`)
    .innerHTML=Object.entries(playersSchedules)
    .map(([nombre,schedule])=>{

      //esta iteracion cuenta cuantas horas libres al dia tiene el jugador
      const timeAviable=Object.values(schedule).reduce((prev,schedList,index)=>{
        console.log(Array.isArray(schedList),schedList)
        if(schedList===true)
        return prev+24;

        if(Array.isArray(schedList) && schedList.length>0)
        return prev+schedList.length

        return prev
      },0)||0

      //168 son la cantidad de horas que tiene una semana, de este calculo se saca un porcentaje de 
      //tiempo libre a la semana que tiene el jugador
      const percentTimeAviable=Math.floor(100*(timeAviable/168))+"%"

      return `<h1 class="nohl">${nombre} (libre ${percentTimeAviable} del tiempo)</h1>`
    })
    .join("")
  }

  setTimeout(()=>{

    const addPlayerElem=document.querySelector(`#${thisId} #adding_player`)
    const addPlayerButton=document.querySelector(`#${thisId} #players #actions #agregar`)
    
    addPlayerButton
    .addEventListener("click",(e)=>{

      function acceptHandler(playerFreeDays){
        const playerName=document.querySelector(`#${thisId} #adding_player input#player_name`).value

        if(playerName=="")
        return alert("Colocale un nombre al jugador");
        
        playersSchedules[playerName]=playerFreeDays;

        renderPlayers();
        
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
        <div id="player_list"></div>
      </div>
    </section>
    <section id="adding_player"></section>
  </div>`;
}