import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
import { LONG_FORM } from "@habla/const";
const Address = dynamic(() => import("@habla/components/nostr/Address"), {
  ssr: false,
});

export default function FAQ() {
  const { t, i18n } = useTranslation("common");
  const url = "https://showcase.pareto.space/faq";
  const metadata = {
    title: t("faq"),
    summary: t("faq-summary"),
  };
  const articleAddr = i18n.language === "de" ? "naddr1qvzqqqr4gupzqr68jklnrqj2g9q53kh3kkymhqfclv9q893lnpxgg33wgz5rvk47qqxnzdej8qmnydeexuenvvf583r6nt" : "naddr1qvzqqqr4gupzqr68jklnrqj2g9q53kh3kkymhqfclv9q893lnpxgg33wgz5rvk47qqxnzdej8qmnyd3n8qcrxd3ctjtzm3";
  const articleId = i18n.language === "de" ? "1728727973614" : "1728726380368";
  const articleAuthor = "0f4795bf31824a414148daf1b589bb8138fb0a03963f984c84462e40a8365abe";

  return (
    <>
      <Metadata type="article" url={url} metadata={metadata} />
      <Layout>
        <Address
          naddr={
            {articleAddr}
          }
          kind={LONG_FORM}
          pubkey={articleAuthor}
          identifier={articleId}
        />
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
