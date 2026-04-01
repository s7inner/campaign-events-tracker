<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class CampaignApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_and_lists_campaigns(): void
    {
        $createResponse = $this->postJson(route('api.campaigns.store'), [
            'name' => 'Spring Sale',
        ]);

        $createResponse
            ->assertCreated()
            ->assertJsonPath('name', 'Spring Sale');

        $listResponse = $this->getJson(route('api.campaigns.index'));

        $listResponse
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.name', 'Spring Sale');
    }

    public function test_it_validates_unique_campaign_name(): void
    {
        Campaign::factory()->create([
            'name' => 'Spring Sale',
        ]);

        $response = $this->postJson(route('api.campaigns.store'), [
            'name' => 'Spring Sale',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    #[DataProvider('invalidEventPayloadProvider')]
    public function test_it_validates_event_payload(array $payload, array $expectedErrors): void
    {
        $response = $this->postJson(route('api.events.store'), $payload);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors($expectedErrors);
    }

    /**
     * @return array<string, array{0: array<string, mixed>, 1: array<int, string>}>
     */
    public static function invalidEventPayloadProvider(): array
    {
        return [
            'invalid campaign and type' => [
                ['campaign_id' => 999, 'type' => 'invalid-type'],
                ['campaign_id', 'type'],
            ],
            'campaign id should be integer' => [
                ['campaign_id' => 'abc', 'type' => 'click'],
                ['campaign_id'],
            ],
            'missing type' => [
                ['campaign_id' => 999],
                ['campaign_id', 'type'],
            ],
        ];
    }

    public function test_it_saves_event_for_existing_campaign(): void
    {
        $campaign = Campaign::factory()->create([
            'name' => 'Brand Campaign',
        ]);

        $response = $this->postJson(route('api.events.store'), [
            'campaign_id' => $campaign->id,
            'type' => 'click',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('campaign_id', $campaign->id)
            ->assertJsonPath('type', 'click');

        $this->assertDatabaseHas('events', [
            'campaign_id' => $campaign->id,
            'type' => 'click',
        ]);
    }

    public function test_it_returns_stats_with_ctr(): void
    {
        $campaign = Campaign::factory()->create([
            'name' => 'Autumn Campaign',
        ]);

        Event::factory()->count(2)->click()->create([
            'campaign_id' => $campaign->id,
        ]);
        Event::factory()->count(3)->impression()->create([
            'campaign_id' => $campaign->id,
        ]);

        $response = $this->getJson(route('api.stats.index'));

        $response
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.campaign_name', 'Autumn Campaign')
            ->assertJsonPath('0.clicks', 2)
            ->assertJsonPath('0.impressions', 3)
            ->assertJsonPath('0.ctr', 66.67);
    }
}
