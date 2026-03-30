//3. Crear una función que reciba un arreglo de números 
// y devuelvaen un objeto a los pares e impares:
function miFuncion(arreglo){
    let obj = { pares:[], impares:[]};
    let cpares = 0
    let cimpares = 0
    for(let i = 0; i < arreglo.length; i++){
        if(arreglo[i] % 2 === 0){
            obj.pares[cpares]=arreglo[i];
            cpares++
        }else {
            obj.impares[cimpares]=arreglo[i];
            cimpares++
        }
    }
    return obj;
}
let obj = miFuncion([1,2,3,4,5])
console.log(obj) 
