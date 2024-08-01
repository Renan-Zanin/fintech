import { View, Text } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import RoundButton from "./RoundButton";
import { MenuView } from "@react-native-menu/menu";

export default function Dropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <RoundButton icon={"ellipsis-horizontal"} text={"Mais"} />
      </DropdownMenu.Trigger>
      <Text>Dropdown</Text>
    </DropdownMenu.Root>
  );
}
