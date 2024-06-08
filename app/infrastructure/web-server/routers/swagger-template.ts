export const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="./docs/swagger-ui.css" />
  <link rel="stylesheet" type="text/css" href="./docs/index.css" />
  <link rel="icon" type="image/png" href="./docs/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="./docs/favicon-16x16.png" sizes="16x16" />
</head>

<body>
<div id="swagger-ui"></div>
<script src="./docs/swagger-ui-bundle.js" charset="UTF-8"> </script>
<script src="./docs/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
<script>
    window.ui = SwaggerUIBundle({
    url: "./open-api.json",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
  });
</script>
</body>
</html>
`;
