const weekDays=[
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
]

function PlayerInput(events={onAccept:()=>{},onCancel:()=>{}}){

  const {onAccept,onCancel} = events

  const thisId="PlayerInput_"+Math.floor(Math.random()*1000)

  //after render set click event
  setTimeout(()=>{

    //estas 2 variables se usaran mas tarde para la seleccion por arrastre
    let clickHolding=false;
    let isRemoving=false;

    //seleccionar todos los recuadros de hora
    document.querySelectorAll("#"+thisId+" #hourbox").forEach(hourbox=>{
      
      //funcion para simplificar la accion de cambiar el valor de seleccionado
      function setSelected(val){
        if(typeof val != "boolean")
        return

        hourbox.setAttribute("selected",val?"t":"f")
      }

      //la siguiente seccion de codigo permite una seleccion de las horas manteniendo y arrastrando el mouse

      //al comenzar a mantener el mouse
      hourbox.addEventListener("mousedown",(e)=>{
        //se cambia este valor a true para que se reconosca al pasar el mouse por encima de un recuadro
        clickHolding=true;

        //si se hace click sobre un recuadro ya seleccionado, pasara a modo deseleccionar por arrastre
        const clickedAlreadySelected=hourbox.getAttribute("selected")=="t"
        
        isRemoving=clickedAlreadySelected;
        setSelected(!isRemoving)
      })
      
      // al pasar el mouse sobre un recuadro de hora
      hourbox.addEventListener("mouseenter",(e)=>{
        if(clickHolding)setSelected(!isRemoving)
      })

      //al levantar el mouse
      hourbox.addEventListener("mouseup",(e)=>{
        clickHolding=false;
      })

    })

    //se selecciona toda la ventana y se hace que al dejar el mouse ()=>clickHolding=false
    //esto se hace para que al sacar el mouse de la vista de horas, si se levanta el click pero no fue sobre
    //ningun recuadro de hora, evitar el bug de que se siga interpretando que el click sigue presionado
    document.querySelector("#"+thisId).addEventListener("mouseleave",()=>clickHolding=false)

    //al clickar el titulo de un dia, selecciona o deselecciona todas las entradas
    document.querySelectorAll("#"+thisId+" #daybox").forEach((daybox)=>{
      const dayIndex=daybox.getAttribute("day")

      const thisDaysHours=Array.from(document.querySelectorAll(`#${thisId} #hourbox[weekday="${dayIndex}"]`))

      daybox.addEventListener("click",(e)=>{
        const areAllSelected=thisDaysHours.every((hour)=>hour.getAttribute("selected")=="t")

        //si todas estan seleccionadas, todas se pasan a deselecionadas, de lo contrario se seleccionan todas
        thisDaysHours.forEach((hour)=>hour.setAttribute("selected",!areAllSelected&&"t"||"f"))
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
    ${weekDays.map((day,ind)=>`<h2 id="daybox" day="${ind}" class="daybox">${day}</h2>`).join("")}
    ${
      Array(12).fill("").map((_,ind)=>DaysRow((ind+1)+" AM")).join("")+
      Array(12).fill("").map((_,ind)=>DaysRow((ind+1)+" PM")).join("")
    }
    <input type="button" value="Aceptar"/>
    <input type="button" value="Cancelar"/>
  </div>
  `
}