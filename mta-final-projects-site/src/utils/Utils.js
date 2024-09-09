// Convert Wix image URL to standard HTTPS URL
export const convertWixImageUrl = (url) => {
    if (url && url.startsWith('wix:image://')) {
        const wixUrl = url.replace('wix:image://v1/', '');
        const parts = wixUrl.split('~');
        if (parts.length > 1) {
            const imageUrl = parts[0];
            const imageNameAndSuffix = parts[1].split('/');
            if (imageNameAndSuffix.length > 1) {
                const suffix = imageNameAndSuffix[0].split('.')[1]; // Extract the file extension
                return `https://static.wixstatic.com/media/${imageUrl}~mv2.${suffix}`;
            }
        }
    }
    return url || 'https://via.placeholder.com/150'; // Placeholder URL in case of error
};