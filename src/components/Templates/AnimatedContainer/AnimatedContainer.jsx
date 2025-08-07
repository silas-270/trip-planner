import React from 'react'

import { motion, AnimatePresence } from "framer-motion"
import styles from './AnimatedContainer.module.css'

const AnimatedContainer = ({
    condition,
    className,
    children
}) => (
    <AnimatePresence>
        {condition && (
            <motion.div
                className={`${styles.animatedContainer} ${className}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.div>
        )}
    </AnimatePresence>
);

export default AnimatedContainer;