import { useState, useEffect, useRef, useMemo } from "react";
import {
  useColorModeValue,
  useDisclosure,
  Flex,
  Stack,
  Box,
  Heading,
  Text,
  Image,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import User from "./nostr/User";

import { ZAP, HIGHLIGHT, REACTION } from "@habla/const";
import { getMetadata } from "@habla/nip23";
import Blockquote from "@habla/components/Blockquote";
import Markdown from "@habla/markdown/Markdown";
import Hashtags from "@habla/components/Hashtags";
import { formatDay } from "@habla/format";
import Highlighter from "@habla/icons/Highlighter";
import Highlight from "@habla/components/nostr/feed/Highlight";
import Highlights from "@habla/components/reactions/Highlights";
import HighlightModal from "@habla/components/HighlightModal";
import { useTextSelection } from "@habla/hooks/useTextSelection";
import Zaps from "./Zaps";
import Reposts from "./Reposts";
import Comments from "./Comments";

function deselect() {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    // IE?
    document.selection.empty();
  } else {
    console.log("Can't deselect");
  }
}

function HighlightsDrawer({ highlights, selected, isOpen, onClose }) {
  const stackRef = useRef();
  const initialFocusRef = useRef();
  const bg = useColorModeValue("white", "layer");

  //useEffect(() => {
  //  if (isOpen) {
  //    if (initialFocusRef.current) {
  //      stackRef.scrollTo(initialFocusRef.current);
  //    }
  //  }
  //}, [isOpen, initialFocusRef]);

  return (
    <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg={bg}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Heading>Highlights</Heading>
        </DrawerHeader>
        <DrawerBody>
          <Stack ref={stackRef}>
            {highlights.reverse().map((event) => (
              <Box ref={event.id === selected?.id ? initialFocusRef : null}>
                <Highlight key={event.id} event={event} />
              </Box>
            ))}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default function LongFormNote({
  event,
  isDraft,
  zaps = [],
  notes = [],
  highlights = [],
  reposts = [],
}) {
  const ref = useRef();
  const [selected, setSelected] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const highlightModal = useDisclosure();
  const { title, summary, image, hashtags, publishedAt } = useMemo(
    () => getMetadata(event),
    [event]
  );
  const [textSelection, setTextSelection] = useState();
  const [ctx, setCtx] = useState();
  const { context, textContent, isCollapsed, clientRect } = useTextSelection(
    ref.current
  );

  useEffect(() => {
    if (!highlightModal.isOpen) {
      setTextSelection(textContent);
      setCtx(context);
    }
  }, [textContent]);

  function onHighlightClick(highlight) {
    setSelected(highlight);
    onOpen();
  }

  function onHighlightOpen() {
    highlightModal.onOpen();
    deselect();
  }

  const reactions = isDraft ? null : (
    <Flex alignItems="center" gap={6}>
      <Zaps event={event} zaps={zaps} />
      <Reposts event={event} reposts={reposts} />
      <Highlights event={event} highlights={highlights} />
      <Comments event={event} comments={notes} />
    </Flex>
  );

  return (
    <>
      <Box sx={{ wordBreak: "break-word" }} ref={ref} dir="auto">
        <Stack gap={2} mb={6}>
          {image?.length > 0 && (
            <Image src={image} alt={title} width="100%" maxHeight="520px" />
          )}
          <Heading as="h1" fontSize="4xl">
            {title}
          </Heading>
          {summary?.length > 0 && (
            <Blockquote fontSize="lg">{summary}</Blockquote>
          )}
          <Hashtags hashtags={hashtags} />
          {reactions}
          <Flex align="center" gap={3} fontFamily="Inter">
            {event.pubkey && <User pubkey={event.pubkey} />}
            <Text color="secondary" fontSize="sm">
              {formatDay(publishedAt)}
            </Text>
          </Flex>
        </Stack>
        <Prose>
          <Markdown
            content={event.content}
            tags={event.tags}
            highlights={highlights}
            onHighlightClick={onHighlightClick}
          />
        </Prose>
      </Box>

      {textSelection?.length ? (
        <Box sx={{ position: "fixed", bottom: 4, right: 4 }}>
          <IconButton
            colorScheme="orange"
            icon={<Highlighter />}
            onClick={onHighlightOpen}
          />
        </Box>
      ) : null}

      <HighlightModal
        event={event}
        content={textSelection}
        context={ctx}
        {...highlightModal}
        onClose={() => {
          setTextSelection("");
          setCtx();
          highlightModal.onClose();
        }}
      />

      <HighlightsDrawer
        selected={selected}
        highlights={highlights}
        isOpen={isOpen}
        onClose={onClose}
      />

      <Box mt={4}>{reactions}</Box>
      <Box mt="120px">
        <Text color="secondary" textAlign="center">
          𐡷
        </Text>
      </Box>
    </>
  );
}
