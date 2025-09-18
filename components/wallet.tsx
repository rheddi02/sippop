import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/context/ThemeContext";
import { useWallet } from "@/context/WalletContext";
import { View } from "react-native";
import { formatPesoDetailed } from "../utils/amountHelper";

export default function Wallet() {
  const { balance, addFunds, deduct } = useWallet();
  const { theme } = useThemeColors();

  return (
    <ThemedCard>
      <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between' }}>
        <View>
          <ThemedText type="caption">
            Wallet Balance
          </ThemedText>
          <ThemedText type="title" bold>{formatPesoDetailed(balance)}</ThemedText>
        </View>
        <View>
          <ThemedText type="caption">
            Total Points
          </ThemedText>
          <ThemedText type="title" bold style={{ color: theme.text, textAlign: "right" }}>0</ThemedText>
        </View>
      </View>
      <Spacer style={{ marginTop: 20 }} />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <ThemedButton
          title="Deposit"
          size="sm"
          onPress={() => addFunds(0)}
          style={{ flex: 1, borderRadius: 50 }}
        />
        <ThemedButton
          title="Withdraw"
          size="sm"
          onPress={() => deduct(0)}
          style={{ flex: 1, borderRadius: 50 }}
        />
      </View>
    </ThemedCard>
  );
}
