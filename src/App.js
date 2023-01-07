import Konva from 'konva';
import './App.css'
import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text, Line, Rect, Circle, Arrow, Image } from 'react-konva'
import CropSquareIcon from '@mui/icons-material/CropSquareOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import BrushIcon from '@mui/icons-material/Brush';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import useImage from 'use-image';
import { Html } from 'react-konva-utils';
function App() {
  const [rectInprog, setRectInprog] = useState([])
  const [circleInprog, setCircleInprog] = useState([])
  const [arrowInprog, setArrowInprog] = useState([])
  const [fill, setFill] = useState(false)
  const [rects, setRects] = useState([])
  const [circles, setCircles] = useState([])
  const [arrows, setArrows] = useState([])
  const [shapeType, setShapeType] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [draw, setDraw] = useState(true)
  const [texts, setTexts] = useState([])
  const [textEditVisible, setTextEditVisible] = useState(false)
  const [textX, setTextX] = useState(0)
  const [textY, setTextY] = useState(0)
  const [pointerOnText, setPointerOnText] = useState(false)
  const [textValue, setTextValue] = useState('')
  const arrowsToDraw = [...arrows, ...arrowInprog];
  const rectsToDraw = [...rects, ...rectInprog];
  const circlesToDraw = [...circles, ...circleInprog];
  const [color, setColor] = useState('red')
  const [selected, setSelected] = useState([])
  const [i, setI] = useState()
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [lastText, setLastText] = useState('')
  const [dragFlag, setDragFlag] = useState(false)
  const containerRef = useRef(null)
  const [displayStage, setDisplayStage] = useState(0)

  useEffect(() => {
    setHeight(containerRef.current.offsetHeight);
    setWidth(containerRef.current.offsetWidth);
  }, [containerRef]);

  const handleTextareaKeyDown = e => {
    if (e.keyCode === 13 && e.target.value !== '') {
      const newText = new Konva.Text({
        text: textValue != '' ? textValue : lastText,
        x: textX + 10,
        y: textY - 15,
      })
      setTexts([...texts, newText])
      // setShapeType('')
      setTextValue('')
      setTextEditVisible(false)
      setLastText('')
    }
    if (e.keyCode === 27) {
      setTextEditVisible(false)
      setLastText('')
      setTextValue('')
    }
  };

  const handleTextEdit = (e) => {
    setTextValue(e.target.value)
    if (lastText !== '') {
      setTextValue(e.target.value)
      setLastText('')
    }
  };
  const handleTextDblClick = (e) => {
    if (shapeType == 'text') {
      const absPos = e.target.getAbsolutePosition();
      setTextX(absPos.x)
      setTextY(absPos.y)
      setTextEditVisible(true)

      setLastText(e.target.attrs.text)
      const targetText = texts.filter(t => t.attrs.text !== e.target.attrs.text)
      setTexts(targetText)



    }
  };
  // edit text function
  // function editText(e) {
  //   if (shapeType == 'text') {

  //   }
  // }
  function handleMouseDown(e) {
    const x = e.target.getStage().getPointerPosition().x
    const y = e.target.getStage().getPointerPosition().y
    setIsDrawing(true)
    if (draw && shapeType === 'freeDraw') {
      setLines([...lines, { tool, points: [x, y] }]);
    }
    if (shapeType === 'rectangle' && draw && rectInprog.length === 0) {
      const reqtangle = new Konva.Rect({
        x: x,
        y: y,
        width: 0,
        height: 0,
      })
      setRectInprog([reqtangle])
    }
    if (shapeType === 'circle' && draw && circleInprog.length === 0) {
      const circle = new Konva.Circle({
        x: x,
        y: y,
        radius: 0,
      });
      setCircleInprog([circle])
    }
    if (shapeType === 'arrow' && draw && arrowInprog.length === 0) {
      const arrow = new Konva.Arrow({
        x: x,
        y: y,
        points: [x, y, x, y],
        pointerWidth: 0,
        pointerLength: 0
      })
      setArrowInprog([arrow])
    }
  }
  function handleMouseMove(e) {
    setDisplayStage(e.target.getStage().getPointerPosition())

    if (!isDrawing) { return false }
    if (draw && shapeType === 'freeDraw' && lines.length > 0) {

      const point = e.target.getStage().getPointerPosition();
      let lastLine = lines[lines.length - 1];
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      // replace last
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
    if (shapeType === 'rectangle' && rectInprog.length === 1) {
      const width = e.target.getStage().getPointerPosition().x - rectInprog[0].attrs.x
      const height = e.target.getStage().getPointerPosition().y - rectInprog[0].attrs.y
      const shape = new Konva.Rect({
        x: rectInprog[0].attrs.x,
        y: rectInprog[0].attrs.y,
        width: width - 2,
        height: height - 2,
      })
      setRectInprog([shape])
    }
    if (shapeType === 'arrow' && arrowInprog.length === 1) {
      const startX = arrowInprog[0].attrs.points[0]
      const startY = arrowInprog[0].attrs.points[1]
      const shape = new Konva.Arrow({
        x: e.target.getStage().getPointerPosition().x,
        y: e.target.getStage().getPointerPosition().y,
        points: [startX, startY, e.target.getStage().getPointerPosition().x, e.target.getStage().getPointerPosition().y],
      })
      setArrowInprog([shape])
    }
    if (shapeType === 'circle' && circleInprog.length === 1) {
      const xradius = Math.pow(e.target.getStage().getPointerPosition().x - circleInprog[0].attrs.x, 2)
      const yradius = Math.pow(e.target.getStage().getPointerPosition().y - circleInprog[0].attrs.y, 2)
      const radius = Math.sqrt(xradius + yradius)
      const shape = new Konva.Circle({
        x: circleInprog[0].attrs.x,
        y: circleInprog[0].attrs.y,
        radius: Math.abs(radius - 3),
      });
      setCircleInprog([shape])
    }
  }
  function handleMouseUp(e) {
    const x = e.target.getStage().getPointerPosition().x
    const y = e.target.getStage().getPointerPosition().y
    if (shapeType === 'rectangle' && draw && rectInprog.length === 1) {
      const width = x - rectInprog[0].attrs.x
      const height = y - rectInprog[0].attrs.y
      const shapetoadd = new Konva.Rect({
        x: rectInprog[0].attrs.x,
        y: rectInprog[0].attrs.y,
        width: width,
        height: height,
      })
      rects.push(shapetoadd)
      setRects(rects)
    }
    if (shapeType === 'circle' && draw && circleInprog.length === 1) {
      const xradius = Math.pow(x - circleInprog[0].attrs.x, 2)
      const yradius = Math.pow(y - circleInprog[0].attrs.y, 2)
      const radius = Math.sqrt(xradius + yradius)
      const circletoadd = new Konva.Circle({
        x: circleInprog[0].attrs.x,
        y: circleInprog[0].attrs.y,
        radius: Math.abs(radius),
      });
      circles.push(circletoadd)
      setCircles(circles)
    }
    if (shapeType === 'arrow' && draw && arrowInprog.length === 1) {
      const startX = arrowInprog[0].attrs.points[0]
      const startY = arrowInprog[0].attrs.points[1]
      const pointerLength = startX == x || startY == y ? 0 : 10
      const pointerWidth = startY == x || startY == y ? 0 : 10
      const arrowtoadd = new Konva.Arrow({
        x: x,
        y: y,
        points: [startX, startY, x, y],
        pointerWidth: pointerWidth,
        pointerLength: pointerLength
      })
      arrows.push(arrowtoadd)
      setArrows(arrows)
    }
    setArrowInprog([])
    setRectInprog([])
    setCircleInprog([])
    setIsDrawing(false)
  }
  // -------------------------------------------------------------- create text-------------------------------------------------
  const handleSingleClick = (e) => {
    console.log(e.target.getStage().getPointerPosition());
    setSelected([])
    if (shapeType == 'text') {
      const absPos = e.target.getStage().getPointerPosition()
      handleTextDblClick(e)
      setTextEditVisible(true)
      setTextX(absPos.x)
      setTextY(absPos.y)
    }
  }



  const [image] = useImage('https://jimmyrose.me/wp-content/uploads/2020/11/screen-shot-2020-11-16-at-1.53.37-pm-2--1.jpg');
  if (image) {
    var imageHeight = image.height
  }
  // ----------///--------------------------------Selection----------------------------------------////----------------
  const selectFunc = (e, i) => {
    console.log(e.target.attrs.points)
    if (e.target.attrs) {
      if (e.target.attrs.width) {
        const selectedRect = rects.filter(rect => rect.attrs.width == e.target.attrs.width && rect.attrs.height == e.target.attrs.height)
        setSelected(selectedRect)
      }
      if (e.target.attrs.radius) {
        const selectedCircle = circles.filter(circle => circle.attrs.radius == e.target.attrs.radius)
        setSelected(selectedCircle)
      }
      if (e.target.attrs.points && e.target.attrs.points.length < 5) {
        const ep = e.target.attrs.points
        const selectedArrow = arrows.filter(arrow => arrow.attrs.points[0] == ep[0]
          && arrow.attrs.points[1] == ep[1]
          && arrow.attrs.points[2] == ep[2]
          && arrow.attrs.points[3] == ep[3]
        )
        setSelected(selectedArrow)
      }
    }
    if (e.target.attrs.points && e.target.attrs.points.length > 4) {
      const epLine = e.target.attrs.points
      const selectedLine = lines.filter((line) => line.points[0] == epLine[0]
        && line.points[1] == epLine[1]
        && line.points[2] == epLine[2]
        && line.points[3] == epLine[3]
      )
      setSelected(selectedLine)
    }
  }
  // ----------///--------------------------------deletion----------------------------------------////----------------
  const deleteSelected = () => {
    if (selected.length == 1) {
      if (selected[0].attrs) {
        console.log('working')
        if (selected[0].attrs.width) {
          const filterdRects = rects.filter(rect => rect.attrs.height !== selected[0].attrs.height && rect.attrs.width !== selected[0].attrs.width)
          setRects(filterdRects)
          setSelected([])
        }
        if (selected[0].attrs.radius) {
          const filterdCicles = circles.filter(circle => circle.attrs.radius !== selected[0].attrs.radius)
          setCircles(filterdCicles)
          setSelected([])
        }
        if (selected[0].attrs.points) {
          const ep = selected[0].attrs.points
          const filterdArrows = arrows.filter(arrow => arrow.attrs.points[0] !== ep[0]
            && arrow.attrs.points[1] !== ep[1]
            && arrow.attrs.points[2] !== ep[2]
            && arrow.attrs.points[3] !== ep[3])
          setArrows(filterdArrows)
          setSelected([])
          setI()
        }
      }
      if (selected[0].tool) {
        const ep = selected[0].points
        const filterdLines = lines.filter(line => line.points[0] !== ep[0]
          && line.points[1] !== ep[1]
          && line.points[2] !== ep[2]
          && line.points[3] !== ep[3]
        )
        setLines(filterdLines)
        setSelected([])
        setI()
      }
    }
  }

  // ---------/////---------------------------------Dragging-------------------------------------------////-------------

  const replaceShape = (e) => {
    console.log(e.target);
    if (e.target.attrs.width && !e.target.attrs.text) {
      const filtredRects = rects.filter((rect) => rect.attrs.height != e.target.attrs.height)
      const replacerRect = new Konva.Rect({
        x: e.target.getStage().getPointerPosition().x,
        y: e.target.getStage().getPointerPosition().y,
        width: e.target.attrs.width,
        height: e.target.attrs.height
      })
      setRects([...filtredRects, replacerRect])
    }

    if (e.target.attrs.radius) {
      const filtredCircles = circles.filter((circle) => circle.attrs.radius != e.target.attrs.radius)
      const replacerCircle = new Konva.Circle({
        x: e.target.getStage().getPointerPosition().x,
        y: e.target.getStage().getPointerPosition().y,
        radius: e.target.attrs.radius
      })
      setCircles([...filtredCircles, replacerCircle])
    }

    if (e.target.attrs.text) {
      const dragedText = texts.findIndex(t => t.attrs.text == e.target.attrs.text)
      texts[dragedText].attrs.x = e.target.getStage().getPointerPosition().x
      texts[dragedText].attrs.y = e.target.getStage().getPointerPosition().y
    }

    if (e.target.attrs.points) {
      const x = e.target.getStage().getPointerPosition().x
      const y = e.target.getStage().getPointerPosition().y
      const ep = e.target.attrs.points
      const foundIndex = arrows.findIndex(x => x._id == e.target.attrs._id)

      if ((ep[2] < ep[0]) && (ep[3] < ep[1])) {
        const xaxis = ep[0] - ep[2]
        const yaxis = ep[1] - ep[3]
        const a = x + xaxis
        const b = y + yaxis
        arrows[foundIndex].attrs.points = [a, b, x, y]
        arrows[foundIndex].attrs.x = x
        arrows[foundIndex].attrs.y = y
      }

      if ((ep[0] < ep[2]) && (ep[3] < ep[1])) {
        const xaxis = ep[2] - ep[0]
        const yaxis = ep[1] - ep[3]
        const a = x - xaxis
        const b = y + yaxis
        arrows[foundIndex].attrs.points = [a, b, x, y]
        arrows[foundIndex].attrs.x = x
        arrows[foundIndex].attrs.y = y

      }
      if ((ep[0] > ep[2]) && (ep[3] > ep[1])) {
        const xaxis = ep[0] - ep[2]
        const yaxis = ep[3] - ep[1]
        const a = x + xaxis
        const b = y - yaxis
        arrows[foundIndex].attrs.points = [a, b, x, y]
        arrows[foundIndex].attrs.x = x
        arrows[foundIndex].attrs.y = y
      }

      if ((ep[0] < ep[2]) && (ep[3] > ep[1])) {
        const xaxis = ep[2] - ep[0]
        const yaxis = ep[3] - ep[1]
        const a = x - xaxis
        const b = y - yaxis
        arrows[foundIndex].attrs.points = [a, b, x, y]
        arrows[foundIndex].attrs.x = x
        arrows[foundIndex].attrs.y = y
      }
    }
  }
  //----------------- SIDE BAR SHAPES CLICK FUNCTION--------------------------// 

  function sideBarItemsClick(param) {
    setShapeType(param)
    shapeType == param && setShapeType('')
  }








  return (
    <div style={{ display: 'flex', gap: '25px', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', height: '100vh', width: '100vw' }} >
      <div ref={containerRef} className='draw-container' style={{ cursor: !draw ? 'grab' : '', boxShadow: '3px 4px 9px grey', overflowX: 'hidden', borderRadius: '20px', overflowY: 'scroll', width: '80%', height: '80%' }}>
        <Stage
          width={width}
          height={imageHeight}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}

          onMouseMove={handleMouseMove}
          onClick={!pointerOnText && !dragFlag && handleSingleClick}
        >
          <Layer>
            <Image
              image={image}
              width={width}
            // height={height}
            />
          </Layer>
          <Layer width={1000} height={800} >
            <Text
              fill={'red'}
              fontSize={20}
              align={"left"}
              draggable
              text={"X " + displayStage.x + "....  Y " + displayStage.y}
              x={5}
              y={5}
            />
            {lines.map((line, i) => {
              return (
                <>
                  {
                    dragFlag ?
                      <Line
                        key={i}
                        points={line.points}
                        stroke={selected.length > 0 && selected[0].points && selected[0].points[5] == line.points[5] ? 'blue' : color}
                        shadowBlur={selected.length > 0 && selected[0].points && selected[0].points[5] == line.points[5] ? 10 : 0}
                        strokeWidth={5}
                        draggable
                        onMouseEnter={() => { setDraw(false) }}
                        onMouseLeave={() => { setDraw(true) }}
                        tension={0.5}
                        onDblClick={(e) => { selectFunc(e) }}
                        lineCap="round"
                        globalCompositeOperation={
                          line.tool === "eraser" ? "destination-out" : "source-over"
                        }
                      /> :
                      <Line
                        key={i}
                        points={line.points}
                        onDblClick={(e) => { selectFunc(e) }}
                        stroke={selected.length > 0 && selected[0].points && selected[0].points[5] == line.points[5] ? 'blue' : color}
                        shadowBlur={selected.length > 0 && selected[0].points && selected[0].points[5] == line.points[5] ? 10 : 0}
                        strokeWidth={5}
                        tension={0.5}
                        lineCap="round"
                        globalCompositeOperation={
                          line.tool === "eraser" ? "destination-out" : "source-over"
                        }
                      />
                  }
                </>
              )
            })}
            {texts.length > 0 && texts.map((t, i) => {
              return (
                <>{
                  dragFlag ?
                    <Text
                      fill={color}
                      key={i}
                      fontSize={20}
                      align={"left"}
                      fontStyle={20}
                      letterSpacing={3}
                      draggable
                      onDragEnd={(e) => { replaceShape(e) }}
                      text={t.attrs.text}
                      x={t.attrs.x - 40}
                      y={t.attrs.y}
                      wrap="word"
                      width={400}
                      // onKeyDown={e => editText(e)}
                      onMouseEnter={() => { setDraw(false) }}
                      onMouseLeave={() => { setDraw(true) }}
                    // onClick={e => editText(e)}
                    // onDblClick={e => handleTextDblClick(e)}
                    /> :
                    <Text
                      fill={color}
                      key={i}
                      fontSize={20}
                      align={"left"}
                      fontStyle={20}
                      letterSpacing={3}
                      text={t.attrs.text}
                      x={t.attrs.x - 40}
                      y={t.attrs.y}
                      onMouseEnter={() => { setPointerOnText(true) }}
                      onMouseLeave={() => { setPointerOnText(false) }}
                      wrap="word"
                      width={400}
                      // onKeyDown={e => editText(e)}
                      // onClick={e => editText(e)}
                      onDblClick={e => handleTextDblClick(e)}
                    />
                }
                </>
              )
            })}
            {rectsToDraw.length > 0 &&
              rectsToDraw.map((rect, i) => {
                return (
                  <>
                    {
                      dragFlag ?
                        <Rect
                          key={i}
                          x={rect.attrs.x}
                          y={rect.attrs.y}
                          width={rect.attrs.width}
                          height={rect.attrs.height}
                          fill={fill ? color : 'transparent'}
                          opacity={fill ? 0.3 : 1}
                          shadowBlur={selected.length > 0 && selected[0]._id == rect._id ? 10 : 0}
                          stroke={selected.length > 0 && selected[0]._id == rect._id ? 'blue' : color}
                          draggable
                          curser='alias'
                          onDblClick={(e) => { selectFunc(e) }}
                          onMouseEnter={() => { setDraw(false) }}
                          onMouseLeave={() => { setDraw(true) }}
                          onDragEnd={(e) => { replaceShape(e) }}
                        /> :
                        <Rect
                          fill={fill ? color : 'transparent'}
                          opacity={fill ? 0.3 : 1}
                          key={i}
                          x={rect.attrs.x}
                          y={rect.attrs.y}
                          width={rect.attrs.width}
                          height={rect.attrs.height}
                          stroke={selected.length > 0 && selected[0]._id == rect._id ? 'blue' : color}
                          shadowBlur={selected.length > 0 && selected[0]._id == rect._id ? 10 : 0}
                          onDblClick={(e) => { selectFunc(e) }}
                        />
                    }
                  </>
                )
              })}
            {/* ----------------------Circles------------------------------------ */}
            {circlesToDraw.length > 0 &&
              circlesToDraw.map((circle, i) => {
                return (
                  <>
                    {
                      dragFlag ?
                        <Circle
                          key={i}
                          x={circle.attrs.x}
                          y={circle.attrs.y}
                          radius={Math.abs(circle.attrs.radius)}
                          fill={fill ? color : 'transparent'}
                          opacity={fill ? 0.3 : 1}
                          stroke={selected.length > 0 && selected[0]._id == circle._id ? 'blue' : color}
                          shadowBlur={selected.length > 0 && selected[0]._id == circle._id ? 10 : 0}
                          draggable
                          onDblClick={(e) => { selectFunc(e) }}
                          onMouseEnter={() => { setDraw(false) }}
                          onMouseLeave={() => { setDraw(true) }}
                          onDragEnd={(e) => { replaceShape(e) }}
                        /> :
                        <Circle
                          key={i}
                          x={circle.attrs.x}
                          y={circle.attrs.y}
                          radius={Math.abs(circle.attrs.radius)}
                          fill={fill ? color : 'transparent'}
                          opacity={fill ? 0.3 : 1}
                          stroke={selected.length > 0 && selected[0]._id == circle._id ? 'blue' : color}
                          shadowBlur={selected.length > 0 && selected[0]._id == circle._id ? 10 : 0}
                          onDblClick={(e) => { selectFunc(e) }}
                        />
                    }
                  </>
                )
              })}
            {/* ------------------------------Arrow------------------------------------- */}
            {arrowsToDraw.length > 0 &&
              arrowsToDraw.map((arrow, i) => {
                return (
                  <>{
                    dragFlag ?
                      <Arrow
                        key={i}
                        _id={arrow._id}
                        pointerLength={arrow.attrs.pointerLength}
                        pointerWidth={arrow.attrs.pointerWidth}
                        points={[arrow.attrs.points[0], arrow.attrs.points[1], arrow.attrs.points[2], arrow.attrs.points[3]]}
                        fill={fill ? color : 'transparent'}
                        opacity={fill ? 0.4 : 1} draggable
                        shadowBlur={selected.length > 0 && selected[0]._id == arrow._id ? 10 : 0}
                        stroke={selected.length > 0 && selected[0]._id == arrow._id ? 'blue' : color}
                        onDblClick={(e) => { selectFunc(e) }}
                        onMouseEnter={() => { setDraw(false) }}
                        onMouseLeave={() => { setDraw(true) }}
                        onDragEnd={(e) => { replaceShape(e) }}
                      /> :
                      <Arrow
                        key={i}
                        _id={arrow._id}
                        pointerLength={arrow.attrs.pointerLength}
                        pointerWidth={arrow.attrs.pointerWidth}
                        points={[arrow.attrs.points[0], arrow.attrs.points[1], arrow.attrs.points[2], arrow.attrs.points[3]]}
                        shadowBlur={selected.length > 0 && selected[0]._id == arrow._id ? 10 : 0}
                        fill={fill ? color : 'transparent'}
                        opacity={fill ? 0.4 : 1}
                        stroke={selected.length > 0 && selected[0]._id == arrow._id ? 'blue' : color}
                        onDblClick={(e) => { selectFunc(e) }}
                      />
                  }
                  </>
                )
              })}
            <Html

              divProps={{
                // // style: {
                //   position: 'relative',
                // top: textY + height / 10 + "px",
                // left: textX + textX / 20 + "px"
                // // },
              }}
            >
              {draw && !dragFlag && shapeType == 'text' &&
                <textarea
                  value={lastText && !textValue ? lastText : !lastText && textValue ? textValue
                    : lastText && textValue ? lastText + textValue : ''}
                  style={{
                    color: color,
                    fontSize: '18px',
                    background: 'transparent',
                    minWidth: '12vw',
                    minHeight: '30px',
                    overflow: 'auto',
                    width: lastText?.length > 0 ? lastText.length + 2 + 'vh' : textValue?.length + 2 + 'vh',
                    maxWidth: width / 2,
                    height: 'auto',
                    maxHeight: height / 2,
                    scrollbar: 'none',
                    borderRadius: '4px',
                    outline: ` 1.5px solid  ${color}`,
                    border: ` 1.5px solid  ${color}`,
                    scrollbarColor: 'none',
                    display: textEditVisible ? "block" : "none",
                    position: "absolute",
                    top: textY - 20 + "px",
                    left: textX - 20 + "px"
                  }}
                  onChange={e => handleTextEdit(e)}
                  onKeyDown={e => handleTextareaKeyDown(e)}
                >{lastText}</textarea>

              }          </Html>
          </Layer>
        </Stage>


      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '20px', boxShadow: '3px 4px 9px grey', height: 'auto', width: 'auto' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '30px', paddingLeft: '0px' }}>
            <ol className='sidebar-elements' style={{ color: dragFlag ? color : 'black' }} onClick={() => { setDragFlag(!dragFlag) }}><DragIndicatorIcon style={{ boxShadow: dragFlag ? `3px 4px 9px ${color}` : '' }} /></ol>
            <ol className='sidebar-elements' style={{ color: shapeType == 'rectangle' ? color : 'black' }} onClick={() => { sideBarItemsClick('rectangle') }}><CropSquareIcon /></ol>
            <ol className='sidebar-elements' style={{ color: shapeType == 'circle' ? color : 'black' }} onClick={() => { sideBarItemsClick('circle') }} ><RadioButtonUncheckedIcon /></ol>
            {/* <ol className='sidebar-elements' style={{ color: shapeType == 'triangle' ? color : 'black' }} onClick={() => { setShapeType('triangle') }}><ChangeHistoryIcon /></ol> */}
            <ol className='sidebar-elements' style={{ color: shapeType == 'arrow' ? color : 'black' }} onClick={() => { sideBarItemsClick('arrow') }}><ArrowForwardIcon /></ol>
            <ol className='sidebar-elements' style={{ color: shapeType == 'text' ? color : 'black' }} onClick={() => { sideBarItemsClick('text') }}>< ModeEditIcon /></ol>
            <ol className='sidebar-elements' style={{ color: shapeType == 'freeDraw' ? color : 'black' }} onClick={() => { sideBarItemsClick('freeDraw') }}>< BrushIcon /></ol>
            <ol className='sidebar-elements' style={{ color: fill ? color : 'black' }} onClick={() => { setFill(!fill) }}>< FormatColorFillIcon /></ol>
            <ol className='sidebar-elements' style={{ color: shapeType == 'rectangle' ? color : 'black' }} onClick={() => { sideBarItemsClick('rectangle') }}></ol>
            <ol className='sidebar-elements' onClick={() => { deleteSelected() }}><DeleteIcon /></ol>
          </ul>
        </div>
        <div style={{ display: 'flex', boxShadow: '3px 4px 9px grey', borderRadius: '20px' }}>
          <div >
            <div className='sidebar-elements' onClick={() => { setColor('green') }} style={{ boxShadow: color == 'green' ? '1px 4px 9px 5px grey' : null, margin: '10px', height: '20px', width: '20px', borderRadius: '50%', backgroundColor: 'green' }}>
            </div>
            <div className='sidebar-elements' onClick={() => { setColor('red') }} style={{ boxShadow: color == 'red' ? '1px 4px 9px 5px grey' : null, margin: '10px', height: '20px', width: '20px', borderRadius: '50%', backgroundColor: 'red' }}>
            </div>
          </div>
          <div>
            <div className='sidebar-elements' onClick={() => { setColor('black') }} style={{ boxShadow: color == 'black' ? '1px 4px 9px 5px grey' : null, margin: '10px', height: '20px', width: '20px', borderRadius: '50%', backgroundColor: 'black' }}>
            </div>
            <div className='sidebar-elements' onClick={() => { setColor('blue') }} style={{ boxShadow: color == 'blue' ? '1px 4px 9px 5px grey' : null, margin: '10px', height: '20px', width: '20px', borderRadius: '50%', backgroundColor: 'blue' }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
