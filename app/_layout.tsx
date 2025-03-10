import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This Stack automatically includes all screens inside `app/` */}
    </Stack>
  );
}
