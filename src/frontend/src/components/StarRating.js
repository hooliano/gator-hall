import { useState } from 'react';

const STAR_PATH = 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21Z';

function StarShape({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d={STAR_PATH} />
        </svg>
    );
}

// A single star "slot": a gray outline star with an orange overlay clipped
// to `fillRatio` (0-1) width. When interactive, two invisible half-width
// buttons sit on top so a click on the left/right half reports a half-star
// or whole-star value, matching the backend's 0.5-increment rating rule.
function StarSlot({ index, fillRatio, size, interactive, onPick, onHover }) {
    return (
        <span className={`relative inline-block ${size}`} style={{ lineHeight: 0 }}>
            <StarShape className="absolute inset-0 text-slate-300" />
            <span className="absolute inset-0 overflow-hidden text-ufOrange" style={{ width: `${fillRatio * 100}%` }}>
                <StarShape className="absolute inset-0" />
            </span>
            {interactive && (
                <>
                    <button
                        type="button"
                        aria-label={`Rate ${index + 0.5} out of 5`}
                        className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                        onMouseEnter={() => onHover(index + 0.5)}
                        onClick={() => onPick(index + 0.5)}
                    />
                    <button
                        type="button"
                        aria-label={`Rate ${index + 1} out of 5`}
                        className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
                        onMouseEnter={() => onHover(index + 1)}
                        onClick={() => onPick(index + 1)}
                    />
                </>
            )}
        </span>
    );
}

// Two modes:
//  - read-only display: pass `value` (any float 0-5), renders a continuous fill.
//  - interactive picker: pass `value` + `onChange`, click zones snap to 0.5 increments.
function StarRating({ value, onChange, size = 'h-5 w-5', showValue = false, reviewCount }) {
    const [hover, setHover] = useState(null);
    const interactive = typeof onChange === 'function';
    const display = interactive && hover !== null ? hover : (value || 0);

    return (
        <div className="inline-flex items-center gap-2">
            <span className="inline-flex" onMouseLeave={() => interactive && setHover(null)}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <StarSlot
                        key={i}
                        index={i}
                        size={size}
                        fillRatio={Math.max(0, Math.min(1, display - i))}
                        interactive={interactive}
                        onPick={onChange}
                        onHover={setHover}
                    />
                ))}
            </span>
            {showValue && (
                <span className="text-sm font-semibold text-slate-600">
                    {value != null ? value.toFixed(1) : '—'}
                    {reviewCount !== undefined && (
                        <span className="font-normal text-slate-400"> ({reviewCount})</span>
                    )}
                </span>
            )}
        </div>
    );
}

export default StarRating;
