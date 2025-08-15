# Note++

## Introduction

**Note++** is a hybrid desktop application designed for users who frequently switch between writing formatted code and plain-text. In many workflows, there is an inherent need for organization and the desire for the features of a rich-text editor that supports typical code editor functionality. Note++ was designed to effectively bridge this gap—providing these two functionalities within a clean interface. This eliminates the need to jump between multiple applications.

Ultimately, the core vision is to provide a seamless workspace for hybrid “text and code” tasks.

## Key Features

**Hybrid Rich-Text and C++ Code Editing**: A rich-text editor for notes and a separate C++ code editor powered by the engine of VS Code.
**View-switching with Ctrl+Shift+X**: Instantly toggle between editor views with a simple keyboard shortcut.
**Text alignment for rich-text documents**: Includes essential formatting options like text alignment to provide natural structure to your documents.
**Intelligent file handling**: The application creates its own rich-text files(.npp) and opens those in the rich-text editor, opening other files in the code editor directly.
**Native desktop experience for file saving and opening**: Built with Electron to feature system dialogs for saving and opening files.

## Tech Stack

**Frameworks**: Electron, React, Vite
**Languages**: TypeScript, C++
**Editors**: Slate.js, Monaco Editor
**Build Tools**: electron-builder, node-gyp

## Architecture & Design Tradeoffs 

Note++ is set up to use the key shortcut **Ctrl+Shift+X** to switch views between the rich-text editor and Monaco editor. In essence, this creates a "Two Seperate Document" model, where Note++ maintains two indepedent states. This approach allows both editors to function without data loss or corruption.

There are some trade-offs with this model. It isn't possible to save "text effects" such as bold, italics, underline, etc. Those become lost in the sync process between both editor modes. In a future redesign, I would keep the same seperate model, but enable code-chunk embedding with the rich-text editor, similar to Notion or Jupyter.

## Getting Started

git clone https://github.com/mbahcc/notepp.git
cd notepp
npm install
npm run rebuild 
npm run dev
