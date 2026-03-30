//5. Crear una función que determine si una cadena 
//es palíndromo (se lee igual al derecho y al revés).
function miFuncion(cadena){
    let band = cadena.length;
    for (let i = 0 ; i < band / 2; i++){
        if (cadena[i] !== cadena[band-1-i]){
            return false;
        }
    }
    return true;
}
let band1 = miFuncion('oruro')
console.log(band1) 
let band2 = miFuncion('hola')
console.log(band2) 
