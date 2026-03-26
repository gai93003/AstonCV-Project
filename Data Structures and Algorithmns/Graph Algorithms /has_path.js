// Write a function, hasPath, that takes an object representing the adjacency list of a directed acyclic graph and two nodes (src, dst). The function should return a boolean indicating whether or not there exists a directed path between the source and destination nodes.

const graph = {
  f: ['g', 'i'],
  g: ['h'],
  h: [],
  i: ['g', 'k'],
  j: ['i'],
  k: []
}

// ---------------- Depth first algorithm solution for the above problem --------------------
const hasPaths = (graph, src, dst) => {
  if (src === dst ) return true;

  for (let neighbor of graph[src]) {
    if (hasPath(graph, neighbor, dst) === true) {
      return true;
    } 
  }

  return false;
};


// ---------------- Breadth first algorithm solution of the problem above. --------------------

const hasPath = (graph, src, dst) => {
  const queue = [ src ];

  while (queue.length > 0 ) {
    const current = queue.shift();

    if (current === dst) return true;

    for (let neighbor of graph[current]) {
      queue.push(neighbor);
    }
  }

  return false;
}


console.log(hasPath(graph, 'f', 'k'));
