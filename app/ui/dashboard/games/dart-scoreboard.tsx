"use client";

import { useState, useEffect, useRef } from "react";
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
  Card,
  Icon
} from "@/once-ui/components";

import outputs from "@/amplify_outputs.json"
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, type Schema } from "@/amplify/data/resource";
import Pride from "react-canvas-confetti/dist/presets/pride";
import ReactCanvasConfetti from "react-canvas-confetti";
import confetti from "canvas-confetti";
import SlidingImage from "@/app/ui/effects/slide-in-sticker";
import styles from '@/app/ui/effects/slide-in-sticker.module.css';

// Interface for ParentComponent state
interface ParentComponentState {
  triggerSlide: boolean;
  animationCount: number;
}

Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function DartScoreboard() {
  const [playerOnePoints, setPlayerOnePoints] = useState(0);
  const [playerTwoPoints, setPlayerTwoPoints] = useState(0);
  const [playerOneTotalPoints, setPlayerOneTotalPoints] = useState([0]);
  const [playerTwoTotalPoints, setPlayerTwoTotalPoints] = useState([0]);
  const [gameTypes, setGameTypes] = useState(["301", "501", "701", "Cricket", "Baseball", "Robday Night Football"]);
  const [currentGameType, setCurrentGameType] = useState("301");
  const [currentGameId, setCurrentGameId] = useState("");
  const [playerOneName, setPlayerOneName] = useState("Player 1");
  const [playerTwoName, setPlayerTwoName] = useState("Player 2");
  const [saveNameButtonActive, setSaveNameButtonActive] = useState(false);
  const boardNumbers = [20, 19, 18, 17, 16, 15, "BULL", "T", "D", "3B"];
  const scoreboardValues = ["20", "19", "18", "17", "16", "15", 'BULL'];
  const [baseBallInningValues, setBaseBallInningValues] = useState(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  const [robdayNightFootballValues, setRobdayNightFootballValues] = useState(["1", "-", "2", "-", "3", "-", "4", "-"])
  const [currentInning, setCurrentInning] = useState("1");
  const [currentInningScore, setCurrentInningScore] = useState({ player1: 0, player2: 0 });
  const [currentInningErrors, setCurrentInningErrors] = useState({ player1: 0, player2: 0 });
  const [totalBaseballScore, setTotalBaseballScore] = useState({ player1: 0, player2: 0 });
  const [innings, setInnings] = useState<{ player1: [number, number]; player2: [number, number] }[]>([{ player1: [0, 0], player2: [0, 0] }]);
  const [initialScore, setInitialScore] = useState(301);
  // Store finalized rounds: each round is an object with player1 and player2 round scores (as numbers)
  const [rounds, setRounds] = useState<{ player1: number; player2: number }[]>([]);
  // Store the current round inputs (as strings so the user can edit them)
  const [currentRound, setCurrentRound] = useState({ player1: '', player2: '' });
  const initialPlayerScores = scoreboardValues.reduce((acc: { [key: string]: number }, val) => {
    acc[val] = 0;
    return acc;
  }, {});
  const [player1Scores, setPlayer1Scores] = useState({ ...initialPlayerScores });
  const [player2Scores, setPlayer2Scores] = useState({ ...initialPlayerScores });
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [possesions, setPossessions] = useState<{ player1: number; player2: number }[]>([{ player1: 0, player2: 0 }]);
  const [currentPossesionScore, setCurrentPossesionScore] = useState({ player1: 0, player2: 0 });

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
  const [commonOptions, setCommonOptions] = useState({});
  const [commonOptions2, setCommonOptions2] = useState({});
  const [stickerState, setStickerState] = useState<ParentComponentState>({
    triggerSlide: false,
    animationCount: 0,
  });

  const [robOPointingStickerState, setRobOPointingStickerState] = useState<ParentComponentState>({
    triggerSlide: false,
    animationCount: 0,
  });

  const [robNPointingStickerState, setRobNPointingStickerState] = useState<ParentComponentState>({
    triggerSlide: false,
    animationCount: 0,
  });

  const handleTrigger = (): void => {
    setStickerState(prevState => ({
      ...prevState,
      triggerSlide: true
    }));
  };

  const handleRobOPointingTrigger = (): void => {
    setRobOPointingStickerState(prevState => ({
      ...prevState,
      triggerSlide: true
    }));
  };

  const handleRobNPointingTrigger = (): void => {
    setRobNPointingStickerState(prevState => ({
      ...prevState,
      triggerSlide: true
    }));
  };

  const handleAnimationComplete = (): void => {
    setStickerState(prevState => ({
      triggerSlide: false,
      animationCount: prevState.animationCount + 1
    }));
  };

  const handleRobOPointingAnimationComplete = (): void => {
    setRobOPointingStickerState(prevState => ({
      triggerSlide: false,
      animationCount: prevState.animationCount + 1
    }));
  };

  const handleRobNPointingAnimationComplete = (): void => {
    setRobNPointingStickerState(prevState => ({
      triggerSlide: false,
      animationCount: prevState.animationCount + 1
    }));
  };

  const handleSetPlayerOneName = (e: string) => {
    setPlayerOneName(e);
    if (currentGameId !== "") {
      setSaveNameButtonActive(true);
      //   const result = client.models.DartGame.update({
      //     id: currentGameId,
      //     player1Name: e
      //   }).then(() => {
      //     console.log("Player 1 name updated successfully");
      //   }).catch((error) => {
      //     console.error("Error updating player 1 name:", error);
      //   });
      //   console.log(result);
    }
  }

  const handleSetPlayerTwoName = (e: string) => {
    setPlayerTwoName(e);
    if (currentGameId !== "") {
      setSaveNameButtonActive(true);
      //   const result = client.models.DartGame.update({
      //     id: currentGameId,
      //     player2Name: e
      //   }).then(() => {
      //     console.log("Player 2 name updated successfully");
      //   }).catch((error) => {
      //     console.error("Error updating player 2 name:", error);
      //   });
      //   console.log(result);
    }
  }

  const handleSavePlayerNames = () => {
    if (currentGameId === "") {
      return;
    }
    const result = client.models.DartGame.update({
      id: currentGameId,
      player1Name: playerOneName,
      player2Name: playerTwoName
    }).then(() => {
      console.log("Player names updated successfully");
    }).catch((error) => {
      console.error("Error updating player names:", error);
    });
    console.log(result);
    setSaveNameButtonActive(false);
  };

  const angles = [60, 120];
  const doubleAngles = angles.concat(angles);
  const instance = useRef<any>(null);
  const onInit = ({ confetti }: { confetti: any }) => {
    instance.current = confetti;
  };

  const fire = (player: string) => {
    if (player === "player1") {
      doubleAngles.forEach((angle, index) => {
        setTimeout(() => {
          instance.current && instance.current({
            ...commonOptions,
            angle
          });
        }, index * 200);
      });
    }
    else {
      doubleAngles.forEach((angle, index) => {
        setTimeout(() => {
          instance.current && instance.current({
            ...commonOptions2,
            angle
          });
        }, index * 200);
      });
    }
  };

  const fetchActiveDartGames = () => {
    client.models.DartGame.observeQuery().subscribe({
      next: async (data) => {
        // setDartGames([...data.items]);
        parseDartGameData(data.items);
      },
      error: (error) => {
        console.error("Error fetching dart games", error);
      }
    });
  }

  const parseDartGameData = (data: Array<Schema["DartGame"]["type"]>) => {
    const parsedData = data.map((game) => {
      if (game.status === "Completed") {
        return;
      }
      if (game.gameType === "ThreeOhOne" || game.gameType === "FiveOhOne" || game.gameType === "SevenOhOne") {
        const player1RoundScores = game.x01RoundScoresPlayer1 ?? [];
        const player2RoundScores = game.x01RoundScoresPlayer2 ?? [];
        const roundData: { player1: number; player2: number }[] = [];
        player2RoundScores.forEach((score, index) => {
          roundData.push({ player1: player1RoundScores[index] ?? 0, player2: score ?? 0 });
        });
        setRounds(roundData);
        if (game.cricketTotalPointsPlayer1 && game.cricketTotalPointsPlayer1.length > 0) {
          setCurrentRound({ player1: game.cricketTotalPointsPlayer1?.[game.cricketTotalPointsPlayer1.length - 1]?.toString() ?? "", player2: "" });
        }
      }
      if (game.gameType === "Cricket") {
        const player1TotalPoints = game.cricketTotalPointsPlayer1 ?? [];
        const player2TotalPoints = game.cricketTotalPointsPlayer2 ?? [];
        setPlayerOneTotalPoints(player1TotalPoints.filter((point): point is number => point !== null));
        setPlayerTwoTotalPoints(player2TotalPoints.filter((point): point is number => point !== null));
        const player1Tallies = game.cricketMarksPlayer1 ?? [];
        const player2Tallies = game.cricketMarksPlayer2 ?? [];
        const player1Inputs = scoreboardValues.reduce((acc: { [key: string]: number }, val, index) => {
          acc[val] = player1Tallies[index] ?? 0;
          return acc;
        }, {});
        setPlayer1Inputs(player1Inputs);
        const player2Inputs = scoreboardValues.reduce((acc: { [key: string]: number }, val, index) => {
          acc[val] = player2Tallies[index] ?? 0;
          return acc;
        }, {});
        setPlayer2Inputs(player2Inputs);
      }
      if (game.gameType === "Baseball") {
        const player1InningScores = game.baseballInningScoresPlayer1 ?? [];
        const player2InningScores = game.baseballInningScoresPlayer2 ?? [];
        const player1InningErrors = game.baseballInningErrorsPlayer1 ?? [];
        const player2InningErrors = game.baseballInningErrorsPlayer2 ?? [];
        const inningData: { player1: [number, number]; player2: [number, number] }[] = [];
        player1InningScores.forEach((score, index) => {
          inningData.push({
            player1: [score ?? 0, player1InningErrors[index] ?? 0],
            player2: [player2InningScores[index] ?? 0, player2InningErrors[index] ?? 0]
          });
        });
        setCurrentInning((player1InningScores.length + 1).toString());
        setInnings(inningData);
      }
      setCurrentGameId(game.id ?? "");
      setPlayerOneName(game.player1Name ?? "Player 1");
      setPlayerTwoName(game.player2Name ?? "Player 2");
    });
    return parsedData;
  };

  const handleSubmitInning = () => {
    const totalBaseballScore = innings.reduce((acc, inning) => {
      acc.player1 += inning.player1[0];
      acc.player2 += inning.player2[0];
      return acc;
    }, { player1: 0, player2: 0 });
    setTotalBaseballScore(totalBaseballScore);
    setInnings([...innings, { player1: [currentInningScore.player1, currentInningErrors.player1], player2: [currentInningScore.player2, currentInningErrors.player2] }]);
    setCurrentInningScore({ player1: 0, player2: 0 });
    setCurrentInningErrors({ player1: 0, player2: 0 });
    if (currentInningScore.player1 > currentInningScore.player2 && playerOneName.includes("RobO")) {
      handleRobOPointingTrigger();
    } else if (currentInningScore.player2 > currentInningScore.player1 && playerTwoName.includes("RobO")) {
      handleRobOPointingTrigger();
    }
    else if (currentInningScore.player1 > currentInningScore.player2 && playerOneName.includes("RobN")) {
      handleRobNPointingTrigger();
    } else if (currentInningScore.player2 > currentInningScore.player1 && playerTwoName.includes("RobN")) {
      handleRobNPointingTrigger();
    }

    let winner = "";
    setCurrentInning((parseInt(currentInning) + 1).toString());
    if (parseInt(currentInning) >= 9) {
      if (totalBaseballScore.player1 > totalBaseballScore.player2) {
        console.log("Player 1 wins!");
        winner = "player1";
      } else if (totalBaseballScore.player1 < totalBaseballScore.player2) {
        console.log("Player 2 wins!");
        winner = "player2";
      } else {
        const updatedBaseBallInningValues = [...baseBallInningValues];
        updatedBaseBallInningValues.push((innings.length + 2).toString());
        setBaseBallInningValues(updatedBaseBallInningValues);
        // if (innings.length === 8) {
        //     updatedBaseBallInningValues.push((innings.length + 2).toString());
        // }
        // else {
        //     updatedBaseBallInningValues.push((innings.length + 1).toString());
        //     setBaseBallInningValues(updatedBaseBallInningValues);
        // }
      }
    }
    const result = client.models.DartGame.update({
      id: currentGameId,
      baseballInningScoresPlayer1: [...innings.map((inning) => inning.player1[0]), currentInningScore.player1],
      baseballInningScoresPlayer2: [...innings.map((inning) => inning.player2[0]), currentInningScore.player2],
      baseballInningErrorsPlayer1: [...innings.map((inning) => inning.player1[1]), currentInningErrors.player1],
      baseballInningErrorsPlayer2: [...innings.map((inning) => inning.player2[1]), currentInningErrors.player2],
      winnerName: winner === "player1" ? playerOneName : winner === "player2" ? playerTwoName : "",
      loserName: winner === "player1" ? playerTwoName : winner === "player2" ? playerOneName : "",
      status: winner ? "Completed" : "InProgress",
      endTime: winner ? new Date().getTime() : null
    }).then(() => {
      console.log("Inning submitted successfully");
    }).catch((error) => {
      console.error("Error submitting inning:", error);
    });
    console.log(result);
    if (winner !== "") {
      if (winner === "player1") {
        fire("player1");
      }
      else {
        fire("player2");
      }
      setCurrentGameId("");
      resetScores();
    }
  };

  const handleBaseballInputChange = (e: string, player: 'player1' | 'player2', type: 'score' | 'errors') => {
    if (e === "") {
      setCurrentInningScore({ ...currentInningScore, [player]: 0 });
      return;
    }

    const value = parseInt(e, 10) || 0;
    if (type === 'score') {
      setCurrentInningScore({ ...currentInningScore, [player]: value });
    } else if (type === 'errors') {
      setCurrentInningErrors({ ...currentInningErrors, [player]: value });
    }
  };

  const handleRNFInputChange = (e: string, player: 'player1' | 'player2') => {
    if (e === "") {
      setCurrentPossesionScore({ ...currentPossesionScore, [player]: 0 });
      return;
    }

    const value = parseInt(e, 10) || 0;
    setCurrentPossesionScore({ ...currentPossesionScore, [player]: value });
  };

  const handleRNFSubmit = () => {
    const updatedPossesions = [...possesions];
    updatedPossesions.push({ player1: currentPossesionScore.player1, player2: currentPossesionScore.player2 });
    setPossessions(updatedPossesions);
    setCurrentPossesionScore({ player1: 0, player2: 0 });
    const result = client.models.DartGame.update({
      id: currentGameId,
      robdayNightFootballScoresPlayer1: updatedPossesions.map((possession) => possession.player1),
      robdayNightFootballScoresPlayer2: updatedPossesions.map((possession) => possession.player2),
    }).then(() => {
      console.log("Possession submitted successfully");
    }).catch((error) => {
      console.error("Error submitting possession:", error);
    });
    console.log(result);
    setCurrentQuarter((currentQuarter + 1));
    if (currentQuarter >= 8) {
      let winner = "";
      const player1Total = possesions.reduce((acc, possession) => acc + possession.player1, 0);
      const player2Total = possesions.reduce((acc, possession) => acc + possession.player2, 0);
      if (player1Total > player2Total) {
        winner = "player1";
      } else if (player1Total < player2Total) {
        winner = "player2";
      }
      const result = client.models.DartGame.update({
        id: currentGameId,
        winnerName: winner === "player1" ? playerOneName : winner === "player2" ? playerTwoName : "",
        loserName: winner === "player1" ? playerTwoName : winner === "player2" ? playerOneName : "",
        status: "Completed",
        endTime: new Date().getTime()
      }).then(() => {
        console.log("Game completed successfully");
      }).catch((error) => {
        console.error("Error completing game:", error);
      });
      console.log(result);
      if (winner !== "") {
        if (winner === "player1") {
          fire("player1");
        }
        else {
          fire("player2");
        }
        setCurrentGameId("");
        resetScores();
      }
    }
  };

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
      setCurrentRound({ ...currentRound, [player]: '' });
      return;
    }

    setCurrentRound({ ...currentRound, [player]: e });
  };

  // Compute the cumulative score for a player from all finalized rounds
  const cumulativeScore = (player: 'player1' | 'player2') => {
    return rounds.reduce((total, round) => total + (Number(round[player]) || 0), 0);
  };

  const cumulativeScoreBaseball = (player: 'player1' | 'player2') => {
    return innings.reduce((total, inning) => total + inning[player][0], 0);
  }

  const cumulativeErrorsBaseball = (player: 'player1' | 'player2') => {
    return innings.reduce((total, inning) => total + inning[player][1], 0);
  }

  const cumulativeScoreRNF = (player: 'player1' | 'player2') => {
    return possesions.reduce((total, possession) => total + (Number(possession[player]) || 0), 0);
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

  const submitRoundPlayer1 = () => {
    console.log("Player 1 current round: ", currentRound.player1);
    const player1Score = parseInt(currentRound.player1, 10) || 0;
    const result = client.models.DartGame.update({
      id: currentGameId,
      // temporarily store the value in cricket points so we don't create a new round
      cricketTotalPointsPlayer1: [...playerOneTotalPoints, player1Score]
    }).then(() => {
      console.log("Player 1 round score saved successfully");
    }).catch((error) => {
      console.error("Error saving Player 1 round score:", error);
    });
    console.log(result);
    // setRounds([...rounds, { player1: player1Score, player2: 0 }]);
  }

  // When the user clicks "Submit Round", parse the inputs and add the round to the list
  const submitRound = () => {
    // Parse the input values, defaulting to 0 if empty or invalid.
    const player1Score = parseInt(currentRound.player1, 10) || 0;
    const player2Score = parseInt(currentRound.player2, 10) || 0;
    setRounds([...rounds, { player1: player1Score, player2: player2Score }]);
    setCurrentRound({ player1: '', player2: '' });
    let winner = "";
    let status = "InProgress";
    if (player1Score === 0) {

      winner = "player1";
      status = "Completed";
    } else if (player2Score === 0) {
      winner = "player2";
      status = "Completed";
    }

    if (player1Score > player2Score && playerOneName.includes("RobO")) {
      handleRobOPointingTrigger();
    } else if (player2Score > player1Score && playerTwoName.includes("RobO")) {
      handleRobOPointingTrigger();
    } else if (player1Score > player2Score && playerOneName.includes("RobN")) {
      handleRobNPointingTrigger();
    } else if (player2Score > player1Score && playerTwoName.includes("RobN")) {
      handleRobNPointingTrigger();
    }
    // Push updates to server
    const result = client.models.DartGame.update({
      id: currentGameId,
      x01RoundScoresPlayer1: [...rounds.map((round) => round.player1), player1Score],
      x01RoundScoresPlayer2: [...rounds.map((round) => round.player2), player2Score],
      status: status as "InProgress" | "Completed",
      winnerName: winner === "player1" ? playerOneName : winner === "player2" ? playerTwoName : "",
      loserName: winner === "player1" ? playerTwoName : winner === "player2" ? playerOneName : "",
      endTime: winner ? new Date().getTime() : null,
      cricketTotalPointsPlayer1: []
    }).then(() => {
      console.log("Round submitted successfully");
    }).catch((error) => {
      console.error("Error submitting round:", error);
    });
    console.log(result);
    if (winner !== "") {
      if (winner === "player1") {
        fire("player1");
      } else {
        fire("player2");
      }
      setCurrentGameId("");
      setCurrentRound({ player1: '', player2: '' });
      // resetScores();
    }
  };

  const undoRound = () => {
    setRounds(rounds.slice(0, -1));
  }

  const incrementValTally = (player: 'player1' | 'player2', val: string) => {
    console.log("player", player);
    console.log("val", val);
    let tempDict = player1Inputs;
    let tempDict2 = player2Inputs;
    if (player === 'player1') {
      console.log("player1Inputs[val]", player1Inputs[val]);
      if (player1Inputs[val] === 3) {
        setPlayer1Inputs({ ...player1Inputs, [val]: 0 });
        tempDict = { ...player1Inputs, [val]: 0 };
        return;
      }
      setPlayer1Inputs({ ...player1Inputs, [val]: (player1Inputs[val] || 0) + 1 });
      tempDict = { ...player1Inputs, [val]: (player1Inputs[val] || 0) + 1 };
    } else {
      console.log("player2Inputs[val]", player2Inputs[val]);
      if (player2Inputs[val] === 3) {
        setPlayer2Inputs({ ...player2Inputs, [val]: 0 });
        tempDict2 = { ...player2Inputs, [val]: 0 };
        return;
      }
      setPlayer2Inputs({ ...player2Inputs, [val]: (player2Inputs[val] || 0) + 1 });
      tempDict2 = { ...player2Inputs, [val]: (player2Inputs[val] || 0) + 1 };
    }

    // map tally dict to array where 20 is index 0, 19 is index 1, etc.
    const tallyArray = scoreboardValues.map((val) => tempDict[val]);
    const tallyArray2 = scoreboardValues.map((val) => tempDict2[val]);
    console.log("tallyArray", tallyArray);
    const result = client.models.DartGame.update({
      id: currentGameId,
      cricketMarksPlayer1: tallyArray,
      cricketMarksPlayer2: tallyArray2,
    }).then(() => {
      console.log("Tally updated successfully");
    }).catch((error) => {
      console.error("Error updating tally:", error);
    });
    // check if player1 or player2 has 3 tallies for all values
    if (Object.values(tempDict).every((val) => val === 3)) {
      // check if neither player has points or if player1 has more than player2
      if (playerOnePoints === 0 || playerOnePoints > playerTwoPoints) {
        fire("player1");
        const result2 = client.models.DartGame.update({
          id: currentGameId,
          status: "Completed",
          winnerName: playerOneName,
          loserName: playerTwoName,
          endTime: new Date().getTime()
        }).then(() => {
          console.log("Game completed successfully");
        }).catch((error) => {
          console.error("Error completing game:", error);
        });
      }
    } else if (Object.values(tempDict2).every((val) => val === 3)) {
      // check if neither player has points or if player2 has more than player1
      if (playerTwoPoints === 0 || playerTwoPoints > playerOnePoints) {
        fire("player2");
        const result2 = client.models.DartGame.update({
          id: currentGameId,
          status: "Completed",
          winnerName: playerTwoName,
          loserName: playerOneName,
          endTime: new Date().getTime()
        }).then(() => {
          console.log("Game completed successfully");
        }).catch((error) => {
          console.error("Error completing game:", error);
        });
      }
    }
  };

  const addPointsCricket = (points: string, player: 'player1' | 'player2') => {

    const numericPoints = parseInt(points, 10) || 0;

    if (player === 'player1') {
      setPlayerOnePoints(numericPoints);
    } else {
      setPlayerTwoPoints(numericPoints);
    }
  };

  const onAddPointsCricket = () => {
    let tempPlayer1Points = playerOnePoints;
    let tempPlayer2Points = playerTwoPoints;
    // If temp1Player1Points is NAN, set it to 0
    if (isNaN(tempPlayer1Points)) {
      tempPlayer1Points = 0;
    }


    if (isNaN(tempPlayer2Points)) {
      tempPlayer2Points = 0;
    }

    const newPlayer1Total = playerOneTotalPoints[playerOneTotalPoints.length - 1] + tempPlayer1Points;
    const newPlayer2Total = playerTwoTotalPoints[playerTwoTotalPoints.length - 1] + tempPlayer2Points;
    const newPlayerOneTotalPoints = [...playerOneTotalPoints, newPlayer1Total];
    const newPlayerTwoTotalPoints = [...playerTwoTotalPoints, newPlayer2Total];
    if (newPlayerOneTotalPoints.length > 7) {
      newPlayerOneTotalPoints.shift();
    }
    if (newPlayerTwoTotalPoints.length > 7) {
      newPlayerTwoTotalPoints.shift();
    }
    console.log("newPlayerOneTotalPoints", newPlayerOneTotalPoints);
    console.log("newPlayerTwoTotalPoints", newPlayerTwoTotalPoints);
    if (tempPlayer1Points > 0) {
      setPlayerOneTotalPoints(newPlayerOneTotalPoints);
    }
    if (tempPlayer2Points > 0) {
      setPlayerTwoTotalPoints(newPlayerTwoTotalPoints);
    }
    setPlayerOnePoints(0);
    setPlayerTwoPoints(0);

    const result = client.models.DartGame.update({
      id: currentGameId,
      cricketTotalPointsPlayer1: newPlayerOneTotalPoints,
      cricketTotalPointsPlayer2: newPlayerTwoTotalPoints,
      cricketMarksPlayer1: scoreboardValues.map((val) => player1Inputs[val]),
      cricketMarksPlayer2: scoreboardValues.map((val) => player2Inputs[val]),
    }).then(() => {
      console.log("Points added successfully");
    }).catch((error) => {
      console.error("Error adding points:", error);
    });
  };

  const handleInputChangeCricket = (
    player: 'player1' | 'player2',
    val: string,
    points: number,
    tally: number
  ) => {
    // const input = e;
    console.log("input", val, points, tally);
    if (player === 'player1') {
      setPlayer1Inputs({ ...player1Inputs, [val]: tally });
      const newTotal = playerOnePoints + points;
      setPlayerOnePoints(newTotal);

    } else {
      setPlayer2Inputs({ ...player2Inputs, [val]: tally });
      const newTotal = playerTwoPoints + points;
      setPlayerTwoPoints(newTotal);
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
    setCurrentRound({ player1: '', player2: '' });
    setRounds([]);
    setPlayerOnePoints(0);
    setPlayerTwoPoints(0);
    setPlayerOneTotalPoints([0]);
    setPlayerTwoTotalPoints([0]);
    setPlayer1Scores({ ...initialPlayerScores });
    setPlayer2Scores({ ...initialPlayerScores });
    setPlayer1Inputs({ ...initialPlayerScores });
    setPlayer2Inputs({ ...initialPlayerScores });
    setInnings([]);
    setCurrentInning("1");
    setCurrentInningScore({ player1: 0, player2: 0 });
    setCurrentInningErrors({ player1: 0, player2: 0 });
    setTotalBaseballScore({ player1: 0, player2: 0 });
    setBaseBallInningValues(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    setRobdayNightFootballValues(["1", "-", "2", "-", "3", "-", "4", "-"]);
    setCurrentQuarter(1);
    setPossessions([{ player1: 0, player2: 0 }]);
    setCurrentPossesionScore({ player1: 0, player2: 0 });
    handleTrigger();
  };

  const createNewDartGame = () => {
    let gameType = "";
    if (currentGameType === "301") {
      gameType = "ThreeOhOne";
    } else if (currentGameType === "501") {
      gameType = "FiveOhOne";
    } else if (currentGameType === "701") {
      gameType = "SevenOhOne";
    } else if (currentGameType === "Cricket") {
      gameType = "Cricket";
    } else if (currentGameType === "Baseball") {
      gameType = "Baseball";
    } else {
      gameType = "RobdayNightFootball";
    }
    const result = client.models.DartGame.create({
      gameType: gameType as "ThreeOhOne" | "FiveOhOne" | "SevenOhOne" | "Cricket" | "Baseball" | "RobdayNightFootball",
      x01RoundScoresPlayer1: [],
      x01RoundScoresPlayer2: [],
      cricketMarksPlayer1: [],
      cricketMarksPlayer2: [],
      cricketTotalPointsPlayer1: [0],
      cricketTotalPointsPlayer2: [0],
      baseballInningScoresPlayer1: [],
      baseballInningScoresPlayer2: [],
      baseballInningErrorsPlayer1: [],
      baseballInningErrorsPlayer2: [],
      status: "InProgress",
      player1Name: playerOneName,
      player2Name: playerTwoName,
      startTime: new Date().getTime(),
    }).then((data) => {
      console.log("New dart game created:", data);
      // setCurrentGameId(data.id ?? "");
    }).catch((error) => {
      console.error("Error creating new dart game:", error);
    });
    console.log(result);
    handleTrigger();
  };

  const endDartGame = () => {
    const result = client.models.DartGame.update({
      id: currentGameId,
      status: "Completed",
      endTime: new Date().getTime()
    }).then(() => {
      console.log("Dart game ended successfully");
    }).catch((error) => {
      console.error("Error ending dart game:", error);
    });
    console.log(result);
    setCurrentGameId("");
    resetScores();
  }

  useEffect(() => {
    fetchActiveDartGames();
    setCommonOptions({
      spread: 55,
      // ticks: 200,
      gravity: .8,
      // decay: 0.9,
      startVelocity: 20,
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      particleCount: 3,
      shapes: [confetti.shapeFromText({ text: "☹️" }), confetti.shapeFromText({ text: "😒" })],
      scalar: 3,
      // flat: true,
      origin: { x: 0.0, y: 0.3 }
    });
    setCommonOptions2({
      spread: 55,
      // ticks: 200,
      gravity: .8,
      // decay: 0.9,
      startVelocity: 30,
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      particleCount: 10,
      shapes: [confetti.shapeFromText({ text: "☹️" }), confetti.shapeFromText({ text: "😒" })],
      scalar: 2,
      origin: { x: 1.0, y: 0.3 },
      flat: true
    });
  }, []);

  return (
    <Column fillWidth fillHeight justifyContent="center" alignItems="center" background="surface" padding="xs">
      <ReactCanvasConfetti onInit={onInit} />

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
      {(currentGameId === "") && (
        <Row fillWidth gap="16" justifyContent="center" padding="s">
          <Button variant="primary" onClick={createNewDartGame}>
            Create New Game
          </Button>
        </Row>
      )}
      {(currentGameType === "301" || currentGameType === "501" || currentGameType === "701") && (
        <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
          <Heading align="center">
            Dart Scoreboard (Game: {initialScore})
          </Heading>
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
                    <input type="text" value={playerOneName} onChange={(e) => handleSetPlayerOneName(e.target.value)}
                      style={{ paddingLeft: 0, paddingRight: 0, width: '70px', backgroundColor: 'transparent', border: 'none', color: '#BBB', zIndex: 10 }}
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
                    <input type="text" value={playerTwoName} onChange={(e) => handleSetPlayerTwoName(e.target.value)}
                      style={{ paddingLeft: 0, paddingRight: 0, width: '70px', backgroundColor: 'transparent', border: 'none', color: '#BBB', zIndex: 10 }}
                    />
                  </Text>
                </th>
              </tr>
              {saveNameButtonActive && (
                <tr>
                  <th colSpan={5}>
                    <Column fillWidth alignItems="center" justifyContent="center">
                      <Button variant="primary" onClick={handleSavePlayerNames}>
                        Save Names
                      </Button>
                    </Column>
                  </th>
                </tr>
              )}
              <tr>
                <th colSpan={5}>
                  <Text variant="body-default-xs">
                    -
                  </Text>
                </th>
              </tr>
              <tr style={{ borderBottom: '2px solid #EEE', marginTop: '10px' }}>
                <th style={{ borderRight: "1px solid #EEE", padding: "0.1rem", color: '#CCC' }}>
                  <Text variant="heading-default-xs">
                    ROUND SCORE
                  </Text>
                </th>
                <th style={{ padding: "0.1rem", color: '#CCC' }}>
                  <Text variant="label-default-xs">
                    REMAINING
                  </Text>
                </th>
                <th style={{ borderLeft: '1px solid #EEE', borderRight: "1px solid #EEE", padding: "0.1rem", color: "#EEE" }}>
                  <Text variant="heading-strong-l">
                    {currentGameType}
                  </Text>
                </th>
                <th style={{ borderLeft: '1px solid #EEE', borderRight: "1px solid #EEE", padding: "0.1rem", color: '#CCC' }}>
                  <Text variant="heading-default-xs">
                    ROUND SCORE
                  </Text>
                </th>
                <th style={{ padding: "0.1rem", color: '#CCC' }}>
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
                  <td style={{ color: "#BBB", textDecoration: "line-through" }}>{computeRemainingAfterRound('player1', index)}</td>
                  <td style={{ borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>{index + 1}</td>
                  <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>{round.player2}</td>
                  <td style={{ color: "#BBB", textDecoration: "line-through" }}>{computeRemainingAfterRound('player2', index)}</td>
                </tr>
              ))}
              {/* Current round input row */}
              <tr style={{ borderTop: '2px dashed #666' }}>
                <td style={{ borderLeft: '1px dashed #666', borderRight: '1px dashed #666', color: "#BBB" }}>
                  <input
                    type="number"
                    value={parseInt(currentRound.player1)}
                    onChange={(e) => handleInputChange(e.target.value, 'player1')}
                    placeholder={""}
                    style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                  />
                </td>
                <td style={{ color: "#EEE" }}>{currentRemaining('player1')}</td>
                <td style={{ borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }} >{rounds.length + 1}</td>
                <td >
                  <input
                    type="number"
                    value={parseInt(currentRound.player2)}
                    onChange={(e) => handleInputChange(e.target.value, 'player2')}
                    placeholder={""}
                    style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                  />
                </td>
                <td style={{ borderLeft: '1px dashed #666', borderRight: '1px dashed #666', color: "#EEE" }}>{currentRemaining('player2')}</td>
              </tr>
            </tbody>
          </table>
          <Row fillWidth gap="16" justifyContent="space-between" padding="s">
            <Button variant="primary" onClick={submitRoundPlayer1} size="s">
              Save Player1
            </Button>
            <Button variant="secondary" onClick={undoRound}>
              Undo
            </Button>
            <Button variant="primary" onClick={submitRound} size="s">
              Save Player2
            </Button>
          </Row>
        </div>
      )}

      {(currentGameType === "Cricket") && (
        <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
          <Heading align="center">
            Dart Scoreboard (Game: {currentGameType})
          </Heading>
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
                      style={{ paddingLeft: 0, paddingRight: 0, width: '70px', backgroundColor: 'transparent', border: 'none', color: '#BBB', zIndex: 10 }}
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
                      style={{ paddingLeft: 0, paddingRight: 0, width: '70px', backgroundColor: 'transparent', border: 'none', color: '#BBB', zIndex: 10 }}
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
                <th style={{ borderRight: "1px solid #EEE", padding: "0.1rem", color: '#CCC' }}>
                  <Text variant="heading-default-xs">
                    POINTS
                  </Text>
                </th>
                <th style={{ padding: "0.1rem", color: '#CCC' }}>
                  <Text variant="label-default-xs">
                    TALLY
                  </Text>
                </th>
                <th style={{ borderLeft: '1px solid #EEE', borderRight: "1px solid #EEE", padding: "0.1rem", color: "#EEE" }}>
                  <Text variant="heading-strong-l">
                    {currentGameType}
                  </Text>
                </th>
                <th style={{ padding: "0.1rem", color: '#CCC' }}>
                  <Text variant="label-default-xs">
                    TALLY
                  </Text>
                </th>
                <th style={{ borderLeft: '1px solid #EEE', borderRight: "1px solid #EEE", padding: "0.1rem", color: '#CCC' }}>
                  <Text variant="heading-default-xs">
                    POINTS
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Render each finalized round */}
              {scoreboardValues.map((round, index) => (
                <tr key={index} style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666' }}>
                  <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB", textDecoration: (playerOneTotalPoints.length > index + 1 ? "line-through" : "none") }}>
                    {playerOneTotalPoints[index]?.toString()}
                    {/* <input
                                        type="number"
                                        value={playerOnePoints}
                                        onChange={(e) => handleInputChangeCricket("player1", round, parseInt(e.target.value), 0)}
                                        placeholder={""}
                                        style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #555', color: '#BBB', zIndex: 10 }}
                                        /> */}
                  </td>
                  <td style={{ color: "#BBB" }}>
                    <Card maxWidth={10} height={3} onClick={incrementValTally.bind(null, 'player1', round)} zIndex={10} alignItems="center" justifyContent="center" border="transparent">
                      <Column fillWidth alignItems="center" justifyContent="center">
                        {(player1Inputs[round] === 1 ? <Icon name="single" size="xl" /> :
                          player1Inputs[round] === 2 ? <Icon name="double" size='xl' /> :
                            player1Inputs[round] === 3 ? <Icon name="singleClosed" size="xl" /> :
                              <Line width={3} height={3} background="neutral-alpha-weak" />)}
                      </Column>
                    </Card>
                  </td>
                  <td style={{ borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>
                    {round}
                  </td>
                  <td style={{ color: "#BBB" }}>
                    <Card maxWidth={10} height={3} onClick={incrementValTally.bind(null, 'player2', round)} zIndex={10} alignItems="center" justifyContent="center" border="transparent">
                      <Column fillWidth alignItems="center" justifyContent="center">
                        {(player2Inputs[round] === 1 ? <Icon name="single" size="xl" /> :
                          player2Inputs[round] === 2 ? <Icon name="double" size='xl' /> :
                            player2Inputs[round] === 3 ? <Icon name="singleClosed" size="xl" /> :
                              <Line width={3} height={3} background="neutral-alpha-weak" />)}
                      </Column>
                    </Card>
                  </td>
                  <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>
                    {playerTwoTotalPoints[index]?.toString()}
                    {/* <input
                                        type="number"
                                        // value={player2Scores[round]}
                                        value={playerTwoPoints}
                                        onChange={(e) => handleInputChangeCricket("player2", round, parseInt(e.target.value), 0)}
                                        placeholder={""}
                                        style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #555', color: '#BBB', zIndex: 10 }}
                                    /> */}
                  </td>
                </tr>
              ))}
              {/* Current round input row */}
              <tr style={{ borderTop: '2px dashed #666' }}>
                <td style={{ borderLeft: '1px dashed #666', borderRight: '1px dashed #666', color: "#BBB" }}>
                  <input
                    type="number"
                    value={playerOnePoints}
                    onChange={(e) => addPointsCricket(e.target.value, 'player1')}
                    placeholder={""}
                    style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                  />
                </td>
                <td style={{ color: "#EEE" }}>
                  {playerOneTotalPoints[-1]}
                </td>
                <td style={{ borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }} ></td>
                <td style={{ borderLeft: '1px dashed #666', borderRight: '1px dashed #666', color: "#EEE" }}>{playerTwoTotalPoints[-1]}</td>
                <td >
                  <input
                    type="number"
                    value={playerTwoPoints}
                    onChange={(e) => addPointsCricket(e.target.value, 'player2')}
                    placeholder={""}
                    style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {(playerOnePoints > 0 || playerTwoPoints > 0) && (
            <Row fillWidth gap="16" justifyContent="center">
              <Button variant="primary" onClick={onAddPointsCricket}>
                Add Points
              </Button>
            </Row>
          )}
        </div>
      )}
      {(currentGameType === "Baseball") && (
        <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
          <Heading align="center">
            Dart Scoreboard (Game: {currentGameType})
          </Heading>
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
                      style={{ paddingLeft: 0, paddingRight: 0, width: '70px', backgroundColor: 'transparent', border: 'none', color: '#BBB', zIndex: 10 }}
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
                      style={{ paddingLeft: 0, paddingRight: 0, width: '70px', backgroundColor: 'transparent', border: 'none', color: '#BBB', zIndex: 10 }}
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
                <th style={{ borderRight: "1px solid #EEE", paddingLeft: "0.5rem", paddingRight: "0.5rem", color: '#CCC' }}>
                  <Text variant="heading-default-xs">
                    RUNS
                  </Text>
                </th>
                <th style={{ paddingRight: "0.5rem", paddingLeft: "0.5rem", color: '#CCC' }}>
                  <Text variant="label-default-xs">
                    E
                  </Text>
                </th>
                <th style={{ borderLeft: '1px solid #EEE', borderRight: "1px solid #EEE", padding: "0.5rem", color: "#EEE" }}>
                  <Text variant="heading-strong-l">
                    {currentGameType}
                  </Text>
                </th>
                <th style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem", color: '#CCC' }}>
                  <Text variant="heading-default-xs">
                    RUNS
                  </Text>
                </th>
                <th style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem", color: '#CCC', borderLeft: '1px solid #EEE' }}>
                  <Text variant="label-default-xs">
                    E
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {baseBallInningValues.map((inning, index) => (
                (parseInt(currentInning) > index + 1) ? (
                  <tr key={index} style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666' }}>
                    <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>{innings[index]?.player1[0]}</td>
                    <td style={{ color: "#BBB" }}>{innings[index]?.player1[1]}</td>
                    <td style={{ borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>{inning}</td>
                    <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>{innings[index]?.player2[0]}</td>
                    <td style={{ color: "#BBB" }}>{innings[index]?.player2[1]}</td>
                  </tr>
                ) :
                  (parseInt(currentInning) === index + 1) ? (
                    <tr key={index} style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666' }}>
                      <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>
                        <input
                          type="number"
                          value={currentInningScore.player1}
                          onChange={(e) => handleBaseballInputChange(e.target.value, 'player1', 'score')}
                          placeholder={""}
                          style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                        />
                      </td>
                      <td style={{ color: "#EEE" }}>
                        <input
                          type="number"
                          value={currentInningErrors.player1}
                          onChange={(e) => handleBaseballInputChange(e.target.value, 'player1', 'errors')}
                          placeholder={""}
                          style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                        />
                      </td>
                      <td style={{ borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>{inning}</td>
                      <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>
                        <input
                          type="number"
                          value={currentInningScore.player2}
                          onChange={(e) => handleBaseballInputChange(e.target.value, 'player2', 'score')}
                          placeholder={""}
                          style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                        />
                      </td>
                      <td style={{ color: "#BBB" }}>
                        <input
                          type="number"
                          value={currentInningErrors.player2}
                          onChange={(e) => handleBaseballInputChange(e.target.value, 'player2', 'errors')}
                          placeholder={""}
                          style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr key={index} style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666' }}>
                      <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>-</td>
                      <td style={{ color: "#BBB" }}>-</td>
                      <td style={{ borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>{inning}</td>
                      <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>-</td>
                      <td style={{ color: "#BBB" }}>-</td>
                    </tr>
                  )
              ))}
              <tr>
                <td>
                  <Text>
                    {cumulativeScoreBaseball("player1")}
                  </Text>
                </td>
                <td>
                  <Text>
                    {cumulativeErrorsBaseball("player1")}
                  </Text>
                </td>
                <td>
                </td>
                <td>
                  <Text>
                    {cumulativeScoreBaseball("player2")}
                  </Text>
                </td>
                <td>
                  <Text>
                    {cumulativeErrorsBaseball("player2")}
                  </Text>
                </td>
              </tr>
            </tbody>
          </table>
          <Column fillWidth justifyContent="center" alignItems="center">
            <Button variant="primary" onClick={handleSubmitInning}>
              Submit Inning
            </Button>
          </Column>
        </div>
      )}
      {(currentGameType === "Robday Night Football") && (
        <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
          <Heading align="center">
            Dart Scoreboard (Game: {currentGameType})
          </Heading>
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
                      style={{ paddingLeft: 0, paddingRight: 0, width: '70px', backgroundColor: 'transparent', border: 'none', color: '#BBB', zIndex: 10 }}
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
                      style={{ paddingLeft: 0, paddingRight: 0, width: '70px', backgroundColor: 'transparent', border: 'none', color: '#BBB', zIndex: 10 }}
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
                <th style={{ padding: "0.1rem", color: '#CCC' }}>
                  <Text variant="heading-default-xs">
                    POINTS
                  </Text>
                </th>
                <th style={{ padding: "0.1rem", color: '#CCC' }}>
                  <Text variant="label-default-xs">

                  </Text>
                </th>
                <th style={{ borderLeft: '1px solid #EEE', borderRight: "1px solid #EEE", padding: "0.1rem", color: "#EEE" }}>
                  <Text variant="heading-strong-l">
                    {currentGameType}
                  </Text>
                </th>
                <th style={{ padding: "0.1rem", color: '#CCC', borderLeft: "1px solid #EEE" }}>
                  <Text variant="heading-default-xs">
                    POINTS
                  </Text>
                </th>
                <th style={{ padding: "0.1rem", color: '#CCC', }}>
                  <Text variant="label-default-xs">

                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {robdayNightFootballValues.map((round, index) => (
                (currentQuarter > index + 1) ?
                  (<tr key={index} style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666' }}>
                    <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>
                      {possesions[index + 1]?.player1}
                    </td>
                    <td style={{ color: "#BBB" }}>
                    </td>
                    {((index + 1) % 2 === 0) ? (
                      <td style={{ borderBottom: "1px solid #DDD", borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>{round}
                      </td>
                    )
                      :
                      (
                        <td style={{ borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>{round}</td>
                      )}
                    <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>
                      {possesions[index + 1]?.player2}
                    </td>
                    <td style={{ color: "#BBB" }}>
                    </td>
                  </tr>) :
                  (currentQuarter === index + 1) ?
                    (<tr key={index} style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666' }}>
                      {/* Additional content for the current quarter can be added here */}
                      <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}>
                        <input
                          type="number"
                          value={currentPossesionScore.player1}
                          onChange={(e) => handleRNFInputChange(e.target.value, 'player1')}
                          placeholder={""}
                          style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                        />
                      </td>
                      <td style={{ color: "#BBB" }}></td>
                      {((index + 1) % 2 === 0) ? (
                        <td style={{ borderBottom: "1px solid #DDD", borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>{round}
                        </td>
                      )
                        :
                        (
                          <td style={{ borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>{round}</td>
                        )}
                      <td style={{ color: "#BBB" }}>
                        <input
                          type="number"
                          value={currentPossesionScore.player2}
                          onChange={(e) => handleRNFInputChange(e.target.value, 'player2')}
                          placeholder={""}
                          style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0, width: '30px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #EEE', color: '#EEE', zIndex: 10 }}
                        />
                      </td>
                    </tr>) :
                    (<tr key={index} style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666' }}>
                      {/* Additional content for the current quarter can be added here */}
                      <td style={{ borderLeft: '1px solid #666', borderRight: '1px solid #666', color: "#BBB" }}></td>
                      <td style={{ color: "#BBB" }}></td>
                      {((index + 1) % 2 === 0) ? (
                        <td style={{ borderBottom: "1px solid #DDD", borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>{round}
                        </td>
                      )
                        :
                        (
                          <td style={{ borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD', color: "#BBB" }}>{round}</td>
                        )}
                      <td style={{ color: "#BBB" }}></td>
                    </tr>)
              ))}
              <tr>
                <td>
                  <Text>
                    {cumulativeScoreRNF("player1")}
                  </Text>
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>
                  <Text>
                    {cumulativeScoreRNF("player2")}
                  </Text>
                </td>
                <td>
                </td>
              </tr>

            </tbody>
          </table>
          <Column fillWidth justifyContent="center" alignItems="center">
            <Button variant="primary" onClick={handleRNFSubmit}>
              Submit Possesion
            </Button>
          </Column>
        </div>
      )}
      {(currentGameId !== "") && (
        <Row fillWidth gap="16" justifyContent="center" padding="s">
          <Button variant="primary" onClick={endDartGame}>
            End Game
          </Button>
        </Row>
      )}
      {(stickerState.triggerSlide) && (
        // <div>
        //   <div className={`${styles.robsDartboard} flex`}>
        //     <img src={"/stickers/robdartsstartgame.png"}></img>
        //   </div>
        // </div>
        <SlidingImage
          trigger={stickerState.triggerSlide}
          onAnimationComplete={handleAnimationComplete}
          slideInDuration={1000}
          visibleDuration={1000}
          slideOutDuration={1000}
          axis="Y"
          startPosition="15%"
          endPosition="0%"
          rotateIn="0deg"
          rotateOut="0deg"
          // imageSrc="/stickers/robo_thumbsup1.png"
          imageSrc="/stickers/robdartsstartgame.png"
        />
      )}
      {(robOPointingStickerState.triggerSlide) && (
        <SlidingImage
          trigger={robOPointingStickerState.triggerSlide}
          onAnimationComplete={handleRobOPointingAnimationComplete}
          slideInDuration={3000}
          visibleDuration={2000}
          slideOutDuration={3000}
          axis="X"
          startPosition="-100%"
          endPosition="-35%"
          startPosition2="30%"
          rotateIn="5deg"
          rotateOut="-5deg"
          flip={-1}
          imageSrc={["/stickers/robo_catch1.png", "/stickers/robo_pointing1.png", "/stickers/robo_pointing2.png", "/stickers/robo_catch2.png", "/stickers/robo_thumbsup1.png", "/stickers/robo_thumbsup2.png", "/stickers/robo_unhappy1.png", "/stickers/robO_loser1.png", "/stickers/robO_loser2.png"][robOPointingStickerState.animationCount % 9]}
        />
      )}
      {(robNPointingStickerState.triggerSlide) && (
        <SlidingImage
          trigger={robNPointingStickerState.triggerSlide}
          onAnimationComplete={handleRobNPointingAnimationComplete}
          slideInDuration={2000}
          visibleDuration={1500}
          slideOutDuration={2000}
          axis="X"
          startPosition="100%"
          endPosition="20%"
          startPosition2="10%"
          rotateIn="2deg"
          rotateOut="-2deg"
          // Cycle through array of images
          imageSrc={["/stickers/robN_loser1.png", "/stickers/robN_uhoh.png", "/stickers/robN_winner1.png", "/stickers/robN_loser2.png"][robNPointingStickerState.animationCount % 4]}
        // imageSrc="/stickers/robN_uhoh.png"
        />
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
    </Column>
  );
}