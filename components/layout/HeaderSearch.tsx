import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const HeaderSearch = ({ className }: { className?: string }): JSX.Element => {
    const [focus, setFocus] = useState(false);

    return (
        <div className={className || ""}>
            <input
                type="text"
                placeholder="Search scripts... (coming soon!)"
                className="w-full bg-neutral-700 rounded-tl-full rounded-bl-full px-4 text-white focus:outline-none focus:bg-neutral-900"
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
            />
            <button
                className={`rounded-tr-full rounded-br-full pr-4 ${
                    focus ? "bg-neutral-900" : "bg-neutral-700"
                }`}
            >
                <FaSearch className="text-neutral-500" />
            </button>
        </div>
    );
};

export default HeaderSearch;
