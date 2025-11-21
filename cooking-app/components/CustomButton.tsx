import { Pressable, StyleSheet, Text, GestureResponderEvent, ViewStyle, TextStyle } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  type?: "primary" | "delete" | "secondary";
  style?: ViewStyle;
}

export default function CustomButton({ title, onPress, type = "primary", style }: CustomButtonProps) {
  const buttonStyles: ViewStyle[] = [styles.button];
  if (type === "delete") buttonStyles.push(styles.delete);
  if (type === "secondary") buttonStyles.push(styles.secondary);
  if (style) buttonStyles.push(style);

  const textStyles: TextStyle[] = [styles.buttonText];
  if (type === "secondary") textStyles.push(styles.secondaryText);

  return (
    <Pressable style={buttonStyles} onPress={onPress}>
      <Text style={textStyles}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { 
    backgroundColor: "#FF6D45", 
    padding: 10, 
    borderRadius: 10, 
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold",
  },
  delete: {
    backgroundColor: "#C91F00",
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF6D45",
    width: "100%",
  },
  secondaryText: {
    color: "#FF6D45",
  },
});
