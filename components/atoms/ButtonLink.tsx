import Link from "next/link";
import React, { ReactNode } from "react";

const ButtonLink = ({
    children,
    href,
    className,
    download,
    blank,
}: {
    children: ReactNode;
    href: string;
    className?: string;
    download?: string;
    blank?: boolean;
}) => {
    if (download) {
        return (
            <a href={href} className={`fsio-btn ${className || ""}`} download={download}>
                {children}
            </a>
        );
    } else {
        return (
            <Link
                href={href}
                className={`fsio-btn ${className || ""}`}
                download={download}
                target={blank ? "_blank" : "_self"}
                rel={blank ? "noreferrer" : undefined}
            >
                {children}
            </Link>
        );
    }
};

export default ButtonLink;
