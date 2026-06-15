// src/components/Modals/RegistroModal.jsx
import React, { useState } from 'react'
import './Modal.css'

const RegistroModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  })
  const [passwordStrength, setPasswordStrength] = useState({
    level: '', // '', 'weak', 'medium', 'strong'
    message: '',
    color: ''
  })
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  if (!show) return null

  // Función para validar la contraseña
  const validatePassword = (password) => {
    let strength = {
      level: '',
      message: '',
      color: '',
      score: 0
    }

    // Criterios de validación
    const hasLowerCase = /[a-z]/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8
    const isVeryLong = password.length >= 12

    // Calcular puntuación
    let score = 0
    if (hasLowerCase) score++
    if (hasUpperCase) score++
    if (hasNumbers) score++
    if (hasSpecialChars) score++
    if (isLongEnough) score++
    if (isVeryLong) score++

    // Determinar nivel de seguridad
    if (password.length === 0) {
      strength.level = ''
      strength.message = ''
      strength.color = ''
    } else if (password.length < 6) {
      strength.level = 'weak'
      strength.message = '❌ Muy corta - Mínimo 6 caracteres'
      strength.color = '#dc3545'
    } else if (score <= 2) {
      strength.level = 'weak'
      strength.message = '🔴 Débil - Usa mayúsculas, números o caracteres especiales'
      strength.color = '#dc3545'
    } else if (score === 3 || score === 4) {
      strength.level = 'medium'
      strength.message = '🟡 Media - Aún puedes mejorarla'
      strength.color = '#ffc107'
    } else if (score >= 5) {
      strength.level = 'strong'
      strength.message = '🟢 Fuerte - Excelente contraseña'
      strength.color = '#28a745'
    }

    return strength
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Validar contraseña en tiempo real
    if (name === 'password') {
      const strength = validatePassword(value)
      setPasswordStrength(strength)
    }

    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres'
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido (ejemplo@correo.com)'
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    } else if (passwordStrength.level === 'weak') {
      newErrors.password = 'La contraseña es muy débil. Usa mayúsculas, números o caracteres especiales'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Registro exitoso:', formData)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        // Resetear formulario
        setFormData({ nombre: '', email: '', password: '' })
        setPasswordStrength({ level: '', message: '', color: '' })
        onClose()
      }, 2000)
    }
  }

  // Función para obtener la barra de fortaleza
  const renderStrengthBar = () => {
    if (!passwordStrength.level) return null

    const getWidth = () => {
      switch(passwordStrength.level) {
        case 'weak': return '33%'
        case 'medium': return '66%'
        case 'strong': return '100%'
        default: return '0%'
      }
    }

    const getBackgroundColor = () => {
      switch(passwordStrength.level) {
        case 'weak': return '#dc3545'
        case 'medium': return '#ffc107'
        case 'strong': return '#28a745'
        default: return '#e0e0e0'
      }
    }

    return (
      <div className="password-strength-container">
        <div className="password-strength-bar">
          <div 
            className={`strength-bar-fill ${passwordStrength.level}`}
            style={{
              width: getWidth(),
              backgroundColor: getBackgroundColor(),
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        <p className="password-strength-message" style={{ color: passwordStrength.color }}>
          {passwordStrength.message}
        </p>
      </div>
    )
  }

  // Requisitos de la contraseña
  const renderPasswordRequirements = () => {
    const requirements = [
      { text: 'Mínimo 6 caracteres', met: formData.password.length >= 6 },
      { text: 'Al menos una letra minúscula', met: /[a-z]/.test(formData.password) },
      { text: 'Al menos una letra mayúscula', met: /[A-Z]/.test(formData.password) },
      { text: 'Al menos un número', met: /\d/.test(formData.password) },
      { text: 'Al menos un carácter especial (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
    ]

    return (
      <div className="password-requirements">
        <p className="requirements-title">Requisitos de seguridad:</p>
        <ul>
          {requirements.map((req, index) => (
            <li key={index} className={req.met ? 'met' : 'unmet'}>
              {req.met ? '✓' : '○'} {req.text}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>REGISTRATE</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {success && (
            <div className="alert-success">
              ✓ ¡Registro exitoso!
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? 'error' : ''}
                placeholder="Ej: María González"
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="ejemplo@correo.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Crea una contraseña segura"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
              
              {/* Barra de fortaleza */}
              {renderStrengthBar()}
              
              {/* Requisitos de contraseña */}
              {formData.password && renderPasswordRequirements()}
            </div>
            
            <button type="submit" className="btn-submit">
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegistroModal