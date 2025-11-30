// shapes.js — createSVGShape + экспорт
window.createSVGShape = function(type, r=0, g=0, b=0, opacity=1, size = 150) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.style.position = "absolute";
  svg.style.top = "50%";
  svg.style.left = "50%";
  svg.style.transform = "translate(-50%, -50%)";
  svg.style.pointerEvents = "none"; // чтобы не мешать кликам
  svg.classList.add('svg-shape');

  const color = `rgba(${r},${g},${b},${opacity})`;

  let shapeEl = null;

  switch ((type||"").toLowerCase()) {
    case "круг":
      shapeEl = document.createElementNS(ns, "circle");
      shapeEl.setAttribute("cx", "50");
      shapeEl.setAttribute("cy", "50");
      shapeEl.setAttribute("r", "40");
      shapeEl.setAttribute("fill", color);
      break;

    case "квадрат":
      shapeEl = document.createElementNS(ns, "rect");
      shapeEl.setAttribute("x", "10");
      shapeEl.setAttribute("y", "10");
      shapeEl.setAttribute("width", "80");
      shapeEl.setAttribute("height", "80");
      shapeEl.setAttribute("fill", color);
      break;

    case "треугольник":
      shapeEl = document.createElementNS(ns, "polygon");
      shapeEl.setAttribute("points", "50,8 92,88 8,88");
      shapeEl.setAttribute("fill", color);
      break;

    case "ромб":
    
      shapeEl = document.createElementNS(ns, "rect");
      shapeEl.setAttribute("x", "25");
      shapeEl.setAttribute("y", "25");
      shapeEl.setAttribute("width", "50");
      shapeEl.setAttribute("height", "50");
      shapeEl.setAttribute("fill", color);
      shapeEl.setAttribute("transform", "rotate(45 50 50)");
      break;

    case "звезда":
      shapeEl = document.createElementNS(ns, "polygon");
  
      shapeEl.setAttribute("points",
        "50,5 61.8,35.1 95.1,35.1 68.6,54.9 79.4,85 50,66 20.6,85 31.4,54.9 4.9,35.1 38.2,35.1"
      );
      shapeEl.setAttribute("fill", color);
      break;

    case "сердце":
      shapeEl = document.createElementNS(ns, "path");
      shapeEl.setAttribute("d",
        "M50 80 L20 50 A18 18 0 0 1 50 24 A18 18 0 0 1 80 50 Z"
      );
      shapeEl.setAttribute("fill", color);
      break;

    case "шестиугольник":
      shapeEl = document.createElementNS(ns, "polygon");

      shapeEl.setAttribute("points", "50,6 84,25 84,75 50,94 16,75 16,25");
      shapeEl.setAttribute("fill", color);
      break;

    case "крест":

      const g = document.createElementNS(ns, "g");
      const v1 = document.createElementNS(ns, "rect");
      v1.setAttribute("x","46"); v1.setAttribute("y","15"); v1.setAttribute("width","8"); v1.setAttribute("height","70"); v1.setAttribute("fill", color);
      const h1 = document.createElementNS(ns, "rect");
      h1.setAttribute("x","15"); h1.setAttribute("y","46"); h1.setAttribute("width","70"); h1.setAttribute("height","8"); h1.setAttribute("fill", color);
      g.appendChild(v1); g.appendChild(h1);
      shapeEl = g;
      break;

    case "облако":
      const gCloud = document.createElementNS(ns, "g");
      const c1 = document.createElementNS(ns, "circle"); c1.setAttribute("cx","35"); c1.setAttribute("cy","55"); c1.setAttribute("r","20"); c1.setAttribute("fill", color);
      const c2 = document.createElementNS(ns, "circle"); c2.setAttribute("cx","50"); c2.setAttribute("cy","40"); c2.setAttribute("r","22"); c2.setAttribute("fill", color);
      const c3 = document.createElementNS(ns, "circle"); c3.setAttribute("cx","65"); c3.setAttribute("cy","55"); c3.setAttribute("r","20"); c3.setAttribute("fill", color);
      const baseRect = document.createElementNS(ns, "rect"); baseRect.setAttribute("x","25"); baseRect.setAttribute("y","55"); baseRect.setAttribute("width","50"); baseRect.setAttribute("height","12"); baseRect.setAttribute("fill", color);
      gCloud.appendChild(c1); gCloud.appendChild(c2); gCloud.appendChild(c3); gCloud.appendChild(baseRect);
      shapeEl = gCloud;
      break;

    case "цветочик":
      const gFlower = document.createElementNS(ns, "g");
      for (let i=0;i<6;i++){
        const p = document.createElementNS(ns, "ellipse");
        p.setAttribute("rx","10"); p.setAttribute("ry","22");
        p.setAttribute("cx","50"); p.setAttribute("cy","30");
        p.setAttribute("fill", color);
        p.setAttribute("transform", `rotate(${i*60} 50 50) translate(0,12)`);
        gFlower.appendChild(p);
      }
      const center = document.createElementNS(ns, "circle");
      center.setAttribute("cx","50"); center.setAttribute("cy","50"); center.setAttribute("r","10"); center.setAttribute("fill", color);
      gFlower.appendChild(center);
      shapeEl = gFlower;
      break;

    default:
      console.warn('Unknown shape type:', type);
      return null;
  }

  if (shapeEl) svg.appendChild(shapeEl);
  return svg;
};
