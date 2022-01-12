import Head from "next/head";

import dynamic from "next/dynamic";
const NoSSRComposer = dynamic(
  () => import("../components/Composer").then((mod) => mod.Composer),
  {
    ssr: false,
  }
);

const ComposerPage = (props: {}) => {
  return (
    <div className="content">
      <Head>
        <title>Compose SLED file</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NoSSRComposer />
    </div>
  );
};

export default ComposerPage;
