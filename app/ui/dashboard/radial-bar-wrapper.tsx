
import RadialBar from '@/app/ui/dashboard/radial-bar';
import StackedBar from '@/app/ui/dashboard/charts/stacked-bar';
import {
    Column,
    Heading,
    Row,
    Grid,
    Accordion,
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
                <RadialBar labels={["ROBDAYS COMPLETED"]} series={[robdayLogs.data.filter((robdayLog) => robdayLog.status === "Completed").length]} />
            </Row>
            <Grid columns="3" mobileColumns="1">
                <RadialBar labels={["AVERAGE ROBDAY RATING"]} series={[99]} height={200} fontSize="14px" />
                <RadialBar labels={["TOTAL DART GAMES PLAYED"]} series={[dartGames.data.length]} colors={["#FD6325"]} height={200} fontSize="14px" />
                <Accordion title="Dart Game Stats" >
                    <Column fillWidth >
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
                <Accordion title="Dart Game Player Stats" >
                    <Column fillWidth >
                        <StackedBar labels={["RobO", "RobN"]} series={[{name: "Cricket", data: [robOCricketwins, robNCricketwins]}, {name: "Baseball", data: [robOBaseballwins, robNBaseballwins]}, {name: "RNF", data: [robORnfwins, robNRnfwins]}, {name: "301", data: [robOThreeOhOnewins, robNThreeOhOnewins]}, {name: "501", data: [robOFiveOhOnewins, robNFiveOhOnewins]}, {name: "701", data: [robOSevenOhOnewins, robNSevenOhOnewins]}]} />
                        <RadialBar labels={["ROBN HIGHEST SCORE"]} series={[Math.max(robNHighestScoreAsPlayerOne, robNHighestScoreAsPlayerTwo)]} colors={["#FD6325"]} height={200} fontSize="14px" />
                        <RadialBar labels={["ROBO HIGHEST SCORE"]} series={[Math.max(robOHighestScoreAsPlayerOne, robOHighestScoreAsPlayerTwo)]} colors={["#FD6325"]} height={200} fontSize="14px" />
                    </Column>
                </Accordion>
                {/* <RadialBar labels={["TOTAL LOCATIONS VISITED"]} series={[locations.data.length]} colors={["#FD6325"]} height={200} fontSize="14px" /> */}
                <RadialBar labels={["AVERAGE ROBDAY COST"]} series={[25]} colors={["#01CF38", "#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["AVERAGE ACTIVITY RATING"]} series={[averageRating]} colors={["#01CF38", "#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["AVERAGE ACTIVITY COST"]} series={[averageActivityCost]} colors={["#01CF38", "#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["UNIQUE ACTIVITIES DONE"]} series={[12]} colors={["#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["TOTAL ACTIVITIES DONE"]} series={[activityInstances.data.length]} colors={["#FD6325"]} height={200} fontSize="14px" />
            </Grid>
        </Column>
    )
}