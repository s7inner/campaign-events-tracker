<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CampaignStatsResource;
use App\Services\CampaignStatsService;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function __construct(private readonly CampaignStatsService $statsService) {}

    public function __invoke(): JsonResponse
    {
        $stats = $this->statsService->getStats();
        $payload = $stats
            ->map(fn (array $item): array => new CampaignStatsResource($item)->toArray(request()))
            ->values();

        return response()->json($payload);
    }
}
