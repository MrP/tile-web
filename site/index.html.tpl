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
      var VICTOR_ORIGINAL_PAGE_DIMENSIONS = <%= dimensions %>;
      var VICTOR_ORIGINAL_PAGE_LINKS = <%= links %>;
      var VICTOR_FILES_DIR = '<%= filesDir %>';
      var VICTOR_MAX_LEVEL = <%= maxLevel %>;
    </script>
    <script type="text/javascript" src="<%= filesDir %>/openseadragon/openseadragon.js"></script>
    <script type="text/javascript" src="<%= filesDir %>/victorDragon.js"></script>
  </body>
</html>
