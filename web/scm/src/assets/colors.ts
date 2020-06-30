export const Colors = {
    aqua: '#00ffff',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    black: '#000000',
    blue: '#0000ff',
    brown: '#a52a2a',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgrey: '#a9a9a9',
    darkgreen: '#006400',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkviolet: '#9400d3',
    fuchsia: '#ff00ff',
    gold: '#ffd700',
    green: '#008000',
    indigo: '#4b0082',
    khaki: '#f0e68c',
    lightblue: '#add8e6',
    lightcyan: '#e0ffff',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    magenta: '#ff00ff',
    maroon: '#800000',
    navy: '#000080',
    olive: '#808000',
    orange: '#ffa500',
    pink: '#ffc0cb',
    purple: '#800080',
    violet: '#800080',
    red: '#ff0000',
    silver: '#c0c0c0',
    white: '#ffffff',
    yellow: '#ffff00',
    randomColor: () => {
        return '#' + '0123456789abcdef'.split('').map((v, i, a) => {
            return i > 5 ? null : a[Math.floor(Math.random() * 16)];
        }).join('');
    },
    lightenDarkenColor: (col, amt, retHex = true) => {

        let usePound = false;

        if (col[0] === '#') {
            col = col.slice(1);
            usePound = true;
        }

        const num = parseInt(col, 16);
        let r = (num >> 16) + amt;

        if (r > 255) {
            r = 255;
        }
        else if (r < 0) {
            r = 0;
        }

        let b = ((num >> 8) & 0x00FF) + amt;

        if (b > 255) {
            b = 255;
        }
        else if (b < 0) {
            b = 0;
        }

        let g = (num & 0x0000FF) + amt;

        if (g > 255) {
            g = 255;
        }
        else if (g < 0) {
            g = 0;
        }

        if (retHex) {
            return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
        } else {
            return `rgb(${r},${g},${b})`;
        }

    }
};
