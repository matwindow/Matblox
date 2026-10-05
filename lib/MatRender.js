//MatRenderer (for 3D games in browser that use html) 0.0.0.1

//IMPORTANT!
//Copyright By Matwindow, please give credits if u wanna use this, u can add into the README.md this or else u get copyright striked:
//##### MatRenderer.js by ***Matwindow***

//==================!!!!WARNING!!!!=================
//this project (Might) be buggy, and is still in development

//================**How To Use**====================
//This libary shows the functions under MatR.function()
//To import it into your project, use:
//import * as MatR from ./lib/MatRender.js
//make shure its in the same dir wheres your project, and make shure its in the lib/ directrtory
//and that in your html file theres a canvas. that has the id of webgl2

export const canvas = document.getElementById('webgl2');
export const gl = canvas.getContext('webgl2');
if (!gl){
alert("Your Browser Is Not Suporting WEBGL! Please Use An Other Browser")
}
console.log(gl)
