/*global OpenSeadragon, VICTOR_ORIGINAL_PAGE_DIMENSIONS, VICTOR_FILES_DIR, VICTOR_MAX_LEVEL*/
var viewer = OpenSeadragon({
    id: 'openseadragon1',
    prefixUrl: VICTOR_FILES_DIR + '/openseadragon/images/',
    // immediateRender: true,
    defaultZoomLevel: 1,
    minZoomLevel: 0.25,
    maxZoomLevel: 4,
    // minZoomImageRatio: 0.9,
    // maxZoomImageRatio: 0,
    // // homeFillsViewer: true,
    // constrainDuringPan: true,
    visibilityRatio: 1,
    // debugMode: true,
    springStiffness: 19.5,
    zoomPerSecond: 0.5,
    gestureSettingsMouse: {
        scrollToZoom: false,
        clickToZoom: false,
        dblClickToZoom: true,
        // pinchToZoom: true,
        flickEnabled: false
    },
    // // gestureSettingsTouch: {

    // // },
    // // mouseNavEnabled: false,
    // useCanvas: true,
    showFullPageControl: false,
    showHomeControl: false,



    tileSources:   {
        height: VICTOR_ORIGINAL_PAGE_DIMENSIONS.height,
        width:  VICTOR_ORIGINAL_PAGE_DIMENSIONS.width,
        tileSize: 256,
        minLevel: 0,
        maxLevel: VICTOR_MAX_LEVEL,
        getTileUrl: function(level, x, y){
            return '/' + VICTOR_FILES_DIR + '/pagetiles/tile_' + (VICTOR_MAX_LEVEL-level) + "_" + x + "_" + y + ".png";
        }
    }
});

viewer.addHandler('canvas-press', function (event) {
    viewer.container.className += ' victor-grabbing';
});
viewer.addHandler('canvas-release', function (event) {
    viewer.container.className = viewer.container.className.replace(/ victor-grabbing/, '');
});

viewer.addHandler('canvas-scroll', function (event) {
    var deltaY = event.originalEvent.deltaY;
    var deltaX = event.originalEvent.deltaX;
    var deltaPoints = viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(deltaX, deltaY), true);
    viewer.viewport.panBy(deltaPoints, false);
    viewer.viewport.applyConstraints(false);
});

viewer.addHandler('open', function () {
    viewer.viewport.panTo(new OpenSeadragon.Point(0, 0), true);
    var level = viewer.viewport.imageToViewportZoom(1);
    viewer.viewport.zoomTo(level, new OpenSeadragon.Point(0, 0), true);
    viewer.viewport.applyConstraints(true);
});

