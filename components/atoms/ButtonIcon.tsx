import { ReactNode } from "react";

const ButtonIcon = ({
    className,
    style,
    children,
    onClick,
    disabled,
}: {
    className?: string;
    style?: React.CSSProperties;
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
}): JSX.Element => {
    return (
        <button
            disabled={disabled}
            className={`${disabled ? "fsio-btn-icon-disabled" : "fsio-btn-icon"} ${
                className || ""
            }`}
            onClick={onClick}
            style={style || {}}
        >
            {children}
        </button>
    );
};

export default ButtonIcon;
