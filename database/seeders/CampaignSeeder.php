<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Campaign::factory()
            ->count(2)
            ->sequence(
                ['name' => 'Demo Campaign A'],
                ['name' => 'Demo Campaign B'],
            )
            ->create();
    }
}
