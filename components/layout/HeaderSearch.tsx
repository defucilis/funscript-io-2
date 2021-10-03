import { FaSearch } from "react-icons/fa";

const HeaderSearch = ({ className }: { className?: string }): JSX.Element => {
    return (
        <div className={className || ""}>
            <input
                type="text"
                placeholder="Search scripts..."
                className="w-full bg-neutral-700 rounded-tl-full rounded-bl-full px-4 text-white"
            />
            <button className="bg-neutral-700 rounded-tr-full rounded-br-full pr-4">
                <FaSearch className="text-neutral-500" />
            </button>
        </div>
    );
};

export default HeaderSearch;
