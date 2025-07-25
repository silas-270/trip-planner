import React from 'react';

import { LogoutButton } from "./uielements";
import styles from './Header.module.css'

export default function Header() {
    return (
        <div className={styles.header}>
            <LogoutButton />
        </div>
    );
}