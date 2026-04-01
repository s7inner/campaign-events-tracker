<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class EventController extends Controller
{
    public function store(StoreEventRequest $request): JsonResponse
    {
        $event = Event::query()->create([
            ...$request->validated(),
            'created_at' => now(),
        ]);

        return response()->json([
            'id' => $event->id,
            'campaign_id' => $event->campaign_id,
            'type' => $event->type->value,
            'created_at' => $event->created_at,
        ], Response::HTTP_CREATED);
    }
}
