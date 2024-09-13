export function slugify(text: string): string {
    const turkishChars: { [key: string]: string } = {
        'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
        'İ': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C'
    };

    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, (char) => turkishChars[char] || '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}