import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { apiRequest } from '@/lib/api';

type Campaign = {
    id: number;
    name: string;
};

type EventType = 'click' | 'impression';

type CampaignStats = {
    campaign_id: number;
    campaign_name: string;
    clicks: number;
    impressions: number;
    ctr: number;
};

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}

export default function CampaignDashboard() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [stats, setStats] = useState<CampaignStats[]>([]);

    const [newCampaignName, setNewCampaignName] = useState('');
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    const [selectedEventType, setSelectedEventType] = useState<EventType>('click');

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingCampaign, setIsSubmittingCampaign] = useState(false);
    const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

    const [campaignError, setCampaignError] = useState('');
    const [eventError, setEventError] = useState('');
    const [globalError, setGlobalError] = useState('');

    const refreshData = useCallback(async () => {
        const [campaignsData, statsData] = await Promise.all([
            apiRequest<Campaign[]>('/api/campaigns'),
            apiRequest<CampaignStats[]>('/api/stats'),
        ]);

        setCampaigns(campaignsData);
        setStats(statsData);
        setSelectedCampaignId((currentValue) => {
            if (currentValue === '' && campaignsData.length > 0) {
                return String(campaignsData[0].id);
            }

            return currentValue;
        });
    }, []);

    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            setGlobalError('');

            try {
                await refreshData();
            } catch (error: unknown) {
                setGlobalError(getErrorMessage(error, 'Unable to load campaigns and stats.'));
            } finally {
                setIsLoading(false);
            }
        };

        void initialize();
    }, [refreshData]);

    const onCreateCampaign = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setCampaignError('');
        setIsSubmittingCampaign(true);

        try {
            await apiRequest<Campaign>('/api/campaigns', {
                method: 'POST',
                body: JSON.stringify({
                    name: newCampaignName.trim(),
                }),
            });

            setNewCampaignName('');
            await refreshData();
        } catch (error: unknown) {
            setCampaignError(getErrorMessage(error, 'Unable to create campaign.'));
        } finally {
            setIsSubmittingCampaign(false);
        }
    };

    const onCreateEvent = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setEventError('');
        setIsSubmittingEvent(true);

        try {
            await apiRequest<{ id: number }>('/api/events', {
                method: 'POST',
                body: JSON.stringify({
                    campaign_id: Number(selectedCampaignId),
                    type: selectedEventType,
                }),
            });

            await refreshData();
        } catch (error: unknown) {
            setEventError(getErrorMessage(error, 'Unable to submit event.'));
        } finally {
            setIsSubmittingEvent(false);
        }
    };

    return (
        <>
            <Head title="Campaign Dashboard" />

            <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Campaign Events Tracker</h1>

                {globalError ? (
                    <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {globalError}
                    </p>
                ) : null}

                <section className="rounded border border-slate-200 p-4">
                    <h2 className="mb-3 text-lg font-medium">Add campaign</h2>

                    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onCreateCampaign}>
                        <input
                            type="text"
                            value={newCampaignName}
                            onChange={(event) => setNewCampaignName(event.target.value)}
                            placeholder="Campaign name"
                            className="w-full rounded border border-slate-300 px-3 py-2"
                            disabled={isSubmittingCampaign}
                        />
                        <button
                            type="submit"
                            className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
                            disabled={isSubmittingCampaign}
                        >
                            {isSubmittingCampaign ? 'Saving...' : 'Create'}
                        </button>
                    </form>

                    {campaignError ? (
                        <p className="mt-2 text-sm text-red-700">{campaignError}</p>
                    ) : null}
                </section>

                <section className="rounded border border-slate-200 p-4">
                    <h2 className="mb-3 text-lg font-medium">Send event</h2>

                    <form className="grid gap-3 sm:grid-cols-3" onSubmit={onCreateEvent}>
                        <select
                            value={selectedCampaignId}
                            onChange={(event) => setSelectedCampaignId(event.target.value)}
                            className="rounded border border-slate-300 px-3 py-2"
                            disabled={isSubmittingEvent || campaigns.length === 0}
                        >
                            {campaigns.length === 0 ? (
                                <option value="">No campaigns yet</option>
                            ) : (
                                campaigns.map((campaign) => (
                                    <option key={campaign.id} value={campaign.id}>
                                        {campaign.name}
                                    </option>
                                ))
                            )}
                        </select>

                        <select
                            value={selectedEventType}
                            onChange={(event) => setSelectedEventType(event.target.value as EventType)}
                            className="rounded border border-slate-300 px-3 py-2"
                            disabled={isSubmittingEvent || campaigns.length === 0}
                        >
                            <option value="click">click</option>
                            <option value="impression">impression</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
                            disabled={isSubmittingEvent || campaigns.length === 0}
                        >
                            {isSubmittingEvent ? 'Submitting...' : 'Submit event'}
                        </button>
                    </form>

                    {eventError ? <p className="mt-2 text-sm text-red-700">{eventError}</p> : null}
                </section>

                <section className="rounded border border-slate-200 p-4">
                    <h2 className="mb-3 text-lg font-medium">Campaign list</h2>

                    {isLoading ? (
                        <p className="text-sm text-slate-600">Loading campaigns...</p>
                    ) : campaigns.length === 0 ? (
                        <p className="text-sm text-slate-600">No campaigns yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {campaigns.map((campaign) => (
                                <li key={campaign.id} className="rounded border border-slate-200 px-3 py-2">
                                    {campaign.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="rounded border border-slate-200 p-4">
                    <h2 className="mb-3 text-lg font-medium">Statistics</h2>

                    {isLoading ? (
                        <p className="text-sm text-slate-600">Loading stats...</p>
                    ) : stats.length === 0 ? (
                        <p className="text-sm text-slate-600">No stats yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="px-2 py-2">Campaign</th>
                                        <th className="px-2 py-2">Clicks</th>
                                        <th className="px-2 py-2">Impressions</th>
                                        <th className="px-2 py-2">CTR, %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.map((item) => (
                                        <tr key={item.campaign_id} className="border-b border-slate-100">
                                            <td className="px-2 py-2">{item.campaign_name}</td>
                                            <td className="px-2 py-2">{item.clicks}</td>
                                            <td className="px-2 py-2">{item.impressions}</td>
                                            <td className="px-2 py-2">{item.ctr}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
