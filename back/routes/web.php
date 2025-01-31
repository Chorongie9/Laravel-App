<?php

use Illuminate\Support\Facades\Route;
use App\Models\Ads;
Use App\Http\Controllers\AdController;


Route::prefix('api')->group(function () {
    Route::post('/ads', [AdController::class, 'create']);
    Route::put('/ads/{id}', [AdController::class, 'update']);
    Route::get('/ads', [AdController::class, 'index']);
    Route::get('/ads/{id}', [AdController::class, 'show']);
    Route::delete('/ads/{id}', [AdController::class, 'destroy']);
});