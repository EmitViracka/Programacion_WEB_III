//15. Proporcione un ejemplo para convertir un callback en una promesa.
// Consulte el saldo disponible en la cuenta del banco
function consultarSaldoB(id, callback) {
    setTimeout(() => {
        const cuentas = { 101: 500, 102: 1200 };
        const saldo = cuentas[id];

        if (saldo !== undefined) {
            callback(null, saldo);
        } else {
            callback("No se ha encontrado la cuenta", null);
        }
    }, 2000);
}
function consultarSaldoPromesa(id) {
    return new Promise((resolve, reject) => {
        consultarSaldoB(id, (err, saldo) => {
            if (err) {
                return reject(err);
            }
            resolve(saldo);
        });
    });
}
console.log("Buscando...");
consultarSaldoPromesa(101)
    .then(saldo => {
        console.log("Saldo disponible: $" + saldo);
    })
    .catch(error => {
        console.error(error);
    });

    consultarSaldoB(101, (err, resultado) => {
    if (err) {
        return console.error(err);
    }
    console.log("Saldo disponible: $" + resultado);
});
