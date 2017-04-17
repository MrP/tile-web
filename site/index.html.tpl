<!DOCTYPE html>
<html lang="en">
  <head>
    <%= metas %>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title><%= title %></title>
    <link href="<%= filesDir %>/styles.css" rel="stylesheet">
    <%= scripts %>
  </head>
  <body>
    <div id="openseadragon1"></div>
    <script>
      var EXTRACTED_METADATA = {
        originalPageDimensions: <%= dimensions %>,
        originalPageLinks: <%= links %>,
        filesDir: '<%= filesDir %>',
        tilesDir: '<%= tilesDir %>',
        maxLevel: <%- maxLevel %>,
        tileSize: <%- tileSize %>
      };
    </script>
    <script type="text/javascript" src="<%= filesDir %>/openseadragon/openseadragon.js"></script>
    <script type="text/javascript" src="<%= filesDir %>/tileWeb.js"></script>
  </body>
</html>
