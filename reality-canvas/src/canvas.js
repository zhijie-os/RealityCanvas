// @ts-ignore
import Physic from "./physic.js";
import Stage from "./stage.js";
import Konva from 'konva';
import particle from "./particle.js";
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
export default class Canvas {
    constructor() {
        this.isPaint = false;
        this.mode = "drawing";
        this.lastPosition = { x: 0, y: 0 };
        // shape is defined by an array of konva lines
        this.currentShape = [];
        this.savedShapes = [];
        // motion line 
        this.motionLine = [];
        this.physic = new Physic();
        this.stage = new Stage();
        this.stage.stage.on('mousedown touchstart', e => {
            // put down the pen, i.e, painting
            this.isPaint = true;
            // get the current pointed position on the stage
            let pos = this.stage.stage.getPointerPosition();
            let color;
            switch (this.mode) {
                case 'emitting':
                    color = '#3cb043'; // emitting = green
                    break;
                case 'motion':
                    color = '#29446f'; // motion = blue
                    break;
                default:
                    color = '#df4b26'; // drawing = red
            }
            // if the pos is not null
            if (pos) {
                //  create new konva line, store it in the this.currentLine
                this.lastPosition = pos;
                this.currentLine = new Konva.Line({
                    stroke: color,
                    strokeWidth: 5,
                    globalCompositeOperation: 'source-over',
                    // round cap for smoother lines
                    lineCap: 'round',
                    // add point twice, so we have some drawings even on a simple click
                    points: [pos.x, pos.y],
                });
                this.stage.layer.add(this.currentLine);
            }
        });
        this.stage.stage.on('mouseup touchend', () => {
            this.isPaint = false;
            switch (this.mode) {
                case "emitting":
                    this.emit();
                    break;
                case "motion":
                    this.add_motion();
                    break;
                default:
                    // save the line into current shape
                    this.currentShape.push(this.currentLine);
                    // reset current line
                    this.currentLine = null;
                    ;
            }
        });
        // and core function - drawing
        this.stage.stage.on('mousemove touchmove', e => {
            // if pen is not down, i.e, not drawing, abort
            if (!this.isPaint) {
                return;
            }
            // prevent scrolling on touch devices
            e.evt.preventDefault();
            // get the current pointed position on the stage
            let pos = this.stage.stage.getPointerPosition();
            /* if the position is not empty and this position is not equal to last position,
                expand the currentLine by appending new points.

                Note: technically, you can have consecutively repeating points for drawing;
                however, you will update more (unnecessary) points.
            */
            //@ts-ignore
            if (pos && this.position != pos) {
                // immutable copy and update
                var newPoints = this.currentLine.points().concat([pos.x, pos.y]);
                this.currentLine.points(newPoints);
                // update last position
                this.lastPosition = pos;
            }
        });
    }
    save_particle() {
        // save current shape
        this.savedShapes.push(this.currentShape);
        // reset current shape
        this.currentShape = [];
    }
    add_motion() {
        let motionVertex = this.currentLine.attrs.points;
        // transform to something that matter needs
        let motionVertexSet = [];
        for (let i = 0; i < motionVertex.length; i += 2) {
            motionVertexSet.push({ x: motionVertex[i], y: motionVertex[i + 1] });
        }
        this.physic.add_motion(motionVertexSet);
    }
    emit() {
        this.savedShapes.map(shape => {
            let max = (this.currentLine.attrs.points.length) / 2;
            let emitXIndex = (getRandomInt(max - 1)) * 2;
            let emitYIndex = emitXIndex + 1;
            console.log(shape);
            this.physic.add_particle(new particle({
                x: this.currentLine.attrs.points[emitXIndex],
                y: this.currentLine.attrs.points[emitYIndex],
            }, shape));
        });
    }
}
