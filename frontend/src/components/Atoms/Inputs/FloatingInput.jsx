import React from 'react'

import { useState } from 'react'
import styles from './FloatingInput.module.css'

const FloatingInput = ({
    label,
    type,
    value,
    onChange
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = type === 'password' && showPassword ? 'text' : type

    return (
        <div className={styles.floatingInputContainer}>
            <input
                type={inputType}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <label
                className={value ? `${styles.active}` : ''}
            >
                {label}
            </label>
            {(type === 'password') && (
                <button
                    type='button'
                    className={styles.toggleButton}
                    onClick={() => setShowPassword(prev => !prev)}
                >
                    {showPassword ? '🙈' : '👁️'}
                </button>
            )}
        </div>
    )
}

export default FloatingInput