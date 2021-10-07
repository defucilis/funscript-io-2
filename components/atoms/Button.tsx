import { ReactNode } from "react";

const Button = ({
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
            className={`${disabled ? "fsio-btn-disabled" : "fsio-btn"} ${className || ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
