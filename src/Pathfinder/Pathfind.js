import React, { useState, useEffect } from "react";
import Astar from "../Algo/astar";
import Dijkstra from "../Algo/dijkstra";
import Node from './Node';
import './Pathfind.css';

const row=12;
const col=45;
let mouseIsPressed = false;
let isStartNode= false;
let isEndNode= false;
let isWallNode= false; 
let NODE_START_ROW = 0;
let NODE_START_COL = 0;
let NODE_END_ROW = row-1;
let NODE_END_COL = col-1;
let currRow = 0;
let currCol = 0;
let algo="Astar";
let isVisualized = false;
let wallWeight=5;
// let wallType="Add Weighted(5) Node";

const Pathfind = () => {

		const [Grid,setGrid] = useState([]);
		const [WallType,setWallType] = useState("Weighted(6)");

		useEffect(()=>{
				initialzeGrid();
		},[]);

		const initialzeGrid=() =>{
				const grid=new Array(row);

				for(let i=0;i<row;i++){
						grid[i]= new Array(col);
				}

				for(let i=0;i<row;i++){
						for(let j=0;j<col;j++){
								grid[i][j]=new Spot(i,j);
						}
				}
				setGrid(grid);
				
		};

		const addNeighbours = (grid) => {
				for(let i=0 ; i<row ; i++)
				{
						for(let j=0;j<col;j++)
						{
								grid[i][j].addneighbours(grid);
						}
				}
		}

		function Spot(i,j){
				this.x=i;   
				this.y=j;
				this.isStart= this.x === NODE_START_ROW && this.y === NODE_START_COL;
				this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
				this.g=0;
				this.f=0;
				this.h=0;
				this.isWall=0;
				this.isBarrier=false;
				if((Math.random(1)<0.05) && (this.isStart !== true) && (this.isEnd !== true)){this.isWall=5;}
				if((Math.random(1)<0.05) && (this.isStart !== true) && (this.isEnd !== true)){this.isBarrier=true;}
				this.neighbours= [];
				this.previous=undefined;
				this.addneighbours = function (grid){
						let i= this.x, j= this.y;
						this.neighbours=[];
						if(i>0) this.neighbours.push(grid[i-1][j]);
						if(i<row-1) this.neighbours.push(grid[i+1][j]);
						if(j>0) this.neighbours.push(grid[i][j-1]);
						if(j<col-1) this.neighbours.push(grid[i][j+1]);
				}
		}
		
		const gridwithNode=(
				<div >
						{Grid.map((row, rowIndex)=>{
								return(
										<div key={rowIndex} className='rowWrapper'>
										{row.map((col,colIndex) =>{
												const {isStart, isEnd, isWall,isBarrier} = col;
												return <Node 
												key={rowIndex} 
												isStart={isStart} 
												isEnd={isEnd} 
												row={rowIndex} 
												col={colIndex} 
												isWall={isWall}
												isBarrier={isBarrier} 
												//onMouseClick ={ (row,col) =>{ handleMouseClick(row, col)}}

												onMouseDown ={ (row,col) =>{
														handleMouseDown(row, col)
												}}

												onMouseEnter ={ (row,col) =>{
														handleMouseEnter(row, col)
												}}

												onMouseUp ={ (row,col) =>{
														handleMouseUp(row, col)
												}}
												/>;
										})}
										</div> 
								);
						})}
				</div>
		);

		const handleMouseDown = (row, col) => {
				if (
					document.getElementById(`node-${row}-${col}`).className ===
					'node node-start'
				) {
						mouseIsPressed= true;
						isStartNode= true;
						currRow= row;
						currCol= col;
				} else if (
					document.getElementById(`node-${row}-${col}`).className ===
					'node node-end'
				) {
						mouseIsPressed= true;
						isEndNode= true;
						currRow= row;
						currCol= col;
				} else {
					const newGrid = getNewGridWithWallToggled(Grid, row, col);
						setGrid(newGrid);
						mouseIsPressed= true;
						isWallNode= true;
						currRow= row;
						currCol= col;
				}
		};

		const handleMouseEnter = (row, col) => {
				if(mouseIsPressed === true){
				const nodeClassName = document.getElementById(`node-${row}-${col}`).className;
				if (isStartNode) 
				{
					if (nodeClassName !== 'node node-wall'  && nodeClassName !== 'node node-end' &&
					nodeClassName !== 'node node-instant-visited-wall' &&
					nodeClassName !== 'node node-visited-wall' &&
					nodeClassName !== 'node node-instant-shortest-wall' &&
					nodeClassName !== 'node node-shortest-wall' && 
					nodeClassName !== 'node node-barrier') 
					{
						const prevStartNode = Grid[currRow][currCol];
						prevStartNode.isStart = false;
						document.getElementById(`node-${currRow}-${currCol}`).className = 'node';
						currRow= row; currCol= col;
						const currStartNode = Grid[row][col];
						currStartNode.isStart = true;
						document.getElementById(`node-${row}-${col}`).className ='node node-start';
			NODE_START_ROW= row; NODE_START_COL= col;
			console.log(NODE_START_ROW,NODE_START_COL);
					}
			if(isVisualized === true)
			{
			clearVisualization();
			visualizePath();
			}
				} else if (isEndNode) {
					if (nodeClassName !== 'node node-wall' && nodeClassName !== 'node node-start' &&
					nodeClassName !== 'node node-instant-visited-wall' &&
					nodeClassName !== 'node node-visited-wall' &&
					nodeClassName !== 'node node-instant-shortest-wall' &&
					nodeClassName !== 'node node-shortest-wall' &&
					nodeClassName !== 'node node-barrier'					
					 ) {
						const prevEndNode = Grid[currRow][currCol];
						prevEndNode.isEnd = false;
						document.getElementById(
							`node-${currRow}-${currCol}`,
						).className = 'node';

						currRow= row; currCol= col;
						const currFinishNode = Grid[row][col];
						currFinishNode.isEnd = true;
						document.getElementById(`node-${row}-${col}`).className =
							'node node-end';
			NODE_END_ROW= row; NODE_END_COL= col;
						}
					
			if(isVisualized === true)
			{
			clearVisualization();
			visualizePath();
			}
				} else if (isWallNode) {
					const newGrid = getNewGridWithWallToggled(Grid, row, col);
					setGrid(newGrid);
				}
		}  
	};

		const handleMouseUp = (row, col) => {
				console.log(row, col);
			mouseIsPressed= false;
			if (isStartNode) {
				isStartNode = !isStartNode;
				NODE_START_ROW= row; NODE_START_COL= col;
			} else if (isEndNode) {
				isEndNode = !isEndNode;
						NODE_END_ROW= row;  NODE_END_COL= col;
			}
		if(isVisualized === true)
		{
			clearVisualization();
			visualizePath();
		}
			//initialzeGrid();
	};


		const getNewGridWithWallToggled = (grid, row, col) => {
				console.log(grid);
				const newGrid = grid.slice();
				const node = newGrid[row][col];
				if (!node.isStart && !node.isEnd) {
					if(wallWeight===5){
						const newNode = {
							...node,
							isBarrier: false,
							isWall: (5-node.isWall),
						};
						newGrid[row][col] = newNode;
					}
					else{
						const newNode = {
							...node,
							isBarrier: !node.isBarrier,
							isWall: 0,
						};
						newGrid[row][col] = newNode;
					}
				}
				return newGrid;
			};
			

		//console.log(Grid);
		//console.log(Path);
		
		

		const visualizePath = () =>{
		
				addNeighbours(Grid);
				console.log(NODE_START_ROW,NODE_START_COL);
				let startNode = Grid[NODE_START_ROW][NODE_START_COL];
				let endNode   = Grid[NODE_END_ROW][NODE_END_COL];
				startNode.isWall=0;
				startNode.isBarrier=false;
				endNode.isWall=0;
				endNode.isBarrier=false;
				let path;
				if(algo==='Astar') path = Astar(startNode, endNode);
				if(algo==='Dijkstra')  path = Dijkstra(startNode, endNode);
				animate(path.visitedNodes, path.path);
		}

		const animate = (VisitedNodes,Path) => {
		let delay = 20;
		if(isVisualized === true)
		{
			delay = 0;
		}
				for(let i=1;i<=VisitedNodes.length-1; i++){
						if(i===VisitedNodes.length-1){
						setTimeout(()=>{
								visualizeShortestPath(Path.reverse());
						},delay*i);
				}else{
						setTimeout(() => {
								const node = VisitedNodes[i];
				if(isVisualized === true)
				{
					if((document.getElementById(`node-${node.x}-${node.y}`).className === "node node-shortest-wall")  || 
					(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-wall") || 
					(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-instant-shortest-wall")||
					(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-visited-wall")   || 
					(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-instant-visited-wall")
						
						)
							document.getElementById(`node-${node.x}-${node.y}`).className= "node node-instant-visited-wall";
						else
							document.getElementById(`node-${node.x}-${node.y}`).className= "node node-instant-visited";
				}
				else
				{
						if((document.getElementById(`node-${node.x}-${node.y}`).className === "node node-wall") || 
						(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-visited-wall")|| 
						(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-shortest-wall") )
							document.getElementById(`node-${node.x}-${node.y}`).className= "node node-visited-wall";
						else
							document.getElementById(`node-${node.x}-${node.y}`).className= "node node-visited";
				}
						}, delay*i);
						
				}
			}
	};

	const visualizeShortestPath = (shortestPathNodes) =>{
		let delay = 10;
		if(isVisualized === true)
		{
			delay = 0;
		}
				for(let i=1;i<shortestPathNodes.length-1;i++){
			setTimeout(()=>{
					const node = shortestPathNodes[i];
					if(isVisualized === true)
					{
						if(	(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-shortest-wall")  || 
							(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-wall") || 
							(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-instant-shortest-wall")||
							(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-visited-wall")   || 
							(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-instant-visited-wall"))
								document.getElementById(`node-${node.x}-${node.y}`).className= "node node-instant-shortest-wall";
							else
								document.getElementById(`node-${node.x}-${node.y}`).className= "node node-instant-shortest-path";
					}
					else
					{
							if((document.getElementById(`node-${node.x}-${node.y}`).className === "node node-wall") || 
							(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-visited-wall")|| 
							(document.getElementById(`node-${node.x}-${node.y}`).className === "node node-shortest-wall") )
								document.getElementById(`node-${node.x}-${node.y}`).className= "node node-shortest-wall";
							else
								document.getElementById(`node-${node.x}-${node.y}`).className= "node node-shortest-path";
					}
			},delay*i);
		}
		isVisualized = true;
		};

	const clearGrid = () => {
			const newGrid = Grid.slice();
			for (const row of newGrid) {
				for (const node of row) {
					let nodeClassName = document.getElementById(`node-${node.x}-${node.y}`,).className;
					if (
						nodeClassName !== 'node node-start' &&
						nodeClassName !== 'node node-end'
					) {
						document.getElementById(`node-${node.x}-${node.y}`).className ='node';
						node.g=0;
						node.f=0;
						node.h=0;
			node.isWall=0;
			node.isBarrier=false;
					node.neighbours= [];
			node.previous=undefined;
					}
					if (nodeClassName === 'node node-end') {
						node.g=0;
						node.f=0;
						node.h=0;
			node.isWall=0;
			node.isBarrier=false;
					node.neighbours= [];
			node.previous=undefined;
					}
					if (nodeClassName === 'node node-start') {
			node.g=0;
						node.f=0;
						node.h=0;
			node.isWall=0;
			node.isBarrier=false;
					node.neighbours= [];
			node.previous=undefined;
					}
				}
			}
		setGrid(newGrid);
	}

	const clearVisualization = () => {
	//isVisualized = false;
	const newGrid = Grid.slice();
	for (const row of newGrid) {
		for (const node of row) {
		let nodeClassName = document.getElementById(`node-${node.x}-${node.y}`,).className;
		if (
			nodeClassName !== 'node node-start' &&
			nodeClassName !== 'node node-end'   &&
			nodeClassName !== 'node node-wall' &&
			nodeClassName !== 'node node-instant-visited-wall' &&
			nodeClassName !== 'node node-visited-wall' &&
			nodeClassName !== 'node node-instant-shortest-wall' &&
			nodeClassName !== 'node node-shortest-wall' &&
			nodeClassName !== 'node node-barrier'
		) {
			document.getElementById(`node-${node.x}-${node.y}`).className ='node';
			node.g=0;
			node.f=0;
			node.h=0;
			// node.isWall=0;
			node.isBarrier=false;
			node.previous=undefined;
		}
		if (nodeClassName === 'node node-end') {
			node.g=0;
			node.f=0;
			node.h=0;
			node.isWall=0;
			node.isBarrier=false;
			node.previous=undefined;
		}
		if (nodeClassName === 'node node-start') {
			node.g=0;
			node.f=0;
			node.h=0;
			node.isWall=0;
			node.isBarrier=false;
			node.previous=undefined;
		}
		if (nodeClassName === 'node node-instant-visited-wall' || nodeClassName === 'node node-visited-wall') {
			document.getElementById(`node-${node.x}-${node.y}`).className ='node node-wall';
			node.g=0;
			node.f=0;
			node.h=0;
			node.isBarrier=false;
			node.isWall=5;
			node.previous=undefined;
		}
		if (nodeClassName === 'node node-instant-shortest-wall' || nodeClassName === 'node node-shortest-wall') {
			document.getElementById(`node-${node.x}-${node.y}`).className ='node node-wall';
			node.g=0;
			node.f=0;
			node.h=0;
			node.isWall=5;
			node.isBarrier=false;
			node.previous=undefined;
		}
		if(nodeClassName === 'node node-barrier'){
			document.getElementById(`node-${node.x}-${node.y}`).className ='node node-barrier';
			node.g=0;
			node.f=0;
			node.h=0;
			node.isWall=0;
			node.isBarrier=true;
			node.previous=undefined;
		}
		}
	}
	setGrid(newGrid);
	
}

const changeWallWeight = () => {
	wallWeight=5-wallWeight;
	if(wallWeight===0) setWallType("Wall");
	else setWallType("Weighted(6)");
}

		return (  
				<div className="Wrapper">
						{/* <img src="src\Pathfinder\path_copy.png" alt="logo"></img> */}
						<h1>Pathfinding Visualizer</h1>
						<button className="button button1" onClick={()=> {isVisualized = false;	algo = "Astar"; visualizePath();}}>Visualize Astar</button>
						<button className="button button2" onClick={() => {isVisualized = false; algo="Dijkstra"; visualizePath();}}>Visualize Dijkstra</button>
						<button className="button button3" onClick={()=>{ isVisualized = false;clearGrid();}}>Clear Grid</button>
						<button className="button button4" onClick={() =>{isVisualized = false; clearVisualization();}}>Clear Visualization</button>
						<button className="button button5" onClick={() => changeWallWeight()}>Toggle   (Node Type = {WallType})</button>
					 	{gridwithNode}
						 <ul class="legend">
						 	<li><span class="start"></span> Starting Node</li>
							<li><span class="end"></span> End Node</li>
							<li><span class="wall"></span> Weighted Node</li>
							<li><span class="barrier"></span> Wall Node</li>
							<li><span class="visited"></span> Visited Node</li>
							<li><span class="shortest-path"></span> Shortest Node</li>
						</ul>
						<br></br><br></br><br></br>
						<span>
							Made by Himanshu Chaudhary & Palak Kothari
						</span>
						<br></br>
				</div>
		);
};
 
export default Pathfind;