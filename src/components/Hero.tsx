import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Flex, Heading, Text, Button } from "@chakra-ui/react";

export default function Hero() {
  const { t } = useTranslation("common");
  return (
    <Flex
      flexDirection="column"
      bg="layer"
      borderRadius="20px"
      p="17px 24px"
      gap={4}
      dir="auto"
    >
      <Heading fontSize="xl">{t("what-is-pareto")}</Heading>
      <Text fontSize="md" fontWeight={400}>
        {t("pareto-description")}
      </Text>
      <Link href={`/faq`} shallow>
        <Button variant="solid" bg="rgba(94, 48, 224, 0.20)" maxWidth="12rem">
          {t("intro")}
        </Button>
      </Link>
    </Flex>
  );
}
