<<<<<<< HEAD
import { useState, useEffect } from "react"
import MealItem from "./MealItem"

// {}
export default function Meals() {
    const [loadedMeals, setLoadedMeals] = useState([])

useEffect(() => {
 async function fetchMeals() {
        const response = await fetch('http://localhost:3000/meals')

        if (!response.ok){

    }
        const meals = await response.json()
        setLoadedMeals(meals)
}

fetchMeals() 

}, [])

   

return (
<ul id="meals">
    {loadedMeals.map((meal) => (
    <MealItem key={meal.id} meal={meal}/>
))}
</ul>
)
=======
import { useState, useEffect } from 'react';

import MealItem from './MealItem.jsx';

export default function Meals() {
  const [loadedMeals, setLoadedMeals] = useState([]);

  useEffect(() => {
    async function fetchMeals() {
      const response = await fetch('http://localhost:3000/meals');

      if (!response.ok) {
        // ...
      }

      const meals = await response.json();
      setLoadedMeals(meals);
    }

    fetchMeals();
  }, []);

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
>>>>>>> 5ca97e896659f01ace48d1e53c4f3ae89f4ab6e3
}