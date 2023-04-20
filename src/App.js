import './App.css';
import Board from './components/Board'
import Square from './components/Square'
import {useState, useEffect} from 'react';

const defaultSquares = () => (new Array(9)).fill(null);

const linesToWin = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
];

function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner,setWinner] = useState(null);

  useEffect(() => {
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
    const linesWith = (a,b,c) => {
      return linesToWin.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => squares[index]);
        console.log(JSON.stringify([a,b,c]))
        console.log(JSON.stringify(squareValues))
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort());
      });
    };
    const emptyIndexes = squares
      .map((square,index) => square === null ? index : null)
      .filter(val => val !== null);
    const playerWon = linesWith('x', 'x', 'x').length > 0;
    const computerWon = linesWith('o', 'o', 'o').length > 0;
    if (playerWon) {
      setWinner('x');
    } else if (computerWon){
      setWinner('o');
    }else if (squares.every(square=>square!==null)){
      setWinner('draw')
    }else{
      setWinner(null)
    }
      
    const putComputerAt = index => {
      let newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);
    };
    if (isComputerTurn) {
      setTimeout(()=>{
        const winingLines = linesWith('o', 'o', null);
      if (winingLines.length > 0) {
        const winIndex = winingLines[0].filter(index => squares[index] === null)[0];
        putComputerAt(winIndex);
        return;
      }

      const linesToBlock = linesWith('x', 'x', null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(index => squares[index] === null)[0];
        putComputerAt(blockIndex);
        return;
      }

      const linesToContinue = linesWith('o', null, null);
      if (linesToContinue.length > 0) {
        putComputerAt(linesToContinue[0].filter(index => squares[index] === null)[0]);
        return;
      }

      const randomIndex = emptyIndexes[ Math.ceil(Math.random()*emptyIndexes.length) ];
      putComputerAt(randomIndex);
      },1000)
    }
  }, [squares]);



  function handleSquareClick(index) {
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    if (isPlayerTurn) {
      let newSquares = squares;
      newSquares[index] = 'x';
      setSquares([...newSquares]);
    }
  }

  return (
    <main>
      <h1>Tic Tac Toe</h1>
      <p>You Vs Computer</p>
      <Board>
        {squares.map((square,index) =>
          <Square
            x={square==='x'?1:0}
            o={square==='o'?1:0}
            onClick={() => handleSquareClick(index)} />
        )}
      </Board>
      {!!winner && winner === 'x' && (
        <div className="result green">
          You WON!
        </div>
      )}
      {!!winner && winner === 'o' && (
        <div className="result red">
          COMPUTER WON!
        </div>
      )}
      {!!winner && winner==='draw' &&(
          <div className='result white'>
          ITS A DRAW
        </div>
      )}

    <button className="button" onClick={()=>{window.location.reload()}}>Reset Game</button>
    </main>
  );
}

export default App;