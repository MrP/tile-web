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
      var ORIGINAL_PAGE_DIMENSIONS = <%= dimensions %>;
      var ORIGINAL_PAGE_LINKS = <%= links %>;
      var FILES_DIR = '<%= filesDir %>';
    </script>
    <script type="text/javascript" src="<%= filesDir %>/openseadragon/openseadragon.js"></script>
    <script type="text/javascript" src="<%= filesDir %>/victorDragon.js"></script>
    <!--<script type="text/javascript" src="<%= filesDir %>/victor.js"></script>-->
  </body>
</html>