// This first method is using the explicit array with its operations to implement the Depth First Algorithms.

// const depthFirstPrint = (graph, source) => {
//   const stack = [ source ];

//   while (stack.length > 0 ) {
//     const current = stack.pop();
//     console.log(current);
    
//     for (let neighbor of graph[current] ) {
//       stack.push(neighbor);
//     }
//   }
// }

const graph = {
  a: ['b', 'c'],
  b: ['d'],
  c: ['e'],
  d: ['f'],
  e: [],
  f: []
};


// This second method is using recursion to implement the Depth First Algorithm.
// How this work is that when we reach the last node without neighbors, the function won't run the for loop.
// It has no explicit base meaning that there is no explicit return e.g 
// if () return to terminate the loop like in most recursions to know that a node is a dead end.
// 

const depthFirstPrint = (graph, source) => {
  console.log(source);

  for (let neighbor of graph[source]) {
    depthFirstPrint(graph, neighbor);
  }
}

depthFirstPrint(graph, 'a'); // abdfce

// breadthFirstPrint(graph, 'a'); // acbedf
