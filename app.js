const weekDays=[
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
]

function PlayerInput(){

  const thisId="PlayerInput_"+Math.floor(Math.random()*1000)

  //after render set click event
  setTimeout(()=>{

    let clickHolding=false;
    let isRemoving=false;

    //select all hour boxes
    document.querySelectorAll("#"+thisId+" #hourbox").forEach(hourbox=>{
      
      function setSelected(val){
        if(typeof val != "boolean")
        return

        hourbox.setAttribute("selected",val?"t":"f")
      }

      hourbox.addEventListener("mousedown",(e)=>{
        console.log("down")
        clickHolding=true;
        const clickedAlreadySelected=hourbox.getAttribute("selected")=="t"
        
        isRemoving=clickedAlreadySelected;
        setSelected(!isRemoving)
      })
      hourbox.addEventListener("mouseup",(e)=>{
        clickHolding=false;
      })

      hourbox.addEventListener("mouseenter",(e)=>{
        if(clickHolding)setSelected(!isRemoving)
      })

    })
  },1)

  function DaysRow(hour){
    return Array(7)
    .fill("")
    .map((_,ind)=>`<div 
      id="hourbox"
      class="hourbox" 
      weekday="${ind}" 
      hour="${hour}"
    >
      <b>${hour}</b>
    </div>`)
    .join("")
  }

  return `<div id="${thisId}" class="player_schedule_input nohl">
    ${weekDays.map((day)=>`<h2 class="daybox">${day}</h2>`).join("")}
    ${
      Array(12).fill("").map((_,ind)=>DaysRow((ind+1)+" AM")).join("")+
      Array(12).fill("").map((_,ind)=>DaysRow((ind+1)+" PM")).join("")
    }
  </div>
  `
}

document.getElementById("root").innerHTML=PlayerInput()+PlayerInput();