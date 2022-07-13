import { Calorie } from 'common/components';
import * as SC from './MealStyle';

interface MealProps {
  name: string;
  mealList: Array<{ foodName: string; quantity: number; id: string }>;
}

interface CalorieProps {
  foods: Array<{ name: string; value: number }>;
  carbohydrate: number;
  protein: number;
  fat: number;
}

const Meal = ({ name, mealList }: MealProps) => {
  const dummyFood = [
    {
      name: '닭가슴살',
      carbohydrate: 0,
      protein: 100,
      fat: 130,
      quantity: 100,
      calories: 230,
    },
    {
      name: '쌀밥',
      carbohydrate: 100,
      protein: 10,
      fat: 1,
      quantity: 100,
      calories: 111,
    },
    {
      name: '바나나',
      carbohydrate: 30,
      protein: 30,
      fat: 30,
      quantity: 100,
      calories: 90,
    },
    {
      name: '오트밀',
      carbohydrate: 80,
      protein: 10,
      fat: 1,
      quantity: 100,
      calories: 91,
    },
  ];

  const init: CalorieProps = {
    foods: [],
    carbohydrate: 0,
    protein: 0,
    fat: 0,
  };

  const dummyCalorie = dummyFood.reduce(
    (prev, food) => ({
      foods: [...prev.foods, { name: food.name, value: food.calories }],
      carbohydrate: prev.carbohydrate + food.carbohydrate,
      protein: prev.protein + food.protein,
      fat: prev.fat + food.fat,
    }),
    init
  );

  const handleUpdate = () => {
    alert('Update');
  };

  const handleDelete = () => {
    alert('Delete');
  };

  return (
    <SC.MealContainer>
      <span>{name}</span>
      <SC.ContentContainer>
        <SC.MealList>
          {mealList.map((meal) => (
            <li key={meal.foodName}>{`${meal.foodName} ${meal.quantity}g`}</li>
          ))}
        </SC.MealList>
        <Calorie
          foods={dummyCalorie.foods}
          carbohydrate={dummyCalorie.carbohydrate}
          protein={dummyCalorie.protein}
          fat={dummyCalorie.fat}
        />
      </SC.ContentContainer>
      <SC.ButtonContainer>
        <button type="button" onClick={handleUpdate}>
          수정
        </button>
        <button type="button" onClick={handleDelete}>
          삭제
        </button>
      </SC.ButtonContainer>
    </SC.MealContainer>
  );
};

export default Meal;