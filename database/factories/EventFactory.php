<?php

namespace Database\Factories;

use App\Enums\EventType;
use App\Models\Campaign;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'campaign_id' => Campaign::factory(),
            'type' => fake()->randomElement([
                EventType::Click->value,
                EventType::Impression->value,
            ]),
            'created_at' => now(),
        ];
    }

    public function click(): static
    {
        return $this->state(fn (): array => [
            'type' => EventType::Click->value,
        ]);
    }

    public function impression(): static
    {
        return $this->state(fn (): array => [
            'type' => EventType::Impression->value,
        ]);
    }
}
