var viewer = OpenSeadragon({
    id: 'openseadragon1',
    prefixUrl: FILES_DIR + '/openseadragon/images/',
    // immediateRender: false,
    // defaultZoomLevel: 1,
    // minZoomLevel: null,
    // maxZoomLevel: null,
    // homeFillsViewer: true,
    // constrainDuringPan: true,
    visibilityRatio: 1,
    // gestureSettingsMouse: {
    //     scrollToZoom: false,
    //     // flickEnabled: true
    // },
    // gestureSettingsTouch: {
        
    // },
    // mouseNavEnabled: false,
    // useCanvas: false,
    showFullPageControl: false,
    showHomeControl: false,



    tileSources:   {
        height: ORIGINAL_PAGE_DIMENSIONS.height,
        width:  ORIGINAL_PAGE_DIMENSIONS.width,
        tileSize: 256,
        minLevel: 0,
        maxLevel: 8,
        getTileUrl: function( level, x, y ){
            return '/' + FILES_DIR + '/pagetiles/tile_' + (8-level) + "_" + x + "_" + y + ".png";
        }
    }
});
