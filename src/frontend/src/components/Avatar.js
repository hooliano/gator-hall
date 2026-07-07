// Excludes ufBlue: several cards (Profile header, dorm banners) already use a
// ufBlue gradient background, and an avatar in that same blue would nearly
// disappear against it.
const PALETTE = ['bg-ufOrange', 'bg-emerald-600', 'bg-violet-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-fuchsia-600'];

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function initials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
}

function Avatar({ name, size = 'h-10 w-10', className = '' }) {
    const color = PALETTE[hashString(name || '') % PALETTE.length];
    return (
        <span className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full ${color} text-sm font-semibold text-white ${className}`}>
            {initials(name)}
        </span>
    );
}

export default Avatar;
