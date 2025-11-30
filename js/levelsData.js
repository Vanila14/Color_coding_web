// levelsData.js — структура всех уровней
window.LEVELS_CONFIG = {
  1: {
    id: 1,
    title: "Уровень 1",
    layersCount: 1,
    goalLayers: {
      1: { shape: "круг", r: 0, g: 0, b: 255, opacity: 1 }
    },
    hint: "синий",
    weights: { shapeTotal: 50, colorTotal: 40, opacityTotal: 10 }
  },
  2: {
    id: 2,
    title: "Уровень 2",
    layersCount: 2,
    goalLayers: {
      1: { shape: "квадрат", r: 255, g: 0, b: 0, opacity: 1 },
      2: { shape: "треугольник", r: 0, g: 255, b: 0, opacity: 1 }
    },
    hint: "красный зеленый",
    weights: { shapeTotal: 50, colorTotal: 40, opacityTotal: 10 }
  },
  3: {
    id: 3,
    title: "Уровень 3",
    layersCount: 3,
    goalLayers: {
      1: { shape: "квадрат", r: 255, g: 0, b: 0, opacity: 1 },
      2: { shape: "круг", r: 0, g: 255, b: 0, opacity: 1 },
      3: { shape: "ромб", r: 0, g: 0, b: 255, opacity: 1 }
    },
    hint: "красный зеленый синий",
    weights: { shapeTotal: 50, colorTotal: 40, opacityTotal: 10 }
  },
  4: {
    id: 4,
    title: "Уровень 4",
    layersCount: 3,
    goalLayers: {
      1: { shape: "шестиугольник", r: 255, g: 255, b: 0, opacity: 1 },
      2: { shape: "звезда", r: 0, g: 255, b: 255, opacity: 1 },
      3: { shape: "крест", r: 255, g: 0, b: 255, opacity: 1 }
    },
    hint: "желтый голубой розовый",
    weights: { shapeTotal: 50, colorTotal: 40, opacityTotal: 10 }
  },
  5: {
    id: 5,
    title: "Уровень 5",
    layersCount: 2,
    goalLayers: {
      1: { shape: "треугольник", r: 255, g: 255, b: 0, opacity: 1 },
      2: { shape: "квадрат", r: 255, g: 0, b: 0, opacity: 0.5 },
    },
    hint: "желтый карсный50%",
    weights: { shapeTotal: 50, colorTotal: 40, opacityTotal: 10 }
  },
  6: {
    id: 6,
    title: "Уровень 6",
    layersCount: 2,
    goalLayers: {
      1: { shape: "облако", r: 100, g: 100, b: 100, opacity: 1 },
      2: { shape: "сердце", r: 213, g: 66, b: 131, opacity: 1 },
    },
    hint: "серый розовый",
    weights: { shapeTotal: 50, colorTotal: 40, opacityTotal: 10 }
  },
  7: {
    id: 7,
    title: "Уровень 7",
    layersCount: 3,
    goalLayers: {
      1: { shape: "треугольник", r: 218, g: 254, b: 118, opacity: 1 },
      2: { shape: "звезда", r: 33, g: 151, b: 211, opacity: 0.8 },
      3: { shape: "цветочик", r: 55, g: 55, b: 55, opacity: 0.9 }
    },
    hint: "зеленый синий серый",
    weights: { shapeTotal: 50, colorTotal: 40, opacityTotal: 10 }
  },
  8: {
    id: 8,
    title: "Уровень 8",
    layersCount: 3,
    goalLayers: {
      1: { shape: "шестиугольник", r: 0, g: 30, b: 60, opacity: 1 },
      2: { shape: "ромб", r: 90, g: 120, b: 150, opacity: 0.8 },
      3: { shape: "крест", r: 180, g: 210, b: 240, opacity: 0.6 }
    },
    hint: "отенки синиго",
    weights: { shapeTotal: 50, colorTotal: 40, opacityTotal: 10 }
  },
  9: {
  id: 9,
  title: "Уровень 9",
  layersCount: 3,
  goalLayers: {
    1: { shape: "цветочик", r: 250, g: 50, b: 80, opacity: 1 },
    2: { shape: "крест", r: 255, g: 255, b: 0, opacity: 0.6 },
    3: { shape: "облако", r: 80, g: 50, b: 52, opacity: 0.9 }
  },
  hint: "розовый желтый фиолетовый",
  weights: { shapeTotal: 50, colorTotal: 40, opacityTotal: 10 }
},
  10: {
  id: 10,
  title: "Уровень 10",
  layersCount: 3,
  goalLayers: {
    1: { shape: "круг", r: 255, g: 0, b: 0, opacity: 1 },
    2: { shape: "треугольник", r: 0, g: 255, b: 0, opacity: 0.8 },
    3: { shape: "звезда", r: 0, g: 0, b: 255, opacity: 0.6 }
  },
  hint: "",
  invertDisplay: true, // ← КЛЮЧ!!!
  weights: { shapeTotal: 50, colorTotal: 40, opacityTotal: 10 },
  
  
}

};
