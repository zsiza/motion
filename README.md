###### This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
###### npm run dev, npx convex dev

# Note-Taking and Organizer Web Application

**A modern, real-time document editor – a Notion-like experience built on React and BlockNote**

## Project Overview

This project is a note-taking web application that supports real-time collaboration.
Users can create documents, edit them in a block-based interface, and work together in real time.

The project was created as part of a thesis, and its goal is to demonstrate modern web development technologies and collaboration systems in practice.

---

## Key Features

### **Block-Based Document Editing**

- BlockNote editor integration
- Insert text, lists, headings, and images
- Responsive UI

### **Real-Time Collaboration**

- Multiple users can edit the same document at the same time
- Live cursors (colored cursor + name display)
- Liveblocks CRDT-based synchronization

### **Cloud-Based Data Storage**

- Convex database
- Real-time change tracking

### **Authentication**

- Clerk integration (name, avatar, color)
- Secure document access
- User-based presence display

### **AI Integration**

#### _(under construction)_

- GROQ LLaMA models for fast text processing
- AI menu in the BlockNote editor:
  - text generation
  - rephrasing
  - summarization
  - block-level modifications

### **Modern UX/UI**

- Dark/light theme
- Colored cursor avatars
- Clean editing interface

---

## Technologies Used

### **Frontend**

- React 18 / Next.js 15 (App Router)
- TypeScript
- BlockNote editor
- TailwindCSS

### **Real-Time Collaboration**

- Liveblocks (presence, storage, CRDT)

### **Backend and Data Management**

- Convex serverless backend
- Liveblocks auth endpoint
- Clerk authentication

## _under construction_

### **AI**

- Vercel AI SDK
- GROQ LLaMA 3.1 / 3.3 models
- Proxy API calls
###### npm run dev, npx convex dev

# Jegyzetelő és szervező webalkalmazás

**Modern, valós idejű dokumentumszerkesztő – Notion-szerű élmény React és BlockNote alapokon**

## Projekt áttekintése

Ez a projekt egy valós idejű együttműködést támogató jegyzetelő webalkalmazás.
A felhasználók dokumentumokat hozhatnak létre, szerkeszthetik őket blokk-alapú felületen, valós időben együtt dolgozhatnak.

A projekt a szakdolgozat részeként készült, célja pedig a modern webfejlesztési technológiák és kollaborációs rendszerek gyakorlati bemutatása.

---

## Fő funkciók

### **Blokk-alapú dokumentumszerkesztés**

- BlockNote editor integráció
- Szöveg, lista, fejlécek, képek beszúrása
- Reszponzív UI

### **Valós idejű kollaboráció**

- Egyszerre több felhasználó szerkesztheti ugyanazt a dokumentumot
- Live cursors (színes kurzor + név megjelenítés)
- Liveblocks CRDT alapú szinkronizáció

### **Felhő alapú adattárolás**

- Convex database
- Valós idejű változáskövetés

### **Hitelesítés**

- Clerk integráció (név, avatar, szín)
- Biztonságos dokumentumelérés
- User alapú jelenlét megjelenítés

### **AI integráció**

#### _(under construction)_

- GROQ LLaMA modellek a gyors szövegfeldolgozáshoz
- AI menü a BlockNote editorban:
  - szöveg generálás
  - átfogalmazás
  - összefoglaló
  - blokk-szintű módosítások

### **Modern UX/UI**

- Sötét/világos téma
- Színes kurzor avatarok
- Letisztult szerkesztőfelület

---

## Felhasznált technológiák

### **Frontend**

- React 18 / Next.js 15 (App Router)
- TypeScript
- BlockNote editor
- TailwindCSS

### **Valós idejű kollaboráció**

- Liveblocks (presence, storage, CRDT)

### **Backend és adatkezelés**

- Convex serverless backend
- Liveblocks auth endpoint
- Clerk hitelesítés

## _under construction_

### **AI**

- Vercel AI SDK
- GROQ LLaMA 3.1 / 3.3 modellek
- Proxy API hívások


