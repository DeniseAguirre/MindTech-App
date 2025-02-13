import { StyleSheet, SafeAreaView } from "react-native";
import Header from "../components/Header";
import FiltersStore from "../components/FiltersStore";

function Store() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FiltersStore />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default Store;
