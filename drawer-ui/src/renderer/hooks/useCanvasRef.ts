import { useRef, useCallback } from 'react';

const useCanvasRef = (): [
    React.MutableRefObject<HTMLCanvasElement>,
    (node: any) => void,
] => {
    const ref = useRef<HTMLCanvasElement>();
    const callback = useCallback(node => {
        if (node) {
            ref.current = node;
        }
    }, []);
    return [ref as React.MutableRefObject<HTMLCanvasElement>, callback];
};

export default useCanvasRef;
