import { useState, useEffect } from "react";
import { evaluarFortalezaPassword } from "../utils/passwordStrength";
import "./passwordStrengthIndicator.css";

function PasswordStrengthIndicator({ password }) {
    const [fortaleza, setFortaleza] = useState({ score: 0, level: "", message: "", color: "", criterios: [], maxScore: 5 });

    useEffect(() => {
        setFortaleza(password ? evaluarFortalezaPassword(password) : { score: 0, level: "", message: "", color: "#ddd", criterios: [], maxScore: 5 });
    }, [password]);

    if (!password) return null;

    return (
        <div className="password-strength">
            <div className="strength-bar-container">
                <div className="strength-bar" style={{ width: `${(fortaleza.score / fortaleza.maxScore) * 100}%`, backgroundColor: fortaleza.color }} />
            </div>
            <div className="strength-info">
                <span className="strength-level" style={{ color: fortaleza.color }}>{fortaleza.level}</span>
                <span className="strength-message">{fortaleza.message}</span>
            </div>
            <div className="strength-criterios">
                <small>Requisitos:</small>
                <ul>
                    {fortaleza.criterios.map((c, i) => <li key={i} className={c.includes("✓") ? "cumple" : "incumple"}>{c}</li>)}
                </ul>
            </div>
        </div>
    );
}

export default PasswordStrengthIndicator;