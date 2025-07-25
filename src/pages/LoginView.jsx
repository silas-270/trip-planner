import React from 'react';

import { useState, useEffect } from 'react';
import { login, signup, googleSignin } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import styles from './LoginView.module.css'
import { motion, AnimatePresence } from "framer-motion";
import { IconGoogle } from '../assets/svg';

export function LoginView() {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email.trim()) {
            alert("Bitte geben Sie Ihre Email ein.");
            return;
        }
        if (!password.trim()) {
            alert("Bitte geben Sie Ihr Passwort ein.");
            return;
        }
        if (!isLoginMode && !verifyPassword.trim()) {
            alert("Bitte bestätigen Sie Ihr Passwort.");
            return;
        }
        if (!isLoginMode && password !== verifyPassword) {
            alert("Passwörter stimmen nicht überein.");
            return;
        }
        try {
            if (isLoginMode) {
                await login(email, password);
                navigate('/');
            } else {
                await signup(email, password);
                navigate('/');
            }
        } catch (err) {
            alert(err.message);
        }
    }
    const [isLoading, setIsLoading] = useState(false);
    const [dots, setDots] = useState('');

    useEffect(() => {
        let interval;
        if (isLoading) {
            interval = setInterval(() => {
                setDots(prev => (prev.length < 3 ? prev + '.' : ''));
            }, 200); // Geschwindigkeit der Animation
        } else {
            setDots('');
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await handleLogin(); // externe Login-Funktion
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await googleSignin();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className={styles.loginForm}>
            <div className={styles.description}>
                {isLoginMode ? "Welcome back!" : "Let's get started"}
            </div>
            <div className={styles.floatingInputContainer}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label className={email ? `${styles.active}` : ""}>Ihre E-Mail</label>
            </div>
            <div className={styles.floatingInputContainer}>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label className={password ? styles.active : ""}>Ihr Passwort</label>

                <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                >
                    {showPassword ? "🙈" : "👁️"}
                </button>
            </div>
            <AnimatePresence>
                {isLoginMode && (
                    <motion.div
                        className={styles.forgotPassword}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div>Forgot Password?</div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {!isLoginMode && (
                    <motion.div
                        className={styles.floatingInputContainer}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <input
                            type={showVerifyPassword ? "text" : "password"}
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                            required
                        />
                        <label className={verifyPassword ? styles.active : ""}>Passwort kontrollieren</label>

                        {/* Toggle-Button */}
                        <button
                            type="button"
                            className={styles.toggleButton}
                            onClick={() => setShowVerifyPassword((prev) => !prev)}
                            aria-label={showVerifyPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                        >
                            {showVerifyPassword ? "🙈" : "👁️"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button className={styles.googleSignContainer} onClick={handleGoogleLogin}>
                <div className={styles.googleSignWrapper}>
                    <IconGoogle />
                    <div>Login with Google</div>
                </div>
            </button>

            <button className={styles.loginBtn} onClick={handleClick} disabled={isLoading}>
                <span>
                    {isLoading
                        ? `${isLoginMode ? 'Login' : 'Sign Up'}${dots}`
                        : isLoginMode ? 'Login' : 'Sign Up'}
                </span>
            </button>
            <div className={styles.switchModeText}>
                {isLoginMode ? (
                    <>
                        Don't have an account?{" "}
                        <span
                            className={styles.switchLink}
                            onClick={() => setIsLoginMode(false)}
                        >
                            Sign Up
                        </span>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <span
                            className={styles.switchLink}
                            onClick={() => setIsLoginMode(true)}
                        >
                            Sign In
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}