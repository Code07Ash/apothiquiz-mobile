import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveSession(session) {
  const old =
    JSON.parse(await AsyncStorage.getItem("sessions")) || [];
  old.push(session);
  await AsyncStorage.setItem("sessions", JSON.stringify(old));
}

export async function getSessions() {
  return JSON.parse(await AsyncStorage.getItem("sessions")) || [];
}