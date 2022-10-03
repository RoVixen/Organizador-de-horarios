var elementCount_PlayerTracker=0;

function PlayerTracker(props={}){

  const thisId="PlayerTracker_"+elementCount_PlayerTracker;
  elementCount_PlayerTracker++;

  let addingPlayer=false;
  let showingCalc=false;

  let playersSchedules={};

  function renderPlayers(){

    //genera elementos HTML que pasarian a se rlos nombres de los jugadores
    document.querySelector(`#${thisId} #players #player_list`)
    .innerHTML=Object.entries(playersSchedules)
    .map(([nombre,schedule])=>{

      //esta iteracion cuenta cuantas horas libres al dia tiene el jugador
      const timeAviable=Object.values(schedule).reduce((prev,schedList,index)=>{
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

  function calculateFreeMatchingTime(){

    //esto genera un objeto inicial, para facilitar la programacion mas adelante al evitar verificar
    let matchingTimes=weekDays.reduce((prev,current)=>{
      prev[current]=dayHours.reduce((prev,hour)=>{
        prev[hour]=[]
        return prev
      },{})
      return prev
    },{})

    //esto recopila todas las horas libres de todos los jugadores en un enorme objeto
    Object.entries(playersSchedules).forEach(([playerName,playerSched])=>{
      weekDays.forEach((day,dayIndex)=>{

        dayHours.forEach(hour=>{
          if(!playerSched[day])
          return matchingTimes[day][hour].push(false)
          
          if(playerSched[day]===true)
          return matchingTimes[day][hour].push(false)
          
          matchingTimes[day][hour].push(playerSched[day].includes(hour))
        })
      })
    })

    let matchingSchedule={};

    //esta seccion simplifica enormemente el proceso anterior, retornando un objeto compatible con PlayerInput
    Object.entries(matchingTimes).forEach(([dayName,hoursObject])=>{
      matchingSchedule[dayName]=[];

      Object.entries(hoursObject).forEach(([hourName,matchesList])=>{

        if(matchesList.every(isFree=>!!isFree))
        matchingSchedule[dayName].push(hourName)
      })

      if(matchingSchedule[dayName].length==0)
      delete matchingSchedule[dayName]
    })

    return matchingSchedule;
  }

  setTimeout(()=>{

    const addPlayerElem=document.querySelector(`#${thisId} #adding_player`)
    const addPlayerButton=document.querySelector(`#${thisId} #players #actions #agregar`)
    const calculateButton=document.querySelector(`#${thisId} #players #actions #calcular`)

    //addingPlayer y showingCalc son banderas globales que ayudan a comprender que esta renderizado ahora mismo
    
    //se hacen funciones como las de setAdding y setShowingCalc para, ademas de cambiar las banderas
    //actualizar el DOM  (tecnicamente renderizar) segun el valor de la bandera nueva
    //ademas de que puedo llamar estas funciones en cualquier momento no solo al momento de

    function acceptHandler(playerFreeDays){
      const playerName=document.querySelector(`#${thisId} #adding_player input#player_name`).value

      if(playerName=="")
      return alert("Colocale un nombre al jugador");
      
      playersSchedules[playerName]=playerFreeDays;

      renderPlayers();
      
      setAdding(false);
    }

    function setAdding(isAdding=false){
      //para asegurar que no halla alguna confucion entre las banderas
      if(isAdding && showingCalc)setShowingCalc(false);

      addingPlayer=isAdding;
      addPlayerButton.innerHTML=isAdding?"Cancelar":"Agregar Jugador";
      addPlayerElem.innerHTML=`${
          addingPlayer&&(
            `<input type="text" id="player_name"/>${PlayerInput({onAccept:acceptHandler,onCancel:()=>setAdding(false)})}`
          )||""
        }
      `;
    }
    
    function setShowingCalc(isShowingCalc=false){
      //para asegurar que no halla alguna confucion entre las banderas
      if(isShowingCalc && addingPlayer)setAdding(false);

      showingCalc=isShowingCalc;
      calculateButton.innerHTML=isShowingCalc?"Esconder calculo":"Calcular";

      addPlayerElem.innerHTML=showingCalc&&PlayerInput({
        defaultSelecteds:calculateFreeMatchingTime(),
        onAccept:()=>setShowingCalc(false),
        onCancel:()=>setShowingCalc(false),
      })||""
      
    }

    addPlayerButton.addEventListener("click",()=>setAdding(!addingPlayer));
    calculateButton.addEventListener("click",e=>setShowingCalc(!showingCalc))
  },1);

  return `<div class="player_tracker" id="${thisId}">
    <section id="players">
      <div id="actions" class="actions">
        <button id="agregar">Agregar Jugador</button>
        <button id="calcular">Calcular</button>
      </div>
      <div id="player_list"></div>
    </section>
    <section id="adding_player"></section>
  </div>`;
}