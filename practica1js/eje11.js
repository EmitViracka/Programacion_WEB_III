//11. Proporcione un ejemplo concreto de encadenamiento de promesas.
const busqueda = (forma, color, lista) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let encontrado = lista.length;
            for (let i=0; i<encontrado ; i++) {
                const {forma: f, color: c} = lista[i];
                if (f === forma && c === color) {
                    encontrado = true;
                    return resolve("Encontrado");
                 }
            }
            reject("No existe");
        }, 2000);
    });
};
const formas=[
    {
        forma: "circulo",
        color: "verde"
    },
    {
        forma: "cuadrado",
        color: "azul"
    }
]
busqueda("circulo", "verde", formas)
    .then((mensaje) => console.log(mensaje))
    .catch((mensaje)=> console.log(mensaje))
    