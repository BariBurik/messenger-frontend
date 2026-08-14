export function getMediaUrl(path?: string | null): string {
    if (!path) {
        return '';
    }

    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('blob:') ||
        path.startsWith('data:')
    ) {
        return path;
    }

    const backendUrl = __BACKEND_URL__.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');

    if (cleanPath.startsWith('media/')) {
        return `${backendUrl}/${cleanPath}`;
    }

    return `${backendUrl}/media/${cleanPath}`;
}