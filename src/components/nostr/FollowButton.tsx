import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { useToast, Icon, Button } from "@chakra-ui/react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { CheckIcon } from "@chakra-ui/icons";

import { dateToUnix } from "@habla/time";
import { CONTACTS } from "@habla/const";
import {
  pubkeyAtom,
  followsAtom,
  tagsAtom,
  contactListAtom,
} from "@habla/state";
import { useNdk } from "@habla/nostr/hooks";

export function FollowReferenceButton({ reference }) {
  const [tag, value] = reference;
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const toast = useToast();
  const [user] = useAtom(pubkeyAtom);
  const [contactList, setContactList] = useAtom(contactListAtom);
  const following = contactList?.tags.find(
    (t) => t.at(0) === tag && t.at(1) === value
  );

  async function followReference() {
    try {
      const newFollows =
        contactList?.tags.length > 0
          ? [...contactList?.tags, [tag, value]]
          : [[tag, value]];
      const newContacts = {
        kind: CONTACTS,
        created_at: dateToUnix(),
        content: contactList?.content || "",
        tags: newFollows,
      };
      setContactList(newContacts);
      const signed = new NDKEvent(ndk, newContacts);
      await signed.sign();
      await ndk.publish(signed);
    } catch (error) {
      console.error(error);
      toast({
        title: "Could not sign event",
        status: "error",
      });
    }
  }

  async function unfollowReference() {
    try {
      const newFollows =
        contactList?.tags.filter((t) => t.at(0) !== tag && t.at(1) !== value) ||
        [];
      const newContacts = {
        kind: CONTACTS,
        created_at: dateToUnix(),
        content: contactList?.content || "",
        tags: newFollows,
      };
      setContactList(newContacts);
      const signed = new NDKEvent(ndk, newContacts);
      await signed.sign();
      await ndk.publish(signed);
    } catch (error) {
      console.error(error);
      toast({
        title: "Could not sign event",
        status: "error",
      });
    }
  }

  return (
    <Button
      variant="outline"
      leftIcon={following ? <Icon as={CheckIcon} color="green.400" /> : null}
      onClick={following ? unfollowReference : followReference}
    >
      {following ? t("unfollow") : t("follow")}
    </Button>
  );
}

export function FollowAddressButton({ address }) {
  return <FollowReferenceButton reference={["a", address]} />;
}

export function FollowTagButton({ tag }) {
  return <FollowReferenceButton reference={["t", tag]} />;
}

export function FollowEvent({ id }) {
  return <FollowReferenceButton reference={["e", id]} />;
}

export function FollowURL({ href }) {
  return <FollowReferenceButton reference={["r", href]} />;
}

export default function FollowButton({ pubkey }) {
  return <FollowReferenceButton reference={["p", pubkey]} />;
}
