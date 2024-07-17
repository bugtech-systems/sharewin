import tilesImages from '../../assets/images/footer_icons.png';

export const tilesData = {
    frames: {
        spin_button: {
            frame: { x: 650, y: 0, w: 150, h: 150 },
            sourceSize: { w: 150, h: 150 },
            spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 }
        }
    },
    meta: {
        image: tilesImages,
        format: 'RGBA8888',
        size: { w: 1606, h: 389 },
        scale: 1.1
    },
    animations: {
        button: ['spin_button', 'spin_button_icon']  // array of frames by name
    }
}