<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCampaignRequest;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CampaignController extends Controller
{
    public function index(): JsonResponse
    {
        $campaigns = Campaign::query()
            ->select(['id', 'name', 'created_at'])
            ->orderByDesc('id')
            ->get();

        return response()->json($campaigns);
    }

    public function store(StoreCampaignRequest $request): JsonResponse
    {
        $campaign = Campaign::query()->create($request->validated());

        return response()->json($campaign, Response::HTTP_CREATED);
    }
}
