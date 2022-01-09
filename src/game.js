import produce from "immer";
import { useState, useEffect, useCallback, useRef } from "react";
import './game.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Game2() {
    const numOfRows = 50
    const numOfColumns = 50
    const [grid, setGrid] = useState(Array)
    const neighborsArr = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [1, 0], [1, -1], [0, 1], [1, 1]]
    const [isRun, setIsRun] = useState(false)
    const isRunRef = useRef(isRun);
    isRunRef.current = isRun;

    function InitGrid() {
        setGrid(() => {
            const rows = [];
            for (let i = 0; i < numOfRows; i++) {
                rows.push(Array.from(Array(numOfColumns), () => Math.random() > 0.5));
            }
            return rows
        })
    }
    const RunGrid = useCallback(() => {
        if (!isRunRef.current) {
            return
        }
        setGrid(g => {
            return produce(g, newGrid => {
                for (let i = 0; i < numOfRows; i++) {
                    for (let j = 0; j < numOfColumns; j++) {
                        let sumNeighbors = 0
                        neighborsArr.forEach(([r, c]) => {
                            let newI = i + r
                            let newJ = j + c
                            if (newI >= 0 && newI < numOfRows && newJ >= 0 && newJ < numOfColumns) {
                                sumNeighbors += g[newI][newJ]
                            }
                            if (g[i][j] == 1 && (sumNeighbors == 2 || sumNeighbors == 3)) {
                                newGrid[i][j] = 1
                            }
                            else if (sumNeighbors < 2 || sumNeighbors > 3) {
                                newGrid[i][j] = 0
                            }
                            else if (g[i][j] == 0 && sumNeighbors == 3) {
                                newGrid[i][j] = 1
                            }
                        });
                    }
                }
            })
        })
        setTimeout(RunGrid, 500)
    }, [])

    useEffect(() => {
        InitGrid();

    }, []);

    return (
        <div className="main">
            <div className="btn">
                <button className="btn-style" disabled={!isRun ? false : true} onClick={() => {
                    setIsRun(!isRun)
                    if (!isRun) {
                        isRunRef.current = true;
                        RunGrid();
                    }
                }} >PLAY</button>

                <button className="btn-style" disabled={isRun ? false : true} onClick={() => {
                    setIsRun(!isRun)
                }} >stop</button>

                <button className="btn-style" onClick={() => {
                    InitGrid()
                    setIsRun(false)
                }}>RESET</button>
            </div>

            <div className="grid">
                {grid.map((row, i) => <div>{
                    row.map((col, j) => (
                        <div className={grid[i][j] ? "live" : "dead"}
                            style={{ width: 14, height: 14, border: "solid black 1px" }}
                        >
                        </div>
                    ))
                }
                </div>)}
            </div>
        </div>
    )
}