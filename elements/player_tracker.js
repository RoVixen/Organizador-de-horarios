var elementCount_PlayerTracker=0;

function PlayerTracker(props={}){

  const thisId="PlayerTracker_"+elementCount_PlayerTracker;
  elementCount_PlayerTracker++;

  setTimeout(()=>{

  },1);

  return `<div class="player_tracker">
    <section id="actions">
      <button>Agregar Jugador</button>
    </section>
  </div>`;
}