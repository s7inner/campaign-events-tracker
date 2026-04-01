<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CampaignStatsResource extends JsonResource
{
    /**
     * @return array<string, int|float|string>
     */
    public function toArray(Request $request): array
    {
        return [
            'campaign_id' => $this['campaign_id'],
            'campaign_name' => $this['campaign_name'],
            'clicks' => $this['clicks'],
            'impressions' => $this['impressions'],
            'ctr' => $this['ctr'],
        ];
    }
}
