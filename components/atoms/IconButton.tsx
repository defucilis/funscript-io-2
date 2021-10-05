import { ReactNode } from "react";

const IconButton = ({
    className,
    children,
    onClick,
    disabled,
}: {
    className?: string;
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
}): JSX.Element => {
    return (
        <button
            disabled={disabled}
            className={`fsio-btn-icon ${className || ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default IconButton;
