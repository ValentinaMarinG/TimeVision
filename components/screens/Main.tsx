import { View, StyleSheet, Text } from "react-native"
import HomeCard from "../molecules/HomeCard";
import SearchInput from "../organisms/SearchInput";

export default function Main() {
  return (
    <View style={styles.content}>
        <HomeCard
          text="Peliculas"
          href="/listItems"
          color="red"
        />
        <HomeCard
          text="Pokémon"
          href="/login"
          color="green"
        />
        <HomeCard
          text="Video Juegos"
          href="/home"
          color="blue"
        />
      </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    height: '90%'
  }
})