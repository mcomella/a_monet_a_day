export function getCommonsUrl(filePath) {
    return `https://commons.wikimedia.org/wiki/File:${filePath}`;
}

export function getCommonsMediaViewerUrl(filePath) {
    return `${getCommonsUrl(filePath)}#/media/File:${filePath}`;
}
