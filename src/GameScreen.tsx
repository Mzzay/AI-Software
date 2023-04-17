import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Game } from "./process/tools";
import { PlayerType } from "./types";

const GameScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [ START_NUMBER, _ ] = useState<number>(Math.floor(Math.random() * (50 - 20) + 20))
    const [ score, setScore ] = useState<number>(START_NUMBER);
    const [ game, setGame ] = useState<Game>();
    const [ firstMove, setFirstMove ] = useState<boolean>(true);

    const [ lastInput, setLastInput ] = useState<number>();
    const [ lastPlayer, setLastPlayer ] = useState<PlayerType>();
    const [ canPlay, setCanPlay ] = useState<boolean>(true);
    const [ playerTurn, setPlayerTurn ] = useState<PlayerType>(0);

    const [ disableBtn, setDisableBtn ] = useState<boolean>(false);

    const DECREASE_LIST = [2, 3 ]
    useEffect(() => {
        if (!(location.state.firstPlayer !== undefined)) {
            navigate("/");
            return;
        }

        setPlayerTurn(location.state.firstPlayer);
        let gm = new Game(START_NUMBER, DECREASE_LIST, location.state.firstPlayer)
        setGame(gm);
    }, [])

    useEffect(() => {
        if (game && firstMove && (location.state.firstPlayer === PlayerType.COMPUTER)) {
            play(0, PlayerType.COMPUTER);
            setFirstMove(false);
        }
            
    }, [ game ])

    const updateScore = () => {
        setScore(game?.currentNode.score)
    }

    const play = (decreasePoint: number, player: PlayerType, disable?: boolean) => {
        if (disable || !game || !(DECREASE_LIST.includes(decreasePoint) || decreasePoint === 0))
            return;

        setDisableBtn(true);
        setPlayerTurn((player + 1) % 2)

        let {
            value,
            canPlay
        }: { value: number, canPlay: boolean } = game.play(decreasePoint, player === PlayerType.COMPUTER);

        updateScore();
        setCanPlay(canPlay)
        setLastPlayer(player);
        setLastInput(value);
        setTimeout(() => {
            setLastInput(undefined)
        }, 1000)
        
        // move from the AI
        if (canPlay && (player === PlayerType.USER && (score - value > 0))) {
            setTimeout(() => {
                play(0, PlayerType.COMPUTER);
                setDisableBtn(false);
            }, 1500)
        }else{
            setDisableBtn(false);
        }
    }

    return (
        <div className="App">
            <div className="middle-box game">
                <div style={{ marginBottom: ".3rem" }}>
                    <h2 className="center">Current game</h2>
                    {canPlay && <p className="subinfo">{playerTurn !== 0 ? "Your turn..." : "AI turn..."}</p>}
                </div>
                {
                    canPlay ? <div className="score">{score}</div> :
                    <div className="result">{lastPlayer === 0 ? "AI" : "You"} won the game !</div>
                }
                <div className="button-container">
                    {
                        canPlay ? 
                            DECREASE_LIST.map((decNumber: number) => {
                                let disable = disableBtn || (decNumber > score);
                                return (
                                    <div key={decNumber} className={`button ${disable ? 'disable' : ''}`} onClick={() => play(decNumber, PlayerType.USER, disable)}>
                                        -{decNumber}
                                    </div>
                                )
                            })
                        :
                            <div className="button-restart" onClick={() => navigate('/')}>
                                Restart the game
                            </div>
                    }
                </div>
                {
                    lastInput && <div className={`value-input ${lastPlayer === 0 ? 'ai' : 'you'}`}><span>{lastPlayer === 0 ? 'AI' : 'You'}<br/></span>-{lastInput}</div>
                }
                {
                    canPlay && (<div className="button-quit" onClick={() => navigate('/')}>
                                Quit
                            </div>)
                }
            </div>
        </div>
    )
}

export default GameScreen;