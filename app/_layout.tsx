import { Stack } from "expo-router";
import { AIChatProvider } from "./contexts/AIChatContext"; // adjust if needed

export default function Layout() {
  return (
    <AIChatProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AIChatProvider>
  );
}
