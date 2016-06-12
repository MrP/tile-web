<!DOCTYPE html>
<html lang="en">
  <head>
    <%= metas %>
    <title><%= title %></title>
    <link href="<%= filesDir %>/styles.css" rel="stylesheet">
    <%= scripts %>
  </head>
  <body>
    <div id="openseadragon1" style="width: 100vw; height: 100vh;"></div>
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
