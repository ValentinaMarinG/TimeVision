import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import BottomBar from "../organisms/BottomBar"

export default function Tickets() {
    const insets = useSafeAreaInsets();
    
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <Text style={styles.text}>Tickets</Text>
        <BottomBar activeRoute="/tickets"/>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      width : '100%',
      flex: 1,
      justifyContent: 'space-between', 
    },
    text: {
      color: 'black',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 24,
    },
  });
