//8. Realizar un código para ejecutar 
// una función callback después 2 segundos.
function ejecutar(callback) {
    setTimeout(callback, 2000);
}
const miCallback = () => console.log("Han pasado 2 seg");
const nomiCallback = () => console.log("Na se ha completado el tiempo");
ejecutar(miCallback);
