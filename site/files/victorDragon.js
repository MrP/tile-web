/*global OpenSeadragon, VICTOR_ORIGINAL_PAGE_DIMENSIONS, VICTOR_FILES_DIR, VICTOR_MAX_LEVEL*/
var viewer = OpenSeadragon({
    id: 'openseadragon1',
    prefixUrl: VICTOR_FILES_DIR + '/openseadragon/images/',
    // immediateRender: true,
    defaultZoomLevel: 1,
    minZoomLevel: 0.25,
    maxZoomLevel: 4,
    minZoomImageRatio: 0.9,
    maxZoomImageRatio: 0,
    // // homeFillsViewer: true,
    // constrainDuringPan: true,
    visibilityRatio: 1,
    // debugMode: true,
    springStiffness: 19.5,
    zoomPerSecond: 0.5,
    gestureSettingsMouse: {
        scrollToZoom: false,
        clickToZoom: false,
        pinchToZoom: true,
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

viewer.addHandler('canvas-scroll', function (event) {
    // var bounds = viewer.viewport.getBounds(true);
    // var bottomRight = bounds.getBottomRight();
    var deltaY = event.originalEvent.deltaY;
    var deltaX = event.originalEvent.deltaX;
    // var pointDimensions = viewer.viewport.imageToViewportCoordinates(VICTOR_ORIGINAL_PAGE_DIMENSIONS.width, VICTOR_ORIGINAL_PAGE_DIMENSIONS.height);
    var deltaPoints = viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(deltaX, deltaY), true);
    // if (bounds.getTopLeft().y <= 0 && deltaPoints.y < 0) {
    //     deltaPoints.y = 0;
    // }
    // if (bounds.getTopLeft().x <= 0 && deltaPoints.x < 0) {
    //     deltaPoints.x = 0;
    // }
    // if (bottomRight.y >= pointDimensions.y && deltaPoints.y > 0) {
    //     deltaPoints.y = 0;
    // }
    // if (bottomRight.x >= pointDimensions.x && deltaPoints.x > 0) {
    //     deltaPoints.x = 0;
    // }
    viewer.viewport.panBy(deltaPoints, false);
    viewer.viewport.applyConstraints(false);
});

// viewer.addHandler('animation-finish', function (args) {
//     viewer.viewport.applyConstraints(false);
// });


viewer.addHandler('open', function () {
    viewer.viewport.panTo(new OpenSeadragon.Point(0, 0), true);
    // var levelHeight = VICTOR_ORIGINAL_PAGE_DIMENSIONS.height/viewer.viewport.getContainerSize().y;
    // var levelWidth = VICTOR_ORIGINAL_PAGE_DIMENSIONS.width/viewer.viewport.getContainerSize().x;
    // var level = Math.max(levelHeight, levelWidth);
    var level = viewer.viewport.imageToViewportZoom(1);
    viewer.viewport.zoomTo(level, new OpenSeadragon.Point(0, 0), true);
    viewer.viewport.applyConstraints(true);
});

