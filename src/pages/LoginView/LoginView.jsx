import { useState, useEffect } from 'react'
import { useToast } from '../../services/context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { login, signup } from '../../services/auth/auth';

import FloatingInput from '../../components/Atoms/Inputs/FloatingInput'
import AnimatedContainer from '../../components/Templates/AnimatedContainer/AnimatedContainer'

import styles from './LoginView.module.css'

const LoginView = () => {
    const navigate = useNavigate()
    const { addToast } = useToast();

    // Login or Signup + Animation
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [isLoading, setIsLoading] = useState(false);
    const [dots, setDots] = useState('');

    // Entry Fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [verifyPassword, setVerifyPassword] = useState('')

    // Get Action Texts
    const getActionText = () => {
        return isLoginMode
            ? { main: 'Login', switch: 'Sign Up', text: "Don't have an account?" }
            : { main: 'Sign Up', switch: 'Sign In', text: "Already have an account?" };
    };
    const { main, switch: switchAction, text } = getActionText();

    // Check Login Data
    const handleLogin = async () => {
        const errorMessage = validateInputs(email, password, verifyPassword, isLoginMode)
        if (errorMessage) {
            addToast('error', errorMessage)
            return
        }
        try {
            if (isLoginMode) await login(email, password)
            else await signup(email, password)
            navigate('/')
        } catch (err) {
            console.log('Failed to login', err.message)
        }
    }

    // Login Animation
    useEffect(() => {
        let interval;
        if (isLoading) {
            interval = setInterval(() => {
                setDots(prev => (prev.length < 3 ? prev + '.' : ''));
            }, 200);
        } else {
            setDots('');
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <div className={styles.loginForm}>
            <div className={styles.description}>
                {isLoginMode ? "Welcome back!" : "Let's get started"}
            </div>

            <FloatingInput
                label='Ihre E-Mail'
                type='email'
                value={email}
                onChange={setEmail}
            />

            <FloatingInput
                label='Ihr Password'
                type='password'
                value={password}
                onChange={setPassword}
            />

            <AnimatedContainer condition={isLoginMode} className={styles.forgotPassword}>
                <div>Forgot Password?</div>
            </AnimatedContainer>

            <AnimatedContainer condition={!isLoginMode}>
                <FloatingInput
                    label='Passwort kontrollieren'
                    type='password'
                    value={verifyPassword}
                    onChange={setVerifyPassword}
                />
            </AnimatedContainer>

            <button className={styles.loginBtn} onClick={handleLogin} disabled={isLoading}>
                <span>{isLoading ? `${main}${dots}` : main}</span>
            </button>

            <div className={styles.switchModeText}>
                {text}{" "}
                <span className={styles.switchLink} onClick={() => setIsLoginMode(!isLoginMode)}>
                    {switchAction}
                </span>
            </div>
        </div>
    )
}

export default LoginView;

const validateInputs = (email, password, verifyPassword, isLoginMode) => {
    if (!email.trim()) return "Bitte geben Sie Ihre Email ein.";
    if (!password.trim()) return "Bitte geben Sie Ihr Passwort ein.";
    if (!isLoginMode && !verifyPassword.trim()) return "Bitte bestätigen Sie Ihr Passwort.";
    if (!isLoginMode && password !== verifyPassword) return "Passwörter stimmen nicht überein.";
    return null;
};