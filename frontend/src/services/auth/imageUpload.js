import { useAuth } from '../../hooks/Auth/useAuth'

const uploadProfilePicture = async (file) => {
    const { user } = useAuth()
    if (!user) {
        console.log('User is not logged in')
        return
    }

    const filePath = `profile-pictures/${user.id}/${file.name}`

    // Datei hochladen
    const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type,
        })

    if (error) {
        console.error('Error uploading file:', error.message)
        return
    }

    console.log('File uploaded successfully:', data)

    // Profilbild-URL abrufen
    const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath)

    const publicURL = urlData.publicUrl

    if (urlError) {
        console.error('Error getting public URL:', urlError.message)
        return
    }

    console.log('Public URL for the image:', publicURL)

    // URL in der Datenbank des Benutzers speichern
    await updateUserProfileImage(publicURL)
}

const updateUserProfileImage = async (imageUrl) => {
    const { user } = useAuth()
    if (!user) {
        console.log('User is not logged in')
        return
    }

    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            profile_picture: imageUrl,
        }, { onConflict: 'id' })

    if (error) {
        console.error('Error updating user profile:', error.message)
        return
    }

    console.log('Profile updated with new image:', data)
}

const getUserProfile = async () => {
    const { user } = useAuth()
    if (!user) {
        console.log('User is not logged in')
        return
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('profile_picture')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching user profile:', error.message)
        return
    }

    console.log('Profile picture URL:', data.profile_picture)
    // Hier kannst du das Profilbild in deiner UI rendern
}