// utils/passwordStrength.js
export function evaluarFortalezaPassword(password) {
    if (!password) {
        return { score: 0, level: "", message: "", color: "#ddd", criterios: [], maxScore: 5 };
    }
    
    let score = 0;
    const criterios = [];
    
    if (password.length >= 8) { score++; criterios.push("✓ 8+ caracteres"); }
    else { criterios.push("✗ Mínimo 8 caracteres"); }
    
    if (/[0-9]/.test(password)) { score++; criterios.push("✓ Contiene números"); }
    else { criterios.push("✗ Debe contener números"); }
    
    if (/[A-Z]/.test(password)) { score++; criterios.push("✓ Contiene mayúsculas"); }
    else { criterios.push("✗ Debe contener mayúsculas"); }
    
    if (/[a-z]/.test(password)) { score++; criterios.push("✓ Contiene minúsculas"); }
    else { criterios.push("✗ Debe contener minúsculas"); }
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) { score++; criterios.push("✓ Caracteres especiales"); }
    else { criterios.push("✗ Debe contener caracteres especiales"); }
    
    let level = "", message = "", color = "";
    if (score <= 2) { level = "Débil"; message = "⚠️ Contraseña débil - Mejórala"; color = "#dc3545"; }
    else if (score <= 4) { level = "Intermedia"; message = "⚠️ Contraseña intermedia - Puedes mejorarla"; color = "#ffc107"; }
    else { level = "Fuerte"; message = "✅ Contraseña fuerte - Excelente seguridad"; color = "#28a745"; }
    
    return { score, level, message, color, criterios, maxScore: 5 };
}

export function validarRequisitosPassword(password) {
    const errors = [];
    if (!password || password.length < 8) errors.push("La contraseña debe tener al menos 8 caracteres");
    if (!/[0-9]/.test(password)) errors.push("La contraseña debe contener al menos un número");
    if (!/[A-Z]/.test(password)) errors.push("La contraseña debe contener al menos una mayúscula");
    if (!/[a-z]/.test(password)) errors.push("La contraseña debe contener al menos una minúscula");
    return { isValid: errors.length === 0, errors };
}