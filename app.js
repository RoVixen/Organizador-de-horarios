



document.getElementById("root").innerHTML=PlayerInput({
  onAccept:(data)=>{
    console.log(data)
  },
  defaultSelecteds:{
    Lunes:[
      "1 AM",
      "5 AM",
      "6 AM"
    ],
    Martes:[
      "1 AM",
      "5 AM",
      "6 AM",
      "7 AM",
      "8 AM",
      "9 AM",
      "10 AM",
      "11 AM",
      "12 AM",
    ],
    Miercoles:true,
  }
});