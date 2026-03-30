//2. Crear una función que invierta 
// el orden de las palabras en una frase.
function miFuncion(frase){
    let cadena = "";
    for(let i = frase.length - 1; i >= 0; i--){
        cadena += frase[i];
    }
    return cadena;
}
let cad = miFuncion('abcd')
console.log(cad)
