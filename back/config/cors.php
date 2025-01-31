<?php

return [

    'paths' => ['api/*', 'ads*'], // Add the routes you want to enable CORS for
    'allowed_methods' => ['*'],  // Allow all methods (GET, POST, etc.)
    'allowed_origins' => ['http://localhost:8081'], // Add your frontend's origin
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],  // Allow all headers
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false, // Set to true if you're using cookies or session-based auth
];