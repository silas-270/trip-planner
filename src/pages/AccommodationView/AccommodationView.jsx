import { useState } from 'react';
import { useToast } from '../../services/context/ToastContext';
import useAccommodations from '../../hooks/useAccommodations'

import PopupForm from '../../components/Templates/PopupForm/PopupForm'
import SectionHeading from '../../components/Molecules/Accommodations/SectionHeading/SectionHeading'
import AccommodationContainer from '../../components/Organisms/Accommodations/AccommodationContainer/AccommodationContainer'
import AccommodationPopup from '../../components/Molecules/Accommodations/AccommodationPopup/AccommodationPopup'
import TextButton from '../../components/Atoms/Buttons/TextButton'

import styles from './AccommodationView.module.css'

const AccommodationView = () => {
    const { accoms, workspaceMeta, addAccom } = useAccommodations();
    const [showPopup, setShowPopup] = useState(false)

    const [createMethod, setCreateMethod] = useState('raw')
    const [scraperUrl, setScraperUrl] = useState('')
    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [price, setPrice] = useState('')
    const [rating, setRating] = useState('')

    const { addToast } = useToast();

    const handleAddAccom = async () => {
        let cardData
        let errorMessage
        switch (createMethod) {
            case 'raw':
                errorMessage = validateRawInput(name, location, price, rating)
                if (errorMessage) {
                    addToast('error', errorMessage)
                    return
                }
                cardData = { name, price, location, rating }
                break
            case 'scraperBooking':
                errorMessage = validateUrlInput(scraperUrl)
                if (errorMessage) {
                    addToast('error', errorMessage)
                    return
                }
                validateUrlInput(scraperUrl)
                cardData = { url: scraperUrl }
                break
            default:
                addToast('error', 'Unzulässiger Modus')
                return
        }
        await addAccom(createMethod, cardData)
        addToast('error', 'neuer Eintrag erstellt')
        close()
    }

    const close = () => {
        setCreateMethod('raw')
        setScraperUrl('')
        setName('')
        setPrice('')
        setLocation('')
        setRating('')
        setShowPopup(false)
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <SectionHeading
                setShowPopup={setShowPopup}
                workspaceMeta={workspaceMeta}
            />
            <div className='divider' />
            <AccommodationContainer
                accommodations={accoms}
            />
            {showPopup &&
                <PopupForm onClose={() => close(true)}>
                    <AccommodationPopup
                        createMethod={createMethod}
                        setCreateMethod={setCreateMethod}
                        scraperUrl={scraperUrl}
                        setScraperUrl={setScraperUrl}
                        name={name}
                        setName={setName}
                        price={price}
                        setPrice={setPrice}
                        location={location}
                        setLocation={setLocation}
                        rating={rating}
                        setRating={setRating}
                    />
                    <div className={styles.buttonBar}>
                        <TextButton
                            desktopLabel='Speichern'
                            onClick={handleAddAccom}
                        />
                        <TextButton
                            desktopLabel='Abbrechen'
                            onClick={() => close(true)}
                        />
                    </div>
                </PopupForm>
            }
        </div>
    )
}

export default AccommodationView

const validateRawInput = (name, location, price, rating) => {
    if (!name.trim()) return "Gib einen Namen ein"
    if (!location.trim()) return "Gib einen Ort ein"
    if (!price.trim()) return "Gib einen Preis ein"
    if (!rating.trim()) return "Gib eine Bewertung ein"
    return null;
}

const validateUrlInput = (scraperUrl) => {
    if (!scraperUrl.trim()) return "Gib einen passenden Namen ein"
    return null;
}