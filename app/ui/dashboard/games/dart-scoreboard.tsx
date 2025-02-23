"use client";

import { useState, useEffect } from "react";
import {
    Grid,
    Column,
    Row,
    Text,
    Button,
    Select,
    IconButton,
    Heading,
    Line,
    NumberInput,
} from "@/once-ui/components";

export default function DartScoreboard() {
    const [playerOneScores, setPlayerOneScores] = useState([0]);
    const [playerTwoScores, setPlayerTwoScores] = useState([0]);
    const [gameTypes, setGameTypes] = useState(["301", "501", "701", "Cricket", "Baseball", "Robday Night Football"]);
    const [currentGameType, setCurrentGameType] = useState("301");
    const [playerOneName, setPlayerOneName] = useState("Player 1");
    const [playerTwoName, setPlayerTwoName] = useState("Player 2");
    const boardNumbers = [20, 19, 18, 17, 16, 15, "BULL", "T", "D", "3B"];
    const scoreboardValues = ["20", "19", "18", "17", "16", "15", 'BULL', 'T', 'D', '3B'];
    const [initialScore, setInitialScore] = useState(301);

    // Store finalized rounds: each round is an object with player1 and player2 round scores (as numbers)
    const [rounds, setRounds] = useState<{ player1: number; player2: number }[]>([]);
    // Store the current round inputs (as strings so the user can edit them)
    const [currentRound, setCurrentRound] = useState({ player1: '0', player2: '0' });

    const initialPlayerScores = scoreboardValues.reduce((acc: { [key: string]: number }, val) => {
        acc[val] = 0;
        return acc;
    }, {});

    const [player1Scores, setPlayer1Scores] = useState({ ...initialPlayerScores });
    const [player2Scores, setPlayer2Scores] = useState({ ...initialPlayerScores });

    // Initialize input states for each player/category
    const [player1Inputs, setPlayer1Inputs] = useState(
        scoreboardValues.reduce((acc: { [key: string]: number }, val) => {
            acc[val] = 0;
            return acc;
        }, {})
    );
    const [player2Inputs, setPlayer2Inputs] = useState(
        scoreboardValues.reduce((acc: { [key: string]: number }, val) => {
            acc[val] = 0;
            return acc;
        }, {})
    );

    const handleSelectGameType = (e: string) => {
        setCurrentGameType(e);
        if (e === "301") {
            setInitialScore(301);
        } else if (e === "501") {
            setInitialScore(501);
        } else if (e === "701") {
            setInitialScore(701);
        }
        // resetScores();
    }

    // Handle changes in the input field for a given player and category
    interface PlayerScores {
        [key: string]: number;
    }

    interface PlayerInputs {
        [key: string]: string;
    }

    // Update the current round input for the specified player
    const handleInputChange = (e: string, player: 'player1' | 'player2') => {
        if (e === "") {
            setCurrentRound({ ...currentRound, [player]: '0' });
            return;
        }

        setCurrentRound({ ...currentRound, [player]: e });
    };

    // Compute the cumulative score for a player from all finalized rounds
    const cumulativeScore = (player: 'player1' | 'player2') => {
        return rounds.reduce((total, round) => total + (Number(round[player]) || 0), 0);
    };

    // Compute the remaining score after all rounds up to a given round index (inclusive)
    const computeRemainingAfterRound = (player: 'player1' | 'player2', roundIndex: number) => {
        const total = rounds.slice(0, roundIndex + 1).reduce((sum, round) => {
            return sum + (Number(round[player]) || 0);
        }, 0);
        return initialScore - total;
    };

    // For the current (not yet submitted) round, calculate the remaining score.
    // If the input is empty or invalid, it is treated as 0.
    const currentRemaining = (player: 'player1' | 'player2') => {
        const currentVal = parseInt(currentRound[player], 10);
        const currentScore = isNaN(currentVal) ? 0 : currentVal;
        return initialScore - (cumulativeScore(player) + currentScore);
    };

    // When the user clicks "Submit Round", parse the inputs and add the round to the list
    const submitRound = () => {
        // Parse the input values, defaulting to 0 if empty or invalid.
        const player1Score = parseInt(currentRound.player1, 10) || 0;
        const player2Score = parseInt(currentRound.player2, 10) || 0;
        setRounds([...rounds, { player1: player1Score, player2: player2Score }]);
        setCurrentRound({ player1: '0', player2: '0' });
    };

    const undoRound = () => {
        setRounds(rounds.slice(0, -1));
    }


    const handleInputChangeCricket = (
        player: 'player1' | 'player2',
        val: string,
        score: number
    ) => {
        // const input = e;
        console.log("input", val);
        if (player === 'player1') {
            setPlayer1Inputs({ ...player1Inputs, [val]: score });
        } else {
            setPlayer2Inputs({ ...player2Inputs, [val]: score });
        }
    };

    // When a player clicks “Add”, parse the input and update that category’s score
    interface HandleAddScoreParams {
        player: 'player1' | 'player2';
        val: number;
    }

    const handleAddScore = ({ player, val }: HandleAddScoreParams) => {
        console.log("player", player);
        console.log("val", val);
        console.log("player1Inputs", player1Inputs);
        console.log("player2Inputs", player2Inputs);
        if (player === 'player1') {
            const addVal = player1Inputs[val];
            if (!isNaN(addVal)) {
                setPlayer1Scores({
                    ...player1Scores,
                    [val]: player1Scores[val] + addVal,
                });
                setPlayer1Inputs({ ...player1Inputs, [val]: 0 });
            }
        } else {
            const addVal = player2Inputs[val];
            if (!isNaN(addVal)) {
                setPlayer2Scores({
                    ...player2Scores,
                    [val]: player2Scores[val] + addVal,
                });
                setPlayer2Inputs({ ...player2Inputs, [val]: 0 });
            }
        }
    };

    // Optionally compute a "total" score for each player (using only numeric scoreboard values)
    const totalScore = (scores: { [key: string]: number }) => {
        return Object.entries(scores).reduce((sum, [key, value]) => {
            const num = parseInt(key, 10);
            if (!isNaN(num)) {
                return sum + num * value;
            }
            return sum;
        }, 0);
    };

    const resetScores = () => {
        setCurrentRound({ player1: '0', player2: '0' });
        setRounds([]);
        setPlayer1Scores({ ...initialPlayerScores });
        setPlayer2Scores({ ...initialPlayerScores });
        setPlayer1Inputs({ ...initialPlayerScores });
        setPlayer2Inputs({ ...initialPlayerScores });
    };



    // useEffect(() => {

    // }, []);

    return (
        <Column fillWidth fillHeight justifyContent="center" alignItems="center" background="surface" padding="xs">
            <Row fillWidth gap="16" justifyContent="center" padding="s">
                <Select
                    id="game-type"
                    label="Select Game Type"
                    value={currentGameType}
                    options={gameTypes.map((type) => ({ label: type, value: type }))}
                    onSelect={(e) => handleSelectGameType(e)}
                />
            <Button variant="secondary" onClick={resetScores}>
                Reset Scores
            </Button>
            </Row>
            {(currentGameType === "301" || currentGameType === "501" || currentGameType === "701") && (
            <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
                <h2>Dart Scoreboard (Game: {initialScore})</h2>
                {/* <button onClick={resetScores}>Reset Scores</button> */}
                <div style={{ marginBottom: '1rem' }}></div>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'center',
                        marginBottom: '1rem',
                    }}
                >
                    <thead style={{ padding: '10px' }}>
                        <tr style={{ paddingBottom: '10px' }}>
                            <th colSpan={2}>
                            <Text variant="heading-default-l">
                                <input type="text" value={playerOneName} onChange={(e) => setPlayerOneName(e.target.value)} 
                                style={{paddingLeft: 0, paddingRight: 0, width: '70px', backgroundColor: 'transparent', border: 'none', color: '#BBB', zIndex: 10 }}
                                />
                            </Text>
                            </th>
                            <th>
                                <Text variant="heading-default-m">
                                vs
                                </Text>
                            </th>
                            <th colSpan={2}>
                            <Text variant="heading-default-l">
                                <input type="text" value={playerTwoName} onChange={(e) => setPlayerTwoName(e.target.value)} 
                                style={{paddingLeft: 0, paddingRight: 0, width: '70px', backgroundColor: 'transparent', border: 'none', color: '#BBB', zIndex: 10 }}
                                />
                            </Text>
                            </th>
                        </tr>
                        <tr>
                            <th colSpan={5}>
                                <Text variant="body-default-xs">
                                    -
                                </Text>
                            </th>
                        </tr>
                        <tr style={{ borderBottom: '2px solid #EEE', marginTop: '10px' }}>
                            <th style={{borderRight: "1px solid #EEE", padding: "0.1rem", color: '#CCC' }}>                                
                                <Text variant="heading-default-xs">
                                    ROUND SCORE
                                </Text>
                            </th>
                            <th style={{padding: "0.1rem", color: '#CCC'}}>
                            <Text variant="label-default-xs">
                                REMAINING
                            </Text>
                            </th>
                            <th style={{borderLeft: '1px solid #EEE', borderRight: "1px solid #EEE", padding: "0.1rem", color: "#EEE" }}>
                                <Text variant="heading-strong-l">
                                {currentGameType}
                                </Text>
                                </th>
                            <th style={{borderLeft: '1px solid #EEE', borderRight: "1px solid #EEE", padding: "0.1rem", color: '#CCC'}}>
                            <Text variant="heading-default-xs">    
                                ROUND SCORE
                            </Text>
                            </th>
                            <th style={{padding: "0.1rem", color: '#CCC'}}>
                            <Text variant="label-default-xs">
                                REMAINING
                            </Text>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render each finalized round */}
                        {rounds.map((round, index) => (
                            <tr key={index} style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666' }}>
                                <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>{round.player1}</td>
                                <td style={{ color: "#BBB" }}>{computeRemainingAfterRound('player1', index)}</td>
                                <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>{index + 1}</td>
                                <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>{round.player2}</td>
                                <td style={{ color: "#BBB" }}>{computeRemainingAfterRound('player2', index)}</td>
                            </tr>
                        ))}
                        {/* Current round input row */}
                        <tr style={{ borderTop: '2px dashed #666' }}>
                            <td>
                            {/* <NumberInput
                                    id="player1-input"
                                    // value={parseInt(currentRound.player1)}
                                    value={0}
                                    onChange={(e) => handleInputChange(e, 'player1')}
                                    label="Score"
                                    // style={{ width: '60px' }}
                                /> */}
                                <input
                                    type="number"
                                    value={parseInt(currentRound.player1)}
                                    onChange={(e) => handleInputChange(e.target.value, 'player1')}
                                    placeholder={"0"}
                                    style={{paddingLeft: 0, paddingRight: 0, width: '20px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                                />
                            </td>
                            <td>{currentRemaining('player1')}</td>
                            <td>{rounds.length + 1}</td>
                            <td>
                                <input
                                    type="number"
                                    value={parseInt(currentRound.player2)}
                                    onChange={(e) => handleInputChange(e.target.value, 'player2')}
                                    placeholder={"0"}
                                    style={{paddingLeft: 0, paddingRight: 0, width: '20px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                                />
                            </td>
                            <td>{currentRemaining('player2')}</td>
                        </tr>
                    </tbody>
                </table>
                <Row fillWidth gap="16" justifyContent="center">
                <Button variant="primary" onClick={submitRound}>
                    Submit Round
                </Button>
                <Button variant="secondary" onClick={undoRound}>
                    Undo Round
                </Button>
                </Row>
               
            </div>
            )}

            {/* <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
                <h2>Dart Scoreboard</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <strong>Player 1 Total: </strong> {totalScore(player1Scores)}<br />
                    <strong>Player 2 Total: </strong> {totalScore(player2Scores)}<br />
                    <button onClick={resetScores}>Reset Scores</button>
                </div>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'center',
                    }}
                >
                    <thead>
                        <tr>
                            <th colSpan={2}>Player 1</th>
                            <th>Scoreboard</th>
                            <th colSpan={2}>Player 2</th>
                        </tr>
                        <tr>
                            <th>Score</th>
                            <th>Add Score</th>
                            <th>Value</th>
                            <th>Add Score</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scoreboardValues.map((val) => (
                            <tr key={val} >
                                <td style={{ padding: '0.5rem', borderRight: "1px solid #ccc" }}>{player1Scores[val]}</td>
                                <td style={{ padding: '0.5rem', borderRight: "1px solid #ccc" }}>
                                    
                                    <NumberInput
                                        id="player1-input"
                                        value={player1Inputs[val]}
                                        label="Score"
                                        max={180}
                                        onChange={(e) => handleInputChangeCricket("player1", val, e)}
                                    />
                                    <button onClick={() => handleAddScore({ player: 'player1', val: player1Inputs[val] })}>
                                        Add
                                    </button>
                                </td>
                                <td style={{ padding: '0.5rem', fontWeight: 'bold', borderRight: "1px solid #ccc" }}>{val}</td>
                                <td style={{ padding: '0.5rem', borderRight: "1px solid #ccc" }}>
                                    <NumberInput
                                        id="player2-input"
                                        value={player2Inputs[val]}
                                        label="Score"
                                        max={180}
                                        onChange={(e) => handleInputChangeCricket("player2", val, e)}
                                    />
                                    <button onClick={() => handleAddScore({ player: 'player2', val: player2Inputs[val] })}>
                                        Add
                                    </button>
                                </td>
                                <td style={{ padding: '0.5rem', borderRight: "1px solid #ccc" }}>{player2Scores[val]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}

            {/* <Row gap="16" fillWidth alignItems="center" justifyContent="center">
                <Column justifyContent="center" alignItems="center">
                    <Heading align="center">
                        {playerOneName}
                    </Heading>
                    <Line />
                </Column>
                <Column justifyContent="center" alignItems="center">
                    <Heading align="center">
                        - vs -
                    </Heading>
                </Column>
                <Column justifyContent="center" alignItems="center">
                    <Heading align="center">
                        {playerTwoName}
                    </Heading>
                    <Line />
                </Column>
            </Row>
            <Heading variant="heading-default-s" align="center">
                {currentGameType}
            </Heading>
            <Line />

            <Row fillWidth>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    ---
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    301
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    20
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    ---
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    301
                </Column>
            </Row>

            <Row fillWidth fillHeight>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    60
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    241
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    19
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    11
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    290
                </Column>
            </Row>

            <Row fillWidth>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    30
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    211
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    18
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    26
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    264
                </Column>
            </Row>

            <Row fillWidth>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    17
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
            </Row>

            <Row fillWidth>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    16
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
            </Row>
            <Row fillWidth>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    15
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
            </Row>

            <Row fillWidth>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    BULL
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight >
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
            </Row>

            <Row fillWidth>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    T
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
            </Row>

            <Row fillWidth>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    D
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
            </Row>

            <Row fillWidth>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    3B
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight>
                    <Line vertical />
                </Column>
                <Column justifyContent="center" alignItems="center" fillWidth fillHeight paddingY="s">
                    .
                </Column>
            </Row> */}

            {/* <Grid columns="3" gap="16" fillWidth>
                <Column fillWidth gap="l" alignItems="center" justifyContent="center" paddingTop="12">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <Grid columns="3" key={index}>
                            <Column justifyContent="center" alignItems="center">
                                <Heading align="center">
                                    ---
                                </Heading>
                            </Column>
                            <Column justifyContent="center" alignItems="center">
                                <Line vertical />
                            </Column>
                            <Column justifyContent="center" alignItems="center">
                                <Heading align="center">
                                    301
                                </Heading>
                            </Column>
                        </Grid>
                    ))}
                </Column>
                <Grid columns="3" >
                    <Column justifyContent="center" alignItems="center">
                        <Line vertical />
                    </Column>
                    <Column justifyContent="center" alignItems="center" gap="l" paddingTop="12">
                        <Row alignItems="center" justifyContent="center">
                            <Heading align="center">
                                20
                            </Heading>
                        </Row>
                        <Row alignItems="center">
                            <Heading align="center">
                                19
                            </Heading>
                        </Row>
                        <Row alignItems="center">
                            <Heading align="center">
                                18
                            </Heading>
                        </Row>
                        <Row alignItems="center">
                            <Heading align="center">
                                17
                            </Heading>
                        </Row>
                        <Row alignItems="center">
                            <Heading align="center">
                                16
                            </Heading>
                        </Row>
                        <Row alignItems="center">
                            <Heading align="center">
                                15
                            </Heading>
                        </Row>
                        <Row alignItems="center">
                            <Heading align="center">
                                BULL
                            </Heading>
                        </Row>
                        <Row alignItems="center">
                            <Heading align="center">
                                T
                            </Heading>
                        </Row>
                        <Row alignItems="center">
                            <Heading align="center">
                                D
                            </Heading>
                        </Row>
                        <Row alignItems="center">
                            <Heading align="center">
                                3B
                            </Heading>
                        </Row>
                    </Column>
                    <Column justifyContent="center" alignItems="center">
                        <Line vertical />
                    </Column>
                </Grid>
                <Grid columns="3" fillWidth>
                    <Column justifyContent="center" alignItems="center">
                        <Heading align="center">
                            x
                        </Heading>
                    </Column>
                    <Column justifyContent="center" alignItems="center">
                        <Line vertical />
                    </Column>
                    <Column justifyContent="center" alignItems="center">
                        <Heading align="center">
                            o
                        </Heading>
                    </Column>
                </Grid>
            </Grid> */}
        </Column>
    );
}