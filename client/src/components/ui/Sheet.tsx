import type { PropsWithChildren } from "react";
import { Modal, Pressable, View } from "react-native";

import { Card } from "@/src/components/ui/Card";

export interface SheetProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
}

export function Sheet({ visible, onClose, children }: SheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
        <Card className="rounded-b-none p-5">{children}</Card>
      </View>
    </Modal>
  );
}
