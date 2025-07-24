import React from 'react';

import { useAccommodations } from '../hooks/useAccommodations'
import { Accommodations } from '../components/accommodation/Accommodations'
import Header from '../components/uielements/header';

export function AccommodationView() {
    const { accoms, workspaceMeta, addAccom, deleteAccom, vote } = useAccommodations();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Header />
            <Accommodations
                accommodations={accoms}
                wsMeta={workspaceMeta}
                onAddAccommodation={addAccom}
                onDeleteAccommodation={deleteAccom}
                onVote={vote}
            />
        </div>
    );
}