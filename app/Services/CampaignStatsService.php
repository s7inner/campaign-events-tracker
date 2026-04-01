<?php

namespace App\Services;

use App\Enums\EventType;
use App\Models\Campaign;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class CampaignStatsService
{
    /**
     * @return Collection<int, array<string, int|float|string>>
     */
    public function getStats(): Collection
    {
        return Campaign::query()
            ->select(['id', 'name'])
            ->withCount([
                'events as clicks' => function (Builder $query): void {
                    $query->where('type', EventType::Click->value);
                },
                'events as impressions' => function (Builder $query): void {
                    $query->where('type', EventType::Impression->value);
                },
            ])
            ->orderByDesc('id')
            ->get()
            ->map(function (Campaign $campaign): array {
                $clicks = (int) $campaign->clicks;
                $impressions = (int) $campaign->impressions;

                return [
                    'campaign_id' => (int) $campaign->id,
                    'campaign_name' => $campaign->name,
                    'clicks' => $clicks,
                    'impressions' => $impressions,
                    'ctr' => $impressions > 0 ? round(($clicks / $impressions) * 100, 2) : 0.0,
                ];
            });
    }
}
