// components/TopNavbar.tsx
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { colors } from '../styles/theme';

export default function TopNavbar() {
  return (
    <View style={styles.navbar}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: Platform.OS === 'ios' ? 60 : 40,
    width: '100%',
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
});
