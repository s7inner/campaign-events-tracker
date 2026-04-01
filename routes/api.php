<?php

use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\StatsController;
use Illuminate\Support\Facades\Route;

Route::name('api.')->group(function (): void {
    Route::post('/campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
    Route::get('/campaigns', [CampaignController::class, 'index'])->name('campaigns.index');

    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::get('/stats', StatsController::class)->name('stats.index');
});
