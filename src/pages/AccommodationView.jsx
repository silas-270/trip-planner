import { useAccommodations } from '../hooks/useAccommodations'
import { Accommodations } from '../components/accommodation/Accommodations'
import { logout } from '../services/auth';

export function AccommodationView() {
    const { accoms, addAccom, deleteAccom, vote } = useAccommodations();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <button onClick={handleLogout}>Logout</button>
            <Accommodations
                accommodations={accoms}
                onAddAccommodation={addAccom}
                onDeleteAccommodation={deleteAccom}
                onVote={vote}
            />
        </div>
    );
}