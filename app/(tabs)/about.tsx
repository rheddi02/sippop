import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useThemeColors } from "../../context/ThemeContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, isSystemTheme, resetToSystemTheme, forceSystemThemeDetection } = useThemeColors();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <ThemedText type="title" bold>A&Y Sippop</ThemedText>
      <Spacer style={{ marginVertical: 40 }} />
      <ThemedText type='subtitle'>📍 Store Address</ThemedText>
      <Spacer style={{ marginVertical: 10 }} />
      <ThemedText>
        Rizal St. Bgy. Basud
      </ThemedText>
      <ThemedText>
        Nearby of Sto Niño, High school.
      </ThemedText>
      <Spacer style={{ marginVertical: 40 }} />
      <ThemedText type='subtitle'>⏰ Store Hours</ThemedText>
      <Spacer style={{ marginVertical: 10 }} />
      <ThemedText>
        Open EVERYDAY from 8am to 6pm.
      </ThemedText>
      <Spacer style={{ marginVertical: 40 }} />
      <ThemedText type='subtitle'>📞 Contact Details</ThemedText>
      <Spacer style={{ marginVertical: 10 }} />
      <ThemedText>
        Yhenna Mae A. Bayog
      </ThemedText>
      <ThemedText>
        WhatsApp: +63 935 811 4619
      </ThemedText>
    </ThemedView>
  )

  // return (
  //   <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
  //     <ThemedText style={{ fontSize: 18, marginBottom: 20 }}>Hello, {user?.name}</ThemedText>

  //     <ThemedView style={{ width: '100%', marginBottom: 30 }}>
  //       <ThemedText style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
  //         Theme Settings
  //       </ThemedText>
  //       <ThemedText style={{ fontSize: 14, marginBottom: 10, opacity: 0.7 }}>
  //         Current: {isDark ? 'Dark' : 'Light'} {isSystemTheme ? '(System)' : '(Manual)'}
  //       </ThemedText>

  //       <ThemedButton 
  //         title={isDark ? "Switch to Light" : "Switch to Dark"} 
  //         onPress={toggleTheme} 
  //         style={{ borderRadius: 50, width: '100%', marginBottom: 10 }} 
  //       />

  //       {!isSystemTheme && (
  //         <ThemedButton 
  //           title="Reset to System Theme" 
  //           onPress={resetToSystemTheme} 
  //           style={{ borderRadius: 50, width: '100%', marginBottom: 10 }} 
  //         />
  //       )}

  //       <ThemedButton 
  //         title="Force System Theme Detection" 
  //         onPress={forceSystemThemeDetection} 
  //         style={{ borderRadius: 50, width: '100%' }} 
  //       />
  //     </ThemedView>

  //     <ThemedButton title="Logout" onPress={handleLogout} style={{ borderRadius: 50, width: '80%'}} />
  //   </ThemedView>
  // );
}
