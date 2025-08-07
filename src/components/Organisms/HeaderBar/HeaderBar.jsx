import React from 'react'

import { useNavigate } from 'react-router-dom'
import { logout } from '../../../services/auth/auth'
import TextButton from '../../Atoms/Buttons/TextButton'
import styles from './HeaderBar.module.css'

const HeaderBar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className={`${styles.HeaderBar} glassmorphic`}>
            <TextButton
                desktopLabel={'Logout'}
                onClick={handleLogout}
            />
        </div>
    )
}

export default HeaderBar