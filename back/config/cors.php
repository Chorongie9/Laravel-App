<?php

return [

    'paths' => ['api/*', 'ads*'], 
    'allowed_methods' => ['*'],  
    'allowed_origins' => ['http://localhost:8081'], 
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],  
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false, 
];