/*global OpenSeadragon, EXTRACTED_METADATA*/
var viewer = OpenSeadragon({
    id: 'openseadragon1',
    prefixUrl: EXTRACTED_METADATA.filesDir + '/openseadragon/images/',
    gestureSettingsMouse: {
        scrollToZoom: false,
        clickToZoom: false,
        dblClickToZoom: true,
        flickEnabled: false
    },
    showFullPageControl: false,
    showHomeControl: false,
    showNavigationControl: false,
    showZoomControl: false,
    visibilityRatio: 0.9,
    springStiffness: 19.5,
    zoomPerSecond: 0.5,
    preserveImageSizeOnResize: true,
    immediateRender: false,
    minZoomImageRatio: 0.1,
    maxZoomPixelRatio: 16,
    defaultZoomLevel: 1,

    // minZoomLevel: 0.25,
    // maxZoomLevel: EXTRACTED_METADATA.maxLevel + 2,
    // minPixelRatio: 0.25,

    tileSources:   {
        height: EXTRACTED_METADATA.originalPageDimensions.height,
        width:  EXTRACTED_METADATA.originalPageDimensions.width,
        tileSize: EXTRACTED_METADATA.tileSize,
        minLevel: 0,
        maxLevel: EXTRACTED_METADATA.maxLevel,
        getTileUrl: function(level, x, y){
            return EXTRACTED_METADATA.filesDir + '/' + EXTRACTED_METADATA.tilesDir + '/tile_' + level + "_" + x + "_" + y + ".png";
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
    event.originalEvent.stopPropagation();
    event.originalEvent.preventDefault();
});

viewer.addHandler('open', function () {
    var level = viewer.viewport.imageToViewportZoom(1);
    viewer.viewport.zoomTo(level, new OpenSeadragon.Point(0, 0), true);
    viewer.viewport.applyConstraints(true);
    var bounds = viewer.viewport.getBounds(true);
    viewer.viewport.panTo(new OpenSeadragon.Point(bounds.width/2, bounds.height/2), true);
    viewer.viewport.applyConstraints(true);
});

var victor_links = EXTRACTED_METADATA.originalPageLinks.map(function (link) {
    link.osdRect = viewer.viewport.imageToViewportRectangle(link.left, link.top, link.outerWidth, link.outerHeight);
    link.osdImageRect = new OpenSeadragon.Rect(link.left, link.top, link.outerWidth, link.outerHeight);
    return link;
});

viewer.addHandler('canvas-click', function (event) {
    if (!event.quick) {
        return;
    }
    var imagePosition = viewer.viewport.viewerElementToImageCoordinates(event.position);
    var clicked = victor_links.filter(function (link) {
        return link.osdImageRect.containsPoint(imagePosition);
    });
    if (clicked.length >= 1) {
        if (clicked[0].href) {
            window.open(clicked[0].href);
        } else if (clicked[0].onclick) {
            eval(clicked[0].onclick);
        }
    }
});

