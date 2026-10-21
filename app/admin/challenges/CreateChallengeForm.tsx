"use client";

import { useState } from "react";
import { createChallenge } from "./action";

export default function CreateChallengeForm() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
      >
        {open ? "Close form" : "+ Create challenge"}
      </button>

      {open && (
        <form
          action={createChallenge}
          className="mt-6 rounded-2xl border border-white/10 bg-zinc-900 p-6"
        >
          <h2 className="text-xl font-bold">
            Create a challenge
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            New challenges are saved as drafts until you publish them.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">
                Challenge name
              </label>

              <input
                name="name"
                required
                placeholder="e.g. November 200 KM Club"
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">
                Description
              </label>

              <textarea
                name="description"
                rows={4}
                placeholder="Explain what members need to do."
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Challenge type
              </label>

              <select
                name="challenge_type"
                required
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              >
                <option value="">Select type</option>
                <option value="distance">Distance</option>
                <option value="consistency">Consistency</option>
                <option value="group_runs">
                  Group Runs
                </option>
                <option value="hydration">Hydration</option>
                <option value="club_distance">
                  Club Distance
                </option>
                <option value="personal_best">
                  Personal Best
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Scoring method
              </label>

              <select
                name="scoring_method"
                required
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              >
                <option value="">
                  Select scoring method
                </option>
                <option value="total_distance">
                  Total distance
                </option>
                <option value="run_days">
                  Running days
                </option>
                <option value="qualifying_sessions">
                  Qualifying sessions
                </option>
                <option value="group_attendance">
                  Group attendance
                </option>
                <option value="hydration_days">
                  Hydration days
                </option>
                <option value="personal_improvement">
                  Personal improvement
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Target
              </label>

              <input
                name="target_value"
                type="number"
                min="0"
                step="0.01"
                placeholder="200"
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Target unit
              </label>

              <input
                name="target_unit"
                placeholder="km, days, runs..."
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Start date
              </label>

              <input
                name="start_date"
                type="date"
                required
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                End date
              </label>

              <input
                name="end_date"
                type="date"
                required
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Badge name
              </label>

              <input
                name="badge_name"
                placeholder="e.g. 200 KM Finisher"
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Badge description
              </label>

              <input
                name="badge_description"
                placeholder="Awarded for completing..."
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-zinc-200"
            >
              Save as draft
            </button>
          </div>
        </form>
      )}
    </div>
  );
}