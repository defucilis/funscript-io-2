import React, { useState, useContext, createContext, ReactNode } from "react";
import Handy from "../thehandy";

const handyContext = createContext<{ handy: Handy | null }>({ handy: null });

const useProvideHandy = (verbose = false) => {
    const [handy] = useState<Handy>(new Handy(verbose));
    return { handy };
};

const HandyProvider = ({
    verbose,
    children,
}: {
    verbose?: boolean;
    children: ReactNode;
}): JSX.Element => {
    const context = useProvideHandy(verbose || false);
    return <handyContext.Provider value={context}>{children}</handyContext.Provider>;
};

const useHandy = (): { handy: Handy | null } => {
    return useContext(handyContext);
};

export { HandyProvider };
export default useHandy;
