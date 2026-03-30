//16. Proporcione un ejemplo para migrar una función con promesas a async/await.
//Envio de paquetes
const procesarEnvio = (paquete) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (paquete) resolve(`Paquete enviado ${paquete}`);
            else reject("No se ha realizado el envio");
        }, 2000);
    });
};
async function gestionarLogistica() {
    try {
        console.log("Enviando...");
        const mensaje = await procesarEnvio("Celular");
        
        console.log(mensaje);
        console.log("Finalizado");

    } catch (error) {
        console.error("No se ha realizado el envio", error);
    }
}
gestionarLogistica();

/*console.log("Iniciando envío...");
procesarEnvio("Laptop")
    .then((mensaje) => {
        console.log(mensaje);
        console.log("Finalizado");
    })
    .catch((error) => {
        console.error(error);
    });*/

