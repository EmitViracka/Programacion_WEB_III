//Crear una función que cuente cuántas veces aparece cada 
// vocal en un texto y devuelva el resultado en un objeto.
function miFuncion(texto){
    let vocales ={a: 0, e: 0, i: 0, o: 0, u: 0};
    for(let i = 0; i< texto.length; i++){
        let vocalactual = texto[i];
        if(vocalactual === 'a'){
            vocales.a++;
        }else if(vocalactual === 'e'){
            vocales.e++;
        }else if(vocalactual === 'i'){
            vocales.i++;
        }else if(vocalactual === 'o'){
            vocales.o++;
        }else if(vocalactual === 'u'){
            vocales.u++;
        }
    }
    return vocales;
}
let obj = miFuncion("euforia")
console.log(obj)
