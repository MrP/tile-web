/*global PanoJS, metadata*/
var imageWidth = metadata.width;
var imageHeight = metadata.height;

PanoJS.MSG_BEYOND_MIN_ZOOM = null;
PanoJS.MSG_BEYOND_MAX_ZOOM = null;
PanoJS.CREATE_CONTROLS = true;
PanoJS.CREATE_INFO_CONTROLS = false;
PanoJS.CREATE_OSD_CONTROLS = false;
PanoJS.CREATE_THUMBNAIL_CONTROLS = false;
PanoJS.USE_WHEEL_FOR_ZOOM = false;
PanoJS.GRAB_MOUSE_CURSOR = '-webkit-grab';
PanoJS.GRABBING_MOUSE_CURSOR = '-webkit-grabbing';
PanoJS.USE_LOADER_IMAGE = false;
PanoJS.USE_SLIDE = true;

function createViewer(dom_id, url, prefix, w, h) {
    var viewer;
    var MY_URL = url;
    var MY_PREFIX = prefix;
    var MY_TILESIZE = 256;
    var MY_WIDTH = w;
    var MY_HEIGHT = h;
    var myPyramid = new VictorPyramid(MY_WIDTH, MY_HEIGHT, MY_TILESIZE);

    var myProvider = new PanoJS.TileUrlProvider('', '', 'png');
    myProvider.assembleUrl = function (xIndex, yIndex, zoom) {
        return MY_URL + '/' + MY_PREFIX + myPyramid.tile_filename(
            zoom, xIndex, yIndex);
    };

    viewer = new PanoJS(dom_id, {
        tileUrlProvider: myProvider,
        tileSize: myPyramid.tilesize,
        maxZoom: myPyramid.getMaxLevel(),
        initialZoom: myPyramid.getMaxLevel(),
        initialPan: {
            x: 0,
            y: 0
        },
        imageWidth: myPyramid.width,
        imageHeight: myPyramid.height,
        blankTile: 'images/blank.gif',
        loadingTile: 'images/gray.png'
    });

    window.addEventListener('resize', viewer.resize.bind(viewer));
    viewer.init();
}

function VictorLevel( width, height, tilesize, level ) {
    this.width = width;
    this.height = height;
    this.xtiles = Math.ceil( width / tilesize );
    this.ytiles = Math.ceil( height / tilesize );
    this.level = level;
}

VictorLevel.prototype.tiles = function() {
    return this.xtiles * this.ytiles;
};

function VictorPyramid( width, height, tilesize ) {
    this.width = width;
    this.height = height;
    this.tilesize = tilesize;
    this._pyramid = [];
    
    var level_id = 0;
    var level_width = width;
    var level_height = height;
    var min_size = (tilesize / 2) + 1;
    while (level_width > min_size || level_height > min_size ) {      
    //while (level_width > tilesize | level_height > tilesize ) {
        var level = new VictorLevel( level_width, level_height, tilesize, level_id );
        this._pyramid.push( level );
        level_width  = Math.floor( level_width / 2 );
        level_height = Math.floor( level_height / 2 );
        level_id++;
    }
    this._pyramid.reverse();
    
    this.length = this._pyramid.length;
    this.levels = this._pyramid.length;
}

VictorPyramid.prototype.getMaxLevel = function() {
    return this.levels - 1;    
};

VictorPyramid.prototype.getLevel = function( level ) {
    if (level<this._pyramid.length) {
        return this._pyramid[level];
    } else {
        return this._pyramid[this._pyramid.length - 1];
    }
};

VictorPyramid.prototype.tiles_upto_level = function( level ) {
    var tiles = 0;
    for (var i = 0; i < level; i++) {
        tiles = tiles + this._pyramid[i].tiles();
    }
    return tiles;
};

VictorPyramid.prototype.tiles = function() {
    return this.tiles_upto_level( this.levels );
};

VictorPyramid.prototype.tile_index = function( level, x_coordinate, y_coordinate ) {
    return x_coordinate + y_coordinate * this._pyramid[ level ].xtiles + this.tiles_upto_level( level );
};

VictorPyramid.prototype.tile_filename = function( level, x_coordinate, y_coordinate ) {
    var l = this.getLevel(level).level;
    return '' + l + '_' + x_coordinate + '_' + y_coordinate + '.png';
};

createViewer('viewer1', 'pagetiles/', 'tile_', imageWidth,  imageHeight);
