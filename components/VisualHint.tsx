import React, { useState, useEffect } from 'react';

interface ShapeData {
  id: string;
  color: string;
  source: 'n1' | 'n2' | 'n3';
}

interface VisualHintProps {
  num1: number;
  num2: number;
  num3?: number;
}

const Shape: React.FC<{ shape: ShapeData }> = ({ shape }) => (
  <div
    id={shape.id}
    className={`w-5 h-5 md:w-6 md:h-6 rounded-md ${shape.color} shadow-sm`}
    aria-label="shape"
  ></div>
);

const createChunks = (shapes: ShapeData[]): ShapeData[][] => {
  const chunks: ShapeData[][] = [];
  if (!shapes || shapes.length === 0) return [];
  for (let i = 0; i < shapes.length; i += 5) {
    chunks.push(shapes.slice(i, i + 5));
  }
  return chunks;
};


const VisualHint: React.FC<VisualHintProps> = ({ num1, num2, num3 }) => {
  const [sourceShapes1, setSourceShapes1] = useState<ShapeData[]>([]);
  const [sourceShapes2, setSourceShapes2] = useState<ShapeData[]>([]);
  const [sourceShapes3, setSourceShapes3] = useState<ShapeData[]>([]);
  const [droppedShapes, setDroppedShapes] = useState<ShapeData[]>([]);

  useEffect(() => {
    setSourceShapes1(Array.from({ length: num1 }, (_, i) => ({ id: `n1-${i}`, color: 'bg-blue-400', source: 'n1' })));
    setSourceShapes2(Array.from({ length: num2 }, (_, i) => ({ id: `n2-${i}`, color: 'bg-green-400', source: 'n2' })));
    if (num3 !== undefined) {
      setSourceShapes3(Array.from({ length: num3 }, (_, i) => ({ id: `n3-${i}`, color: 'bg-orange-400', source: 'n3' })));
    } else {
      setSourceShapes3([]);
    }
    setDroppedShapes([]);
  }, [num1, num2, num3]);

  const handleDoubleClickShape = (shapeToMove: ShapeData) => {
    if (droppedShapes.some(s => s.id === shapeToMove.id)) return;

    if (shapeToMove.source === 'n2') {
      const shapeFromSource = sourceShapes2.find(s => s.id === shapeToMove.id);
      if (shapeFromSource) {
        setSourceShapes2(prev => prev.filter(s => s.id !== shapeToMove.id));
        setDroppedShapes(prev => [...prev, shapeFromSource]);
      }
    } else if (shapeToMove.source === 'n3') {
      const shapeFromSource = sourceShapes3.find(s => s.id === shapeToMove.id);
      if (shapeFromSource) {
        setSourceShapes3(prev => prev.filter(s => s.id !== shapeToMove.id));
        setDroppedShapes(prev => [...prev, shapeFromSource]);
      }
    }
  };

  const handleGroupDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('dragType', 'group');
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleSingleShapeDragStart = (e: React.DragEvent<HTMLDivElement>, shape: ShapeData) => {
    e.dataTransfer.setData('dragType', 'single');
    e.dataTransfer.setData('shapeId', shape.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dragType = e.dataTransfer.getData('dragType');

    if (dragType === 'group' && sourceShapes1.length > 0) {
      setDroppedShapes(prev => [...prev, ...sourceShapes1]);
      setSourceShapes1([]);
    } else if (dragType === 'single') {
      const shapeId = e.dataTransfer.getData('shapeId');
      if (!shapeId || droppedShapes.some(s => s.id === shapeId)) return;

      const shapeFromSource2 = sourceShapes2.find(s => s.id === shapeId);
      if (shapeFromSource2) {
        setSourceShapes2(prev => prev.filter(s => s.id !== shapeId));
        setDroppedShapes(prev => [...prev, shapeFromSource2]);
        return;
      }
      
      const shapeFromSource3 = sourceShapes3.find(s => s.id === shapeId);
      if (shapeFromSource3) {
        setSourceShapes3(prev => prev.filter(s => s.id !== shapeId));
        setDroppedShapes(prev => [...prev, shapeFromSource3]);
      }
    }
  };

  const handleGroupClick = () => {
    if (sourceShapes1.length > 0) {
      setDroppedShapes(prev => [...prev, ...sourceShapes1]);
      setSourceShapes1([]);
    }
  };
  
  const isGroupDraggable = sourceShapes1.length > 0;
  
  const renderShapeChunks = (
    chunks: ShapeData[][], 
    onDragStart?: (e: React.DragEvent<HTMLDivElement>, shape: ShapeData) => void,
    onDoubleClick?: (shape: ShapeData) => void
  ) => {
    return chunks.map((chunk, chunkIndex) => (
      <div 
        key={chunkIndex} 
        className={`flex flex-col-reverse gap-1.5 ${chunkIndex > 0 && (chunkIndex) % 2 !== 0 ? 'mr-2' : ''}`}
      >
        {chunk.map(shape => 
          onDragStart ? (
            <div
              key={shape.id}
              draggable={true}
              onDragStart={(e) => onDragStart(e, shape)}
              onDoubleClick={onDoubleClick ? () => onDoubleClick(shape) : undefined}
              className="cursor-grab active:cursor-grabbing active:scale-125 transition-transform"
              aria-label="draggable shape"
            >
              <Shape shape={shape} />
            </div>
          ) : (
            <Shape key={shape.id} shape={shape} />
          )
        )}
      </div>
    ));
  };
  
  const source1Chunks = createChunks(sourceShapes1);
  const source2Chunks = createChunks(sourceShapes2);
  const source3Chunks = createChunks(sourceShapes3);
  const droppedChunks = createChunks([...droppedShapes].sort((a,b) => a.source.localeCompare(b.source) || a.id.localeCompare(b.id)));


  return (
    <div className="flex flex-col items-center justify-center gap-3 my-3 w-full">
      <div className="flex items-end justify-center gap-2 w-full min-h-[10rem] lg:min-h-[8rem]">
        {/* Source container 1 - Draggable as a group */}
        <div className="flex-1 flex justify-center items-center">
            <div 
              draggable={isGroupDraggable}
              onDragStart={isGroupDraggable ? handleGroupDragStart : undefined}
              onClick={handleGroupClick}
              className={`p-2 bg-blue-100/70 rounded-lg min-h-[8.5rem] lg:min-h-[7rem] flex items-end justify-center transition-shadow ${isGroupDraggable ? 'cursor-pointer cursor-grab active:cursor-grabbing active:ring-2 ring-blue-500' : ''}`}
            >
              {sourceShapes1.length > 0 ? (
                  <div className="flex flex-row items-end gap-1.5">
                    {renderShapeChunks(source1Chunks)}
                  </div>
              ) : (
                  num1 > 0 && <span className="text-xs text-slate-500 self-center">移動済み</span>
              )}
            </div>
        </div>

        <span className="text-2xl font-bold text-slate-500 pb-16 lg:pb-12">+</span>
        
        {/* Source container 2 - Individually draggable shapes */}
        <div className="flex-1 flex justify-center items-center">
            <div className="p-2 bg-green-100/70 rounded-lg min-h-[8.5rem] lg:min-h-[7rem] flex items-end justify-center">
              {sourceShapes2.length > 0 ? (
                  <div className="flex flex-row items-end gap-1.5">
                    {renderShapeChunks(source2Chunks, handleSingleShapeDragStart, handleDoubleClickShape)}
                  </div>
                ) : (
                  num2 > 0 && <span className="text-xs text-slate-500 self-center">移動済み</span>
                )}
            </div>
        </div>

        {num3 !== undefined && (
          <>
            <span className="text-2xl font-bold text-slate-500 pb-16 lg:pb-12">+</span>
            {/* Source container 3 */}
            <div className="flex-1 flex justify-center items-center">
              <div className="p-2 bg-orange-100/70 rounded-lg min-h-[8.5rem] lg:min-h-[7rem] flex items-end justify-center">
                  {sourceShapes3.length > 0 ? (
                      <div className="flex flex-row items-end gap-1.5">
                          {renderShapeChunks(source3Chunks, handleSingleShapeDragStart, handleDoubleClickShape)}
                      </div>
                  ) : (
                      num3 > 0 && <span className="text-xs text-slate-500 self-center">移動済み</span>
                  )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="text-2xl font-bold text-slate-500">↓</div>
      
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full p-3 bg-yellow-100/70 border-2 border-dashed border-yellow-400 rounded-xl min-h-[16rem] lg:min-h-[14rem] flex flex-col"
        aria-label="Drop zone for shapes"
      >
        <p className="text-center text-sm text-yellow-800 mb-2">ここに四角をいれて、数をかぞえよう！</p>
        <div className="flex-grow flex items-end justify-center">
           <div className="flex flex-row items-end gap-1.5">
              {renderShapeChunks(droppedChunks)}
           </div>
        </div>
        <p className="text-center text-lg font-bold text-yellow-900 mt-2" aria-live="polite">
          合計: {droppedShapes.length}
        </p>
      </div>
    </div>
  );
};

export default VisualHint;