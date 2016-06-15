/*global OpenSeadragon, VICTOR_ORIGINAL_PAGE_DIMENSIONS, VICTOR_FILES_DIR, VICTOR_MAX_LEVEL, VICTOR_ORIGINAL_PAGE_LINKS*/

// (function () {
    var viewer = OpenSeadragon({
        id: 'openseadragon1',
        prefixUrl: VICTOR_FILES_DIR + '/openseadragon/images/',
        defaultZoomLevel: 1,
        minZoomLevel: 0.25,
        maxZoomLevel: 4,
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

        // debugMode: true,
        // immediateRender: true,
        // minZoomImageRatio: 0.9,
        // maxZoomImageRatio: 0,
        // homeFillsViewer: true,
        // constrainDuringPan: true,


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
        event.originalEvent.stopPropagation();
        event.originalEvent.preventDefault();
    });

    viewer.addHandler('open', function () {
        var level = viewer.viewport.imageToViewportZoom(1);
        viewer.viewport.zoomTo(level, new OpenSeadragon.Point(0, 0), true);
        viewer.viewport.panTo(new OpenSeadragon.Point(0, 0), true);
        viewer.viewport.applyConstraints(true);
    });

    var victor_links = VICTOR_ORIGINAL_PAGE_LINKS.map(function (link) {
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

// }());

