import React from 'react';

interface React9SliceProps {
    image: string;
    border?: number;
    width: number;
    height: number;
    children?: React.ReactNode;
    imageSize: { x: number; y: number };
    style?: React.CSSProperties;
}

export default function React9Slice({ 
    image, 
    border = 8, 
    width = 128, 
    height = 128, 
    children, 
    imageSize, 
    style 
}: React9SliceProps) {
    const IMAGE_X = imageSize.x;
    const IMAGE_Y = imageSize.y;
    const INNER_WIDTH = width;
    const INNER_HEIGHT = height;

    return (
        <div 
            className="r9s-container" 
            style={{ 
                width: INNER_WIDTH + border * 2, 
                height: INNER_HEIGHT + border * 2, 
                position: 'relative', 
                display: 'inline-block', 
                lineHeight: 0 
            }}
        >
            {/* Top Row */}
            <div style={{ display: 'flex' }}>
                <div className="r9s-nw" style={sliceStyle(image, 0, 0, border, border)}></div>
                <div className="r9s-n" style={sliceStyle(image, border, 0, IMAGE_X - 2 * border, border, INNER_WIDTH)}></div>
                <div className="r9s-ne" style={sliceStyle(image, IMAGE_X - border, 0, border, border)}></div>
            </div>

            {/* Middle Row */}
            <div style={{ display: 'flex' }}>
                <div className="r9s-w" style={sliceStyle(image, 0, border, border, IMAGE_Y - 2 * border, undefined, INNER_HEIGHT)}></div>
                <div className="r9s-c" style={{ 
                    ...sliceStyle(image, border, border, IMAGE_X - 2 * border, IMAGE_Y - 2 * border, INNER_WIDTH, INNER_HEIGHT),
                    position: 'relative' 
                }}>
                    <div className="r9-content" style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: INNER_WIDTH, height: INNER_HEIGHT,
                        boxSizing: 'border-box',
                        zIndex: 10,
                        ...style
                    }}>
                        {children}
                    </div>
                </div>
                <div className="r9s-e" style={sliceStyle(image, IMAGE_X - border, border, border, IMAGE_Y - 2 * border, undefined, INNER_HEIGHT)}></div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'flex' }}>
                <div className="r9s-sw" style={sliceStyle(image, 0, IMAGE_Y - border, border, border)}></div>
                <div className="r9s-s" style={sliceStyle(image, border, IMAGE_Y - border, IMAGE_X - 2 * border, border, INNER_WIDTH)}></div>
                <div className="r9s-se" style={sliceStyle(image, IMAGE_X - border, IMAGE_Y - border, border, border)}></div>
            </div>
        </div>
    );
}

/**
 * Helper function to generate the styles for each 9-slice piece.
 */
function sliceStyle(
    image: string, 
    x: number, y: number, width: number, height: number, 
    scaleX?: number, scaleY?: number
): React.CSSProperties {
    return {
        width: scaleX || width,
        height: scaleY || height,
        backgroundImage: `url(${image})`,
        backgroundPosition: `-${x}px -${y}px`,
        backgroundSize: `${scaleX ? scaleX + width : 'auto'} ${scaleY ? scaleY + height : 'auto'}`,
        imageRendering: 'pixelated'
    };
}