
import RadialBar from '@/app/ui/dashboard/radial-bar';
import StackedBar from '@/app/ui/dashboard/charts/stacked-bar';
import RadarChart from '@/app/ui/dashboard/charts/radar-chart';
import {
    Column,
    Heading,
    Row,
    Grid,
    Accordion,
    Line,
    Text
} from "@/once-ui/components";

import outputs from "@/amplify_outputs.json"
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, type Schema } from "@/amplify/data/resource";



Amplify.configure(outputs);

const client = generateClient<Schema>();

export default async function RadialBarWrapper() {

    const activities = await client.models.Activity.list();
    const activityInstances = await client.models.ActivityInstance.list();
    const locations = await client.models.Location.list();
    const robdayLogs = await client.models.Robdaylog.list();
    const dartGames = await client.models.DartGame.list();
    const robNDartGameWins = dartGames.data.filter((dartGame) => dartGame.winnerName === "RobN").length;
    const robODartGameWins = dartGames.data.filter((dartGame) => dartGame.winnerName === "RobO").length;
    const baseballGamesPlayed = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball").length;
    const robNBaseballwins = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.winnerName === "RobN").length;
    const robOBaseballwins = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.winnerName === "RobO").length;
    const cricketGamesPlayed = dartGames.data.filter((dartGame) => dartGame.gameType === "Cricket").length;
    const robNCricketwins = dartGames.data.filter((dartGame) => dartGame.gameType === "Cricket" && dartGame.winnerName === "RobN").length;
    const robOCricketwins = dartGames.data.filter((dartGame) => dartGame.gameType === "Cricket" && dartGame.winnerName === "RobO").length;
    const rnfGamesPlayed = dartGames.data.filter((dartGame) => dartGame.gameType === "RobdayNightFootball").length;
    const robNRnfwins = dartGames.data.filter((dartGame) => dartGame.gameType === "RobdayNightFootball" && dartGame.winnerName === "RobN").length;
    const robORnfwins = dartGames.data.filter((dartGame) => dartGame.gameType === "RobdayNightFootball" && dartGame.winnerName === "RobO").length;
    const threeOhOneGamesPlayed = dartGames.data.filter((dartGame) => dartGame.gameType === "ThreeOhOne").length;
    const robNThreeOhOnewins = dartGames.data.filter((dartGame) => dartGame.gameType === "ThreeOhOne" && dartGame.winnerName === "RobN").length;
    const robOThreeOhOnewins = dartGames.data.filter((dartGame) => dartGame.gameType === "ThreeOhOne" && dartGame.winnerName === "RobO").length;
    const fiveOhOneGamesPlayed = dartGames.data.filter((dartGame) => dartGame.gameType === "FiveOhOne").length;
    const robNFiveOhOnewins = dartGames.data.filter((dartGame) => dartGame.gameType === "FiveOhOne" && dartGame.winnerName === "RobN").length;
    const robOFiveOhOnewins = dartGames.data.filter((dartGame) => dartGame.gameType === "FiveOhOne" && dartGame.winnerName === "RobO").length;
    const sevenOhOneGamesPlayed = dartGames.data.filter((dartGame) => dartGame.gameType === "SevenOhOne").length;
    const robNSevenOhOnewins = dartGames.data.filter((dartGame) => dartGame.gameType === "SevenOhOne" && dartGame.winnerName === "RobN").length;
    const robOSevenOhOnewins = dartGames.data.filter((dartGame) => dartGame.gameType === "SevenOhOne" && dartGame.winnerName === "RobO").length;
    // Find the highest single round score for RobN in xo1 games
    const robNHighestScoreAsPlayerOne = Math.max(...dartGames.data
        .filter((dartGame) => (dartGame.gameType === "SevenOhOne" || dartGame.gameType === "FiveOhOne" || dartGame.gameType === "ThreeOhOne") && dartGame.player1Name === "RobN")
        .map((dartGame) => dartGame.x01RoundScoresPlayer1 ? Math.max(...dartGame.x01RoundScoresPlayer1.filter(score => score !== null)) : 0));
    
    const robNHighestScoreAsPlayerTwo = Math.max(...dartGames.data
        .filter((dartGame) => (dartGame.gameType === "SevenOhOne" || dartGame.gameType === "FiveOhOne" || dartGame.gameType === "ThreeOhOne") && dartGame.player2Name === "RobN")
        .map((dartGame) => dartGame.x01RoundScoresPlayer2 ? Math.max(...dartGame.x01RoundScoresPlayer2.filter(score => score !== null)) : 0));
    
    // Find the highest single round score for RobO in xo1 games
    const robOHighestScoreAsPlayerOne = Math.max(...dartGames.data
        .filter((dartGame) => (dartGame.gameType === "SevenOhOne" || dartGame.gameType === "FiveOhOne" || dartGame.gameType === "ThreeOhOne") && (dartGame.player1Name === "RobO"))
        .map((dartGame) => dartGame.x01RoundScoresPlayer1 ? Math.max(...dartGame.x01RoundScoresPlayer1.filter(score => score !== null)) : 0));
    
    const robOHighestScoreAsPlayerTwo = Math.max(...dartGames.data
        .filter((dartGame) => (dartGame.gameType === "SevenOhOne" || dartGame.gameType === "FiveOhOne" || dartGame.gameType === "ThreeOhOne") && dartGame.player2Name === "RobO")
        .map((dartGame) => dartGame.x01RoundScoresPlayer2 ? Math.max(...dartGame.x01RoundScoresPlayer2.filter(score => score !== null)) : 0));

    const robNMultiRunInnings = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player1Name === "RobN")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer1 ?? [])
        .filter((runs) => runs !== null && runs > 1).length;

    const robNMultiRunInningsAsPlayer2 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player2Name === "RobN")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer2 ?? [])
        .filter((runs) => runs !== null && runs > 1).length;

    const robNInningsWithRunsAsPlayer1 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player1Name === "RobN")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer1 ?? [])
        .filter((runs) => runs !== null && runs > 0).length;

    const robNInningsWithRunsAsPlayer2 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player2Name === "RobN")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer2 ?? [])
        .filter((runs) => runs !== null && runs > 0).length;

    const robNTotalInnings1 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && (dartGame.player1Name === "RobN"))
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer1 ?? []).length;
    
    const robNTotalInnings2 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && (dartGame.player2Name === "RobN"))
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer2 ?? []).length;

    const RobOMultiRunInnings = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player1Name === "RobO")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer1 ?? [])
        .filter((runs) => runs !== null && runs > 1).length;

    const RobNTotalRunsScoredAsPlayer1 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player1Name === "RobN")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer1 ?? []).reduce((acc, runs) => (acc ?? 0) + (runs ?? 0), 0);

    const RobNTotalRunsScoredAsPlayer2 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player2Name === "RobN")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer2 ?? []).reduce((acc, runs) => (acc ?? 0) + (runs ?? 0), 0);
    
    console.log("RobN Total Runs Scored as Player 1: ", RobNTotalRunsScoredAsPlayer1);
    console.log("RobN Total Runs Scored as Player 2: ", RobNTotalRunsScoredAsPlayer2);

    const RobNTotalRunsScored = (RobNTotalRunsScoredAsPlayer1 ?? 0) + (RobNTotalRunsScoredAsPlayer2 ?? 0);
    console.log("RobN Total Runs Scored: ", RobNTotalRunsScored);
    const RobNTotalAtBats = robNTotalInnings1 + robNTotalInnings2;
    console.log("RobN Total At Bats: ", RobNTotalAtBats);
    const robNSluggingPercentage = Number((RobNTotalRunsScored / (RobNTotalAtBats * 3)).toPrecision(3)) * 100;
    console.log("RobN Slugging Percentage: ", robNSluggingPercentage);

    const robOTotalRunsScoredAsPlayer1 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player1Name === "RobO")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer1 ?? []).reduce((acc, runs) => (acc ?? 0) + (runs ?? 0), 0);

    console.log("RobO Total Runs Scored as Player 1: ", robOTotalRunsScoredAsPlayer1);

    const robOTotalRunsScoredAsPlayer2 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player2Name === "RobO")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer2 ?? []).reduce((acc, runs) => (acc ?? 0) + (runs ?? 0), 0);

    console.log("RobO Total Runs Scored as Player 2: ", robOTotalRunsScoredAsPlayer2);

    const RobOMultiRunInningsAsPlayer2 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player2Name === "RobO")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer2 ?? [])
        .filter((runs) => runs !== null && runs > 1).length;

    const RobOInningsWithRunsAsPlayer1 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player1Name === "RobO")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer1 ?? [])
        .filter((runs) => runs !== null && runs > 0).length;

    const RobOInningsWithRunsAsPlayer2 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && dartGame.player2Name === "RobO")
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer2 ?? [])
        .filter((runs) => runs !== null && runs > 0).length;

    const RobOTotalInnings1 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && (dartGame.player1Name === "RobO"))
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer1 ?? []).length;

    const RobOTotalInnings2 = dartGames.data.filter((dartGame) => dartGame.gameType === "Baseball" && (dartGame.player2Name === "RobO"))
        .flatMap((dartGame) => dartGame.baseballInningScoresPlayer2 ?? []).length;

    const RobOTotalAtBats = RobOTotalInnings1 + RobOTotalInnings2;
    const robOSluggingPercentage = Number((((robOTotalRunsScoredAsPlayer1 ?? 0) + (robOTotalRunsScoredAsPlayer2 ?? 0)) / (RobOTotalAtBats * 3)).toPrecision(3)) * 100;
    console.log("RobO Slugging Percentage: ", robOSluggingPercentage);
    const robNTotalInnings = robNTotalInnings1 + robNTotalInnings2;
    const robOTotalInnings = RobOTotalInnings1 + RobOTotalInnings2;

    const robNMultiRunPercentage = (robNTotalInnings > 0 ? Number(((robNMultiRunInnings + robNMultiRunInningsAsPlayer2) / robNTotalInnings).toPrecision(3)) : 0) * 100;
    const robNBattingAverage = (robNTotalInnings > 0 ? Number(Number((robNInningsWithRunsAsPlayer1 + robNInningsWithRunsAsPlayer2) / robNTotalInnings).toPrecision(3)) : 0) * 100;

    const robOMultiRunPercentage = (robOTotalInnings > 0 ? Number(((RobOMultiRunInnings + RobOMultiRunInningsAsPlayer2) / robOTotalInnings).toPrecision(3)) : 0) * 100;
    const robOBattingAverage = (robOTotalInnings > 0 ? Number(Number((RobOInningsWithRunsAsPlayer1 + RobOInningsWithRunsAsPlayer2) / robOTotalInnings).toPrecision(3)) : 0) * 100;

    console.log("RobN Multi Run Percentage: ", robNMultiRunPercentage);
    console.log("RobN Batting Average: ", robNBattingAverage);
    console.log("RobO Multi Run Percentage: ", robOMultiRunPercentage);
    console.log("RobO Batting Average: ", robOBattingAverage);

    console.log("RobO Highest Score as Player One: ", robOHighestScoreAsPlayerOne);
    console.log("RobO Highest Score as Player Two: ", robOHighestScoreAsPlayerTwo);
    console.log("RobN Highest Score as Player One: ", robNHighestScoreAsPlayerOne);
    console.log("RobN Highest Score as Player Two: ", robNHighestScoreAsPlayerTwo);    

    console.log("RobN Highest Score: ", Math.max(robNHighestScoreAsPlayerOne, robNHighestScoreAsPlayerTwo));
    console.log("RobO Highest Score: ", Math.max(robOHighestScoreAsPlayerOne, robOHighestScoreAsPlayerTwo));

    console.log("RobN Dart Game Wins: ", robNDartGameWins);
    console.log("RobO Dart Game Wins: ", robODartGameWins);
    
    // console.log("Activities fetched: ", activities);
    // console.log("Activity Instances fetched: ", activityInstances);
    // console.log("Locations fetched: ", locations);
    // console.log("Robday Logs fetched: ", robdayLogs);

    const averageRating = Number((activityInstances.data.reduce((acc, activityInstance) => acc + (activityInstance.rating ?? 0), 0) / activityInstances.data.length).toPrecision(2));
    const averageActivityCost = Number((activityInstances.data.reduce((acc, activityInstance) => acc + (activityInstance.cost ?? 0), 0) / activityInstances.data.length).toPrecision(2));

    return (
        <Column justifyContent='center' alignItems='center'>
            <Row mobileDirection="column">
                <RadialBar labels={["ROBDAYS COMPLETED"]} series={[robdayLogs.data.filter((robdayLog) => robdayLog.status === "Completed").length]} width={400}/>
            </Row>
            <Grid columns="3" mobileColumns="1">
                <RadialBar labels={["AVERAGE ROBDAY RATING"]} series={[99]} height={200} fontSize="14px" />
                <RadialBar labels={["TOTAL DART GAMES PLAYED"]} series={[dartGames.data.length]} colors={["#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["AVERAGE ROBDAY COST"]} series={[25]} colors={["#01CF38", "#FD6325"]} height={200} fontSize="14px" />
                <Accordion title="Dart Game Stats" >
                    <Column fillWidth background="surface">
                        <StackedBar labels={["Games Played"]} series={[{name: "Cricket", data: [cricketGamesPlayed]}, {name: "Baseball", data: [baseballGamesPlayed]}, {name: "RNF", data: [rnfGamesPlayed]}, {name: "301", data: [threeOhOneGamesPlayed]}, {name: "501", data: [fiveOhOneGamesPlayed]}, {name: "701", data: [sevenOhOneGamesPlayed]}]} />
                        <RadialBar labels={["TOTAL ROBN WINS"]} series={[robNDartGameWins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["TOTAL ROBO WINS"]} series={[robODartGameWins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["BASEBALL GAMES PLAYED"]} series={[baseballGamesPlayed]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBN BASEBALL WINS"]} series={[robNBaseballwins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBO BASEBALL WINS"]} series={[robOBaseballwins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["CRICKET GAMES PLAYED"]} series={[cricketGamesPlayed]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBN CRICKET WINS"]} series={[robNCricketwins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBO CRICKET WINS"]} series={[robOCricketwins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["RNF GAMES PLAYED"]} series={[rnfGamesPlayed]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBN RNF WINS"]} series={[robNRnfwins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBO RNF WINS"]} series={[robORnfwins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["301 GAMES PLAYED"]} series={[threeOhOneGamesPlayed]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBN 301 WINS"]} series={[robNThreeOhOnewins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBO 301 WINS"]} series={[robOThreeOhOnewins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["501 GAMES PLAYED"]} series={[fiveOhOneGamesPlayed]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBN 501 WINS"]} series={[robNFiveOhOnewins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBO 501 WINS"]} series={[robOFiveOhOnewins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["701 GAMES PLAYED"]} series={[sevenOhOneGamesPlayed]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBN 701 WINS"]} series={[robNSevenOhOnewins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBO 701 WINS"]} series={[robOSevenOhOnewins]} colors={["#FD6325"]} height={200} fontSize="14px" />
                    </Column>
                </Accordion>
                <Line width="xs"></Line>
                <Accordion title="Dart Game Player Stats">
                    <Column fillWidth background="surface" padding="2">
                        <RadarChart labels={[]} series={[]} />
                        <StackedBar labels={["RobO", "RobN"]} series={[{name: "Cricket", data: [robOCricketwins, robNCricketwins]}, {name: "Baseball", data: [robOBaseballwins, robNBaseballwins]}, {name: "RNF", data: [robORnfwins, robNRnfwins]}, {name: "301", data: [robOThreeOhOnewins, robNThreeOhOnewins]}, {name: "501", data: [robOFiveOhOnewins, robNFiveOhOnewins]}, {name: "701", data: [robOSevenOhOnewins, robNSevenOhOnewins]}]} />
                        <Text>501</Text>
                        <Line height={0.25}></Line>
                        <RadialBar labels={["ROBN HIGHEST ROUND SCORE"]} series={[Math.max(robNHighestScoreAsPlayerOne, robNHighestScoreAsPlayerTwo)]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBO HIGHEST ROUND SCORE"]} series={[Math.max(robOHighestScoreAsPlayerOne, robOHighestScoreAsPlayerTwo)]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        
                        <Text>Baseball</Text>
                        <Line height={0.25}></Line>
                        <RadialBar labels={["ROBN MULTI RUN PERCENTAGE"]} series={[robNMultiRunPercentage]} colors={["#FD6325"]} height={200} fontSize="14px" percentageFormatter={true} />
                        <RadialBar labels={["ROBO MULTI RUN PERCENTAGE"]} series={[robOMultiRunPercentage]} colors={["#FD6325"]} height={200} fontSize="14px" percentageFormatter={true} />
                        <Line></Line>
                        <RadialBar labels={["ROBN BATTING AVERAGE"]} series={[robNBattingAverage]} colors={["#FD6325"]} height={200} fontSize="14px" percentageFormatter={true} />
                        <RadialBar labels={["ROBO BATTING AVERAGE"]} series={[robOBattingAverage]} colors={["#FD6325"]} height={200} fontSize="14px" percentageFormatter={true} />
                        <Line></Line>
                        <RadialBar labels={["ROBN SLUGGING PERCENTAGE"]} series={[robNSluggingPercentage]} colors={["#FD6325"]} height={200} fontSize="14px" percentageFormatter={true} />
                        <RadialBar labels={["ROBO SLUGGING PERCENTAGE"]} series={[robOSluggingPercentage]} colors={["#FD6325"]} height={200} fontSize="14px" percentageFormatter={true} />
                        <Line></Line>
                    </Column>
                </Accordion>
                {/* <RadialBar labels={["TOTAL LOCATIONS VISITED"]} series={[locations.data.length]} colors={["#FD6325"]} height={200} fontSize="14px" /> */}
                
                <RadialBar labels={["AVERAGE ACTIVITY RATING"]} series={[averageRating]} colors={["#01CF38", "#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["AVERAGE ACTIVITY COST"]} series={[averageActivityCost]} colors={["#01CF38", "#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["UNIQUE ACTIVITIES DONE"]} series={[12]} colors={["#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["TOTAL ACTIVITIES DONE"]} series={[activityInstances.data.length]} colors={["#FD6325"]} height={200} fontSize="14px" />
            </Grid>
        </Column>
    )
}