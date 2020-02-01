import uuidv4 from 'uuid/v4';
import Frame from '../../../../models/Frame';

export function createWorktableStore() {
    const initFrame = new Frame(32, 32);
    return {
        /* drawing */
        canvasColumns: 32,
        canvasRows: 32,
        paletteColor: '#a12af1',
        drawingTool: 'PEN',
        changeCanvasSize(rows: number, columns: number): void {
            // TODO: implementation
            this.canvasColumns = columns;
            this.canvasRows = rows;
        },
        changePaletteColor(color: string): void {
            this.paletteColor = color;
        },
        changeDrawingTool(tool: string): void {
            this.drawingTool = tool;
        },

        /* frames */
        currentFrame: initFrame,
        frames: [initFrame] as Array<Frame>,
        changeCurrentFrame(frame: Frame) {
            this.currentFrame = frame;
        },
        resortFrames(startIndex: number, endIndex: number) {
            const [removed] = this.frames.splice(startIndex, 1);
            this.frames.splice(endIndex, 0, removed);
        },
        addFrame() {
            this.frames.push(new Frame(this.canvasColumns, this.canvasRows));
            console.debug('addFrame', this.frames);
        },
    };
}

export type WorktableStore = ReturnType<typeof createWorktableStore>;
