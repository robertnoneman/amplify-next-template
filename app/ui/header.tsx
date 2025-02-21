"use client";

import { Flex, ToggleButton, StyleOverlay } from "@/once-ui/components"
import styles from '@/app/ui/header.module.css'
import { useParams, usePathname } from "next/navigation";
import CountdownToMonday from "@/app/ui/CountdownToMonday";

export const Header = () => {
    const pathname = usePathname() ?? '';
    const params = useParams();
    const routes = {
        '/':        true,
        '/about':   true,
        '/work':    true,
        '/blog':    true,
        '/archive': true,
        '/games': true,
    }

    return (
        <>
            <Flex
                className={styles.mask}
                position="fixed" zIndex={9}
                fillWidth minHeight="80" justifyContent="center">
            </Flex>
            <Flex 
                style={{height: 'fit-content'}}
                className={styles.position}
                as="header"
                zIndex={9}
                fillWidth padding="8"
                gap="40"
                justifyContent="center">
                {/* <div className="hidden md:block">
                    <Flex border="brand-strong" borderStyle="dashed" radius="xs" shadow="l" onBackground="brand-strong" background="brand-alpha-strong" maxHeight={2.5}>
                        <CountdownToMonday />
                    </Flex>
                </div> */}
                <Flex fillWidth justifyContent="center" gap="40">
                    <Flex
                        background="surface" border="neutral-medium" borderStyle="solid" radius="m-4" shadow="l"
                        padding="4"
                        justifyContent="center">
                        <Flex
                            gap="4"
                            textVariant="body-default-s">
                            { routes['/'] && (
                                <ToggleButton
                                    prefixIcon="home"
                                    href={`/`}
                                    selected={pathname === "/"}
                                    size="m"
                                >
                                    <Flex paddingX="2" hide="s" className="hidden md:flex">
                                        Home
                                    </Flex>
                                </ToggleButton>
                            )}
                            { routes['/about'] && (
                                <ToggleButton
                                    prefixIcon="dashboard"
                                    href={`/dashboard`}
                                    selected={pathname === "/dashboard"}>
                                    <Flex paddingX="2" hide="s">
                                        Dashboard
                                    </Flex>
                                </ToggleButton>
                            )}
                            { routes['/work'] && (
                                <ToggleButton
                                    prefixIcon="lightbulb"
                                    href={`/dashboard/activities`}
                                    selected={pathname.startsWith('/dashboard/activities')}
                                    size="m">
                                        <Flex paddingX="2" hide="s">
                                        Activities
                                        </Flex>
                                </ToggleButton>
                            )}
                            { routes['/blog'] && (
                                <ToggleButton
                                    prefixIcon="book"
                                    href={`/dashboard/planner`}
                                    selected={pathname.startsWith('/dashboard/planner')}>
                                        <Flex paddingX="2" hide="s">
                                            Planner
                                        </Flex>
                                </ToggleButton>
                            )}
                            { routes['/archive'] && (
                                <ToggleButton
                                    prefixIcon="gallery"
                                    href={`/dashboard/archive`}
                                    selected={pathname.startsWith('/archive')}>
                                        <Flex paddingX="2" hide="s">
                                            Gallery
                                        </Flex>
                                </ToggleButton>
                            )}
                            { routes['/games'] && (
                                <ToggleButton
                                    prefixIcon="game"
                                    href={`/dashboard/games`}
                                    selected={pathname.startsWith('/games')}>
                                        <Flex paddingX="2" hide="s">
                                            Games
                                        </Flex>
                                </ToggleButton>
                            )}
                        </Flex>
                    </Flex>
                    
                    <StyleOverlay top="20" right="24" />
                </Flex>
                <div className="hidden md:block">
                    <Flex fillWidth justifyContent="flex-end" alignItems="center">
                        <Flex
                            paddingRight="12"
                            justifyContent="flex-end" alignItems="center"
                            textVariant="body-default-s"
                            gap="20">
                            {5 > 1 &&
                                <Flex
                                    background="surface" border="neutral-medium" borderStyle="solid" radius="m-4" shadow="l"
                                    padding="4" gap="2"
                                    justifyContent="center">
                                </Flex>
                            }
                            {/* <Flex hide="s">
                                { display.time && (
                                    <TimeDisplay timeZone={person.location}/>
                                    )}
                                    </Flex> */}
                        </Flex>
                    </Flex>
                </div>
            </Flex>
        </>
    )
}