import Layout from "./Layout";

const LayoutSkeleton = ({ message }: { message: string }): JSX.Element => {
    return (
        <Layout>
            <h1 className="text-4xl">{message}</h1>
        </Layout>
    );
};

export default LayoutSkeleton;
