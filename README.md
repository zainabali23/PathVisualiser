# Graph Algorithm Visualizer

## Overview

A React-based tool to visualize A* and Dijkstra's algorithms. Users can interact with the grid by moving start/end points, adding weights, and placing walls to observe real-time pathfinding.

## Features

- **Interactive Grid:** Move start and end points across the grid.
- **Custom Obstacles:** Add or remove walls and weighted nodes.
- **Real-Time Visualization:** Watch as algorithms find the shortest path.

## Tech Stack

- **Frontend:** JavaScript, React.js
- **Styling:** CSS, HTML

## Installation

### Cloning the Repository:
Clone the repository using:

```bash
git clone https://github.com/zainabali23/PathVisualiser.git
```

### Installing Dependencies:
Run:

```bash
npm install
```

### Starting the Server:
Run:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Features

### Positioning the Start and End Nodes:
You can move the start and end nodes to any cell by dragging and dropping them.

### Adding Walls:
Ensure the rightmost yellow button is set to "Toggle (Node Type=Wall)." You can add walls by clicking and dragging the mouse over cells. The same action removes walls, and you can toggle between wall and normal cells.

### Adding Weighted Nodes:
Ensure the rightmost yellow button is set to "Toggle (Node Type=Weighted(6))." You can add weighted nodes by clicking and dragging the mouse over cells. The same action removes them, and you can toggle between weighted and normal cells.

### Auto Calculation of Shortest Path:
The shortest path is automatically recalculated whenever you move the start or end node, without needing to press the "Calculate Shortest Path" button.

### Visualization of Path:
Visualize the calculated path by clicking the "Visualize Path" button.

### Clear Grid:
Clears the grid, removing all weighted nodes and walls.

### Clear Visualization:
Clears the algorithm's visualization, resetting all visited and shortest path nodes to unvisited.

### After Visualization:
After visualization, you can reposition the start and end nodes, add or delete walls, and re-visualize the path using any algorithm without reloading the webpage.

## Developer

### This project was built by:

Zainab Ali
