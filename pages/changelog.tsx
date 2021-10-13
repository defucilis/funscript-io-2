import { join } from "path";
import fs from "fs";
import { remark } from "remark";
import html from "remark-html";
import { GetStaticPropsResult } from "next";
import Layout from "components/layout/Layout";

const Changelog = ({ changelog }: { changelog: string }): JSX.Element => {
    return (
        <Layout>
            <div className="markdown" dangerouslySetInnerHTML={{ __html: changelog }} />
        </Layout>
    );
};

export default Changelog;

export const markdownToHtml = async (markdown: string): Promise<string> => {
    const result = await remark().use(html).process(markdown);
    return result.toString();
};

export const getStaticProps = async (): Promise<GetStaticPropsResult<{ changelog: string }>> => {
    const path = join(process.cwd(), "CHANGELOG.md");
    const fileContents = fs.readFileSync(path, "utf8");

    const changelog = (await remark().use(html).process(fileContents)).toString();

    return {
        props: {
            changelog,
        },
    };
};
