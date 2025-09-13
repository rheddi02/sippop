import { useThemeColors } from "@/context/ThemeContext";
import { WalletContext } from "@/context/WalletContext";
import { useContext } from "react";
import { View } from "react-native";
import Card from "../../components/Card";
import PrimaryButton from "../../components/PrimaryButton";
import Typography from "../../components/Typography";

export default function WalletScreen() {
  const { balance, addFunds, deduct } = useContext(WalletContext);
  const { theme } = useThemeColors();

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background }}>  
      <Card>
        <Typography variant="title" bold>
          {balance}
        </Typography>
        <Typography variant="subtitle">₱{balance}</Typography> 
      </Card>

      <PrimaryButton title="Add ₱100" onPress={() => addFunds(100)} />
      <PrimaryButton title="Spend ₱50" onPress={() => deduct(50)} />
    </View>
  );
}
