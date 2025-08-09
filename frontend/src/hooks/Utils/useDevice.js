import { useEffect, useState } from 'react'

const useDevice = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 600)
        }

        checkMobile() // Initial check
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return {
        isMobile
    }
}

export default useDevice