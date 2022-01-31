import Head from "next/head";

import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";

const NoSSRComposer = dynamic(
  () => import("../components/Composer").then((mod) => mod.Composer),
  {
    ssr: false,
  }
);

const ComposerPage = (props: {}) => {
  return (
    <Box className="content" overflow="hidden">
      <Head>
        <title>Compose SLED file</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NoSSRComposer />
    </Box>
  );
};

export default ComposerPage;
