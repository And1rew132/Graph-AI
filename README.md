# Graph-AI

A Node Graph based AI tool that supports prompt per node, where each node can execute AI operations and pass results to the next node. Designed to create visual workflows for AI image generation and text processing using APIs like Hugging Face.

## Features

- **Visual Node Graph Interface**: Drag-and-drop node editor using React Flow
- **Text Generation Nodes**: Generate text using Hugging Face language models
- **Image Generation Nodes**: Generate images using Hugging Face diffusion models
- **Prompt Per Node**: Each node has its own customizable prompt
- **Node-to-Node Flow**: Results from one node can be passed to the next
- **Real-time Image Display**: Generated images are displayed directly in the nodes
- **API Integration**: Seamless integration with Hugging Face Inference API

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Hugging Face API key (get it from [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/And1rew132/Graph-AI.git
cd Graph-AI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Usage

1. **Set API Key**: Enter your Hugging Face API key in the top-right input field
2. **Add Nodes**: Click "Add Text Node" or "Add Image Node" to create new nodes
3. **Configure Prompts**: Click on any node's prompt area to edit the prompt
4. **Connect Nodes**: Drag from the bottom handle of one node to the top handle of another to create connections
5. **Execute Graph**: Click "Execute Graph" to run all nodes and see the results

### Building for Production

```bash
npm run build
```

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Graph Visualization**: React Flow
- **API Integration**: Hugging Face Inference API
- **Styling**: CSS modules with custom design

## Project Structure

```
src/
├── components/
│   ├── CustomNodes.tsx    # Text and Image node components
│   └── Graph.tsx          # Main graph interface
├── types/
│   └── index.ts           # TypeScript type definitions
├── utils/
│   └── api.ts             # Hugging Face API integration
├── App.tsx                # Main application component
├── App.css                # Application styles
└── main.tsx               # Application entry point
```

## License

MIT License