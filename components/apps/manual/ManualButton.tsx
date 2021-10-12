import { ReactNode } from "react";
import ButtonIcon from "components/atoms/ButtonIcon";

const ManualButton = ({
    label,
    disabled,
    onClick,
    cellSize,
    children,
}: {
    label: string;
    disabled: boolean;
    onClick: () => void;
    cellSize: number;
    children: ReactNode;
}): JSX.Element => {
    const size = cellSize > 200 ? 200 : cellSize;

    return (
        <div className="w-full h-full grid place-items-center">
            <ButtonIcon
                disabled={disabled}
                onClick={onClick}
                style={{
                    width: size - 32,
                    height: size - 32,
                    fontSize: size * 0.5,
                }}
            >
                {children}
            </ButtonIcon>
            <span className="text-white text-sm">{label}</span>
        </div>
    );
};

export default ManualButton;
