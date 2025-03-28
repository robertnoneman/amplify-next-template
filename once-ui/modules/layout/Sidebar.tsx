"use client";

import { Flex, Icon, IconButton, Tag, Text, ToggleButton } from "@/once-ui/components";
import { usePathname } from "next/navigation";

const Sidebar: React.FC = ({}) => {
  const pathname = usePathname() ?? "";

  return (
    <Flex
      data-theme="dark"
      maxWidth={16}
      fillWidth
      fillHeight
      paddingX="16"
      paddingY="32"
      gap="m"
      background="page"
      border="neutral-weak"
      radius="l"
      justifyContent="flex-start"
      alignItems="flex-start"
      direction="column"
    >
      <Flex fill paddingX="xs" gap="m" direction="column">
        <Flex fillWidth gap="4" direction="column">
          <Text
            variant="body-default-xs"
            onBackground="neutral-weak"
            marginBottom="8"
            marginLeft="16"
          >
            Dashboard
          </Text>
          <ToggleButton fillWidth justifyContent="flex-start" href="" selected={true}>
            <Flex padding="4" alignItems="center" gap="12" textVariant="label-default-s">
              <Icon name="home" onBackground="neutral-weak" size="xs" />
              Home
            </Flex>
          </ToggleButton>
          <ToggleButton
            fillWidth
            justifyContent="flex-start"
            href=""
            selected={pathname === "analytics"}
          >
            <Flex padding="4" alignItems="center" gap="12" textVariant="label-default-s">
              <Icon name="trendUp" onBackground="neutral-weak" size="xs" />
              Analytics
            </Flex>
          </ToggleButton>
          <ToggleButton
            style={{
              position: "relative",
            }}
            prefixIcon=""
            fillWidth
            justifyContent="flex-start"
            href=""
            selected={pathname === "reports"}
          >
            <Flex padding="4" alignItems="center" gap="12" textVariant="label-default-s">
              <Icon name="notebook" onBackground="neutral-weak" size="xs" />
              Reports
              <Flex
                position="absolute"
                style={{
                  right: "var(--static-space-12)",
                }}
              >
                <Tag variant="neutral" size="s">
                  New
                </Tag>
              </Flex>
            </Flex>
          </ToggleButton>
        </Flex>

        <Flex fillWidth height="1" background="neutral-strong"></Flex>

        <Flex fillWidth gap="4" direction="column">
          <Text variant="body-default-xs" onBackground="neutral-weak" marginY="8" marginLeft="16">
            Management
          </Text>
          <ToggleButton
            fillWidth
            justifyContent="flex-start"
            href=""
            selected={pathname === "users"}
          >
            <Flex padding="4" gap="12" alignItems="center" textVariant="label-default-s">
              <Flex height="1" width="16" alpha="neutral-strong"></Flex>
              Users
            </Flex>
          </ToggleButton>
          <ToggleButton
            fillWidth
            justifyContent="flex-start"
            href=""
            selected={pathname === "roles"}
          >
            <Flex padding="4" alignItems="center" gap="12" textVariant="label-default-s">
              <Flex height="1" width="16" alpha="neutral-strong"></Flex>
              Roles
            </Flex>
          </ToggleButton>
          <ToggleButton
            fillWidth
            justifyContent="flex-start"
            href=""
            selected={pathname === "permissions"}
          >
            <Flex padding="4" gap="12" alignItems="center" textVariant="label-default-s">
              <Flex height="1" width="16" alpha="neutral-strong"></Flex>
              Permissions
            </Flex>
          </ToggleButton>
        </Flex>

        <Flex fillWidth height="1" background="neutral-strong"></Flex>

        <Flex fill gap="4" direction="column">
          <Flex
            fillWidth
            justifyContent="space-between"
            alignItems="center"
            paddingY="8"
            paddingX="16"
          >
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Projects
            </Text>
            <IconButton tooltip="Create" variant="secondary" icon="plus" size="s" />
          </Flex>
          <ToggleButton
            fillWidth
            justifyContent="flex-start"
            href=""
            selected={pathname === "overview"}
          >
            <Flex padding="4" gap="12" alignItems="center" textVariant="label-default-s">
              <Flex height="1" width="16" alpha="neutral-strong"></Flex>
              Overview
            </Flex>
          </ToggleButton>
          <ToggleButton
            fillWidth
            justifyContent="flex-start"
            href=""
            selected={pathname === "projects"}
          >
            <Flex padding="4" gap="12" alignItems="center" textVariant="label-default-s">
              <Flex height="1" width="16" alpha="neutral-strong"></Flex>
              My projects
            </Flex>
          </ToggleButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

Sidebar.displayName = "Sidebar";
export { Sidebar };
