import * as fs from 'fs';
import { createCanvas, loadImage, Canvas, CanvasRenderingContext2D, PNGStream } from 'canvas';


const canvasWidth: number = 1080; //540;
const canvasHeight: number = 1080; //540;

const canvas: Canvas = createCanvas(canvasWidth, canvasHeight);
const context: CanvasRenderingContext2D = canvas.getContext('2d');

//loadImage("./east-cobb-park.jpg").then(image => {
loadImage("./rehearse-live.jpg").then(image => {
    const hRatio: number = canvas.width / image.width;
    const vRatio: number = canvas.height / image.height;
    const ratio: number = Math.min(hRatio, vRatio);
    const centerShift_x: number = (canvas.width - image.width*ratio) / 2;
    const centerShift_y: number = (canvas.height - image.height*ratio) / 2;

    console.log(typeof image);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, image.width, image.height, centerShift_x, centerShift_y, image.width*ratio, image.height*ratio);

    let fontSize: number = canvasHeight * 0.10;
    let lineMargin: number = fontSize * 0.30;
    context.textAlign = 'center';
    context.font = `${fontSize}px serif`; //'50px serif';
    context.lineWidth = 8;

    //const txt: string = 'Marietta Yo-Yo Club January 2023 East Cobb Park 2023-01-29 3PM - 5PM';
    let x: number = canvas.width / 2;
    let y: number = canvas.height / 3;
    let maxWidth: number = (canvas.width * 0.875);
    let lineHeight: number = fontSize + lineMargin;

    let lines: Array<string> = [
        "Atlanta Yo-Yo Club",
        "Rehearse Live",
        "Jan 29th, 2023",
        "2PM - 5PM",
    ];

    /*let lines: Array<string> = [
        "Marietta Yo-Yo Club",
        "East Cobb Park",
        "Jan 29th, 2023",
        "2PM - 5PM",
    ];*/

    let positionedLines: Array<PositionedLine> = positionLines(lines, x, y, lineHeight)

    positionedLines.forEach(function(line: PositionedLine) {
        drawStrokedText(context, line.text, line.x, line.y)
    })

    /*let wrappedText = textToWrappedLines(context, txt, x, y, maxWidth, fontSize + 15)
    wrappedText.forEach(function(line: WrappedLine) {
        drawStrokedText(context, line.text, line.x, line.y);
    })*/

    const buffer: Buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./test.png', buffer)
})

const positionLines = function(lines: Array<string>, x: number, y: number, lineHeight: number):  Array<PositionedLine> {
    let result: Array<PositionedLine> = [];
    lines.forEach(function(line: string, i: number) {
        result.push({
            text: line,
            x: x,
            y: y + (lineHeight * i)
        })
    })
    return result
}

type WrappedLine = {
    text: string;
    x: number;
    y: number;
};
type PositionedLine = WrappedLine;

const drawStrokedText = function(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
    ctx.strokeStyle = 'black';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
}

const textToWrappedLines = function(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    let words: Array<string> = text.split(' ');
    let line: WrappedLine = {
        text: '',
        x: x,
        y: y
    };
    let testLine: string = '';
    let lines: Array<WrappedLine> = [];

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        testLine += `${word} `
        let metrics: TextMetrics = ctx.measureText(testLine);
        let testWidth: number = metrics.width;
        if (testWidth > maxWidth && i > 0) {
            lines.push(line);
            line = {
                text: `${word} `,
                x: line.x,
                y: line.y + lineHeight,
            }
            testLine = `${word} `
        } else {
            line.text += `${word} `
        }
    }
    lines.push(line)
    return lines;
};