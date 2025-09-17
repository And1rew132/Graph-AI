import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node as FlowNode,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import { TextNode, ImageNode } from './CustomNodes';
import { NodeData, ImageResult, HuggingFaceConfig } from '../types';
import { huggingFaceAPI } from '../utils/api';

const initialNodes: FlowNode[] = [
  {
    id: '1',
    type: 'textNode',
    position: { x: 100, y: 100 },
    data: {
      id: '1',
      label: 'Text Generator',
      prompt: 'Generate a creative story about a robot',
      nodeType: 'text-gen',
      apiConfig: { model: 'gpt2' }
    } as NodeData,
  },
  {
    id: '2',
    type: 'imageNode',
    position: { x: 400, y: 100 },
    data: {
      id: '2',
      label: 'Image Generator',
      prompt: 'A futuristic robot in a cyberpunk city',
      nodeType: 'image-gen',
      apiConfig: { model: 'runwayml/stable-diffusion-v1-5' }
    } as NodeData,
  },
];

const initialEdges: Edge[] = [];

interface GraphProps {
  apiKey: string;
}

export const Graph: React.FC<GraphProps> = ({ apiKey }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleModelChange = useCallback((nodeId: string, model: string) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              apiConfig: {
                ...node.data.apiConfig,
                model: model
              }
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const nodeTypes: NodeTypes = {
    textNode: (props) => <TextNode {...props} onModelChange={handleModelChange} />,
    imageNode: (props) => <ImageNode {...props} onModelChange={handleModelChange} />,
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addTextNode = useCallback(() => {
    const newNode: FlowNode = {
      id: uuidv4(),
      type: 'textNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        id: uuidv4(),
        label: 'New Text Node',
        prompt: '',
        nodeType: 'text-gen',
        apiConfig: { model: 'gpt2' }
      } as NodeData,
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addImageNode = useCallback(() => {
    const newNode: FlowNode = {
      id: uuidv4(),
      type: 'imageNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        id: uuidv4(),
        label: 'New Image Node',
        prompt: '',
        nodeType: 'image-gen',
        apiConfig: { model: 'runwayml/stable-diffusion-v1-5' }
      } as NodeData,
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const executeGraph = useCallback(async () => {
    if (!apiKey) {
      alert('Please set your Hugging Face API key first!');
      return;
    }

    setIsExecuting(true);
    huggingFaceAPI.setApiKey(apiKey);

    // Create a copy of nodes for execution
    const nodeMap = new Map<string, FlowNode>();
    nodes.forEach(node => nodeMap.set(node.id, { ...node }));

    // Simple execution: process nodes in order they were created
    for (const node of nodes) {
      const nodeData = node.data as NodeData;
      
      if (!nodeData.prompt) {
        continue;
      }

      try {
        let result;
        
        if (nodeData.nodeType === 'text-gen') {
          const config: HuggingFaceConfig = {
            model: nodeData.apiConfig?.model || 'gpt2'
          };
          const response = await huggingFaceAPI.generateText(
            config,
            nodeData.prompt
          );
          
          if (response.success && Array.isArray(response.data)) {
            result = response.data[0]?.generated_text || 'No result';
          } else {
            result = response.error || 'Error generating text';
          }
        } else if (nodeData.nodeType === 'image-gen') {
          const config: HuggingFaceConfig = {
            model: nodeData.apiConfig?.model || 'runwayml/stable-diffusion-v1-5'
          };
          const response = await huggingFaceAPI.generateImage(
            config,
            nodeData.prompt
          );
          
          if (response.success) {
            result = response.data as ImageResult;
          } else {
            result = response.error || 'Error generating image';
          }
        }

        // Update the node with the result
        const updatedNode = nodeMap.get(node.id);
        if (updatedNode) {
          updatedNode.data.result = result;
        }
      } catch (error) {
        console.error(`Error executing node ${node.id}:`, error);
      }
    }

    // Update nodes state
    setNodes(Array.from(nodeMap.values()));
    setIsExecuting(false);
  }, [nodes, apiKey, setNodes]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div className="toolbar">
        <button onClick={addTextNode} disabled={isExecuting}>
          Add Text Node
        </button>
        <button onClick={addImageNode} disabled={isExecuting}>
          Add Image Node
        </button>
        <button onClick={executeGraph} disabled={isExecuting || !apiKey}>
          {isExecuting ? 'Executing...' : 'Execute Graph'}
        </button>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};