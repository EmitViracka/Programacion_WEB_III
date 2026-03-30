//14. Proporcione un ejemplo para convertir una promesa en un callback.
// Verificar el id de un usuario
const verificarPermisoPromesa = (usuarioId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const usuariosAutorizados = [101, 102, 105];
            
            if (usuariosAutorizados.includes(usuarioId)) {
                resolve("Acceso Concedido");
            } else {
                reject("Acceso Denegado");
            }
        }, 2000);
    });
};
function loginSistemaAntiguo(id, callback) {
    verificarPermisoPromesa(id)
        .then((respuesta) => {
            callback(null, respuesta);
        })
        .catch((error) => {
            callback(error, null);
        });
}
console.log("Verificando...");
loginSistemaAntiguo(101, (err, resultado) => {
    if (err) {
        console.error("Alerta", err);
        return;
    }
    console.log("Estado:", resultado);
});
