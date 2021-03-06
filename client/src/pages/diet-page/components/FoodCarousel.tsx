/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from 'react';
import { useRecoilState } from 'recoil';
import Slider from 'react-slick';

import ArrowButton from 'common/components/arrow-button/ArrowButton';
import { MEAL_INITIAL_MESSAGE } from 'common/constants';
import { isCursorLeftX } from 'common/utils/getElementLocationInfo';
import currentTargetState from 'pages/add-routine-page/states/currentTargetState';
import { IMeal } from 'types/interfaces';
import foodUpdateState from '../states/foodUpdateState';

import * as SC from './FoodCarouselStyle';

interface ISliderProps {
  /** 슬라이더 아이템 요소 */
  data?: Array<string | number | null>;
  setData?: React.Dispatch<React.SetStateAction<Array<string | number | null>>>;
  objData?: Array<IMeal>;
  setObjData?: React.Dispatch<React.SetStateAction<Array<IMeal>>>;
  /** 커스텀 클래스 */
  className?: string;
  /** 자동재생 (속도 설정시 number 타입으로) */
  autoplay?: boolean | number;
  /** 슬라이더 속도 */
  speed?: number;
  /** 반복 여부 */
  loop?: boolean;
  // draggable
  draggable?: boolean;

  width?: number;
  dragTarget?: string | number | null;
  setDragTarget?: React.Dispatch<React.SetStateAction<string | number | null>>;
  modifyFlag?: boolean;
  setModalView?: React.Dispatch<React.SetStateAction<boolean>>;
  isCancel?: boolean;
  setIsCancel?: React.Dispatch<React.SetStateAction<boolean>>;
  cache?: Array<string | number | null> | Array<IMeal>;
  setCache?: React.Dispatch<
    React.SetStateAction<Array<string | number | null> | Array<IMeal>>
  >;
  objCache?: Array<IMeal>;
  setObjCache?: React.Dispatch<React.SetStateAction<Array<IMeal>>>;
}

const FoodCarousel = ({
  data = [],
  setData,
  objData = [],
  setObjData,
  className = 'test',
  autoplay = true,
  speed = 500,
  loop = false,
  draggable = false,
  width = 80,
  dragTarget,
  setDragTarget,
  modifyFlag = false,
  setModalView,
  isCancel,
  setIsCancel,
  setCache,
  cache,
  objCache,
  setObjCache,
}: ISliderProps) => {
  const configureOnlyOneContent = (dataLength: number, showCount: number) =>
    dataLength < showCount ? dataLength : showCount;
  const settings = {
    dots: true,
    infinite: draggable,
    speed,
    slidesToShow: configureOnlyOneContent(data.length || objData.length, 5),
    slidesToScroll: 5,
    initialSlide: 0,
    arrows: draggable,
    draggable: !draggable,
    nextArrow: <ArrowButton className="arrow-button" />,
    prevArrow: <ArrowButton className="arrow-button" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: configureOnlyOneContent(
            data.length || objData.length,
            4
          ),
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: configureOnlyOneContent(
            data.length || objData.length,
            3
          ),
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: configureOnlyOneContent(
            data.length || objData.length,
            2
          ),
          slidesToScroll: 2,
        },
      },
    ],
  };
  const [currentTarget, setCurrentTarget] = useRecoilState(currentTargetState);
  const [foodUpdate, setFoodUpdate] = useRecoilState(foodUpdateState);

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const dragStart = (e: any) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', dragTarget);
    if (modifyFlag) return;

    if (setDragTarget) {
      setDragTarget(data[e.currentTarget.dataset.index]);
    }
  };

  const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.display = 'block';
  };

  const dragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragTarget || !modifyFlag) return;

    const cachedData = [...objData];
    const dropTargetIndex = Number(e.currentTarget.dataset.index);
    const isInitial =
      objData[dropTargetIndex].foodName === MEAL_INITIAL_MESSAGE ||
      data[dropTargetIndex] === MEAL_INITIAL_MESSAGE;

    if (setObjCache) setObjCache([...cachedData]);

    if (setData) {
      if (isInitial) {
        data.splice(dropTargetIndex, 1, dragTarget);
        setCurrentTarget(dropTargetIndex);
      } else {
        // eslint-disable-next-line no-lonely-if
        if (isCursorLeftX(e)) {
          data.splice(dropTargetIndex, 0, dragTarget);
          setCurrentTarget(dropTargetIndex);
        } else {
          data.splice(dropTargetIndex + 1, 0, dragTarget);
          setCurrentTarget(dropTargetIndex + 1);
        }
      }
      setData([...data]);
    } else if (setObjData) {
      const tempData = objData.slice();
      const dragObj = {
        foodName: String(dragTarget),
        quantity: 0,
      };
      if (isInitial) {
        tempData.splice(dropTargetIndex, 1, dragObj);
        setCurrentTarget(dropTargetIndex);
      } else {
        // eslint-disable-next-line no-lonely-if
        if (isCursorLeftX(e)) {
          tempData.splice(dropTargetIndex, 0, dragObj);
          setCurrentTarget(dropTargetIndex);
        } else {
          tempData.splice(dropTargetIndex + 1, 0, dragObj);
          setCurrentTarget(dropTargetIndex + 1);
        }
      }

      setObjData([...tempData]);
    }

    if (setModalView) setModalView(true);
  };

  const handleClick = (item: string | number | null) => {
    setFoodUpdate(item);
    if (setModalView) setModalView(true);
  };

  return (
    <SC.CarouselWrapper width={width} className="CustomCarousel">
      <Slider {...settings}>
        {data &&
          data.map((item, i) => (
            <SC.Slide
              key={i}
              data-index={i}
              draggable={draggable}
              onDragOver={dragOver}
              onDragLeave={dragLeave}
              onDragStart={dragStart}
              onDragEnd={dragEnd}
              onDrop={dragDrop}
              className="slide-element"
              onClick={() => handleClick(item)}
            >
              <h3>{item}</h3>
            </SC.Slide>
          ))}

        {objData &&
          objData.map((item, i) => (
            <SC.Slide
              key={i}
              data-index={i}
              draggable={draggable}
              onDragOver={dragOver}
              onDragLeave={dragLeave}
              onDragStart={dragStart}
              onDragEnd={dragEnd}
              onDrop={dragDrop}
              className="slide-element"
            >
              <h3>{item.foodName}</h3>
            </SC.Slide>
          ))}
      </Slider>
    </SC.CarouselWrapper>
  );
};

export default FoodCarousel;
