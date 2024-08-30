import MealItem from './MealItem.jsx';
import useHttp from '../hooks/useHttp.js';

const requestConfig = {};

export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp('https://boule-elpan.web.app/meals', requestConfig, []);

  if (isLoading) {
    return <p className="loading-text">Cargando productos...</p>;
  }
  

  // if (!data) {
  //   return <p>No meals found.</p>
  // }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}