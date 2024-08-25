import './Node.css';

const Node = ({
    isStart, 
    isEnd, 
    row, 
    col, 
    isWall,
    isBarrier,
    //onMouseClick,
    onMouseDown,
    onMouseEnter,
    onMouseUp
}) => {
    
    const classes = isStart? "node-start" : isWall? "node-wall" :isEnd? "node-end": isBarrier? "node-barrier" : "";
    return   <div 
    className={`node ${classes}`} 
    id={`node-${row}-${col}`} 
    onMouseDown={() => {onMouseDown(row, col)}}
    onMouseEnter={() => {onMouseEnter(row, col)}}
    onMouseUp={() => {  onMouseUp(row,col)}}
    ></div>;
};
 
export default Node;