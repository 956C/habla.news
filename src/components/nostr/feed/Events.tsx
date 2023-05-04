import { Stack } from "@chakra-ui/react";

import Event from "./Event";

export default function Events({ events }) {
  return (
    <Stack spacing={4}>
      {events.map((event, idx) => (
        <Event key={event.id} event={event} />
      ))}
    </Stack>
  );
}
