###### This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
