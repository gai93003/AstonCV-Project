const newSet = new Set();

const solution = (num) => {


  for ( let i = 0; i < num; i++) {
    if (i % 3 === 0 || i % 5 === 0) {
      newSet.add(i)
    }
  }

  console.log([...newSet].reduce((acc, curr) => acc + curr, 0))
  
  return [...newSet].reduce((acc, curr) => acc + curr, 0);
}

solution(5)