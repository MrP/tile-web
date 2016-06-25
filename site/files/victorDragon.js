/*global OpenSeadragon, EXTRACTED_METADATA*/

// (function () {
    var viewer = OpenSeadragon({
        id: 'openseadragon1',
        prefixUrl: EXTRACTED_METADATA.filesDir + '/openseadragon/images/',
        defaultZoomLevel: 1,
        minZoomLevel: 0.25,
        maxZoomLevel: 8,
        visibilityRatio: 1,
        springStiffness: 19.5,
        zoomPerSecond: 0.5,
        gestureSettingsMouse: {
            scrollToZoom: false,
            clickToZoom: false,
            dblClickToZoom: true,
            flickEnabled: false
        },
        showFullPageControl: false,
        showHomeControl: false,
        preserveImageSizeOnResize: true,

        // minPixelRatio: 1,
        // maxZoomPixelRatio: 1,
        // debugMode: true,
        // immediateRender: true,
        // minZoomImageRatio: 0.9,
        // maxZoomImageRatio: 0,
        // homeFillsViewer: true,
        // constrainDuringPan: true,

        tileSources:   {
            height: EXTRACTED_METADATA.originalPageDimensions.height,
            width:  EXTRACTED_METADATA.originalPageDimensions.width,
            tileSize: EXTRACTED_METADATA.tileSize,
            minLevel: 0,
            maxLevel: EXTRACTED_METADATA.maxLevel,
            getTileUrl: function(level, x, y){
                return '/' + EXTRACTED_METADATA.filesDir + '/' + EXTRACTED_METADATA.tilesDir + '/tile_' + level + "_" + x + "_" + y + ".png";
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
        viewer.viewport.panTo(new OpenSeadragon.Point(0, 0), true);
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
        console.log('imagePosition', imagePosition);
        var clicked = victor_links.filter(function (link) {
            console.log('link', link);
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

// }());

