const weekDays=[
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
]

var elementCount_PlayerInput=0;

function PlayerInput(props={
  onAccept:()=>{},
  onCancel:()=>{},
  defaultSelecteds:{
    Lunes:[],
    Martes:[],
    Miercoles:[],
    Jueves:[],
    Lunes:[],
    Viernes:[],
    Sabado:[],
    Domingo:[],
  }
}){

  const {onAccept,onCancel,defaultSelecteds} = props

  const thisId="PlayerInput_"+elementCount_PlayerInput;
  elementCount_PlayerInput++;

  //despues de colocarse este texto, declarar los eventos
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

    //funcion que recopila todos los datos y los devuelve en un objeto
    function gatherData(){
      let toReturn={}

      weekDays.forEach((dayName,dayIndex)=>{

        //al final de todo esto, quedata una lista con el texto de la hora
        const selectedHoursOfThisDay=Array.from(document
        .querySelectorAll(`#${thisId} #hourbox[weekday="${dayIndex}"][selected="t"]`))
        .map((selectedHour)=>selectedHour.getAttribute("hour"))
        
        if(selectedHoursOfThisDay.length==0)
        return

        if(selectedHoursOfThisDay.length==24)
        return toReturn[dayName]=true;

        toReturn[dayName]=selectedHoursOfThisDay;
      })

      return toReturn
    }

    //el boton aceptar envia un json a travez de la funcion onAccept
    document.querySelector(`#${thisId} #aceptar`).addEventListener("click",()=>{
      onAccept(gatherData())
    })
    
    //lo mismo que aceptar, pero en cancelar
    document.querySelector(`#${thisId} #cancelar`).addEventListener("click",()=>{
      onCancel(gatherData())
    })

  },1)

  //este elemento genera 7 recuadros de hora, uno por cada dia
  function DaysRow(hour){

    return Array(7)
    .fill("")
    .map((_,weekDayIndex)=>{

      let isSelected=false;
    
      if(defaultSelecteds){
        if(defaultSelecteds[weekDays[weekDayIndex]]===true)
        isSelected=true;

        if(
          Array.isArray(defaultSelecteds[weekDays[weekDayIndex]])&&
          defaultSelecteds[weekDays[weekDayIndex]].includes(hour)
        )
        isSelected=true;
      }

      return `<div 
        id="hourbox"
        class="hourbox" 
        weekday="${weekDayIndex}" 
        hour="${hour}"
        ${isSelected&&`selected="t"`||""}
      >
        <b>${hour}</b>
      </div>`
    })
    .join("")
  }

  function TwelveHoursSet(amOrPM="AM"){
    return Array(12).fill("")
    .map((_,ind)=>DaysRow((ind+1)+" "+amOrPM))
    .join("")
  }

  return `<div id="${thisId}" class="player_schedule_input nohl">
    ${weekDays.map((day,ind)=>`<h2 id="daybox" day="${ind}" class="daybox">${day}</h2>`).join("")}
    ${
      TwelveHoursSet("AM")+
      TwelveHoursSet("PM")
    }
    <input id="aceptar" type="button" value="Aceptar"/>
    <input id="cancelar" type="button" value="Cancelar"/>
  </div>
  `
}