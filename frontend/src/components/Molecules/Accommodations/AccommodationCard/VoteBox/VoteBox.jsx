import React from 'react'

import { useState, useRef } from 'react'
import { BtnDown, BtnUp } from '../../../../../assets/svg'
import styles from './VoteBox.module.css'

const VoteBox = ({
    id,
    voteState,
    voteCount,
    voteAccom
}) => {
    const upBtnRef = useRef(null)
    const downBtnRef = useRef(null)

    const [myVote, setMyVote] = useState(voteState)
    const [prevVote, setPrevVote] = useState(voteState)
    const debounceRef = useRef(null)

    const debounceVote = (newVote) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            if (newVote !== prevVote) {
                voteAccom(id, newVote)
                setPrevVote(newVote)
            }
            debounceRef.current = null
        }, 1000) // 1 Sekunde warten
    }

    const handleUpClick = () => {
        triggerPopAnimation(upBtnRef)
        setMyVote(prev => {
            const newVote = prev === 1 ? 0 : 1
            debounceVote(newVote)
            return newVote
        })
    }

    const handleDownClick = () => {
        triggerPopAnimation(downBtnRef)
        setMyVote(prev => {
            const newVote = prev === -1 ? 0 : -1
            debounceVote(newVote)
            return newVote
        })
    }

    const triggerPopAnimation = (ref) => {
        const svg = ref.current?.querySelector('svg')
        if (!svg) {
            console.warn('No SVG found in button')
            return
        }

        svg.classList.remove('pop')
        void svg.offsetWidth
        svg.classList.add('pop')

        setTimeout(() => {
            svg.classList.remove('pop')
        }, 250)
    }

    return (
        <div className={styles.btnWrapper}>
            <button
                ref={upBtnRef}
                className={`${styles.voteBtn} ${styles.voteUp} ${myVote === 1 ? styles.active : ''}`}
                onClick={handleUpClick}
            >
                <BtnUp />
            </button>

            <span className={styles.voteCount}>{voteCount + myVote}</span>

            <button
                ref={downBtnRef}
                className={`${styles.voteBtn} ${styles.voteDown} ${myVote === -1 ? styles.active : ''}`}
                onClick={handleDownClick}
            >
                <BtnDown />
            </button>
        </div>
    )
}

export default VoteBox