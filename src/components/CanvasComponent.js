import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import "./CanvasComponent.css";

function CanvasComponent() {
  const [cards, setCards] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [edges, setEdges] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  // Use nodes state from React Flow for better management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [reactEdges, setReactEdges, onEdgesChange] = useEdgesState(edges);

  const addCard = () => {
    const id = `card-${cards.length + 1}`;
    const position = { x: Math.random() * 300, y: Math.random() * 300 };

    const newNode = {
      id,
      type: "default",
      position,
      data: {
        label: (
          <ResizableBox
            width={200}
            height={100}
            onResizeStop={(e, data) => onCardResize(id, data.size)}
          >
            <div
              className="card"
              onClick={() => onCardClick(id)}
            >
              {`This is some dummy text for ${id}.`.substring(0, 50)}...
              <button onClick={() => onCardClick(id)}>Show More</button>
            </div>
          </ResizableBox>
        ),
      },
    };

    setCards([...cards, newNode]);
    setNodes((nds) => [...nds, newNode]);
  };

  const onCardClick = (id) => {
    const card = cards.find((c) => c.id === id);
    setSelectedCard(card);
  };

  const onCardResize = (id, newSize) => {
    setCards((cards) =>
      cards.map((card) =>
        card.id === id ? { ...card, size: newSize } : card
      )
    );
  };

  const onConnect = (params) => setReactEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <button style={{ position: "fixed", top: 10, left: 10, zIndex: 10 }} onClick={addCard}>
        Add Card
      </button>
      <ReactFlow
        nodes={nodes}
        edges={reactEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={{ width: "100%", height: "100%" }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      {selectedCard && (
        <div className="popup">
          <div>{selectedCard.data.label}</div>
          <button onClick={() => setSelectedCard(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default CanvasComponent;
