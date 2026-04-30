# 🚚 Delivery Route Optimizer (Dynamic Programming Project)

## 📌 Overview

The **Delivery Route Optimizer** is a full-stack project that finds the **minimum cost path** between two locations using **Dynamic Programming (DP)**.

It takes a graph (as an adjacency matrix) and computes the most efficient route between a start and end node.

---

## 🧠 Core Concept

This project is based on **Dynamic Programming (Top-Down with Memoization)**.

### Key ideas used:

* **Overlapping Subproblems** → Same node paths are recalculated → stored in memory
* **Optimal Substructure** → Best path = best subpaths
* **Memoization** → Store results to avoid recomputation
* **Bitmasking** → Efficiently track visited nodes

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* CORS

### Frontend

* HTML
* CSS
* JavaScript (Fetch API)

---

## 📁 Project Structure

```
project-root/
│
├── backend/
│   ├── server.js
│   ├── route.js
│   ├── routeController.js
│   ├── dpAlgorithm.js
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

## ⚙️ How It Works (Workflow)

### 1. User Input (Frontend)

* User enters:

  * Graph (matrix)
  * Start node
  * End node

### 2. API Request

Frontend sends POST request:

```
POST http://localhost:3000/optimize-route
```

### 3. Route Handling (Backend)

* `server.js` → handles server & middleware
* `route.js` → defines API endpoint
* `routeController.js` → validates input and calls DP function

### 4. Core Logic Execution

* `dpAlgorithm.js` runs **Dynamic Programming algorithm**
* Computes:

  * Minimum cost
  * Optimal path

### 5. Response

Backend sends:

```json
{
  "minCost": 10,
  "path": [0, 2, 3]
}
```

### 6. Display

Frontend displays result to user

---

## 🧮 Algorithm Explanation

### Function:

```
findMinCostPath(graph, start, end)
```

### Approach:

* Recursive DP function:

  ```
  dp(node, visited)
  ```
* Try all possible next nodes
* Use memoization:

  ```
  memo[node, visited]
  ```
* Return minimum cost

### Time Optimization:

* Avoids recomputation using caching
* Uses bitmask for efficient state tracking

---

## 🚀 How to Run the Project

### 🔹 Step 1: Go to backend

```bash
cd backend
```

### 🔹 Step 2: Initialize project

```bash
npm init -y
```

### 🔹 Step 3: Install dependencies

```bash
npm install express cors
```

### 🔹 Step 4: Run server

```bash
node server.js
```

👉 Server runs at:

```
http://localhost:3000
```

---

### 🔹 Step 5: Run frontend

Go to frontend folder:

```bash
cd ../frontend
```

Open:

```
index.html
```

OR use:

```bash
npx live-server
```

---

## 📡 API Details

### Endpoint:

```
POST /optimize-route
```

### Request Body:

```json
{
  "graph": [
    [0, 10, 15],
    [10, 0, 20],
    [15, 20, 0]
  ],
  "start": 0,
  "end": 2
}
```

### Response:

```json
{
  "minCost": 15,
  "path": [0, 2]
}
```

---

## ❗ Error Handling

* Invalid graph → 400 error
* Invalid nodes → 400 error
* No path → returns `minCost: -1`
* Server error → 500 error

---

## 💡 Key Features

✔ Finds optimal delivery route
✔ Uses efficient DP algorithm
✔ Full-stack implementation
✔ Input validation included
✔ Clean modular structure

---

## 📚 Learning Outcomes

* Practical use of **Dynamic Programming**
* Backend API development using Express
* Frontend-backend integration
* Debugging module/path errors in Node.js
* Working with graphs and algorithms

---

## 🏁 Conclusion

This project demonstrates how **real-world problems like delivery optimization** can be solved using **advanced algorithms like Dynamic Programming**, combined with a simple full-stack architecture.

---

## 🙌 Future Improvements

* Add map visualization
* Use real-world data (Google Maps API)
* Convert to React frontend
* Add database support (MongoDB/MySQL)

---


