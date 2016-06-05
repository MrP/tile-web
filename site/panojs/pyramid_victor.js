
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

// -----------------------------------------------------
// VictorPyramid
// -----------------------------------------------------

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
    // var l = this.getMaxLevel() - this.getLevel(level).level;
    var l = this.getLevel(level).level;
    return '' + l + '_' + x_coordinate + '_' + y_coordinate + '.png';
};
