import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "white",
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "white",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  link: { // ✅ Added missing `link` style
    marginTop: 10,
    color: "lightblue",
    textDecorationLine: "underline",
  },
});
