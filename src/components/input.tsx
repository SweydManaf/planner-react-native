import { ReactNode } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ViewProps,
} from "react-native";
import clsx from "clsx";

import { colors } from "@/styles/colors";

type Variants = "primary" | "secondary" | "tertiary";

type InputProps = ViewProps & {
  children: ReactNode;
  variant?: Variants;
};

export function Input({
  children,
  variant = "primary",
  className,
  ...props
}: InputProps) {
  return (
    <View
      className={clsx(
        "min-h-16 h-16 max-h-16 flex-row items-center gap-2",
        {
          "h-14 px-4 rounded-lg border border-zinc-800": variant !== "primary",
          "bg-zinc-950": variant === "secondary",
          "bg-zinc-900": variant === "tertiary",
        },
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

function Field({ ...props }: TextInputProps) {
  return (
    <TextInput
      className="flex-1 text-zinc-100 text-lg font-regular"
      placeholderTextColor={colors.zinc[400]}
      cursorColor={colors.zinc[100]}
      selectionColor={Platform.OS == "ios" ? colors.zinc[100] : undefined}
      style={{
        height: 64,
        textAlignVertical: "center",
        ...Platform.select({
          ios: {
            lineHeight: 20,
          },
          android: {},
        }),
      }}
      {...props}
    />
  );
}

Input.Field = Field;
