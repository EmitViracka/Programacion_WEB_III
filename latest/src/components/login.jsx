import { useState, useEffect, useRef } from "react";
import { FaLock, FaEnvelope, FaSync } from "react-icons/fa";
import { api } from "../services/api";
import "./login.css";

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaText, setCaptchaText] = useState("");
    const [captchaSvg, setCaptchaSvg] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const captchaContainerRef = useRef(null);

    useEffect(() => { cargarCaptcha(); }, []);

    const cargarCaptcha = async () => {
        const svg = await api.getCaptcha();
        setCaptchaSvg(svg);
        if (captchaContainerRef.current) captchaContainerRef.current.innerHTML = svg;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError("");
        const result = await api.login({ email, password, captcha: captchaText });
        
        console.log("Respuesta del login:", result);
        
        if (result.token) {
            if (onLoginSuccess) onLoginSuccess(result.usuario);
        } else {
            setError(result.error || "Credenciales incorrectas");
            cargarCaptcha();
            setCaptchaText("");
        }
        setCargando(false);
    };

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit}>
                <img src="/logotipo.png" alt="Logo" className="login-logo" />
                <h1>Tienda de Ropa</h1>
                <p>Inicia sesión para continuar</p>
                {error && <div className="error-message"> {error}</div>}
                <div className="input-group"><FaEnvelope /><input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={cargando} /></div>
                <div className="input-group"><FaLock /><input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={cargando} /></div>
                <div className="captcha-section">
                    <div className="captcha-svg" ref={captchaContainerRef}></div>
                    <button type="button" className="captcha-refresh" onClick={cargarCaptcha} disabled={cargando}><FaSync /> Actualizar</button>
                </div>
                <div className="input-group"><input type="text" placeholder="Ingrese el código" value={captchaText} onChange={(e) => setCaptchaText(e.target.value)} required disabled={cargando} /></div>
                <button type="submit" className="btn-submit" disabled={cargando}>{cargando ? "Ingresando..." : "Ingresar"}</button>
            </form>
        </div>
    );
}

export default Login;