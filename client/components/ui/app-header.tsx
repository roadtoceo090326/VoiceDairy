import { Text, View } from "react-native";

type AppHeaderProps = {
  title: string;
  subtitle: string;
};

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <View className="border-b border-slate-200 bg-white px-5 pb-4 pt-3">
      <Text className="text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </Text>
      <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text>
    </View>
  );
}
